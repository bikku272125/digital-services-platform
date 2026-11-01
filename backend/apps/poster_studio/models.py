import secrets
from django.db import models
from django.utils.text import slugify


def generate_public_reference():
    """Generate a collision-resistant, non-sequential reference code."""
    return f"PST-{secrets.token_hex(4).upper()}"


class PosterCategory(models.Model):
    name = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(max_length=160, unique=True, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='poster_studio/categories/', blank=True, null=True)
    is_active = models.BooleanField(default=True, db_index=True)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', 'name']
        verbose_name = 'Poster Category'
        verbose_name_plural = 'Poster Categories'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class PosterTemplate(models.Model):
    category = models.ForeignKey(
        PosterCategory,
        related_name='templates',
        on_delete=models.CASCADE
    )
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField(blank=True)
    preview_image = models.ImageField(upload_to='poster_studio/templates/')
    starting_price = models.DecimalField(max_digits=10, decimal_places=2, default=99.00)
    # JSON list of supported languages, e.g. ["Hindi", "English", "Both"]
    supported_languages = models.JSONField(default=list, blank=True)
    # JSON list of supported dimensions, e.g. ["WhatsApp", "Instagram Post", "Instagram Story", "A4", "Custom"]
    supported_sizes = models.JSONField(default=list, blank=True)
    # Future-proofing schema for online canvas editor (placeholders, layers, etc.)
    canvas_metadata = models.JSONField(
        default=dict,
        blank=True,
        help_text="Extensible schema reserved for future interactive canvas layers/placeholders."
    )
    is_featured = models.BooleanField(default=False, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', '-created_at']
        verbose_name = 'Poster Template'
        verbose_name_plural = 'Poster Templates'

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            idx = 1
            while PosterTemplate.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{idx}"
                idx += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.category.name})"


class PosterOrder(models.Model):
    class CustomerType(models.TextChoices):
        INDIVIDUAL = 'INDIVIDUAL', 'Individual'
        BUSINESS = 'BUSINESS', 'Business'

    class LanguageChoice(models.TextChoices):
        HINDI = 'HINDI', 'Hindi'
        ENGLISH = 'ENGLISH', 'English'
        BOTH = 'BOTH', 'Both (Hindi & English)'

    class SizeChoice(models.TextChoices):
        WHATSAPP = 'WHATSAPP', 'WhatsApp (1:1 / 4:5)'
        INSTAGRAM_POST = 'INSTAGRAM_POST', 'Instagram Post (1:1)'
        INSTAGRAM_STORY = 'INSTAGRAM_STORY', 'Instagram Story (9:16)'
        A4 = 'A4', 'A4 Printable'
        CUSTOM = 'CUSTOM', 'Custom Dimensions'

    class FormatChoice(models.TextChoices):
        JPG = 'JPG', 'JPG'
        PNG = 'PNG', 'PNG'
        PDF = 'PDF', 'PDF (Print Ready)'

    class OrderStatus(models.TextChoices):
        NEW = 'NEW', 'New'
        REVIEWING = 'REVIEWING', 'Reviewing'
        QUOTED = 'QUOTED', 'Quoted'
        APPROVED = 'APPROVED', 'Approved'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        PREVIEW_SHARED = 'PREVIEW_SHARED', 'Preview Shared'
        REVISION_REQUESTED = 'REVISION_REQUESTED', 'Revision Requested'
        DELIVERED = 'DELIVERED', 'Delivered'
        COMPLETED = 'COMPLETED', 'Completed'
        REJECTED = 'REJECTED', 'Rejected'
        CANCELLED = 'CANCELLED', 'Cancelled'

    public_reference = models.CharField(
        max_length=32,
        unique=True,
        editable=False,
        default=generate_public_reference,
        db_index=True
    )
    customer_name = models.CharField(max_length=150)
    email = models.EmailField(db_index=True)
    phone = models.CharField(max_length=30)
    customer_type = models.CharField(
        max_length=20,
        choices=CustomerType.choices,
        default=CustomerType.INDIVIDUAL
    )

    category = models.ForeignKey(
        PosterCategory,
        related_name='orders',
        on_delete=models.PROTECT
    )
    template = models.ForeignKey(
        PosterTemplate,
        related_name='orders',
        on_delete=models.SET_NULL,
        blank=True,
        null=True
    )

    heading = models.CharField(max_length=250)
    content = models.TextField(help_text="Customized text, slogans, or announcement details")
    language = models.CharField(
        max_length=20,
        choices=LanguageChoice.choices,
        default=LanguageChoice.BOTH
    )
    colour_preference = models.CharField(max_length=100, blank=True)
    custom_instructions = models.TextField(blank=True)

    output_size = models.CharField(
        max_length=30,
        choices=SizeChoice.choices,
        default=SizeChoice.WHATSAPP
    )
    output_format = models.CharField(
        max_length=10,
        choices=FormatChoice.choices,
        default=FormatChoice.PNG
    )
    budget = models.CharField(max_length=50, blank=True)
    required_delivery_date = models.CharField(max_length=100, blank=True)
    revisions_requested_count = models.PositiveIntegerField(default=0)

    status = models.CharField(
        max_length=30,
        choices=OrderStatus.choices,
        default=OrderStatus.NEW,
        db_index=True
    )
    quoted_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="Admin quote for the order"
    )
    admin_notes = models.TextField(blank=True)
    privacy_consent = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Poster Order'
        verbose_name_plural = 'Poster Orders'

    def __str__(self):
        return f"{self.public_reference} - {self.customer_name} ({self.status})"


