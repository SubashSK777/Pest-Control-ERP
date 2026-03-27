from django.urls import path, include
from authentication.views import login_view

urlpatterns = [
    path('api/login/', login_view, name='login'),
    path('api/', include('crm.urls')),
]
