from django.http import JsonResponse

def root_health_view(request):
    return JsonResponse({
        'status': 'online',
        'platform': 'Digital Services Platform API',
        'version': '1.0.0',
        'api_documentation': '/api/v1/',
        'admin_dashboard': '/admin/'
    })
