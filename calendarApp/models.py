from django.db import models
from membersApp.models import Members

# Create your models here.
class Time_setting(models.Model):
    time_interval_category = models.CharField(max_length=150, null=False)
    begin_time = models.CharField(max_length=150, null=False)
    end_time = models.CharField(max_length=150, null=False)
    begin_date = models.CharField(max_length=150)
    end_date = models.CharField(max_length=150)
    time_slice = models.CharField(max_length=50, null=False)
    time_slice_unit = models.CharField(max_length=10, null=False)
    pre_ordering_numbers = models.CharField(max_length=15)
    pre_ordering_unit = models.CharField(max_length=15)
    # members = models.ForeignKey(Members, on_delete=models.CASCADE, related_name="time_setting")

    def __str__(self):
        return self.name

class Time_pricing(models.Model):
    origin_price = models.CharField(max_length=100, null=False)
    discount_price = models.CharField(max_length=100)
    discount_begin_date = models.CharField(max_length=100)
    discount_end_date = models.CharField(max_length=100)
    # members = models.ForeignKey(Members, on_delete=models.CASCADE, related_name="time_pricing")

    def __str__(self):
        return self.name

class Pay_deposit(models.Model):
    open_deposit = models.CharField(max_length=50)
    deposit_category = models.CharField(max_length=50)
    deposit_total_amount = models.CharField(max_length=100)
    # members = models.ForeignKey(Members, on_delete=models.CASCADE, related_name="pay_deposit")

    def __str__(self):
        return self.name

class Order_audit_cancel(models.Model):
    audit_choosing = models.CharField(max_length=10)
    cancel_choosing = models.CharField(max_length=10)
    cancel_number = models.CharField(max_length=20)
    cancel_unit = models.CharField(max_length=20)
    # members = models.ForeignKey(Members, on_delete=models.CASCADE, related_name="order_audit_cancel")

    def __str__(self):
        return self.name