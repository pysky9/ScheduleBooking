from datetime import date, datetime
import json
import jwt
import requests
import os

from dotenv import load_dotenv

from django.shortcuts import render
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt

from membersApp.models import Members
from calendarApp.models import Time_setting, Time_pricing, Pay_deposit, Order_audit_cancel
from cartApp.models import Booking
from orderApp.models import Order

load_dotenv()
jwt_key = os.getenv("jwt_key")

time_setting = Time_setting()
time_pricing = Time_pricing()
pay_deposit = Pay_deposit()
order_audit_cancel = Order_audit_cancel()


# Create your views here.
def calendar(request, storename):
    return render(request, 'calendar.html')

def booked_calendar(request, storename):
    return render(request, "bookedcalendar.html")

def time_setting_records(request, storename):
    return render(request, "timeSettingRecords.html")

def calendar_setting(request):
    if request.method == "POST":
        data = json.loads(request.body)
        time_setting.time_interval_category = data['timeSettingCategory']
        time_setting.begin_time = data['timeSettingBegintime']
        time_setting.end_time = data['timeSettingEndtime']
        time_setting.begin_date = data['timeSettingBegindate']
        time_setting.end_date = data['timeSettingEnddate']
        time_setting.time_slice = data['timeNumbers']
        time_setting.time_slice_unit = data['timeSliceUnit']
        time_setting.pre_ordering_numbers = data['timeBookingNums']
        time_setting.pre_ordering_unit = data['timeBookingUnit']
        time_setting.members = Members(data['membersData']['id'])
        time_setting.save()

        time_pricing.origin_price = data['orignPrice']
        time_pricing.discount_price = data['discountPrice']
        time_pricing.discount_begin_date = data['discountBeginDate']
        time_pricing.discount_end_date = data['discountEndDate']
        time_pricing.members = Members(data['membersData']['id'])
        time_pricing.save()

        pay_deposit.open_deposit = data['depositChooses']
        pay_deposit.deposit_category = data['depositItems']
        pay_deposit.deposit_total_amount = data['totalDeposits']
        pay_deposit.members = Members(data['membersData']['id'])
        pay_deposit.save()

        order_audit_cancel.audit_choosing = data['bookingAudits']
        order_audit_cancel.cancel_choosing = data['bookingCancels']
        order_audit_cancel.cancel_number = data['cancelDayNumber']
        order_audit_cancel.cancel_unit = data['cancelTimeUnit']
        order_audit_cancel.members = Members(data['membersData']['id'])
        order_audit_cancel.save()

        return JsonResponse({"ok": True})
    
    return JsonResponse({"ok": False})

