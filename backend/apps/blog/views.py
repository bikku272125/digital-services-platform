from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q, F
from .models import BlogCategory, BlogPost
from .serializers import (
    BlogCategorySerializer,
    BlogPostListSerializer,
    BlogPostDetailSerializer,
)


class BlogCategoryListView(generics.ListAPIView):
    serializer_class = BlogCategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        return BlogCategory.objects.filter(is_active=True).order_by('display_order', 'name')


class BlogPostListView(generics.ListAPIView):
    serializer_class = BlogPostListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = BlogPost.objects.filter(is_published=True).select_related('category')

        category = self.request.query_params.get('category')
        if category:
            if category.isdigit():
                qs = qs.filter(category_id=int(category))
            else:
                qs = qs.filter(category__slug=category)

        trending = self.request.query_params.get('trending')
        if trending in ['true', 'True', '1']:
            qs = qs.filter(is_trending=True)

        featured = self.request.query_params.get('featured')
        if featured in ['true', 'True', '1']:
            qs = qs.filter(is_featured=True)

        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(
                Q(title__icontains=search) |
                Q(excerpt__icontains=search) |
                Q(content__icontains=search)
            )

        tag = self.request.query_params.get('tag')
        if tag:
            qs = qs.filter(tags__contains=[tag])

        return qs.order_by('-published_at')


class BlogPostDetailView(generics.RetrieveAPIView):
    serializer_class = BlogPostDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return BlogPost.objects.filter(is_published=True).select_related('category')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count atomically
        BlogPost.objects.filter(id=instance.id).update(views_count=F('views_count') + 1)
        instance.refresh_from_db()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class InternalPostIngestView(APIView):
    """
    Endpoint for automated news scraping scripts to ingest rewritten news articles.
    Protected by a secret token in header: X-Ingest-Key.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        secret_key = request.headers.get('X-Ingest-Key', '')
        if secret_key != 'aaradhya-news-ingest-secret-2026':
            return Response({"error": "Unauthorized ingest key"}, status=403)

        data = request.data
        category_slug = data.get('category_slug', 'technology')
        category, _ = BlogCategory.objects.get_or_create(
            slug=category_slug,
            defaults={'name': category_slug.replace('-', ' ').title()}
        )

        post, created = BlogPost.objects.get_or_create(
            title=data.get('title'),
            defaults={
                'category': category,
                'excerpt': data.get('excerpt', ''),
                'content': data.get('content', ''),
                'featured_image': data.get('featured_image', ''),
                'source_name': data.get('source_name', ''),
                'source_url': data.get('source_url', ''),
                'tags': data.get('tags', []),
                'read_time_minutes': data.get('read_time_minutes', 3),
                'is_trending': data.get('is_trending', False),
            }
        )
        return Response({"success": True, "created": created, "slug": post.slug})
