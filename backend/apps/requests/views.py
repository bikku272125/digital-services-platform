from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.throttling import AnonRateThrottle
from django.shortcuts import get_object_or_404
from .models import ServiceRequest
from .serializers import (
    GuestServiceRequestCreateSerializer,
    AdminServiceRequestSerializer,
    GuestStatusLookupSerializer
)

class RequestPostThrottle(AnonRateThrottle):
    rate = '15/minute'

class GuestServiceRequestCreateView(generics.CreateAPIView):
    queryset = ServiceRequest.objects.all()
    serializer_class = GuestServiceRequestCreateSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [RequestPostThrottle]

    def create(self, request, *args, **kwargs):
        # Support both form data (with files) and JSON
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        return Response({
            'message': 'Service request received successfully! Our team will review your requirements and provide a quote.',
            'public_reference': instance.public_reference,
            'access_token': str(instance.access_token),
            'status': instance.status,
            'customer_name': instance.customer_name,
            'created_at': instance.created_at,
        }, status=status.HTTP_201_CREATED)


class GuestRequestStatusLookupView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        ref = request.query_params.get('ref')
        token = request.query_params.get('token')
        if not ref or not token:
            return Response(
                {'error': 'Both reference and secure access token are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        req = get_object_or_404(ServiceRequest, public_reference=ref, access_token=token)
        serializer = GuestStatusLookupSerializer(req)
        return Response(serializer.data)


# Admin Endpoints
class AdminServiceRequestListView(generics.ListAPIView):
    queryset = ServiceRequest.objects.all().select_related('category', 'service').prefetch_related('attachments').order_by('-created_at')
    serializer_class = AdminServiceRequestSerializer
    permission_classes = [permissions.IsAdminUser]
    filterset_fields = ['status', 'customer_type', 'category']
    search_fields = ['public_reference', 'customer_name', 'email', 'phone', 'company_name']


class AdminServiceRequestDetailView(generics.RetrieveUpdateAPIView):
    queryset = ServiceRequest.objects.all().select_related('category', 'service').prefetch_related('attachments')
    serializer_class = AdminServiceRequestSerializer
    permission_classes = [permissions.IsAdminUser]
