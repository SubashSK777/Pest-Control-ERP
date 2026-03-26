from rest_framework import viewsets, filters
from .models import Tax
from .serializers import TaxSerializer

class TaxViewSet(viewsets.ModelViewSet):
    queryset = Tax.objects.all()
    serializer_class = TaxSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'tax_value']
    ordering_fields = ['id', 'name', 'tax_value', 'status']
    ordering = ['-id']
