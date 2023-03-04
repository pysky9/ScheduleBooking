import requests
import json
import jwt
import random
import string
import os
from datetime import datetime, timedelta

from dotenv import load_dotenv
from django.shortcuts import render, HttpResponseRedirect
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt

from membersApp.models import Members
from lineApp.models import Channel_data, Customers

load_dotenv()

jwt_key = os.getenv("jwt_key")

# 亂數產生login API url的state 避免被當釣魚網站偷取登入資訊
def generate_random_string(length):
    letters_and_digits = string.ascii_letters + string.digits
    result = ''.join(random.choice(letters_and_digits) for i in range(length))
    return result
random_state = generate_random_string(6)

def line_login(request, username):
    return render(request, 'linelogin.html')

def channel_setting_page(request, username):
    name = username
    return render(request, 'lineSetting.html', locals())

def store_channel_data(request):
    if request.method == "POST":
        data = json.loads(request.body)
        db_data = Members.objects.filter(username=data["username"])
        channel_data = Channel_data()
        channel_data.members = Members(db_data[0].id)
        channel_data.username = data["username"]
        channel_data.channel_id = data["channelId"]
        channel_data.channel_secret = data["channelSecret"]
        channel_data.save()
        return JsonResponse({"ok": True})

@csrf_exempt
def get_channel_data(request):
    get_cookie = request.COOKIES.get("jwt_token")
    try:
        payloads = jwt.decode(get_cookie, jwt_key, algorithms = "HS256")
        data = json.loads(request.body)
        db_data = Channel_data.objects.filter(username=data["username"])
        if db_data:
            response_data = {
                "channel_id": db_data[0].channel_id,
                "channel_secret": db_data[0].channel_secret
            }
            return JsonResponse({"ok": True, "data": response_data})
        else:
            return JsonResponse({"ok": False, "data": "請填入資料"})
    except:
        return JsonResponse({"ok": False, "data": "請登入系統"})

 
# 由後端提供機敏資料
def get_line_data(request, username):
    db_data = Channel_data.objects.filter(username=username)
    data = {
        "clientID": db_data[0].channel_id,#從DB拿
        "redirect_uri": "http://localhost:8000/line/recieve/",#開發測試使用
        # "redirect_uri": "https://www.schedule-booking.com/line/recieve/",# 上線
        "state": random_state
    }

    return JsonResponse(data)

# 接收line登入 取得個人資訊
@csrf_exempt
def recieve(request, username):
    # global random_state
    db_data = Channel_data.objects.filter(username=username)
    code = request.GET.get("code")
    state = request.GET.get("state")
    # Verify the state parameter to prevent CSRF attacks
    if state != random_state:
        return HttpResponseBadRequest("Invalid state")

    # Use the code parameter and your Channel Secret to get an access token
    response = requests.post("https://api.line.me/oauth2/v2.1/token",
        data={
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": f"http://localhost:8000/line/recieve/{username}",#測試開發
            # "redirect_uri":f"https://www.schedule-booking.com/line/recieve/{username}",# 上線
            "client_id": db_data[0].channel_id,
            "client_secret": db_data[0].channel_secret,
        },
    )

    response.raise_for_status()
    access_token = response.json()["access_token"]
    id_token = response.json()["id_token"]
    # Use the access token to get the user's profile information
    headers = {
        "Authorization": f"Bearer {access_token}",
    }
    responses = requests.get("https://api.line.me/v2/profile", headers=headers)
    # # id_token
    url = "https://api.line.me/oauth2/v2.1/verify"

    data = {
        'id_token': id_token,
        'client_id': db_data[0].channel_id
    }

    response = requests.post(url, data=data)
    profile = response.json()

    name = profile["name"]
    picture = profile["picture"]
    email = profile["email"]
    # 廠商members id
    query_store = Members.objects.filter(username=username)
    
    # DB無消費者資料 存入DB
    query_db = Customers.objects.filter(email= profile["email"], members_id=query_store[0].id)
    if not query_db:
        try:
            customer = Customers.objects.create(
                members = Members(query_store[0].id),
                username = name,
                email = email,
                picture = picture
            )
            customer.save()
        except Exception as err:
            print(err)
            return JsonResponse({"msg": f"{err}"})
    customer_data = Customers.objects.filter(email= profile["email"], members_id=query_store[0].id)

    customer_id = customer_data[0].id

    # 登入後 消費者資訊存入JWT
    expiration_time = datetime.utcnow() + timedelta(weeks=1)
    payload = {
        "store_id": f"{query_store[0].id}",
        "store_name": f"{username}",
        "customer_id": f"{customer_id}",
        "name": f"{name}",
        "email": f"{email}",
        "exp": expiration_time
    }
    jwt_encode = jwt.encode(payload, jwt_key, algorithm = "HS256")
    response = render(request, "customer.html", locals()) # 導向顧客會員頁
    response.set_cookie(key="customer_token", value=jwt_encode, expires=expiration_time, httponly=True)
    return response
