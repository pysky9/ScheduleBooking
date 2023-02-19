from django.urls import path
from lineApp import views

app_name = "line"

urlpatterns = [
    path("linelogin/<username>", views.line_login),
    path("channel_setting/<username>", views.channel_setting_page),
    path("channel/", views.store_channel_data),
    path("show/", views.get_channel_data),
    path("data/<username>", views.get_line_data),
    path("recieve/<username>", views.recieve),
    path("get_liffId/", views.get_liffId),
]

