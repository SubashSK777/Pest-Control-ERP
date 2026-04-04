from django.urls import path, include
from django.http import JsonResponse
from authentication.views import login_view

def home_view(request):
    return JsonResponse({"status": "healthy", "project": "A-Flick Pest Control ERP API", "backend": "online"})

urlpatterns = [
    path('', home_view, name='home'),
    path('api/login/', login_view, name='login'),
    path('api/', include('crm.urls')),
]
