from django.db import models
from membersApp.models import Members
from lineApp.models import Customers
from cartApp.models import Booking

class Order(models.Model):
    members = models.ForeignKey(Members, on_delete=models.CASCADE, related_name="order")
    customers = models.ForeignKey(Customers, on_delete=models.CASCADE, related_name="order")
    bookings = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name="order", to_field="booking_id")
    order_id = models.CharField(max_length=150)
    order_date = models.CharField(max_length=150, null=False)
    order_time = models.CharField(max_length=50, null=False)
    order_total_time = models.CharField(max_length=50, null=False)
    order_price = models.CharField(max_length=50, null=False)
    order_status = models.CharField(max_length=100)
