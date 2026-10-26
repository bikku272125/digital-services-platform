import uuid
from decimal import Decimal
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone
from apps.requests.models import ServiceRequest
from apps.quotes.models import Quote

def generate_order_reference():
    return f"ORD-{uuid.uuid4().hex[:8].upper()}"

def deliverable_upload_path(instance, filename):
    ext = filename.split('.')[-1].lower()
    return f"deliverables/ord_{instance.order.public_reference}/{uuid.uuid4().hex}.{ext}"

class Order(models.Model):
    STATUS_CHOICES = [
        ('PENDING_PAYMENT', 'Pending Payment'),
        ('CONFIRMED', 'Confirmed'),
        ('IN_PROGRESS', 'In Progress'),
        ('DELIVERED', 'Delivered'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]

    PAYMENT_STATUS_CHOICES = [
        ('UNPAID', 'Unpaid'),
        ('PARTIALLY_PAID', 'Partially Paid'),
        ('PAID', 'Paid'),
        ('REFUNDED', 'Refunded'),
    ]

    public_reference = models.CharField(
        max_length=32,
        unique=True,
        editable=False,
        default=generate_order_reference,
        db_index=True
    )
    service_request = models.ForeignKey(
        ServiceRequest,
        on_delete=models.PROTECT,
        related_name='orders'
    )
    accepted_quote = models.OneToOneField(
        Quote,
        on_delete=models.PROTECT,
        related_name='order'
    )
    status = models.CharField(
        max_length=25,
        choices=STATUS_CHOICES,
        default='PENDING_PAYMENT',
        db_index=True
    )
    payment_status = models.CharField(
        max_length=25,
        choices=PAYMENT_STATUS_CHOICES,
        default='UNPAID',
        db_index=True
    )
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Order'
        verbose_name_plural = 'Orders'
        ordering = ['-created_at']

    def update_payment_status(self):
        total_paid = sum(
            payment.amount for payment in self.payments.filter(status='VERIFIED')
        )
        quote_amount = self.accepted_quote.amount
        if total_paid >= quote_amount and quote_amount > Decimal('0.00'):
            self.payment_status = 'PAID'
        elif total_paid > Decimal('0.00'):
            self.payment_status = 'PARTIALLY_PAID'
        else:
            self.payment_status = 'UNPAID'
        self.save()

    def __str__(self):
        return f"{self.public_reference} — {self.service_request.customer_name} ({self.get_status_display()} / {self.get_payment_status_display()})"


class Deliverable(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='deliverables'
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to=deliverable_upload_path, blank=True, null=True)
    external_url = models.URLField(
        blank=True,
        help_text="Figma, GitHub repo, Google Drive or live link."
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Deliverable'
        verbose_name_plural = 'Deliverables'
        ordering = ['-created_at']

    def clean(self):
        if not self.file and not self.external_url:
            raise ValidationError("A deliverable must have either a file or an external URL.")

    def __str__(self):
        return f"{self.title} for {self.order.public_reference}"


class OrderNote(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='notes'
    )
    note = models.TextField()
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Internal Order Note'
        verbose_name_plural = 'Internal Order Notes'
        ordering = ['-created_at']

    def __str__(self):
        return f"Note on {self.order.public_reference} at {self.created_at:%Y-%m-%d %H:%M}"


class PaymentRecord(models.Model):
    STATUS_CHOICES = [
        ('PENDING_VERIFICATION', 'Pending Verification'),
        ('VERIFIED', 'Verified'),
        ('REJECTED', 'Rejected'),
    ]

    PAYMENT_METHOD_CHOICES = [
        ('UPI', 'UPI (Google Pay / PhonePe / Paytm / BHIM)'),
        ('BANK_TRANSFER', 'Bank Transfer (IMPS / NEFT / RTGS)'),
        ('CREDIT_DEBIT_CARD', 'Credit / Debit Card'),
        ('CASH_OR_CHEQUE', 'Cash or Cheque'),
        ('OTHER', 'Other'),
    ]

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='payments'
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text="Payment amount in INR (₹)."
    )
    payment_method = models.CharField(
        max_length=30,
        choices=PAYMENT_METHOD_CHOICES,
        default='UPI'
    )
    transaction_reference = models.CharField(
        max_length=150,
        help_text="Bank UTR, UPI reference number, or payment identifier."
    )
    status = models.CharField(
        max_length=25,
        choices=STATUS_CHOICES,
        default='PENDING_VERIFICATION',
        db_index=True
    )
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='verified_payments'
    )
    verified_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Payment Record'
        verbose_name_plural = 'Payment Records'
        ordering = ['-created_at']
        unique_together = ('order', 'transaction_reference')

    def verify_payment(self, user):
        self.status = 'VERIFIED'
        self.verified_by = user
        self.verified_at = timezone.now()
        self.save()
        self.order.update_payment_status()

    def __str__(self):
        return f"₹{self.amount} via {self.payment_method} ({self.transaction_reference}) - {self.status}"
