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
                from reportlab.lib import colors
                from reportlab.lib.pagesizes import letter
                from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
                from reportlab.lib.styles import getSampleStyleSheet
                
                output = io.BytesIO()
                doc = SimpleDocTemplate(output, pagesize=letter)
                elements = []
                
                # Title
                styles = getSampleStyleSheet()
                elements.append(Paragraph("A-Flick Pest Control ERP - Tax Master List", styles['Title']))
                
                # Table Data
                table_data = [df.columns.tolist()] + df.values.tolist()
                t = Table(table_data)
                t.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                    ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                    ('GRID', (0,0), (-1,-1), 1, colors.black)
                ]))
                elements.append(t)
                doc.build(elements)
                
                response = HttpResponse(output.getvalue(), content_type='application/pdf')
                response['Content-Disposition'] = 'attachment; filename=tax_report.pdf'
                return response
                
            return Response({"error": "Unsupported format"}, status=400)
            
        except Exception as e:
            return Response({"error": str(e)}, status=500)
