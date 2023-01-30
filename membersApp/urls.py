from django.urls import path
from membersApp import views

app_name = "members"

urlpatterns = [
    path("loginSignup/", views.login_signup),
    path("member_page/", views.member_page),
    path("signup/", views.signup),
    path("login/", views.login),
]