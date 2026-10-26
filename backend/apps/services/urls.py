from django.urls import path
from .views import (
    PublicCategoryListView,
    PublicServiceListView,
    PublicServiceDetailView
)

urlpatterns = [
    path('categories/', PublicCategoryListView.as_view(), name='category-list'),
    path('services/', PublicServiceListView.as_view(), name='service-list'),
    path('services/<slug:slug>/', PublicServiceDetailView.as_view(), name='service-detail'),
]
