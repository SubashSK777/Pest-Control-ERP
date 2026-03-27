from django.core.management.base import BaseCommand
from crm.models import Tax

class Command(BaseCommand):
    help = 'Seeds initial tax data into the database'

    def handle(self, *args, **kwargs):
        taxes = [
            {'name': 'GST 5%', 'tax_value': 5.00, 'status': True},
            {'name': 'VAT 10%', 'tax_value': 10.00, 'status': True},
            {'name': 'Service Tax 18%', 'tax_value': 18.00, 'status': True},
            {'name': 'Surcharge 2%', 'tax_value': 2.00, 'status': False},
            {'name': 'Cess 1%', 'tax_value': 1.00, 'status': True},
            {'name': 'Import Duty 15%', 'tax_value': 15.00, 'status': True},
            {'name': 'Excise 8%', 'tax_value': 8.00, 'status': True},
            {'name': 'Luxury Tax 28%', 'tax_value': 28.00, 'status': False},
        ]

        for tax_data in taxes:
            tax, created = Tax.objects.get_or_create(
                name=tax_data['name'],
                defaults={'tax_value': tax_data['tax_value'], 'status': tax_data['status']}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Successfully created tax "{tax.name}"'))
            else:
                self.stdout.write(self.style.WARNING(f'Tax "{tax.name}" already exists'))
