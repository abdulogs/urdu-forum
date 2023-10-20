from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.contrib.sites.models import Site
from smartfields import fields


class UserManager(BaseUserManager):
    use_in_migraions = True

    def create_user(self, email, password, password2=None, **extra_fields):
        if not email:
            raise ValueError(("Email address is require"))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(("Superuser must have is_staff true"))

        return self.create_user(email=email, password=password, **extra_fields)


class User(AbstractUser):
    first_name = models.CharField(max_length=250, null=True, blank=True)
    last_name = models.CharField(max_length=250, null=True, blank=True)
    username = models.CharField("username", max_length=150, unique=True)
    email = models.EmailField("email address", unique=True, max_length=255)
    avatar = fields.ImageField(
        upload_to="avatars", blank=True, null=True, default="avatar.png")
    about = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(null=True, blank=True, default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]


class ForumPost(models.Model):
    name = models.TextField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(null=True, blank=True, default=True)
    created_by = models.ForeignKey(
        User, editable=False, null=True,  blank=True, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "forum_posts"
        verbose_name = "Forum posts"
        verbose_name_plural = "Forums posts"


class ForumComment(models.Model):
    description = models.TextField(null=True, blank=True)
    post = models.ForeignKey(ForumPost, null=True,
                             blank=True, on_delete=models.CASCADE)
    is_active = models.BooleanField(null=True, blank=True, default=True)
    created_by = models.ForeignKey(
        User, editable=False, null=True,  blank=True, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.description

    class Meta:
        db_table = "forum_comments"
        verbose_name = "Forum comments"
        verbose_name_plural = "Forum comments"


class Reaction(models.Model):
    comment = models.ForeignKey(ForumComment, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'reactions'
        verbose_name = 'reaction'
        verbose_name_plural = 'reactions'