class PosterAsset(models.Model):
    class AssetType(models.TextChoices):
        CUSTOMER_PHOTO = 'CUSTOMER_PHOTO', 'Customer Photograph'
        BUSINESS_LOGO = 'BUSINESS_LOGO', 'Business Logo'
        REFERENCE_IMAGE = 'REFERENCE_IMAGE', 'Reference Design / Layout'

    poster_order = models.ForeignKey(
        PosterOrder,
        related_name='assets',
        on_delete=models.CASCADE
    )
    file = models.FileField(upload_to='poster_studio/order_assets/')
    original_filename = models.CharField(max_length=255, blank=True)
    asset_type = models.CharField(
        max_length=30,
        choices=AssetType.choices,
        default=AssetType.CUSTOMER_PHOTO
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['uploaded_at']
        verbose_name = 'Poster Asset'
        verbose_name_plural = 'Poster Assets'

    def __str__(self):
        return f"{self.poster_order.public_reference} - {self.asset_type}"


class PosterRevision(models.Model):
    class RevisionStatus(models.TextChoices):
        REQUESTED = 'REQUESTED', 'Requested'
        IN_REVIEW = 'IN_REVIEW', 'In Review'
        RESOLVED = 'RESOLVED', 'Resolved'

    poster_order = models.ForeignKey(
        PosterOrder,
        related_name='revisions',
        on_delete=models.CASCADE
    )
    revision_number = models.PositiveIntegerField(default=1)
    customer_feedback = models.TextField()
    admin_notes = models.TextField(blank=True)
    preview_file = models.FileField(upload_to='poster_studio/revisions/', blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=RevisionStatus.choices,
        default=RevisionStatus.REQUESTED
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-revision_number', '-created_at']
        verbose_name = 'Poster Revision'
        verbose_name_plural = 'Poster Revisions'

    def __str__(self):
        return f"{self.poster_order.public_reference} - Rev #{self.revision_number}"


class PosterDeliverable(models.Model):
    poster_order = models.ForeignKey(
        PosterOrder,
        related_name='deliverables',
        on_delete=models.CASCADE
    )
    title = models.CharField(max_length=200, default="Final High-Resolution Poster")
    description = models.TextField(blank=True)
    file = models.FileField(upload_to='poster_studio/deliverables/')
    output_format = models.CharField(max_length=20, default="PNG")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Poster Deliverable'
        verbose_name_plural = 'Poster Deliverables'

    def __str__(self):
        return f"{self.poster_order.public_reference} - {self.title}"
