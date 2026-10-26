from rest_framework import serializers
from .models import Quote

class QuoteSerializer(serializers.ModelSerializer):
    service_request_reference = serializers.CharField(source='service_request.public_reference', read_only=True)
    customer_name = serializers.CharField(source='service_request.customer_name', read_only=True)

    class Meta:
        model = Quote
        fields = [
            'id', 'service_request', 'service_request_reference', 'customer_name',
            'amount', 'scope_of_work', 'estimated_delivery_days', 'revision_limit',
            'terms', 'status', 'valid_until', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']
        extra_kwargs = {
            'service_request': {'required': False}
        }

    def validate_amount(self, value):
        if value < 0:
            raise serializers.ValidationError("Quote amount must be non-negative.")
        return value
