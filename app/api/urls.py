from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()

router.register("user", UserApi)
router.register("forum-post", ForumPostApi)
router.register("forum-comment", ForumCommentApi)
router.register("forum-reaction", ForumReactionApi)

urlpatterns = [
    path('', include(router.urls), name="AA"),
    path('login/', LoginApi.as_view(), name='AL'),
    path('register/', RegistrationApi.as_view(), name='AR'),
    path('change-password/', ChangePasswordApi.as_view(), name='ACP'),
    path('send-reset-email/', PasswordResetEmailApi.as_view(), name='ASRE'),
    path('reset-password/<uid>/<token>/',
         PasswordResetApi.as_view(), name='ARP'),
]
