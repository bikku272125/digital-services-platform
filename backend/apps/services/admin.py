from django.contrib import admin
from .models import ServiceCategory, Service

@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active', 'display_order', 'services_count', 'created_at')
    list_editable = ('is_active', 'display_order')
    search_fields = ('name', 'description')
    list_filter = ('is_active',)
    prepopulated_fields = {'slug': ('name',)}

    def services_count(self, obj):
        return obj.services.count()
    services_count.short_description = 'Services'


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'category', 'starting_price', 'estimated_delivery_text',
        'is_active', 'is_featured', 'display_order', 'created_at'
    )
    list_editable = ('is_active', 'is_featured', 'display_order')
    search_fields = ('name', 'short_description', 'full_description', 'category__name')
    list_filter = ('category', 'is_active', 'is_featured')
    prepopulated_fields = {'slug': ('name',)}
