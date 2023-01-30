from django.db import models

# Create your models here.
class Members(models.Model):
    username = models.CharField(max_length=255, null=False)
    email = models.EmailField(max_length=254, null=False)
    password = models.CharField(max_length=150, null=False)
    def __str__(self):
        return self.username

