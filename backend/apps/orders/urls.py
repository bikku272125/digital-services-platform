from django.urls import path
from .views import (
    AdminOrderListView,
    AdminOrderDetailView,
    AdminCreatePaymentRecordView,
    AdminCreateDeliverableView,
    AdminCreateOrderNoteView
)

urlpatterns = [
    path('admin/orders/', AdminOrderListView.as_view(), name='admin-order-list'),
    path('admin/orders/<int:pk>/', AdminOrderDetailView.as_view(), name='admin-order-detail'),
    path('admin/orders/<int:order_id>/payments/', AdminCreatePaymentRecordView.as_view(), name='admin-create-payment'),
    path('admin/orders/<int:order_id>/deliverables/', AdminCreateDeliverableView.as_view(), name='admin-create-deliverable'),
    path('admin/orders/<int:order_id>/notes/', AdminCreateOrderNoteView.as_view(), name='admin-create-note'),
]
