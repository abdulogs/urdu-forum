from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login as login_auth
from .serializers import *
from app.helpers import pagination, authclass, get_tokens_for_user

#####################################
############## Dashboard ############


class RegistrationApi(APIView):
    def post(self, request, format=None):
        serializer = RegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = get_tokens_for_user(user)
        return Response(token, status=status.HTTP_201_CREATED)


class LoginApi(APIView):
    def post(self, request, format=None):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.data.get('email')
        password = serializer.data.get('password')
        login = authenticate(username=email, password=password)

        if login:
            data = get_tokens_for_user(login)
            login_auth(request, login)
            return Response(data)
        else:
            return Response(False)


class ChangePasswordApi(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, format=None):
        user_id = request.data.get("userid")
        serializer = ChangePasswordSerializer(
            data=request.data, context={'user': user_id})
        serializer.is_valid(raise_exception=True)
        return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)


class PasswordResetEmailApi(APIView):
    def post(self, request, format=None):
        serializer = PasswordResetEmailSerializer(
            data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        return Response({'message': 'Password Reset link send. Please check your Email'}, status=status.HTTP_200_OK)


class PasswordResetApi(APIView):
    def post(self, request, uid, token, format=None):
        serializer = PasswordResetSerializer(
            data=request.data, context={'uid': uid, 'token': token})
        serializer.is_valid(raise_exception=True)
        return Response({'message': 'Password Reset Successfully', 'change': True}, status=status.HTTP_200_OK)


class UserApi(viewsets.ModelViewSet):
    queryset = User.objects.all().select_related()
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ["id", "username", "first_name", 'last_name', 'email', "is_active",
                        "is_superuser", "is_staff"]
    search_fields = ["id", "username", "first_name", 'last_name', 'email', "is_active", "is_superuser",
                     "is_staff"]
    pagination_class = pagination
    authentication_classes = authclass
    permission_classes = [IsAuthenticated]


class ForumPostApi(viewsets.ModelViewSet):
    queryset = ForumPost.objects.all().select_related()
    serializer_class = ForumPostSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ["id", "description", "created_by_id", "is_active"]
    search_fields = ["name", "description"]
    ordering = ['-id']
    pagination_class = pagination

    def perform_create(self, serializer):
        return serializer.save(created_by=self.request.user)


class ForumCommentApi(viewsets.ModelViewSet):
    queryset = ForumComment.objects.filter().select_related()
    serializer_class = ForumCommentSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ["id", "description", "is_active", "post_id"]
    search_fields = ["id", "description", "is_active", "post_id"]
    ordering = ['-id']
    pagination_class = pagination

    def perform_create(self, serializer):
        return serializer.save(created_by=self.request.user)


class ForumReactionApi(viewsets.ModelViewSet):
    queryset = Reaction.objects.all().select_related()
    serializer_class = ForumReactionSerializer

    def perform_create(self, serializer):
        return serializer.save(created_by=self.request.user)
