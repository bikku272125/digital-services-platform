from rest_framework import serializers
from .models import Order, Deliverable, PaymentRecord, OrderNote

class DeliverableSerializer(serializers.ModelSerializer):
    order = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Deliverable
        fields = ['id', 'order', 'title', 'description', 'file', 'external_url', 'created_at']
        read_only_fields = ['id', 'order', 'created_at']

    def validate(self, attrs):
        file = attrs.get('file') or getattr(self.instance, 'file', None)
        external_url = attrs.get('external_url') or getattr(self.instance, 'external_url', None)
        if not file and not external_url:
            raise serializers.ValidationError("Either a file or an external URL is required for a deliverable.")
        return attrs


class PaymentRecordSerializer(serializers.ModelSerializer):
    order = serializers.PrimaryKeyRelatedField(read_only=True)
    verified_by_name = serializers.CharField(source='verified_by.username', read_only=True)

    class Meta:
        model = PaymentRecord
        fields = [
            'id', 'order', 'amount', 'payment_method', 'transaction_reference',
            'status', 'verified_by', 'verified_by_name', 'verified_at', 'created_at'
        ]
        read_only_fields = ['id', 'order', 'status', 'verified_by', 'verified_at', 'created_at']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Payment amount must be greater than zero.")
        return value


class OrderNoteSerializer(serializers.ModelSerializer):
    order = serializers.PrimaryKeyRelatedField(read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = OrderNote
        fields = ['id', 'order', 'note', 'created_by', 'created_by_name', 'created_at']
        read_only_fields = ['id', 'order', 'created_by', 'created_at']


class OrderDetailSerializer(serializers.ModelSerializer):
    deliverables = DeliverableSerializer(many=True, read_only=True)
    payments = PaymentRecordSerializer(many=True, read_only=True)
    notes = OrderNoteSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='service_request.customer_name', read_only=True)
    customer_email = serializers.CharField(source='service_request.email', read_only=True)
    quote_amount = serializers.DecimalField(source='accepted_quote.amount', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'public_reference', 'service_request', 'customer_name', 'customer_email',
            'accepted_quote', 'quote_amount', 'status', 'payment_status', 'due_date',
            'deliverables', 'payments', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'public_reference', 'accepted_quote', 'created_at', 'updated_at']
