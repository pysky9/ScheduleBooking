from django.urls import path
from membersApp import views

app_name = "members"

urlpatterns = [
    path("loginSignup/", views.login_signup),
    path("member_page/<username>", views.member_page),
    path("signup/", views.signup),
    path("login/", views.login),
    path('logout/', views.logout),
    path("get_members_info/", views.get_members_info),
    path("sitemap/<username>", views.site_map),
    path("customer_management/<storename>", views.customer_management),
    path("store_setting/<storename>", views.store_setting),
]
