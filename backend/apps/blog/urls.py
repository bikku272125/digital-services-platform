from django.urls import path
from .views import (
    BlogCategoryListView,
    BlogPostListView,
    BlogPostDetailView,
    InternalPostIngestView,
)

urlpatterns = [
    path('blog/categories/', BlogCategoryListView.as_view(), name='blog-categories-list'),
    path('blog/posts/', BlogPostListView.as_view(), name='blog-posts-list'),
    path('blog/posts/<slug:slug>/', BlogPostDetailView.as_view(), name='blog-post-detail'),
    path('blog/ingest/', InternalPostIngestView.as_view(), name='blog-post-ingest'),
]
