from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from apps.requests.models import ServiceRequest
from apps.orders.models import Order
from .models import Quote
from .serializers import QuoteSerializer

class AdminCreateQuoteForRequestView(generics.CreateAPIView):
    serializer_class = QuoteSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        request_id = self.kwargs.get('request_id')
        service_req = get_object_or_404(ServiceRequest, pk=request_id)
        quote = serializer.save(service_request=service_req)
        # Update request status to REVIEWING or QUOTED if still NEW
        if service_req.status == 'NEW':
            service_req.status = 'REVIEWING'
            service_req.save()


class AdminQuoteDetailView(generics.RetrieveUpdateAPIView):
    queryset = Quote.objects.all().select_related('service_request')
    serializer_class = QuoteSerializer
    permission_classes = [permissions.IsAdminUser]


class AdminSendQuoteView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        quote = get_object_or_404(Quote, pk=pk)
        try:
            quote.mark_sent()
            return Response({'message': f"Quote #{quote.id} marked as SENT and request updated to QUOTED."})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class AdminAcceptQuoteView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        quote = get_object_or_404(Quote, pk=pk)
        try:
            quote.mark_accepted()
            # Automatically create Order if not already created
            order, created = Order.objects.get_or_create(
                service_request=quote.service_request,
                accepted_quote=quote,
                defaults={'status': 'PENDING_PAYMENT'}
            )
            return Response({
                'message': f"Quote #{quote.id} marked as ACCEPTED.",
                'order_created': created,
                'order_reference': order.public_reference,
                'order_status': order.status
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
