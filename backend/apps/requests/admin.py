from django.contrib import admin
from django.utils.html import format_html
from .models import ServiceRequest, RequestAttachment

class RequestAttachmentInline(admin.TabularInline):
    model = RequestAttachment
    extra = 0
    readonly_fields = ('original_filename', 'file_link', 'uploaded_at')
    can_delete = False

    def file_link(self, obj):
        if obj.file:
            return format_html('<a href="{}" target="_blank" rel="noopener noreferrer">Download / View</a>', obj.file.url)
        return "-"
    file_link.short_description = "File"


@admin.register(ServiceRequest)
class ServiceRequestAdmin(admin.ModelAdmin):
    list_display = (
        'public_reference', 'customer_name', 'email', 'phone',
        'customer_type', 'category', 'status', 'created_at'
    )
    list_filter = ('status', 'customer_type', 'category', 'created_at')
    search_fields = ('public_reference', 'customer_name', 'email', 'phone', 'company_name', 'description')
    readonly_fields = ('public_reference', 'access_token', 'created_at', 'updated_at')
    inlines = [RequestAttachmentInline]
    fieldsets = (
        ('Request Reference', {
            'fields': ('public_reference', 'status', 'access_token', 'created_at', 'updated_at')
        }),
        ('Customer Details', {
            'fields': ('customer_name', 'email', 'phone', 'customer_type', 'company_name', 'preferred_contact_method')
        }),
        ('Project Requirements', {
            'fields': ('category', 'service', 'description', 'budget', 'deadline', 'existing_website_url', 'additional_notes', 'privacy_consent')
        }),
    )


@admin.register(RequestAttachment)
class RequestAttachmentAdmin(admin.ModelAdmin):
    list_display = ('original_filename', 'service_request', 'uploaded_at')
    search_fields = ('original_filename', 'service_request__public_reference')
    readonly_fields = ('service_request', 'file', 'original_filename', 'uploaded_at')
