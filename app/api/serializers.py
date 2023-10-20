from rest_framework import serializers
from drf_writable_nested.serializers import WritableNestedModelSerializer
from django.utils.encoding import smart_str, force_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from email_utils import send_email
from app.models import *
from app.helpers import exact_url


class CreatedBySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "first_name", "last_name",
                  "email", "username", "avatar")
        read_only_fields = ("first_name", "last_name",
                            "email", "username", "avatar")


class RegistrationSerializer(serializers.ModelSerializer):
    # We are writing this becoz we need confirm password field in our Registratin Request
    password2 = serializers.CharField(
        style={"input_type": "password"}, write_only=True)

    class Meta:
        model = User
        fields = ["username", "first_name", "last_name", "email", "password", "password2",
                  "is_staff", "is_superuser", "is_active"]
        extra_kwargs = {"password": {"write_only": True}}

    # Validating Password and Confirm Password while Registration
    def validate(self, attrs):
        password = attrs.get("password")
        password2 = attrs.get("password2")
        if password != password2:
            raise serializers.ValidationError(
                "Password and Confirm Password does't match")
        return attrs

    def create(self, validate_data):
        return User.objects.create_user(**validate_data)


class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255)

    class Meta:
        model = User
        fields = ["email", "password"]


class PasswordResetEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)

    class Meta:
        fields = ["email"]

    def validate(self, attrs):
        request = self.context["request"]
        email = attrs.get("email")
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            # Send EMail
            send_email(
                context={
                    "url": exact_url(request),
                    "logo": exact_url(request, "/src/images/logo.png"),
                    "link": exact_url(request, f"/password-recovery/{uid}/{token}/"),
                    "message": "Click on the button below to recover your account",
                },
                from_email="",
                recipient_list=[email],
                subject="Password verification link",
                template_name="emails/account-password-verification.html",
            )
            return attrs
        else:
            raise serializers.ValidationError("You are not a registered User")


class ChangePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(
        max_length=255, style={"input_type": "password"}, write_only=True)
    password2 = serializers.CharField(
        max_length=255, style={"input_type": "password"}, write_only=True)

    class Meta:
        fields = ["password", "password2"]

    def validate(self, attrs):
        password = attrs.get("password")
        password2 = attrs.get("password2")
        userid = self.context.get("user")
        user = User.objects.get(id=userid)
        if password != password2:
            raise serializers.ValidationError(
                "Password and Confirm Password doesn't match")
        user.set_password(password)
        user.save()
        return attrs


class PasswordResetSerializer(serializers.Serializer):
    password = serializers.CharField(
        max_length=255, style={"input_type": "password"}, write_only=True)
    password2 = serializers.CharField(
        max_length=255, style={"input_type": "password"}, write_only=True)

    class Meta:
        fields = ["password", "password2"]

    def validate(self, attrs):
        try:
            password = attrs.get("password")
            password2 = attrs.get("password2")
            uid = self.context.get("uid")
            token = self.context.get("token")
            if password != password2:
                raise serializers.ValidationError(
                    "Password and Confirm Password doesn't match")
            id = smart_str(urlsafe_base64_decode(uid))
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise serializers.ValidationError(
                    "Token is not Valid or Expired")
            user.set_password(password)
            user.save()
            return attrs
        except DjangoUnicodeDecodeError as identifier:
            PasswordResetTokenGenerator().check_token(user, token)
            raise serializers.ValidationError("Token is not Valid or Expired")


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "username", "email", "avatar", "about", "is_active",
                  "is_superuser", "is_staff", "created_at", "updated_at")


class ForumPostSerializer(WritableNestedModelSerializer):
    created_by = CreatedBySerializer(many=False, read_only=True)
    comments = serializers.SerializerMethodField("get_comments")

    def get_comments(self, obj):
        try:
            count = ForumComment.objects.filter(
                post_id=obj.id).select_related().distinct().count()
            return count
        except Exception as e:
            return 0

    class Meta:
        model = ForumPost
        fields = ("id", "name", "description", "comments", "is_active",
                  "created_by_id", "created_by", "created_at", "updated_at")


class ForumCommentSerializer(WritableNestedModelSerializer):
    post_id = serializers.CharField()
    created_by = CreatedBySerializer(many=False, read_only=True)
    reaction = serializers.SerializerMethodField('get_reaction')

    def get_reaction(self, obj):
        try:
            user = self.context.get('request').user
            react = Reaction.objects.get(
                comment_id=obj.id, created_by_id=user.id)
            return react.id
        except:
            return False

    class Meta:
        model = ForumComment
        fields = ("id", "description", "post_id", "reaction", "is_active", "created_by_id",
                  "created_by", "created_at", "updated_at")


class ForumReactionSerializer(WritableNestedModelSerializer):
    comment_id = serializers.CharField()
    created_by = CreatedBySerializer(many=False, read_only=True)

    class Meta:
        model = Reaction
        fields = ('id', 'comment_id', 'created_by', 'created_at')
