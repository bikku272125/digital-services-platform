from django.urls import path
from .views import (
    PublicCategoryListView,
    PublicTemplateListView,
    PublicTemplateDetailView,
    PublicOrderCreateView,
    PublicOrderStatusLookupView,
    AdminOrderListView,
    AdminOrderDetailView,
    AdminOrderStatusUpdateView,
    AdminDeliverableUploadView,
)

urlpatterns = [
    # Public customer endpoints
    path('posters/categories/', PublicCategoryListView.as_view(), name='public-poster-categories'),
    path('posters/templates/', PublicTemplateListView.as_view(), name='public-poster-templates'),
    path('posters/templates/<slug:slug>/', PublicTemplateDetailView.as_view(), name='public-poster-template-detail'),
    path('posters/orders/', PublicOrderCreateView.as_view(), name='public-poster-order-create'),
    path('posters/orders/<str:reference>/', PublicOrderStatusLookupView.as_view(), name='public-poster-order-lookup'),

    # Admin endpoints
    path('admin/posters/orders/', AdminOrderListView.as_view(), name='admin-poster-order-list'),
    path('admin/posters/orders/<str:public_reference>/', AdminOrderDetailView.as_view(), name='admin-poster-order-detail'),
    path('admin/posters/orders/<str:reference>/status/', AdminOrderStatusUpdateView.as_view(), name='admin-poster-order-status-update'),
    path('admin/posters/orders/<str:reference>/deliverables/', AdminDeliverableUploadView.as_view(), name='admin-poster-deliverable-upload'),
]
