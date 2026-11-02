from rest_framework import serializers
from .models import BlogCategory, BlogPost


class BlogCategorySerializer(serializers.ModelSerializer):
    posts_count = serializers.IntegerField(source='posts.count', read_only=True)

    class Meta:
        model = BlogCategory
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'icon_name',
            'color',
            'posts_count',
            'is_active',
            'display_order',
        ]


class BlogPostListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    category_color = serializers.CharField(source='category.color', read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            'id',
            'title',
            'slug',
            'post_type',
            'category',
            'category_name',
            'category_slug',
            'category_color',
            'excerpt',
            'featured_image',
            'author_name',
            'source_name',
            'source_url',
            'tags',
            'read_time_minutes',
            'views_count',
            'is_trending',
            'is_featured',
            'published_at',
        ]


class BlogPostDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    category_color = serializers.CharField(source='category.color', read_only=True)
    related_posts = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            'id',
            'title',
            'slug',
            'post_type',
            'category',
            'category_name',
            'category_slug',
            'category_color',
            'excerpt',
            'content',
            'featured_image',
            'author_name',
            'source_name',
            'source_url',
            'tags',
            'read_time_minutes',
            'views_count',
            'is_trending',
            'is_featured',
            'published_at',
            'updated_at',
            'related_posts',
        ]

    def get_related_posts(self, obj):
        related = BlogPost.objects.filter(
            category=obj.category,
            is_published=True
        ).exclude(id=obj.id).order_by('-published_at')[:3]
        return BlogPostListSerializer(related, many=True).data
