from rest_framework import generics, status, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Order, Deliverable, PaymentRecord, OrderNote
from .serializers import (
    OrderDetailSerializer,
    DeliverableSerializer,
    PaymentRecordSerializer,
    OrderNoteSerializer
)

class AdminOrderListView(generics.ListAPIView):
    queryset = Order.objects.all().select_related('service_request', 'accepted_quote').prefetch_related('payments', 'deliverables').order_by('-created_at')
    serializer_class = OrderDetailSerializer
    permission_classes = [permissions.IsAdminUser]
    filterset_fields = ['status', 'payment_status']
    search_fields = ['public_reference', 'service_request__public_reference', 'service_request__customer_name']


class AdminOrderDetailView(generics.RetrieveUpdateAPIView):
    queryset = Order.objects.all().select_related('service_request', 'accepted_quote').prefetch_related('payments', 'deliverables', 'notes')
    serializer_class = OrderDetailSerializer
    permission_classes = [permissions.IsAdminUser]


class AdminCreatePaymentRecordView(generics.CreateAPIView):
    serializer_class = PaymentRecordSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        order_id = self.kwargs.get('order_id')
        order = get_object_or_404(Order, pk=order_id)
        payment = serializer.save(order=order)
        # Verify immediately when recorded by admin
        payment.verify_payment(self.request.user)


class AdminCreateDeliverableView(generics.CreateAPIView):
    serializer_class = DeliverableSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        order_id = self.kwargs.get('order_id')
        order = get_object_or_404(Order, pk=order_id)
        serializer.save(order=order)


class AdminCreateOrderNoteView(generics.CreateAPIView):
    serializer_class = OrderNoteSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        order_id = self.kwargs.get('order_id')
        order = get_object_or_404(Order, pk=order_id)
        serializer.save(order=order, created_by=self.request.user)
