"""
Digital Services Platform URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import root_health_view

api_patterns = [
    path('', include('apps.services.urls')),
    path('', include('apps.requests.urls')),
    path('', include('apps.quotes.urls')),
    path('', include('apps.orders.urls')),
]

urlpatterns = [
    path('', root_health_view, name='root-health'),
    path('admin/', admin.site.urls),
    path('api/v1/', include(api_patterns)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
