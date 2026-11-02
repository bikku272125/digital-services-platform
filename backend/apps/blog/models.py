from django.db import models
from django.utils.text import slugify


class BlogCategory(models.Model):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=130, unique=True, blank=True)
    description = models.TextField(blank=True)
    icon_name = models.CharField(max_length=50, default='Layers')
    color = models.CharField(max_length=50, default='indigo')
    is_active = models.BooleanField(default=True, db_index=True)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['display_order', 'name']
        verbose_name = 'Blog Category'
        verbose_name_plural = 'Blog Categories'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class BlogPost(models.Model):
    POST_TYPE_CHOICES = (
        ('blog', 'Editorial Blog'),
        ('news', 'Trending News'),
    )

    category = models.ForeignKey(
        BlogCategory,
        related_name='posts',
        on_delete=models.CASCADE
    )
    post_type = models.CharField(
        max_length=20,
        choices=POST_TYPE_CHOICES,
        default='blog',
        db_index=True,
        help_text="Distinguish between in-depth Editorial Blog guides and real-time Trending News"
    )
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=280, unique=True, blank=True)
    excerpt = models.TextField(help_text="Concise summary for SEO and feed cards")
    content = models.TextField(help_text="Full article body in HTML or Markdown")
    featured_image = models.URLField(
        max_length=500,
        blank=True,
        help_text="Direct CDN / Unsplash image URL"
    )
    author_name = models.CharField(max_length=100, default="Digital Studio Editorial")
    source_name = models.CharField(max_length=120, blank=True, help_text="e.g. Google News, TechCrunch")
    source_url = models.URLField(max_length=500, blank=True)
    tags = models.JSONField(default=list, blank=True)
    read_time_minutes = models.PositiveIntegerField(default=3)
    views_count = models.PositiveIntegerField(default=0)
    is_trending = models.BooleanField(default=False, db_index=True)
    is_featured = models.BooleanField(default=False, db_index=True)
    is_published = models.BooleanField(default=True, db_index=True)
    published_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_at']
        verbose_name = 'Blog Post'
        verbose_name_plural = 'Blog Posts'

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            idx = 1
            while BlogPost.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{idx}"
                idx += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
