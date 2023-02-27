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
    time_id = models.CharField(max_length=150)
    members = models.ForeignKey(Members, on_delete=models.CASCADE, related_name="time_setting")

    def __str__(self):
        return self.time_interval_category

class Time_pricing(models.Model):
    origin_price = models.CharField(max_length=100, null=False)
    discount_price = models.CharField(max_length=100)
    discount_begin_date = models.CharField(max_length=100)
    discount_end_date = models.CharField(max_length=100)
    members = models.ForeignKey(Members, on_delete=models.CASCADE, related_name="time_pricing")
    time_setting = models.ForeignKey(Time_setting, on_delete=models.CASCADE, related_name="time_pricing")