@csrf_exempt
def response_time_period(request):
    if request.method == "POST":
        data = json.loads(request.body)
        request_date_split = data['date'].split('-')
        request_date_year = int(request_date_split[0])
        request_date_month = int(request_date_split[1])
        request_date_day = int(request_date_split[2])
        request_date = datetime(request_date_year, request_date_month, request_date_day)

        today = datetime.today()

        today_hours = today.hour
        today_minutes = today.minute 

        # 確認商家&取得members id
        query_member = Members.objects.filter(username=data["username"])
        id = query_member[0].id
        
        # 商家設定日期
        query = Time_setting.objects.filter(members_id=id) 
        if not query:
            return JsonResponse({"ok": False, "data": None}) 
        preordering_time = f"{query[0].pre_ordering_numbers}{query[0].pre_ordering_unit}"
        # 時段邏輯
        begin_time = query[0].begin_time
        end_time = query[0].end_time
        time_slice = int(query[0].time_slice)
        time_slice_unit = query[0].time_slice_unit
        time_slice_list = generate_time_slice(begin_time, end_time, time_slice, time_slice_unit, request_date)
        whole_time_slice_list = time_slice_list["time_slice_list"]
        today_time_slice_list = time_slice_list["time_slice_for_today"]
        morning = time_slice_list["morning"]
        afternoon = time_slice_list["afternoon"]
        night = time_slice_list["night"]
        morning_today = time_slice_list["morning_for_today"]
        afternoon_today = time_slice_list["afternoon_for_today"]
        night_today = time_slice_list["night_for_today"]

        if query[0].time_interval_category == "特定時間範圍，每日幾點到幾點":
            db_begin_date_split = query[0].begin_date.split('-')
            db_begin_date_year = int(db_begin_date_split[0])
            db_begin_date_month = int(db_begin_date_split[1])
            db_begin_date_day = int(db_begin_date_split[2])
            db_begin_date = datetime(db_begin_date_year, db_begin_date_month, db_begin_date_day)

            db_end_date_split = query[0].end_date.split('-')
            db_end_date_year = int(db_end_date_split[0])
            db_end_date_month = int(db_end_date_split[1])
            db_end_date_day = int(db_end_date_split[2])
            db_end_date = datetime(db_end_date_year, db_end_date_month, db_end_date_day)
            
            if request_date.date() == today.date():   
                response_data = {
                    "OK": True,
                    "category": query[0].time_interval_category,
                    "interval":{
                        "begin_date": db_begin_date,
                        "end_date": db_end_date,
                        "begin_time": begin_time,
                        "end_time": end_time
                    },
                    "available_time": today_time_slice_list,
                    "morning": morning,
                    "afternoon": afternoon,
                    "night": night,
                    "today":{
                        "morning_today": morning_today,
                        "afternoon_today": afternoon_today,
                        "night_today": night_today
                    },
                    "time_slice": query[0].time_slice,
                    "time_slice_unit": query[0].time_slice_unit,
                    "preordering_time": preordering_time
                    }
                return JsonResponse(response_data)
            if today.date() < request_date.date() <= db_end_date.date():
                response_data = {
                    "OK": True, 
                    "category": query[0].time_interval_category,
                    "interval":{
                        "begin_date": db_begin_date,
                        "end_date": db_end_date,
                        "begin_time": begin_time,
                        "end_time": end_time
                    },
                    "available_time": whole_time_slice_list,
                    "morning": morning,
                    "afternoon": afternoon,
                    "night": night,
                    "today":{
                        "morning_today": morning_today,
                        "afternoon_today": afternoon_today,
                        "night_today": night_today
                    },
                    "time_slice": query[0].time_slice,
                    "time_slice_unit": query[0].time_slice_unit,
                    "preordering_time": preordering_time
                    }
                return JsonResponse(response_data)
            if request_date.date() > db_end_date.date() or request_date.date() < today.date():
                response_data = {
                    "OK": True, 
                    "category": query[0].time_interval_category,
                    "interval":{
                        "begin_date": db_begin_date,
                        "end_date": db_end_date,
                        "begin_time": begin_time,
                        "end_time": end_time
                    },
                    "available_time": None,
                    "morning": morning,
                    "afternoon": afternoon,
                    "night": night,
                    "today":{
                        "morning_today": morning_today,
                        "afternoon_today": afternoon_today,
                        "night_today": night_today
                    },
                    "time_slice": query[0].time_slice,
                    "time_slice_unit": query[0].time_slice_unit,
                    "preordering_time": preordering_time
                    }
                return JsonResponse(response_data)

        else:
            if request_date.date() == today.date():   
                response_data = {
                    "OK": True, 
                    "category": query[0].time_interval_category,
                    "interval":{
                        "begin_time": begin_time,
                        "end_time": end_time
                    },
                    "available_time": today_time_slice_list,
                    "morning": morning,
                    "afternoon": afternoon,
                    "night": night,
                    "today":{
                        "morning_today": morning_today,
                        "afternoon_today": afternoon_today,
                        "night_today": night_today
                    },
                    "time_slice": query[0].time_slice,
                    "time_slice_unit": query[0].time_slice_unit,
                    "preordering_time": preordering_time
                    }
                return JsonResponse(response_data)
            if request_date.date() > today.date():
                response_data = {
                    "OK": True, 
                    "category": query[0].time_interval_category,
                    "interval":{
                        "begin_time": begin_time,
                        "end_time": end_time
                    },
                    "available_time": whole_time_slice_list,
                    "morning": morning,
                    "afternoon": afternoon,
                    "night": night,
                    "today":{
                        "morning_today": morning_today,
                        "afternoon_today": afternoon_today,
                        "night_today": night_today
                    },
                    "time_slice": query[0].time_slice,
                    "time_slice_unit": query[0].time_slice_unit,
                    "preordering_time": preordering_time
                    }
                return JsonResponse(response_data)
            if request_date.date() < today.date():
                response_data = {
                    "OK": True, 
                    "category": query[0].time_interval_category,
                    "interval":{
                        "begin_time": begin_time,
                        "end_time": end_time
                    },
                    "available_time": None,
                    "morning": morning,
                    "afternoon": afternoon,
                    "night": night,
                    "today":{
                        "morning_today": morning_today,
                        "afternoon_today": afternoon_today,
                        "night_today": night_today
                    },
                    "time_slice": query[0].time_slice,
                    "time_slice_unit": query[0].time_slice_unit,
                    "preordering_time": preordering_time
                    }
                return JsonResponse(response_data)
    return JsonResponse({"ok": False})

