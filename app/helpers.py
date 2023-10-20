from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.authentication import JWTAuthentication
from urllib.parse import urlparse
from rest_framework.permissions import BasePermission, IsAdminUser, IsAuthenticated
from rest_framework.response import Response

authclass = [JWTAuthentication]


class pagination(PageNumberPagination):
    page_size = 5
    page_query_param = "page"
    page_size_query_param = "records"
    max_page_size = 100
    last_page_strings = ('last',)

    def get_paginated_response(self, data):
        return Response({
            'next': self.page.next_page_number() if self.page.has_next() else None,
            'previous': self.page.previous_page_number() if self.page.has_previous() else None,
            'count': self.page.paginator.count,
            'results': data
        })


def exact_url(request, value=""):
    get_url = urlparse(request.build_absolute_uri())
    scheme = get_url.scheme
    domain = get_url.netloc
    path = f"{scheme}://{domain}{value}"
    return path


def get_tokens_for_user(user):
    token = RefreshToken.for_user(user)
    data = {
        'id': user.id,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'username': user.username,
        'email': user.email,
        'avatar': "src/images/avatar.png",
        'is_superuser': user.is_superuser,
        'is_staff': user.is_staff,
        'is_active': user.is_active,
        'refresh_token': str(token),
        'access_token': str(token.access_token),
        'created_at': user.created_at,
        'updated_at': user.updated_at,

    }
    return data
