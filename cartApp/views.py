import json

from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from membersApp.models import Members

# Create your views here.

@csrf_exempt
def booking(request): #預約資料寫入資料庫
    data = json.loads(request.body)
    
    return JsonResponse({"ok": True})

@csrf_exempt
def cancel_booking(request): #取消預約更改bookingStatus
    pass