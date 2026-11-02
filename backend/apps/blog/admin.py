from django.contrib import admin
from .models import BlogCategory, BlogPost


@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'color', 'is_active', 'display_order', 'created_at')
    list_editable = ('is_active', 'display_order')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description')


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'author_name', 'is_trending', 'is_featured', 'is_published', 'views_count', 'published_at')
    list_editable = ('is_trending', 'is_featured', 'is_published')
    list_filter = ('category', 'is_trending', 'is_featured', 'is_published', 'published_at')
    search_fields = ('title', 'excerpt', 'content', 'source_name')
    prepopulated_fields = {'slug': ('title',)}
