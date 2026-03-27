from django.db import models

class Tax(models.Model):
    name = models.CharField(max_length=100, unique=True, db_index=True)
    tax_value = models.DecimalField(max_digits=5, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.tax_value}%)"

    class Meta:
        verbose_name_plural = "Taxes"
        ordering = ['-created_at']
