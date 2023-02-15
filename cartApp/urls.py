from django.urls import path
from cartApp import views

app_name = "cart"

urlpatterns = [
    path("", views.booking),
    path("cancel/", views.cancel_booking),
    path("record/", views.record)
]  

