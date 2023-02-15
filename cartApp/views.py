import json
import jwt
import os
import random

from dotenv import load_dotenv

from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from cartApp.models import Booking
from membersApp.models import Members
from lineApp.models import Customers

load_dotenv()
jwt_key = os.getenv("jwt_key")

@csrf_exempt
def booking(request): #預約資料寫入資料庫
    get_cookie = request.COOKIES.get("customer_token")
    try:
        payloads = jwt.decode(get_cookie, jwt_key, algorithms = "HS256")


        customer_query = Customers.objects.filter(email=payloads["email"])
        customer_id = customer_query[0].id

        data = json.loads(request.body)["data"]
        store_query = Members.objects.filter(username=data["storeName"])
        store_id = store_query[0].id
        booking_id = data["bookingDate"][:9] + str(random.randint(100000, 999999))
        
        booking = Booking()
        booking.members_id = Members(store_id)
        booking.customer_id = Customers(customer_id)
        booking.booking_id = booking_id
        booking.booking_date = data["bookingDate"]
        booking.booking_time = data["bookingTime"]
        booking.booking_total_time = data["bookingTotalTime"]
        booking.booking_price = data["bookingPrice"]
        booking.booking_status = data["bookingStatus"]
        booking.save()
        response_data = {"customer_name": payloads["name"], "customer_mail": payloads["email"], "booking_id": booking_id}
        return JsonResponse({"ok": True, "data": response_data})
    except:
        return JsonResponse({"ok": False, "data": None})

@csrf_exempt
def cancel_booking(request): #取消預約更改bookingStatus
    get_cookie = request.COOKIES.get("customer_token")
    try:
        payloads = jwt.decode(get_cookie, jwt_key, algorithms = "HS256")
        data = json.loads(request.body)["data"]
        record = Booking.objects.get(booking_id=data["bookingId"])
        record.booking_status = data["bookingStatus"]
        record.save()
        return JsonResponse({"ok": True})
    except Exception as err:
        return JsonResponse({"ok": False, "message": f"{err}"})

def record(request):
    get_cookie = request.COOKIES.get("customer_token")
    try:
        payloads = jwt.decode(get_cookie, jwt_key, algorithms = "HS256")
        customer_query = Customers.objects.filter(email=payloads["email"])
        customer_id = customer_query[0].id
        record_query = Booking.objects.filter(customer_id_id = customer_id, booking_status = "booked")
        response_data = []
        if record_query:
            for book in record_query:
                data = {
                    "booking_id": book.booking_id,
                    "booking_date": book.booking_date,
                    "booking_time": book.booking_time,
                    "booking_total_time": book.booking_total_time,
                    "booking_price": book.booking_price
                }
                response_data.append(data)
        return JsonResponse({"ok": True, "data": response_data})
    except Exception as err:
        return JsonResponse({"ok": False, "message": f"{err}"})
        