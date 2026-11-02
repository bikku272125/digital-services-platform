from django.http import HttpResponse
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q, F
from django.utils.html import escape
from .models import BlogCategory, BlogPost
from .serializers import (
    BlogCategorySerializer,
    BlogPostListSerializer,
    BlogPostDetailSerializer,
)


class BlogSitemapXMLView(APIView):
    """
    Returns a dynamic XML sitemap containing all published blog posts and category routes,
    plus core platform routes. Formatted strictly for Google Search Console & Google News indexing.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        base_url = "https://digital.aaradhyaenertech.com"
        posts = BlogPost.objects.filter(is_published=True).select_related('category').order_by('-published_at')
        categories = BlogCategory.objects.filter(is_active=True)

        xml_lines = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
            '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">',
            '  <!-- Core Platform Routes -->',
            '  <url>',
            f'    <loc>{base_url}/</loc>',
            '    <changefreq>daily</changefreq>',
            '    <priority>1.0</priority>',
            '  </url>',
            '  <url>',
            f'    <loc>{base_url}/blog</loc>',
            '    <changefreq>hourly</changefreq>',
            '    <priority>0.9</priority>',
            '  </url>',
            '  <url>',
            f'    <loc>{base_url}/services</loc>',
            '    <changefreq>weekly</changefreq>',
            '    <priority>0.8</priority>',
            '  </url>',
            '  <url>',
            f'    <loc>{base_url}/portfolio</loc>',
            '    <changefreq>weekly</changefreq>',
            '    <priority>0.8</priority>',
            '  </url>',
            '  <url>',
            f'    <loc>{base_url}/how-it-works</loc>',
            '    <changefreq>monthly</changefreq>',
            '    <priority>0.7</priority>',
            '  </url>',
            '  <url>',
            f'    <loc>{base_url}/request</loc>',
            '    <changefreq>monthly</changefreq>',
            '    <priority>0.8</priority>',
            '  </url>',
            '  <url>',
            f'    <loc>{base_url}/contact</loc>',
            '    <changefreq>monthly</changefreq>',
            '    <priority>0.7</priority>',
            '  </url>',
            '  <url>',
            f'    <loc>{base_url}/faq</loc>',
            '    <changefreq>monthly</changefreq>',
            '    <priority>0.6</priority>',
            '  </url>',
        ]

        # Dynamic Categories
        for cat in categories:
            xml_lines.extend([
                '  <url>',
                f'    <loc>{base_url}/blog?category={cat.slug}</loc>',
                '    <changefreq>daily</changefreq>',
                '    <priority>0.8</priority>',
                '  </url>'
            ])

        # Dynamic Blog Posts & News with Google News extension
        for p in posts:
            pub_date_iso = p.published_at.strftime('%Y-%m-%d')
            prefix = 'news' if p.post_type == 'news' else 'blog'
            post_url = f"{base_url}/{prefix}/{p.category.slug}/{p.slug}"
            clean_title = escape(p.title)
            
            xml_lines.extend([
                '  <url>',
                f'    <loc>{post_url}</loc>',
                f'    <lastmod>{pub_date_iso}</lastmod>',
                '    <changefreq>weekly</changefreq>',
                '    <priority>0.8</priority>',
                '    <news:news>',
                '      <news:publication>',
                '        <news:name>Aaradhya Enertech Digital Intelligence</news:name>',
                '        <news:language>en</news:language>',
                '      </news:publication>',
                f'      <news:publication_date>{p.published_at.isoformat()}</news:publication_date>',
                f'      <news:title>{clean_title}</news:title>',
                '    </news:news>',
                '  </url>'
            ])

        xml_lines.append('</urlset>')
        xml_content = '\n'.join(xml_lines)
        return HttpResponse(xml_content, content_type='application/xml')



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

        post_type = self.request.query_params.get('post_type')
        if post_type in ['blog', 'news']:
            qs = qs.filter(post_type=post_type)

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

        post_type = data.get('post_type', 'news')

        post, created = BlogPost.objects.get_or_create(
            title=data.get('title'),
            defaults={
                'category': category,
                'post_type': post_type,
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
