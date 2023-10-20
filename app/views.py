from django.shortcuts import render, HttpResponseRedirect
from .decorators import *


def Home(request):
    return render(request, "index.html")


@login_required(login_url='/')
def Profile(request):
    return render(request, "profile.html")


@superuser_required(redirect_url="/forbidden/")
@login_required(login_url='/login/')
def Team(request):
    return render(request, "team.html")


@login_required(login_url='/')
def ChangePassowrd(request):
    return render(request, "change-password.html")


@logout_required(logout_url='/')
def Login(request):
    return render(request, "login.html")


@logout_required(logout_url='/')
def Signup(request):
    return render(request, "signup.html")


@logout_required(logout_url='/')
def ForgotPassword(request):
    return render(request, "password-forgot.html")


@logout_required(logout_url='/')
def RecoverPassword(request, uid, token):
    return render(request, "password-recovery.html", {"token": token, "uid": uid})


def Signout(request):
    logout(request)
    return HttpResponseRedirect('/')


def Forbidden(request):
    return render(request, "403.html")


def Notfound(request):
    return render(request, "404.html")

