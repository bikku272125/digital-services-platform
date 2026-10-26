from django.urls import path
from .views import (
    AdminCreateQuoteForRequestView,
    AdminQuoteDetailView,
    AdminSendQuoteView,
    AdminAcceptQuoteView
)

urlpatterns = [
    path('admin/requests/<int:request_id>/quotes/', AdminCreateQuoteForRequestView.as_view(), name='admin-create-quote'),
    path('admin/quotes/<int:pk>/', AdminQuoteDetailView.as_view(), name='admin-quote-detail'),
    path('admin/quotes/<int:pk>/send/', AdminSendQuoteView.as_view(), name='admin-quote-send'),
    path('admin/quotes/<int:pk>/accept/', AdminAcceptQuoteView.as_view(), name='admin-quote-accept'),
]
