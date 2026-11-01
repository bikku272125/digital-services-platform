from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import get_object_or_404
from django.db.models import Q

from .models import (
    PosterCategory,
    PosterTemplate,
    PosterOrder,
    PosterRevision,
    PosterDeliverable,
)
from .serializers import (
    PosterCategorySerializer,
    PosterTemplateSerializer,
    PosterOrderCreateSerializer,
    PosterOrderDetailSerializer,
    PosterPublicStatusSerializer,
    PosterRevisionSerializer,
    PosterDeliverableSerializer,
)


# ============================================================================
# PUBLIC CUSTOMER ENDPOINTS
# ============================================================================

class PublicCategoryListView(generics.ListAPIView):
    """List active poster categories."""
    serializer_class = PosterCategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        return PosterCategory.objects.filter(is_active=True).order_by('display_order', 'name')


class PublicTemplateListView(generics.ListAPIView):
    """
    List active poster templates with filtering by category, search term,
    and featured flag.
    """
    serializer_class = PosterTemplateSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        qs = PosterTemplate.objects.filter(is_active=True).select_related('category')

        category = self.request.query_params.get('category')
        if category:
            if category.isdigit():
                qs = qs.filter(category_id=int(category))
            else:
                qs = qs.filter(category__slug=category)

        featured = self.request.query_params.get('featured')
        if featured in ['true', 'True', '1']:
            qs = qs.filter(is_featured=True)

        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(category__name__icontains=search)
            )

        return qs.order_by('display_order', '-created_at')


class PublicTemplateDetailView(generics.RetrieveAPIView):
    """Retrieve details for a single poster template by slug."""
    serializer_class = PosterTemplateSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return PosterTemplate.objects.filter(is_active=True).select_related('category')


class PublicOrderCreateView(generics.CreateAPIView):
    """
    Submit a new poster design order. Accepts multipart/form-data with
    uploaded photos, logos, and reference images.
    """
    serializer_class = PosterOrderCreateSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()

        return Response(
            {
                "success": True,
                "message": "Poster design request submitted successfully.",
                "order": {
                    "public_reference": order.public_reference,
                    "customer_name": order.customer_name,
                    "category": order.category.name,
                    "template": order.template.name if order.template else None,
                    "created_at": order.created_at,
                    "status": order.status,
                }
            },
            status=status.HTTP_201_CREATED
        )


class PublicOrderStatusLookupView(APIView):
    """
    Allows a customer to securely look up their poster order status
    using public_reference and verification email.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, reference):
        email = request.query_params.get('email', '').strip().lower()
        order = get_object_or_404(PosterOrder, public_reference=reference)

        # Basic email check for privacy protection
        if email and order.email.strip().lower() != email:
            return Response(
                {"error": "Verification failed. Email does not match this order reference."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = PosterPublicStatusSerializer(order)
        return Response(serializer.data)


# ============================================================================
# ADMIN ENDPOINTS (Require staff/superuser)
# ============================================================================

class AdminOrderListView(generics.ListAPIView):
    """Admin view to list all poster orders with status & category filters."""
    serializer_class = PosterOrderDetailSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        qs = PosterOrder.objects.all().select_related('category', 'template').prefetch_related('assets', 'revisions', 'deliverables')
        status_param = self.request.query_params.get('status')
        if status_param:
            qs = qs.filter(status=status_param)

        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(
                Q(customer_name__icontains=search) |
                Q(email__icontains=search) |
                Q(phone__icontains=search) |
                Q(public_reference__icontains=search) |
                Q(heading__icontains=search)
            )

        return qs.order_by('-created_at')


class AdminOrderDetailView(generics.RetrieveUpdateAPIView):
    """Admin view to retrieve and update poster order details (status, quotes, admin notes)."""
    serializer_class = PosterOrderDetailSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'public_reference'
    queryset = PosterOrder.objects.all().select_related('category', 'template').prefetch_related('assets', 'revisions', 'deliverables')


class AdminOrderStatusUpdateView(APIView):
    """Admin endpoint to transition an order through its status workflow."""
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, reference):
        order = get_object_or_404(PosterOrder, public_reference=reference)
        new_status = request.data.get('status')
        quoted_price = request.data.get('quoted_price')
        admin_notes = request.data.get('admin_notes')

        valid_statuses = [choice[0] for choice in PosterOrder.OrderStatus.choices]
        if new_status and new_status not in valid_statuses:
            return Response(
                {"error": f"Invalid status '{new_status}'. Valid choices: {valid_statuses}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if new_status:
            order.status = new_status
        if quoted_price is not None:
            order.quoted_price = quoted_price
        if admin_notes is not None:
            order.admin_notes = admin_notes

        order.save()
        return Response({
            "success": True,
            "message": f"Order {order.public_reference} updated to status {order.status}.",
            "order": PosterOrderDetailSerializer(order).data
        })


class AdminDeliverableUploadView(generics.CreateAPIView):
    """Admin upload of a final deliverable file for an order."""
    serializer_class = PosterDeliverableSerializer
    permission_classes = [permissions.IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, reference, *args, **kwargs):
        order = get_object_or_404(PosterOrder, public_reference=reference)
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file uploaded."}, status=status.HTTP_400_BAD_REQUEST)

        title = request.data.get('title', 'Final High-Resolution Poster')
        output_format = request.data.get('output_format', 'PNG')
        description = request.data.get('description', '')

        deliverable = PosterDeliverable.objects.create(
            poster_order=order,
            file=file,
            title=title,
            output_format=output_format,
            description=description
        )

        # Transition order to DELIVERED automatically if not already completed
        if order.status in [PosterOrder.OrderStatus.IN_PROGRESS, PosterOrder.OrderStatus.PREVIEW_SHARED, PosterOrder.OrderStatus.REVISION_REQUESTED]:
            order.status = PosterOrder.OrderStatus.DELIVERED
            order.save()

        return Response(PosterDeliverableSerializer(deliverable).data, status=status.HTTP_201_CREATED)
