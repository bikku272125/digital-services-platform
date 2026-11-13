from rest_framework import serializers
from .models import WebsiteCategory, WebsitePackage, WebsiteTemplate, WebsiteOrder, WebsiteExportRequest


class WebsiteCategorySerializer(serializers.ModelSerializer):
    templates_count = serializers.IntegerField(source='templates.count', read_only=True)

    class Meta:
        model = WebsiteCategory
        fields = [
            'id', 'name', 'slug', 'description', 'icon_name',
            'display_order', 'templates_count', 'is_active'
        ]


class WebsitePackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsitePackage
        fields = [
            'id', 'name', 'tier', 'price_inr', 'billing_period',
            'tagline', 'is_popular', 'features', 'subdomain_included',
            'custom_domain_supported', 'ssl_included', 'hosting_included',
            'pages_limit', 'export_allowed', 'display_order', 'is_active'
        ]


class WebsiteTemplateListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)

    class Meta:
        model = WebsiteTemplate
        fields = [
            'id', 'title', 'slug', 'category', 'category_name', 'category_slug',
            'description', 'thumbnail_url', 'demo_url', 'features',
            'tech_stack', 'is_featured', 'is_active', 'created_at'
        ]


class WebsiteExportRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteExportRequest
        fields = [
            'id', 'export_token', 'status', 'archive_file', 'archive_size_bytes',
            'customer_notes', 'admin_instructions', 'expires_at', 'created_at'
        ]


class WebsiteOrderDetailSerializer(serializers.ModelSerializer):
    package_details = WebsitePackageSerializer(source='package', read_only=True)
    template_details = WebsiteTemplateListSerializer(source='template', read_only=True)
    export_requests = WebsiteExportRequestSerializer(many=True, read_only=True)

    class Meta:
        model = WebsiteOrder
        fields = [
            'id', 'order_ref', 'access_token', 'customer_name', 'customer_email',
            'customer_phone', 'organization_name', 'business_type', 'city',
            'package', 'package_details', 'template', 'template_details',
            'is_custom_development', 'requested_subdomain', 'assigned_subdomain',
            'custom_domain', 'requirements_note', 'uploaded_logo', 'uploaded_brochure',
            'status', 'total_amount_inr', 'is_paid', 'payment_reference',
            'subscription_start', 'subscription_expiry', 'deployed_url',
            'admin_notes', 'export_requests', 'created_at', 'updated_at'
        ]


class WebsiteOrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteOrder
        fields = [
            'customer_name', 'customer_email', 'customer_phone',
            'organization_name', 'business_type', 'city',
            'package', 'template', 'is_custom_development',
            'requested_subdomain', 'custom_domain',
            'requirements_note', 'uploaded_logo', 'uploaded_brochure'
        ]

    def create(self, validated_data):
        package = validated_data.get('package')
        order = WebsiteOrder(**validated_data)
        if package:
            order.total_amount_inr = package.price_inr
        order.save()
        return order
