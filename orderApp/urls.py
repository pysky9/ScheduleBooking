from django.urls import path
from orderApp import views

app_name = "order"

urlpatterns = [
    path("recieve_order/", views.recieve_order),
    path("check_order/<orderId>", views.render_check_order),
    path("get_order_record/<orderId>", views.get_ordering_record),
    path("get_tappay_id_key/", views.tappay_id_key),
    path("tappay_payment/", views.tappay_payment),
    path("order_record/<storename>", views.order_record_page),
    path("get_order_history/", views.get_order_history),
    path("get_unpaid_order/", views.get_unpaid_order),
    path("complete_order_payment/<orderId>", views.complete_order_payment),
    path("get_paid_record/", views.get_paid_record),
    path("history_order/", views.render_history_order),
    path("delete_order/", views.delete_order)
]