def generate_time_slice(begin_time, end_time, time_slice, time_slice_unit,  request_date):
    begin_time_hours = begin_time.split(":")[0]
    begin_time_minutes = begin_time.split(":")[1]
    end_time_hours = end_time.split(":")[0]
    end_time_minutes = end_time.split(":")[1]

    today = datetime.today()
    today_hours = today.hour
    today_minutes = today.minute 

    time_slice_for_today = []
    time_slice_list = [begin_time]
    morning = [begin_time]
    afternoon = []
    night = []
    morning_for_today = []
    afternoon_for_today = []
    night_for_today = []
    if time_slice_unit == "小時":
        begin_time_hours = int(begin_time_hours)
        begin_time_minutes = int(begin_time_minutes)
        while begin_time_hours < int(end_time_hours):
            begin_time_hours += time_slice
            time = time_slice_format(begin_time_hours, begin_time_minutes)
            time_slice_list.append(time)

            # 將時段分為早上、中午、晚上
            if begin_time_hours < 12:
                morning.append(time)
            elif 12 <= begin_time_hours < 18:
                afternoon.append(time)
            else:
                night.append(time)
            
            # 依照使用者目前所在時間提供時段
            if request_date.date() == today.date() and begin_time_hours > today_hours:
                today_time = time_slice_format(begin_time_hours, begin_time_minutes)
                time_slice_for_today.append(today_time)
                if begin_time_hours < 12:
                    morning_for_today.append(today_time)
                elif 12 <= begin_time_hours < 18:
                    afternoon_for_today.append(today_time)
                else:
                    night_for_today.append(today_time)

    elif time_slice_unit == "分":
        begin_time_hours = int(begin_time_hours)
        begin_time_minutes = int(begin_time_minutes)
        end_time_hours = int(end_time_hours)
        end_time_minutes = int(end_time_minutes)

        while True:
            begin_time_minutes += time_slice
            if begin_time_minutes >= 60:
                begin_time_hours += begin_time_minutes // 60
                begin_time_minutes = begin_time_minutes % 60

            time = time_slice_format(begin_time_hours, begin_time_minutes)

            if begin_time_hours < 12:
                morning.append(time)
            elif 12 <= begin_time_hours < 18:
                afternoon.append(time)
            else:
                night.append(time)

            if request_date.date() == today.date() and (begin_time_hours > today_hours or (begin_time_hours >= today_hours and begin_time_minutes >= today_minutes)):
                time_today = time_slice_format(begin_time_hours, begin_time_minutes)
                time_slice_for_today.append(time_today)
                
                if begin_time_hours < 12:
                    morning_for_today.append(time_today)
                elif 12 <= begin_time_hours < 18:
                    afternoon_for_today.append(time_today)
                else:
                    night_for_today.append(time_today)
            
            # while 何時結束
            if begin_time_hours > end_time_hours or (begin_time_hours == end_time_hours and begin_time_minutes > end_time_minutes):
                break

            time_slice_list.append(time)
    else:
        time_slice_list.append(begin_time)

    return {
        "time_slice_list":time_slice_list, 
        "time_slice_for_today":time_slice_for_today, 
        "morning": morning, 
        "afternoon": afternoon, 
        "night": night,
        "morning_for_today": morning_for_today,
        "afternoon_for_today": afternoon_for_today,
        "night_for_today": night_for_today
        }

def time_slice_format(begin_time_hours, begin_time_minutes):
    begin_time_hours_string = str(begin_time_hours).zfill(2)
    begin_time_minutes_string = str(begin_time_minutes).zfill(2)
    return f"{begin_time_hours_string}:{begin_time_minutes_string}"

