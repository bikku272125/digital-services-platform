from rest_framework import generics, filters
from .models import ServiceCategory, Service
from .serializers import (
    ServiceCategorySerializer,
    ServiceListSerializer,
    ServiceDetailSerializer
)

class PublicCategoryListView(generics.ListAPIView):
    queryset = ServiceCategory.objects.filter(is_active=True).order_by('display_order', 'name')
    serializer_class = ServiceCategorySerializer
    pagination_class = None


class PublicServiceListView(generics.ListAPIView):
    serializer_class = ServiceListSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'short_description', 'full_description', 'category__name']

    def get_queryset(self):
        queryset = Service.objects.filter(is_active=True).select_related('category').order_by('display_order', 'name')
        category_slug = self.request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        featured = self.request.query_params.get('featured')
        if featured in ['true', '1']:
            queryset = queryset.filter(is_featured=True)
        return queryset


class PublicServiceDetailView(generics.RetrieveAPIView):
    queryset = Service.objects.filter(is_active=True).select_related('category')
    serializer_class = ServiceDetailSerializer
    lookup_field = 'slug'
