from rest_framework import serializers
from .models import ServiceCategory, Service

class ServiceCategorySerializer(serializers.ModelSerializer):
    services_count = serializers.IntegerField(source='services.count', read_only=True)

    class Meta:
        model = ServiceCategory
        fields = [
            'id', 'name', 'slug', 'description', 'image',
            'is_active', 'display_order', 'services_count'
        ]


class ServiceListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)

    class Meta:
        model = Service
        fields = [
            'id', 'category', 'category_name', 'category_slug',
            'name', 'slug', 'short_description', 'starting_price',
            'estimated_delivery_text', 'image', 'is_featured', 'display_order'
        ]


class ServiceDetailSerializer(serializers.ModelSerializer):
    category = ServiceCategorySerializer(read_only=True)

    class Meta:
        model = Service
        fields = [
            'id', 'category', 'name', 'slug', 'short_description',
            'full_description', 'deliverables', 'customer_requirements',
            'starting_price', 'estimated_delivery_text', 'image',
            'is_featured', 'display_order', 'created_at'
        ]
