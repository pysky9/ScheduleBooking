from django.urls import path
from calendarApp import views

app_name = "calendar"

urlpatterns = [
    path('views/', views.calendar),
    path('setting/', views.calendar_setting),
    path('response_period/', views.response_time_period)
]