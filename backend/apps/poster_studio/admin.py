from django.contrib import admin
from .models import (
    PosterCategory,
    PosterTemplate,
    PosterOrder,
    PosterAsset,
    PosterRevision,
    PosterDeliverable,
)


class PosterTemplateInline(admin.TabularInline):
    model = PosterTemplate
    extra = 1
    fields = ('name', 'starting_price', 'is_featured', 'is_active', 'display_order')


@admin.register(PosterCategory)
class PosterCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active', 'display_order', 'created_at')
    list_editable = ('is_active', 'display_order')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description')
    inlines = [PosterTemplateInline]


@admin.register(PosterTemplate)
class PosterTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'starting_price', 'is_featured', 'is_active', 'display_order')
    list_editable = ('starting_price', 'is_featured', 'is_active', 'display_order')
    list_filter = ('category', 'is_featured', 'is_active')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description')


class PosterAssetInline(admin.TabularInline):
    model = PosterAsset
    extra = 0
    readonly_fields = ('uploaded_at',)


class PosterRevisionInline(admin.StackedInline):
    model = PosterRevision
    extra = 0


class PosterDeliverableInline(admin.TabularInline):
    model = PosterDeliverable
    extra = 0


@admin.register(PosterOrder)
class PosterOrderAdmin(admin.ModelAdmin):
    list_display = (
        'public_reference',
        'customer_name',
        'category',
        'template',
        'status',
        'quoted_price',
        'required_delivery_date',
        'created_at',
    )
    list_filter = ('status', 'customer_type', 'language', 'category', 'output_size', 'created_at')
    search_fields = ('public_reference', 'customer_name', 'email', 'phone', 'heading')
    readonly_fields = ('public_reference', 'created_at', 'updated_at')
    inlines = [PosterAssetInline, PosterRevisionInline, PosterDeliverableInline]
    actions = ['mark_as_reviewing', 'mark_as_in_progress', 'mark_as_completed']

    @admin.action(description="Mark selected orders as REVIEWING")
    def mark_as_reviewing(self, request, queryset):
        queryset.update(status=PosterOrder.OrderStatus.REVIEWING)

    @admin.action(description="Mark selected orders as IN_PROGRESS")
    def mark_as_in_progress(self, request, queryset):
        queryset.update(status=PosterOrder.OrderStatus.IN_PROGRESS)

    @admin.action(description="Mark selected orders as COMPLETED")
    def mark_as_completed(self, request, queryset):
        queryset.update(status=PosterOrder.OrderStatus.COMPLETED)


@admin.register(PosterAsset)
class PosterAssetAdmin(admin.ModelAdmin):
    list_display = ('poster_order', 'asset_type', 'original_filename', 'uploaded_at')
    list_filter = ('asset_type', 'uploaded_at')


@admin.register(PosterRevision)
class PosterRevisionAdmin(admin.ModelAdmin):
    list_display = ('poster_order', 'revision_number', 'status', 'created_at')
    list_filter = ('status', 'created_at')


@admin.register(PosterDeliverable)
class PosterDeliverableAdmin(admin.ModelAdmin):
    list_display = ('poster_order', 'title', 'output_format', 'created_at')
    list_filter = ('output_format', 'created_at')
