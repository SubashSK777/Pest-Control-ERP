from django.urls import path
from authentication.views import login_view

urlpatterns = [
    path('api/login/', login_view, name='login'),
]
