from django.urls import path
from calendarApp import views

app_name = "calendar"

urlpatterns = [
    path('views/<storename>', views.calendar),
    path('setting/', views.calendar_setting),
    path('response_period/', views.response_time_period),
    path('response_time_price/', views.response_time_price),
    path('booked_calendar/<storename>', views.booked_calendar),
    path('time_setting_records/<storename>', views.time_setting_records),
    path('get_reservation_time/', views.get_reservation_time),
    path('get_consumer_data/', views.get_consumer_data),
    path('fetch_merchant_time_slots/', views.fetch_merchant_time_slots),
    path('update_merchant_time_slots/', views.update_merchant_time_slots),
    path('delete_merchant_time_slots/', views.delete_merchant_time_slots)
]

