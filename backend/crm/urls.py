from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaxViewSet

router = DefaultRouter()
router.register(r'taxes', TaxViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
