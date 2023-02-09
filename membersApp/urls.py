from django.urls import path
from membersApp import views

app_name = "members"

urlpatterns = [
    path("loginSignup/", views.login_signup),
    path("member_page/", views.member_page),
    path("signup/", views.signup),
    path("login/", views.login),
    path('logout/', views.logout),
    path("get_members_info/", views.get_members_info),
    path("line_setting/", views.line_setting_page),
]