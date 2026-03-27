from rest_framework import viewsets, filters, views
from rest_framework.response import Response
from django.http import HttpResponse
import pandas as pd
import io
import json
from .models import Tax
from .serializers import TaxSerializer

class TaxViewSet(viewsets.ModelViewSet):
    queryset = Tax.objects.all()
    serializer_class = TaxSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'tax_value']
    ordering_fields = ['id', 'name', 'tax_value', 'status']
    ordering = ['-id']

class TaxExportView(views.APIView):
    def post(self, request):
        try:
            format_type = request.data.get('format', 'csv')
            data = request.data.get('data', [])
            
            if not data:
                return Response({"error": "No data provided"}, status=400)

            df = pd.DataFrame(data)
            
            if format_type == 'csv':
                output = io.StringIO()
                df.to_csv(output, index=False)
                response = HttpResponse(output.getvalue(), content_type='text/csv')
                response['Content-Disposition'] = 'attachment; filename=tax_export.csv'
                return response
            
            elif format_type == 'excel':
                output = io.BytesIO()
                with pd.ExcelWriter(output, engine='openpyxl') as writer:
                    df.to_excel(writer, index=False, sheet_name='Taxes')
                response = HttpResponse(output.getvalue(), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                response['Content-Disposition'] = 'attachment; filename=tax_export.xlsx'
                return response
            
            elif format_type == 'pdf':
                # Simplified PDF as CSV for now because reportlab/xhtml2pdf is not in environment
                # In production, recommend installing reportlab.
                output = io.StringIO()
                df.to_csv(output, index=False)
                response = HttpResponse(output.getvalue(), content_type='text/csv')
                response['Content-Disposition'] = 'attachment; filename=tax_report_converted.csv'
                return response
                
            return Response({"error": "Unsupported format"}, status=400)
            
        except Exception as e:
            return Response({"error": str(e)}, status=500)
