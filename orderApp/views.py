import json
import jwt
import os
import random
import requests

from dotenv import load_dotenv
from datetime import datetime

from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from membersApp.models import Members
from lineApp.models import Customers
from cartApp.models import Booking
from orderApp.models import Order

load_dotenv()
jwt_key = os.getenv("jwt_key")

def order_record_page(request, storename):
    return render(request, "orderRecord.html")

def render_check_order(request, orderId):
    get_cookie = request.COOKIES.get("customer_token")
    try:
        payloads = jwt.decode(get_cookie, jwt_key, algorithms = "HS256")
        name = payloads["name"]
        mail = payloads["email"]
        return render(request, "order.html", locals())
    except:
        return JsonResponse({"ok": False, "msg": "請先登入"})

def complete_order_payment(request, orderId):
    return render(request, "orderSuccess.html")

def render_history_order(request):
    return render(request, "historyOrder.html")

@csrf_exempt
def recieve_order(request):
    if request.method == "POST":
        get_cookie = request.COOKIES.get("customer_token")
        try:
            payloads = jwt.decode(get_cookie, jwt_key, algorithms = "HS256")
            request_data = json.loads(request.body)["orderData"]
            now = datetime.now().strftime("%Y-%m-%d")
            order_id = "O-" + now + str(random.randint(100000, 999999))

            for data in request_data:
                id_query = Booking.objects.filter(booking_id=data["booking_id"])
                booking = Booking.objects.get(booking_id=data["booking_id"])
                members_id = id_query[0].members_id_id
                customer_id = id_query[0].customer_id_id
                
                # alter booking-status
                booking.booking_status = data["order_status"]
                booking.save()

                # store into DB
                order = Order()
                order.members = Members(members_id)
                order.customers = Customers(customer_id)
                order.bookings = booking
                order.order_id = order_id
                order.order_date = data["booking_date"]
                order.order_time = data["booking_time"]
                order.order_total_time = data["booking_total_time"]
                order.order_price = data["booking_price"]
                order.order_status = data["order_status"]
                order.save()
            
            return JsonResponse({"ok":True, "orderId": order_id})
        except Exception as err:
            return JsonResponse({"ok": False, "msg": f"{err}"})
    return JsonResponse({"ok": False, "msg": "wrong HTTP Method"})

def get_ordering_record(request, orderId):
    get_cookie = request.COOKIES.get("customer_token")
    try:
        payloads = jwt.decode(get_cookie, jwt_key, algorithms = "HS256")
        order_query = Order.objects.filter(order_id=orderId, order_status="ordering")
        if order_query:
            order_data = []
            for data in order_query:
                order = {
                    "order_date": data.order_date,
                    "order_time": data.order_time,
                    "order_total_time": data.order_total_time,
                    "order_price": data.order_price,
                    "order_status": data.order_status,
                    "bookings_id": data.bookings_id
                }
                order_data.append(order)
            response_data = {
                "ok":True,
                "order_id": orderId,
                "order_data": order_data
            }
            
            return JsonResponse(response_data)
        
        response_data = {
            "ok":False,
            "order_id": orderId,
            "order_data": None
        }
        return JsonResponse(response_data)
    except:
        return JsonResponse({"ok": False, "msg": "請先登入"})

@csrf_exempt  
def get_paid_record(request):
    get_cookie = request.COOKIES.get("customer_token")
    try:
        payloads = jwt.decode(get_cookie, jwt_key, algorithms = "HS256")
        request_data = json.loads(request.body)
        orderId = request_data["orderId"]
        try:
            orders = Order.objects.filter(order_id = orderId, order_status = "payed")
            order_list = []
            for order in orders:
                data = {
                    "order_date": order.order_date,
                    "order_time": order.order_time,
                    "order_total_time": order.order_total_time,
                    "order_price": order.order_price
                }
                order_list.append(data)
            return JsonResponse({"ok": True, "data": order_list})
        except:
            return JsonResponse({"ok": False, "msg": "server went wrong"})
    except:
        return JsonResponse({"ok": False, "msg": "請先登入"})
 
