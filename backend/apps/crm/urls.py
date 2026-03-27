from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaxViewSet, TaxExportView

router = DefaultRouter()
router.register(r'taxes', TaxViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('tax/export/', TaxExportView.as_view(), name='tax-export'),
]
