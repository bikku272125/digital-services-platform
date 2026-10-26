from django.contrib import admin
from .models import Quote

@admin.register(Quote)
class QuoteAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'service_request', 'amount', 'estimated_delivery_days',
        'status', 'valid_until', 'created_at'
    )
    list_filter = ('status', 'created_at')
    search_fields = ('id', 'service_request__public_reference', 'service_request__customer_name', 'scope_of_work')
    readonly_fields = ('created_at', 'updated_at')
