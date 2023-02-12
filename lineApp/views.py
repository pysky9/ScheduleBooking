import requests
import json
import jwt
import random
import string
import os

from dotenv import load_dotenv
from django.shortcuts import render, HttpResponseRedirect
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt

from membersApp.models import Members
from lineApp.models import Channel_data

load_dotenv()

jwt_key = os.getenv("jwt_key")

# 亂數產生login API url的state 避免被當釣魚網站偷取登入資訊
def generate_random_string(length):
    letters_and_digits = string.ascii_letters + string.digits
    result = ''.join(random.choice(letters_and_digits) for i in range(length))
    return result
random_state = generate_random_string(10)


# Create your views here.
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
        "redirect_uri": "http://localhost:8000/line/recieve/",
        "state": random_state
    }

    return JsonResponse(data)

def recieve(request, username):
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
            "redirect_uri": f"http://localhost:8000/line/recieve/{username}",
            "client_id": db_data[0].channel_id,
            "client_secret": db_data[0].channel_secret,
        },
    )

    response.raise_for_status()
    access_token = response.json()["access_token"]
    id_token = response.json()["id_token"]
    # Use the access token to get the user's profile information
    headers = {
        # "Authorization": "Bearer " + access_token,
        "Authorization": f"Bear {access_token}",
    }
    response = requests.get("https://api.line.me/v2/profile", headers=headers)
    
    profile = response.json()

    # # id_token
    url = "https://api.line.me/oauth2/v2.1/verify"

    data = {
        'id_token': id_token,
        'client_id': db_data[0].channel_id
    }

    response = requests.post(url, data=data)

    return HttpResponseRedirect(f"http://localhost:8000/calendar/views/{username}")




