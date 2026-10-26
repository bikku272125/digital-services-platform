import uuid
import os
from django.db import models
from django.core.validators import MinValueValidator, FileExtensionValidator
from django.core.exceptions import ValidationError
from django.conf import settings
from apps.services.models import ServiceCategory, Service

def generate_request_reference():
    return f"REQ-{uuid.uuid4().hex[:8].upper()}"

def attachment_upload_path(instance, filename):
    ext = filename.split('.')[-1].lower()
    clean_filename = f"{uuid.uuid4().hex}.{ext}"
    return f"attachments/req_{instance.service_request.public_reference}/{clean_filename}"

def validate_file_size(file):
    max_size = getattr(settings, 'MAX_UPLOAD_SIZE', 10 * 1024 * 1024)
    if file.size > max_size:
        raise ValidationError(f"File size exceeds limit of {max_size // (1024 * 1024)} MB.")

class ServiceRequest(models.Model):
    CUSTOMER_TYPE_CHOICES = [
        ('INDIVIDUAL', 'Individual'),
        ('BUSINESS', 'Business'),
    ]

    STATUS_CHOICES = [
        ('NEW', 'New'),
        ('REVIEWING', 'Reviewing'),
        ('QUOTED', 'Quoted'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
        ('CANCELLED', 'Cancelled'),
    ]

    CONTACT_METHOD_CHOICES = [
        ('EMAIL', 'Email'),
        ('PHONE', 'Phone Call'),
        ('WHATSAPP', 'WhatsApp'),
    ]

    public_reference = models.CharField(
        max_length=32,
        unique=True,
        editable=False,
        default=generate_request_reference,
        db_index=True
    )
    customer_name = models.CharField(max_length=150)
    email = models.EmailField(db_index=True)
    phone = models.CharField(max_length=30)
    customer_type = models.CharField(
        max_length=20,
        choices=CUSTOMER_TYPE_CHOICES,
        default='INDIVIDUAL'
    )
    company_name = models.CharField(max_length=150, blank=True)
    category = models.ForeignKey(
        ServiceCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='requests'
    )
    service = models.ForeignKey(
        Service,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='requests'
    )
    description = models.TextField()
    budget = models.CharField(
        max_length=100,
        help_text="Budget range or amount (e.g., '₹5,000 - ₹15,000' or 'Under ₹10k')"
    )
    deadline = models.CharField(
        max_length=100,
        help_text="Preferred deadline or timeline (e.g., 'Within 1 week' or specific date)"
    )
    preferred_contact_method = models.CharField(
        max_length=20,
        choices=CONTACT_METHOD_CHOICES,
        default='EMAIL'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='NEW',
        db_index=True
    )
    privacy_consent = models.BooleanField(
        default=False,
        help_text="Customer agreed to the privacy policy."
    )
    existing_website_url = models.URLField(blank=True)
    additional_notes = models.TextField(blank=True)
    access_token = models.CharField(
        max_length=64,
        unique=True,
        editable=False,
        default=uuid.uuid4
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Service Request'
        verbose_name_plural = 'Service Requests'
        ordering = ['-created_at']

    def clean(self):
        if not self.privacy_consent:
            raise ValidationError({'privacy_consent': 'You must accept the privacy policy to submit a request.'})

    def __str__(self):
        return f"{self.public_reference} — {self.customer_name} ({self.get_status_display()})"


class RequestAttachment(models.Model):
    service_request = models.ForeignKey(
        ServiceRequest,
        on_delete=models.CASCADE,
        related_name='attachments'
    )
    file = models.FileField(
        upload_to=attachment_upload_path,
        validators=[
            validate_file_size,
            FileExtensionValidator(
                allowed_extensions=getattr(
                    settings,
                    'ALLOWED_ATTACHMENT_EXTENSIONS',
                    ['pdf', 'docx', 'doc', 'png', 'jpg', 'jpeg', 'zip']
                )
            )
        ]
    )
    original_filename = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Request Attachment'
        verbose_name_plural = 'Request Attachments'
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"{self.original_filename} ({self.service_request.public_reference})"
