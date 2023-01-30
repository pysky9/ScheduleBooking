from django.contrib import admin
from calendarApp.models import Time_setting, Time_pricing, Pay_deposit, Order_audit_cancel

# Register your models here.
admin.site.register(Time_setting)
admin.site.register(Time_pricing)
admin.site.register(Pay_deposit)
admin.site.register(Order_audit_cancel)