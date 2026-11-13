from django.db import models
from django.utils.text import slugify
import uuid


class WebsiteCategory(models.Model):
    """
    Initial categories: Education, Business, Healthcare, Retail, Food, Professional, Services, Custom
    """
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True)
    icon_name = models.CharField(max_length=50, default='Globe', help_text="Lucide icon name")
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['display_order', 'name']
        verbose_name_plural = 'Website Categories'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class WebsitePackage(models.Model):
    """
    Pricing tiers: Free Trial (7 Days), Starter ₹2,999/yr, Business ₹5,999/yr, Professional ₹9,999/yr, Custom
    """
    TIER_CHOICES = (
        ('trial', '7-Day Free Trial'),
        ('starter', 'Starter'),
        ('business', 'Business'),
        ('professional', 'Professional'),
        ('custom', 'Custom Development'),
    )
    name = models.CharField(max_length=100)
    tier = models.CharField(max_length=30, choices=TIER_CHOICES, unique=True)
    price_inr = models.DecimalField(max_digits=10, decimal_places=2, help_text="Annual price in INR")
    billing_period = models.CharField(max_length=50, default='year')
    tagline = models.CharField(max_length=255, blank=True)
    is_popular = models.BooleanField(default=False)
    features = models.JSONField(default=list, help_text="List of feature bullet points")
    subdomain_included = models.BooleanField(default=True)
    custom_domain_supported = models.BooleanField(default=True)
    ssl_included = models.BooleanField(default=True)
    hosting_included = models.BooleanField(default=True)
    pages_limit = models.PositiveIntegerField(default=5)
    export_allowed = models.BooleanField(default=True, help_text="Full website portability export")
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['display_order', 'price_inr']

    def __str__(self):
        return f"{self.name} - ₹{self.price_inr:,.0f}/{self.billing_period}"


class WebsiteTemplate(models.Model):
    """
    Catalogue of ready-to-deploy website templates.
    """
    category = models.ForeignKey(WebsiteCategory, related_name='templates', on_delete=models.CASCADE)
    title = models.CharField(max_length=150)
    slug = models.SlugField(max_length=180, unique=True, blank=True)
    description = models.TextField()
    thumbnail_url = models.URLField(max_length=500, blank=True)
    demo_url = models.URLField(max_length=500, blank=True, help_text="Live preview link or subdomain")
    features = models.JSONField(default=list, blank=True)
    tech_stack = models.CharField(max_length=100, default='React / Tailwind / Node / Django')
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_featured', 'title']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"[{self.category.name}] {self.title}"


class WebsiteOrder(models.Model):
    """
    Customer website purchase order and lifecycle tracking.
    """
    STATUS_CHOICES = (
        ('pending', 'Order Received'),
        ('under_review', 'Requirements Under Review'),
        ('in_development', 'In Development'),
        ('deployed_preview', 'Preview Ready on Subdomain'),
        ('active', 'Live & Active'),
        ('renewal_due', 'Renewal Due'),
        ('expired', 'Subscription Expired'),
        ('cancelled', 'Cancelled'),
    )

    order_ref = models.CharField(max_length=32, unique=True, editable=False)
    access_token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    
    # Customer Info
    customer_name = models.CharField(max_length=120)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)
    organization_name = models.CharField(max_length=150)
    business_type = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    
    # Selected Plan & Template
    package = models.ForeignKey(WebsitePackage, related_name='orders', on_delete=models.SET_NULL, null=True)
    template = models.ForeignKey(WebsiteTemplate, related_name='orders', on_delete=models.SET_NULL, null=True, blank=True)
    is_custom_development = models.BooleanField(default=False)
    
    # Domain Requirements
    requested_subdomain = models.SlugField(max_length=80, blank=True, help_text="e.g. 'greenwood-school' for greenwood-school.aaradhyaenertech.com")
    assigned_subdomain = models.CharField(max_length=120, blank=True)
    custom_domain = models.CharField(max_length=150, blank=True, help_text="e.g. www.greenwoodschool.in")
    
    # Project Content & Assets
    requirements_note = models.TextField(blank=True, help_text="Content, sections, color choices")
    uploaded_logo = models.FileField(upload_to='websites/logos/%Y/%m/', blank=True, null=True)
    uploaded_brochure = models.FileField(upload_to='websites/docs/%Y/%m/', blank=True, null=True)
    
    # Subscription & Lifecycle
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='pending')
    is_trial = models.BooleanField(default=False, help_text="Is this order under the 7-day free trial")
    total_amount_inr = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    paid_amount_inr = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, help_text="Amount received from client so far")
    payment_status = models.CharField(
        max_length=30,
        choices=(
            ('free_trial', 'Free Trial (₹0)'),
            ('unpaid', 'Unpaid (₹0 received)'),
            ('partially_paid', 'Partially Paid (Advance Received)'),
            ('fully_paid', 'Fully Paid'),
        ),
        default='free_trial',
        help_text="Track full, partial or trial payment status"
    )
    is_paid = models.BooleanField(default=False)
    payment_reference = models.CharField(max_length=100, blank=True)
    subscription_start = models.DateTimeField(null=True, blank=True)
    subscription_expiry = models.DateTimeField(null=True, blank=True)
    
    # Admin Deployment Info
    deployed_url = models.URLField(max_length=500, blank=True)
    is_delivered = models.BooleanField(default=False, help_text="Is the website finished and delivered to client")
    is_active = models.BooleanField(default=True, help_text="Active or paused / inactive")
    admin_notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.order_ref:
            self.order_ref = f"WAAS-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.order_ref} - {self.organization_name} ({self.get_status_display()})"


class WebsiteExportRequest(models.Model):
    """
    Website portability request to export source files, database, and media.
    """
    STATUS_CHOICES = (
        ('requested', 'Export Requested'),
        ('generating', 'Packaging Source & Media'),
        ('ready', 'Archive Ready for Download'),
        ('downloaded', 'Downloaded'),
        ('expired', 'Link Expired'),
    )

    order = models.ForeignKey(WebsiteOrder, related_name='export_requests', on_delete=models.CASCADE)
    export_token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='requested')
    archive_file = models.FileField(upload_to='websites/exports/%Y/%m/', blank=True, null=True)
    archive_size_bytes = models.BigIntegerField(default=0)
    customer_notes = models.TextField(blank=True, help_text="Reason for export or target hosting provider")
    admin_instructions = models.TextField(blank=True, default="Setup instructions: Extract ZIP, run 'npm install' or deploy static dist to your provider.")
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Export for {self.order.organization_name} ({self.get_status_display()})"
