from django.urls import path, include
from .views import *

urlpatterns = [
    path('api/', include("app.api.urls")),
    path('', Home, name="home"),
    path('team/', Team, name="team"),
    path('profile/', Profile, name="profile"),
    path('change-password/', ChangePassowrd, name="changePassowrd"),
    path('login/', Login, name="login"),
    path('signup/', Signup, name="signup"),
    path('logout/', Signout, name="logout"),
    path('password-forgot/', ForgotPassword, name="forgotPassword"),
    path('password-recovery/<uid>/<token>/',
         RecoverPassword, name="pRecovery"),
    path('forbidden/', Forbidden, name="forbidden"),
]
