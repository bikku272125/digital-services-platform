from django.urls import path
from .views import (
    WebsiteCategoryListView,
    WebsitePackageListView,
    WebsiteTemplateListView,
    WebsiteOrderCreateView,
    WebsiteOrderStatusView,
    WebsiteExportTriggerView,
    AdminWebsiteOrdersListView,
    AdminWebsiteOrderUpdateView,
)

urlpatterns = [
    path('websites/categories/', WebsiteCategoryListView.as_view(), name='waas-categories'),
    path('websites/packages/', WebsitePackageListView.as_view(), name='waas-packages'),
    path('websites/templates/', WebsiteTemplateListView.as_view(), name='waas-templates'),
    path('websites/orders/', WebsiteOrderCreateView.as_view(), name='waas-order-create'),
    path('websites/orders/status/', WebsiteOrderStatusView.as_view(), name='waas-order-status'),
    path('websites/orders/<str:order_ref>/export/', WebsiteExportTriggerView.as_view(), name='waas-export-trigger'),
    
    # Admin endpoints
    path('websites/admin/orders/', AdminWebsiteOrdersListView.as_view(), name='waas-admin-orders-list'),
    path('websites/admin/orders/<str:order_ref>/', AdminWebsiteOrderUpdateView.as_view(), name='waas-admin-order-update'),
]
