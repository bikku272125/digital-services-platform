from django.urls import path
from .views import (
    GuestServiceRequestCreateView,
    GuestRequestStatusLookupView,
    AdminServiceRequestListView,
    AdminServiceRequestDetailView
)

urlpatterns = [
    path('requests/', GuestServiceRequestCreateView.as_view(), name='guest-request-create'),
    path('requests/status/', GuestRequestStatusLookupView.as_view(), name='guest-request-status'),
    path('admin/requests/', AdminServiceRequestListView.as_view(), name='admin-request-list'),
    path('admin/requests/<int:pk>/', AdminServiceRequestDetailView.as_view(), name='admin-request-detail'),
]
