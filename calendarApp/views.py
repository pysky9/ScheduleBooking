from django.shortcuts import render
from django.http import JsonResponse
import json

from membersApp.models import Members
from calendarApp.models import Time_setting, Time_pricing, Pay_deposit, Order_audit_cancel

# Create your views here.
def calendar(request):
    return render(request, 'calendar.html')

members = Members()
time_setting = Time_setting()
time_pricing = Time_pricing()
pay_deposit = Pay_deposit()
order_audit_cancel = Order_audit_cancel()

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
        time_setting.save()

        time_pricing.origin_price = data['orignPrice']
        time_pricing.discount_price = data['discountPrice']
        time_pricing.discount_begin_date = data['discountBeginDate']
        time_pricing.discount_end_date = data['discountEndDate']
        time_pricing.save()

        pay_deposit.open_deposit = data['depositChooses']
        pay_deposit.deposit_category = data['depositItems']
        pay_deposit.deposit_total_amount = data['totalDeposits']
        pay_deposit.save()

        order_audit_cancel.audit_choosing = data['bookingAudits']
        order_audit_cancel.cancel_choosing = data['bookingCancels']
        order_audit_cancel.cancel_number = data['cancelDayNumber']
        order_audit_cancel.cancel_unit = data['cancelTimeUnit']
        order_audit_cancel.save()

    return JsonResponse({"ok": True})