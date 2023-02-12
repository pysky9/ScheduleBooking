from django.urls import path
from calendarApp import views

app_name = "calendar"

urlpatterns = [
    path('views/<username>', views.calendar),
    path('setting/', views.calendar_setting),
    path('response_period/', views.response_time_period),
    path('response_time_price/', views.response_time_price),
    # path('recieve/<username>', views.recieve),
    
]

