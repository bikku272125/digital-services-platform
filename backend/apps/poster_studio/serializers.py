from rest_framework import serializers
from .models import (
    PosterCategory,
    PosterTemplate,
    PosterOrder,
    PosterAsset,
    PosterRevision,
    PosterDeliverable,
)


class PosterCategorySerializer(serializers.ModelSerializer):
    template_count = serializers.IntegerField(source='templates.count', read_only=True)

    class Meta:
        model = PosterCategory
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'image',
            'is_active',
            'display_order',
            'template_count',
            'created_at',
            'updated_at',
        ]


class PosterTemplateSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)

    class Meta:
        model = PosterTemplate
        fields = [
            'id',
            'category',
            'category_name',
            'category_slug',
            'name',
            'slug',
            'description',
            'preview_image',
            'starting_price',
            'supported_languages',
            'supported_sizes',
            'canvas_metadata',
            'is_featured',
            'is_active',
            'display_order',
            'created_at',
            'updated_at',
        ]


class PosterAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = PosterAsset
        fields = [
            'id',
            'file',
            'original_filename',
            'asset_type',
            'uploaded_at',
        ]
        read_only_fields = ['id', 'uploaded_at']


class PosterRevisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PosterRevision
        fields = [
            'id',
            'poster_order',
            'revision_number',
            'customer_feedback',
            'admin_notes',
            'preview_file',
            'status',
            'created_at',
        ]
        read_only_fields = ['id', 'revision_number', 'created_at']


class PosterDeliverableSerializer(serializers.ModelSerializer):
    class Meta:
        model = PosterDeliverable
        fields = [
            'id',
            'poster_order',
            'title',
            'description',
            'file',
            'output_format',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class PosterOrderCreateSerializer(serializers.ModelSerializer):
    # Support multiple file uploads for each asset type
    customer_photos = serializers.ListField(
        child=serializers.FileField(max_length=100000, allow_empty_file=False),
        write_only=True,
        required=False
    )
    business_logos = serializers.ListField(
        child=serializers.FileField(max_length=100000, allow_empty_file=False),
        write_only=True,
        required=False
    )
    reference_images = serializers.ListField(
        child=serializers.FileField(max_length=100000, allow_empty_file=False),
        write_only=True,
        required=False
    )

    class Meta:
        model = PosterOrder
        fields = [
            'public_reference',
            'customer_name',
            'email',
            'phone',
            'customer_type',
            'category',
            'template',
            'heading',
            'content',
            'language',
            'colour_preference',
            'custom_instructions',
            'output_size',
            'output_format',
            'budget',
            'required_delivery_date',
            'privacy_consent',
            'customer_photos',
            'business_logos',
            'reference_images',
        ]
        read_only_fields = ['public_reference']

    def validate_privacy_consent(self, value):
        if not value:
            raise serializers.ValidationError("Privacy consent is required to submit a poster request.")
        return value

    def create(self, validated_data):
        customer_photos = validated_data.pop('customer_photos', [])
        business_logos = validated_data.pop('business_logos', [])
        reference_images = validated_data.pop('reference_images', [])

        order = PosterOrder.objects.create(**validated_data)

        for f in customer_photos:
            PosterAsset.objects.create(
                poster_order=order,
                file=f,
                original_filename=getattr(f, 'name', 'photo'),
                asset_type=PosterAsset.AssetType.CUSTOMER_PHOTO
            )

        for f in business_logos:
            PosterAsset.objects.create(
                poster_order=order,
                file=f,
                original_filename=getattr(f, 'name', 'logo'),
                asset_type=PosterAsset.AssetType.BUSINESS_LOGO
            )

        for f in reference_images:
            PosterAsset.objects.create(
                poster_order=order,
                file=f,
                original_filename=getattr(f, 'name', 'reference'),
                asset_type=PosterAsset.AssetType.REFERENCE_IMAGE
            )

        return order


class PosterOrderDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    template_name = serializers.CharField(source='template.name', read_only=True, default=None)
    template_preview = serializers.ImageField(source='template.preview_image', read_only=True, default=None)
    assets = PosterAssetSerializer(many=True, read_only=True)
    revisions = PosterRevisionSerializer(many=True, read_only=True)
    deliverables = PosterDeliverableSerializer(many=True, read_only=True)

    class Meta:
        model = PosterOrder
        fields = [
            'id',
            'public_reference',
            'customer_name',
            'email',
            'phone',
            'customer_type',
            'category',
            'category_name',
            'template',
            'template_name',
            'template_preview',
            'heading',
            'content',
            'language',
            'colour_preference',
            'custom_instructions',
            'output_size',
            'output_format',
            'budget',
            'required_delivery_date',
            'revisions_requested_count',
            'status',
            'quoted_price',
            'admin_notes',
            'privacy_consent',
            'assets',
            'revisions',
            'deliverables',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'public_reference', 'created_at', 'updated_at']


class PosterPublicStatusSerializer(serializers.ModelSerializer):
    """Safe public serializer for customers querying order status by public_reference + email."""
    category_name = serializers.CharField(source='category.name', read_only=True)
    template_name = serializers.CharField(source='template.name', read_only=True, default=None)
    revisions = PosterRevisionSerializer(many=True, read_only=True)
    deliverables = PosterDeliverableSerializer(many=True, read_only=True)

    class Meta:
        model = PosterOrder
        fields = [
            'public_reference',
            'customer_name',
            'category_name',
            'template_name',
            'heading',
            'output_size',
            'output_format',
            'status',
            'quoted_price',
            'revisions',
            'deliverables',
            'created_at',
        ]
