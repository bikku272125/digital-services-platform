from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.utils import timezone
from datetime import timedelta
from .models import WebsiteCategory, WebsitePackage, WebsiteTemplate, WebsiteOrder, WebsiteExportRequest
from .serializers import (
    WebsiteCategorySerializer,
    WebsitePackageSerializer,
    WebsiteTemplateListSerializer,
    WebsiteOrderDetailSerializer,
    WebsiteOrderCreateSerializer,
    WebsiteExportRequestSerializer,
)


class WebsiteCategoryListView(generics.ListAPIView):
    serializer_class = WebsiteCategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        return WebsiteCategory.objects.filter(is_active=True).order_by('display_order', 'name')


class WebsitePackageListView(generics.ListAPIView):
    serializer_class = WebsitePackageSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        return WebsitePackage.objects.filter(is_active=True).order_by('display_order', 'price_inr')


class WebsiteTemplateListView(generics.ListAPIView):
    serializer_class = WebsiteTemplateListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = WebsiteTemplate.objects.filter(is_active=True).select_related('category')
        cat = self.request.query_params.get('category')
        if cat:
            if cat.isdigit():
                qs = qs.filter(category_id=int(cat))
            else:
                qs = qs.filter(category__slug=cat)
        featured = self.request.query_params.get('featured')
        if featured in ['true', '1']:
            qs = qs.filter(is_featured=True)
        return qs.order_by('-is_featured', 'title')


class WebsiteOrderCreateView(generics.CreateAPIView):
    serializer_class = WebsiteOrderCreateSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        detail_serializer = WebsiteOrderDetailSerializer(order)
        return Response(detail_serializer.data, status=status.HTTP_201_CREATED)


class WebsiteOrderStatusView(APIView):
    """
    Lookup order by order_ref, subdomain slug, customer email, or access_token.
    Enables instant resolution for:
    - Path mode: /sites/:subdomain or /:subdomain
    - Wildcard subdomain: drglobal.aaradhyaenertech.com
    - Custom domain: www.drglobalschool.in
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        ref = request.query_params.get('ref')
        token = request.query_params.get('token')
        email = request.query_params.get('email')
        subdomain = request.query_params.get('subdomain')
        domain = request.query_params.get('domain')

        qs = WebsiteOrder.objects.all().select_related('package', 'template', 'template__category')

        if subdomain:
            order = qs.filter(
                Q(requested_subdomain__iexact=subdomain) |
                Q(assigned_subdomain__iexact=subdomain)
            ).first()
            if order:
                return Response(WebsiteOrderDetailSerializer(order).data)

        if domain:
            order = qs.filter(custom_domain__iexact=domain).first()
            if order:
                return Response(WebsiteOrderDetailSerializer(order).data)

        if not ref and not token:
            return Response({"error": "Order reference, subdomain, or access token is required."}, status=400)

        if token:
            order = get_object_or_404(qs, access_token=token)
        else:
            if email:
                order = get_object_or_404(qs, order_ref__iexact=ref, customer_email__iexact=email)
            else:
                order = get_object_or_404(qs, order_ref__iexact=ref)

        serializer = WebsiteOrderDetailSerializer(order)
        return Response(serializer.data)


class WebsiteExportTriggerView(APIView):
    """
    Customer requests an export archive for their website.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, order_ref):
        email = request.data.get('email')
        token = request.data.get('token')
        notes = request.data.get('notes', '')

        qs = WebsiteOrder.objects.filter(order_ref__iexact=order_ref)
        if token:
            order = get_object_or_404(qs, access_token=token)
        elif email:
            order = get_object_or_404(qs, customer_email__iexact=email)
        else:
            return Response({"error": "Authentication required (email or access token)."}, status=403)

        # Create Export Request record
        export_req = WebsiteExportRequest.objects.create(
            order=order,
            customer_notes=notes,
            status='generating',
            expires_at=timezone.now() + timedelta(days=7),
            admin_instructions=(
                f"Export package for {order.organization_name}.\n"
                "Includes: Clean React/Static Distribution, Public Assets, and DNS Config Guide."
            )
        )

        return Response({
            "success": True,
            "message": "Website export request initiated. Packaging code and media.",
            "export_token": str(export_req.export_token),
            "status": export_req.status
        }, status=status.HTTP_201_CREATED)


class AdminWebsiteOrdersListView(generics.ListAPIView):
    """
    Admin overview of all WaaS orders, deployments, and renewal states.
    """
    serializer_class = WebsiteOrderDetailSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return WebsiteOrder.objects.all().select_related('package', 'template').order_by('-created_at')


class AdminWebsiteOrderUpdateView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = WebsiteOrderDetailSerializer
    permission_classes = [permissions.AllowAny]
    queryset = WebsiteOrder.objects.all()
    lookup_field = 'order_ref'

    def patch(self, request, *args, **kwargs):
        order = self.get_object()
        data = request.data

        # Update status & delivery
        if 'status' in data:
            order.status = data['status']
        if 'is_delivered' in data:
            order.is_delivered = bool(data['is_delivered'])
        if 'is_active' in data:
            order.is_active = bool(data['is_active'])
        if 'is_trial' in data:
            order.is_trial = bool(data['is_trial'])
        if 'deployed_url' in data:
            order.deployed_url = data['deployed_url']
        if 'assigned_subdomain' in data:
            order.assigned_subdomain = data['assigned_subdomain']

        # Update payment breakdown: free, full, partially paid
        if 'paid_amount_inr' in data:
            try:
                order.paid_amount_inr = float(data['paid_amount_inr'])
            except (ValueError, TypeError):
                pass
        if 'total_amount_inr' in data:
            try:
                order.total_amount_inr = float(data['total_amount_inr'])
            except (ValueError, TypeError):
                pass

        if 'payment_status' in data:
            order.payment_status = data['payment_status']
        else:
            # Auto-calculate payment status from amounts
            if order.is_trial:
                order.payment_status = 'free_trial'
            elif order.paid_amount_inr >= order.total_amount_inr and order.total_amount_inr > 0:
                order.payment_status = 'fully_paid'
                order.is_paid = True
            elif order.paid_amount_inr > 0:
                order.payment_status = 'partially_paid'
                order.is_paid = False
            else:
                order.payment_status = 'unpaid'
                order.is_paid = False

        if 'admin_notes' in data:
            order.admin_notes = data['admin_notes']

        order.save()
        return Response(WebsiteOrderDetailSerializer(order).data)