@csrf_exempt
def get_order_history(request):
    get_cookie = request.COOKIES.get("customer_token")
    try:
        payloads = jwt.decode(get_cookie, jwt_key, algorithms = "HS256")
        try:
            orders_payed = Order.objects.filter(customers_id = payloads["customer_id"], order_status = "payed")
            orders_canceled = Order.objects.filter(customers_id = payloads["customer_id"], order_status = "canceled")
            history_order_list = []
            if orders_payed:
                for order in orders_payed:
                    data = {
                        "order_id": order.order_id,
                        "order_date": order.order_date,
                        "order_time": order.order_time,
                        "order_total_time": order.order_total_time,
                        "order_price": order.order_price,
                        "order_status": order.order_status
                    }
                    history_order_list.append(data)
            if orders_canceled:
                for order in orders_canceled:
                    data = {
                        "order_id": order.order_id,
                        "order_date": order.order_date,
                        "order_time": order.order_time,
                        "order_total_time": order.order_total_time,
                        "order_price": order.order_price,
                        "order_status": order.order_status
                    }
            return JsonResponse({"ok": True, "order_data": history_order_list})
        except:
            return JsonResponse({"ok": False, "msg": "server went wrong"})
    except:
        return JsonResponse({"ok": False, "msg": "請先登入"})

@csrf_exempt
def get_unpaid_order(request):
    get_cookie = request.COOKIES.get("customer_token")
    try:
        payloads = jwt.decode(get_cookie, jwt_key, algorithms = "HS256")
        try:
            orders = Order.objects.filter(customers=payloads["customer_id"], order_status="ordering")
            if order:
                orderIds = set()
                for order in orders:
                    orderIds.add(order.order_id)
                orderId = [id for id in orderIds]
                return JsonResponse({"ok": True, "orderId": orderId})
            return JsonResponse({"ok": True, "orderId": None})
        except:
            return JsonResponse({"ok": False, "msg": "server went wrong"})
    except:
        return JsonResponse({"ok": False, "msg": "請先登入"})



# 金流

def tappay_id_key(request):
    get_cookie = request.COOKIES.get("customer_token")
    try:
        payloads = jwt.decode(get_cookie, jwt_key, algorithms = "HS256")
        app_id = os.getenv("appId")
        app_key = os.getenv("appKey")
        response_data = {
            "app_id": app_id,
            "app_key": app_key
        }
        return JsonResponse({"ok": True, "data": response_data})
    except:
        return JsonResponse({"ok": False, "msg": "請先登入"})

@csrf_exempt
def tappay_payment(request):
    if request.method == "POST":
        get_cookie = request.COOKIES.get("customer_token")
        try:
            payloads = jwt.decode(get_cookie, jwt_key, algorithms = "HS256")
            request_data = json.loads(request.body)
            # 訂單資料
            order_data = request_data["order"]
            price = order_data["price"]
            orderId = order_data["orderId"]
            # 訂購人資訊
            customer_data = request_data["contact"]
            name = customer_data["name"]
            email = customer_data["email"]
            phone = customer_data["phone"]
            # 金流
            prime_token = request_data["prime"]
            url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
            header_content = {"Content-Type": "application/json", "x-api-key": os.getenv("partner_key")}
            data = {
                "prime": prime_token,
                "partner_key": os.getenv("partner_key"),
                "merchant_id": os.getenv("merchant_id"),
                "details": orderId,
                "amount": price,
                "cardholder": {
                    "phone_number": phone,
                    "name": name,
                    "email": email
                },
                "remember": True
            }
            send_tappay = requests.post(url, headers = header_content, json = data,)
            pay_result = send_tappay.json()
            print(pay_result)

            if pay_result["status"] == 0:

                response_data = {
                    "data": {
                        "number": orderId,
                        "payment": {
                            "status": pay_result["status"],
                            "message": "付款成功"
                        }
                    }
                }

                # 更改booking/order status
                orders = Order.objects.filter(order_id=orderId)
                for order in orders:
                    order.order_status = "payed"
                    order.bookings.booking_status = "payed"
                    order.save()
                    order.bookings.save()


                return JsonResponse({"ok": True, "data": response_data})
            
            response_data = {
                "data": {
                    "number": orderId,
                    "payment": {
                        "status": pay_result["status"],
                        "message": "付款失敗"
                    }
                }
            }
            return JsonResponse({"ok": False, "data": response_data})
        except:
            return JsonResponse({"ok": False, "message": "請先登入"})
        
    return JsonResponse({"ok": False, "message": "HTTP連線方式錯誤"})