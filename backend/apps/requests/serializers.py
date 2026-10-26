from rest_framework import serializers
from .models import ServiceRequest, RequestAttachment

class RequestAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequestAttachment
        fields = ['id', 'file', 'original_filename', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']


class GuestServiceRequestCreateSerializer(serializers.ModelSerializer):
    attachments = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = ServiceRequest
        fields = [
            'public_reference',
            'customer_name',
            'email',
            'phone',
            'customer_type',
            'company_name',
            'category',
            'service',
            'description',
            'budget',
            'deadline',
            'preferred_contact_method',
            'privacy_consent',
            'existing_website_url',
            'additional_notes',
            'access_token',
            'created_at',
            'attachments',
        ]
        read_only_fields = ['public_reference', 'access_token', 'created_at']

    def validate_privacy_consent(self, value):
        if not value:
            raise serializers.ValidationError("You must agree to the privacy policy to submit a request.")
        return value

    def validate_description(self, value):
        if len(value.strip()) < 15:
            raise serializers.ValidationError("Please provide at least 15 characters describing your project requirements.")
        return value.strip()

    def create(self, validated_data):
        attachments_data = validated_data.pop('attachments', [])
        service_request = ServiceRequest.objects.create(**validated_data)
        for uploaded_file in attachments_data:
            RequestAttachment.objects.create(
                service_request=service_request,
                file=uploaded_file,
                original_filename=uploaded_file.name
            )
        return service_request


class AdminServiceRequestSerializer(serializers.ModelSerializer):
    attachments = RequestAttachmentSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    service_name = serializers.CharField(source='service.name', read_only=True)

    class Meta:
        model = ServiceRequest
        fields = '__all__'
        read_only_fields = ['public_reference', 'access_token', 'created_at', 'updated_at']


class GuestStatusLookupSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    service_name = serializers.CharField(source='service.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = ServiceRequest
        fields = [
            'public_reference',
            'customer_name',
            'category_name',
            'service_name',
            'status',
            'status_display',
            'created_at',
            'updated_at'
        ]
