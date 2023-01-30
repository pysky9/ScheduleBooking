from django.shortcuts import render
from django.http import JsonResponse
import json

from membersApp.models import Members

# Create your views here.

def homepage(request):
    return render(request, "index.html")

def login_signup(request):
    return render(request, "loginSignup.html")

def member_page(request):
    return render(request, "members.html")

def signup(request):
    if request.method == "POST":
        data = json.loads(request.body)
        members = Members()
        members.username = data["username"]
        members.email = data["email"]
        members.password = data["password"]
        members.save()
        return JsonResponse({"ok": True})

def login(request):
    if request.method == "POST":
        data = json.loads(request.body)
        print(data["email"])
        email = data["email"]
        
        # members = Members()
        query = Members.objects.filter(email=email)
        print(query[0].password)
        
        return JsonResponse({"ok": True})