@csrf_exempt
def response_time_price(request):
    # 商家設定的時段價錢
    data = json.loads(request.body)
    request_date = data["date"]

    # 確認商家&取得member id
    query_member = Members.objects.filter(username=data["username"])
    if not query_member:
        return JsonResponse({"ok": False, "data": None}) 
    id = query_member[0].id


    query = Time_pricing.objects.filter(members_id=id)
    origin_price = query[0].origin_price
    discount_price = query[0].discount_price
    query_time = Time_setting.objects.filter(members_id=id)
    time_slice = query_time[0].time_slice
    time_slice_unit = query_time[0].time_slice_unit

    if discount_price :
        discount_begin_date = query[0].discount_begin_date
        discount_end_date = query[0].discount_end_date
        request_datetime = convert_to_datetime(request_date)
        discount_begin_datetime = convert_to_datetime(discount_begin_date)
        discount_end_datetime = convert_to_datetime(discount_end_date)
        if discount_begin_datetime.date() <= request_datetime.date() <= discount_end_datetime.date():
            response_data = {
                "OK": True,
                "isDiscount": True,
                "origin_price": origin_price,
                "discount_price": discount_price,
                "discount_begin_date": discount_begin_date,
                "discount_end_date": discount_end_date,
                "time_slice": time_slice,
                "time_slice_unit": time_slice_unit
            }
        else:
            response_data = {
                "OK": True,
                "isDiscount": False,
                "origin_price": origin_price,
                "discount_price": discount_price,
                "discount_begin_date": discount_begin_date,
                "discount_end_date": discount_end_date,
                "time_slice": time_slice,
                "time_slice_unit": time_slice_unit
            }
        return JsonResponse(response_data)

    response_data = {
        "OK": True,
        "isDiscount": False,
        "origin_price": origin_price,
        "discount_price": discount_price,
        "discount_begin_date": None,
        "discount_end_date": None,
        "time_slice": time_slice,
        "time_slice_unit": time_slice_unit
    }
    return JsonResponse(response_data)

@csrf_exempt
def get_reservation_time(request):
    if request.method == "POST":
        get_cookie = request.COOKIES.get("customer_token")
        try:
            payloads = jwt.decode(get_cookie, jwt_key, algorithms = "HS256")
            date = json.loads(request.body)["date"]
            try:
                booking_in_cart = Booking.objects.filter(members_id_id=payloads["store_id"], booking_date=date, booking_status="booked")
                order_unpaid = Order.objects.filter(members_id=payloads["store_id"], order_date=date, order_status="ordering")
                order_paid = Order.objects.filter(members_id=payloads["store_id"], order_date=date, order_status="payed")
                reservation_time_list = []
                if booking_in_cart:
                    for booking in booking_in_cart:
                        reservation_time_data = {
                            "reservation_date": booking.booking_date,
                            "reservation_time": booking.booking_time
                        }
                        reservation_time_list.append(reservation_time_data)
                if order_unpaid:
                    for ordering in order_unpaid:
                        reservation_time_data = {
                            "reservation_date": ordering.order_date,
                            "reservation_time": ordering.order_time
                        }
                        reservation_time_list.append(reservation_time_data)
                if order_paid:
                    for ordered in order_paid:
                        reservation_time_data = {
                            "reservation_date": ordered.order_date,
                            "reservation_time": ordered.order_time
                        }
                        reservation_time_list.append(reservation_time_data)
                return JsonResponse({"ok": True, "reservation_time_list": reservation_time_list})
            except:
                
                return JsonResponse({"ok": False, "msg": "server went wrong"})
        except:
            return JsonResponse({"ok": False, "message": "請先登入"})
    return JsonResponse({"ok": False, "msg": "wrong HTTP Method"})

def get_consumer_data(request):
    get_cookie = request.COOKIES.get("customer_token")
    try:
        payloads = jwt.decode(get_cookie, jwt_key, algorithms = "HS256")
        print(payloads)
        response_data = {
            "storeId": payloads["store_id"],
            "storeName": payloads["store_name"],
            "customerId": payloads["customer_id"],
            "customerName": payloads["name"],
            "customerMail": payloads["email"]
        }
        return JsonResponse({"ok": True, "data": response_data})
    except:
        return JsonResponse({"ok": False, "message": "請先登入"})


def convert_to_datetime(date):
    date_split = date.split("-")
    year = int(date_split[0])
    month = int(date_split[1])
    day = int(date_split[2])
    return datetime(year, month, day)


