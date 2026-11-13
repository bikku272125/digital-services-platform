from django.contrib import admin
from .models import WebsiteCategory, WebsitePackage, WebsiteTemplate, WebsiteOrder, WebsiteExportRequest


@admin.register(WebsiteCategory)
class WebsiteCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'icon_name', 'display_order', 'is_active')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('display_order', 'is_active')


@admin.register(WebsitePackage)
class WebsitePackageAdmin(admin.ModelAdmin):
    list_display = ('name', 'tier', 'price_inr', 'billing_period', 'is_popular', 'pages_limit', 'is_active')
    list_editable = ('price_inr', 'is_popular', 'is_active')


@admin.register(WebsiteTemplate)
class WebsiteTemplateAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'tech_stack', 'is_featured', 'is_active')
    prepopulated_fields = {'slug': ('title',)}
    list_filter = ('category', 'is_featured', 'is_active')
    search_fields = ('title', 'description')


@admin.register(WebsiteOrder)
class WebsiteOrderAdmin(admin.ModelAdmin):
    list_display = ('order_ref', 'organization_name', 'customer_name', 'package', 'status', 'is_paid', 'created_at')
    list_filter = ('status', 'is_paid', 'package')
    search_fields = ('order_ref', 'customer_name', 'customer_email', 'organization_name', 'assigned_subdomain')
    readonly_fields = ('order_ref', 'access_token', 'created_at', 'updated_at')


@admin.register(WebsiteExportRequest)
class WebsiteExportRequestAdmin(admin.ModelAdmin):
    list_display = ('order', 'status', 'archive_size_bytes', 'expires_at', 'created_at')
    list_filter = ('status',)
    readonly_fields = ('export_token', 'created_at')
