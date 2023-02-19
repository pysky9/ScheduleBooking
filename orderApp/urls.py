from django.urls import path
from orderApp import views

app_name = "order"

urlpatterns = [
    path("recieve_order/", views.recieve_order),
    path("check_order/<orderId>", views.check_order),
    path("get_order_record/<orderId>", views.get_order_record),
    path("get_tappay_id_key/", views.tappay_id_key),
    path("tappay_payment/", views.tappay_payment),
]