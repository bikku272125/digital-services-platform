from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from decimal import Decimal
from apps.requests.models import ServiceRequest

class Quote(models.Model):
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('SENT', 'Sent'),
        ('ACCEPTED', 'Accepted'),
        ('DECLINED', 'Declined'),
        ('EXPIRED', 'Expired'),
    ]

    service_request = models.ForeignKey(
        ServiceRequest,
        on_delete=models.CASCADE,
        related_name='quotes'
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="Quote amount in INR (₹)."
    )
    scope_of_work = models.TextField(
        help_text="Clear description of agreed deliverables and project scope."
    )
    estimated_delivery_days = models.PositiveIntegerField(
        help_text="Estimated working days to complete."
    )
    revision_limit = models.PositiveIntegerField(
        default=2,
        help_text="Number of included revision rounds."
    )
    terms = models.TextField(
        blank=True,
        default="50% advance to start work, 50% upon final delivery review. Revisions within 7 days of delivery."
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='DRAFT',
        db_index=True
    )
    valid_until = models.DateField(
        null=True,
        blank=True,
        help_text="Quote validity date."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Quotation'
        verbose_name_plural = 'Quotations'
        ordering = ['-created_at']

    def clean(self):
        if self.amount < Decimal('0.00'):
            raise ValidationError({'amount': 'Amount cannot be negative.'})

    def mark_sent(self):
        if self.status != 'DRAFT':
            raise ValidationError(f"Cannot send a quote that is currently {self.status}.")
        self.status = 'SENT'
        self.save()
        if self.service_request.status in ['NEW', 'REVIEWING']:
            self.service_request.status = 'QUOTED'
            self.service_request.save()

    def mark_accepted(self):
        if self.status not in ['SENT', 'DRAFT']:
            raise ValidationError(f"Cannot accept a quote that is {self.status}.")
        self.status = 'ACCEPTED'
        self.save()
        self.service_request.status = 'ACCEPTED'
        self.service_request.save()

    def __str__(self):
        return f"Quote #{self.id} — ₹{self.amount} for {self.service_request.public_reference} ({self.get_status_display()})"
