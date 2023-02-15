from django.db import models
from membersApp.models import Members
# Create your models here.

class Channel_data(models.Model):
    members = models.ForeignKey(Members, on_delete=models.CASCADE, related_name="login_api_data") 
    username = models.CharField(max_length=150, null=False)
    channel_id = models.CharField(max_length=250, null=False)
    channel_secret = models.CharField(max_length=250, null=False)

    def __str__(self):
        return self.username

class Customers(models.Model):
    members = models.ForeignKey(Members, on_delete=models.CASCADE, related_name="line_customer_data")
    username = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    picture = models.TextField()

    def __str__(self):
        return self.username