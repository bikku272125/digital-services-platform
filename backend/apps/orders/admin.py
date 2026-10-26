from django.contrib import admin
from django.utils.html import format_html
from .models import Order, Deliverable, OrderNote, PaymentRecord

class DeliverableInline(admin.TabularInline):
    model = Deliverable
    extra = 1

class OrderNoteInline(admin.TabularInline):
    model = OrderNote
    extra = 1
    readonly_fields = ('created_at',)

class PaymentRecordInline(admin.TabularInline):
    model = PaymentRecord
    extra = 0
    readonly_fields = ('verified_at', 'created_at')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'public_reference', 'service_request_link', 'status',
        'payment_status', 'quote_amount', 'due_date', 'created_at'
    )
    list_filter = ('status', 'payment_status', 'created_at')
    search_fields = (
        'public_reference', 'service_request__public_reference',
        'service_request__customer_name', 'service_request__email'
    )
    readonly_fields = ('public_reference', 'created_at', 'updated_at')
    inlines = [PaymentRecordInline, DeliverableInline, OrderNoteInline]

    def quote_amount(self, obj):
        return f"₹{obj.accepted_quote.amount}"
    quote_amount.short_description = "Agreed Quote"

    def service_request_link(self, obj):
        return f"{obj.service_request.public_reference} ({obj.service_request.customer_name})"
    service_request_link.short_description = "Request"


@admin.register(Deliverable)
class DeliverableAdmin(admin.ModelAdmin):
    list_display = ('title', 'order', 'file_or_link', 'created_at')
    search_fields = ('title', 'order__public_reference', 'description')

    def file_or_link(self, obj):
        if obj.file:
            return format_html('<a href="{}" target="_blank">File</a>', obj.file.url)
        if obj.external_url:
            return format_html('<a href="{}" target="_blank">{}</a>', obj.external_url, obj.external_url[:30])
        return "-"
    file_or_link.short_description = "Asset"


@admin.register(PaymentRecord)
class PaymentRecordAdmin(admin.ModelAdmin):
    list_display = (
        'order', 'amount', 'payment_method', 'transaction_reference',
        'status', 'verified_by', 'verified_at', 'created_at'
    )
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('transaction_reference', 'order__public_reference', 'order__service_request__customer_name')
    actions = ['mark_as_verified']

    @admin.action(description="Verify selected payment records")
    def mark_as_verified(self, request, queryset):
        for record in queryset:
            record.verify_payment(request.user)
        self.message_user(request, f"{queryset.count()} payment records verified successfully.")


@admin.register(OrderNote)
class OrderNoteAdmin(admin.ModelAdmin):
    list_display = ('order', 'created_by', 'created_at')
    search_fields = ('order__public_reference', 'note')
