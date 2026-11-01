from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth.models import User
from decimal import Decimal

from apps.poster_studio.models import (
    PosterCategory,
    PosterTemplate,
    PosterOrder,
    PosterAsset,
)


class PosterStudioTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Admin user
        self.admin_user = User.objects.create_superuser(
            username='admin_test',
            email='admin@test.com',
            password='password123'
        )

        # Create test category
        self.category = PosterCategory.objects.create(
            name='Festival Posters',
            slug='festival-posters',
            description='Test festival category'
        )

        # Create test template
        test_img = SimpleUploadedFile(
            name='test_preview.png',
            content=b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\rIDATx\x9cc`\x00\x00\x00\x02\x00\x01\xe5\'\xde\xfc\x00\x00\x00\x00IEND\xaeB`\x82',
            content_type='image/png'
        )
        self.template = PosterTemplate.objects.create(
            category=self.category,
            name='Diwali Shubhkaamnayein Banner',
            slug='diwali-shubhkaamnayein-banner',
            description='Test diwali template',
            preview_image=test_img,
            starting_price=Decimal('99.00'),
            supported_languages=['Hindi', 'English'],
            supported_sizes=['WhatsApp (1:1 / 4:5)', 'Instagram Post (1:1)'],
            is_featured=True,
            is_active=True
        )

    def test_public_categories_list(self):
        url = reverse('public-poster-categories')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['slug'], 'festival-posters')

    def test_public_templates_list_and_filtering(self):
        url = reverse('public-poster-templates')
        response = self.client.get(url, {'category': 'festival-posters'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['slug'], 'diwali-shubhkaamnayein-banner')

    def test_public_template_detail(self):
        url = reverse('public-poster-template-detail', kwargs={'slug': 'diwali-shubhkaamnayein-banner'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Diwali Shubhkaamnayein Banner')

    def test_order_creation_with_file_upload(self):
        url = reverse('public-poster-order-create')
        photo = SimpleUploadedFile("photo.jpg", b"photo_bytes", content_type="image/jpeg")
        data = {
            'customer_name': 'Ramesh Kumar',
            'email': 'ramesh@example.com',
            'phone': '+91 9876543210',
            'customer_type': 'INDIVIDUAL',
            'category': self.category.id,
            'template': self.template.id,
            'heading': 'Shubh Deepawali Wishes from Ramesh Family',
            'content': 'Wishing you and your family peace and prosperity.',
            'language': 'HINDI',
            'colour_preference': 'Golden & Deep Red',
            'output_size': 'WHATSAPP',
            'output_format': 'PNG',
            'budget': '100',
            'required_delivery_date': 'Tomorrow morning',
            'privacy_consent': True,
            'customer_photos': [photo]
        }
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        ref = response.data['order']['public_reference']
        self.assertTrue(ref.startswith('PST-'))

        # Verify asset created in DB
        order = PosterOrder.objects.get(public_reference=ref)
        self.assertEqual(order.assets.count(), 1)
        self.assertEqual(order.assets.first().asset_type, PosterAsset.AssetType.CUSTOMER_PHOTO)

    def test_public_order_lookup(self):
        order = PosterOrder.objects.create(
            customer_name='Suresh',
            email='suresh@example.com',
            phone='9999999999',
            category=self.category,
            heading='Test',
            content='Test content',
            privacy_consent=True
        )
        url = reverse('public-poster-order-lookup', kwargs={'reference': order.public_reference})

        # Test lookup with matching email
        res = self.client.get(f"{url}?email=suresh@example.com")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['public_reference'], order.public_reference)

        # Test lookup with mismatched email
        res_mismatch = self.client.get(f"{url}?email=wrong@example.com")
        self.assertEqual(res_mismatch.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_permissions(self):
        # Unauthenticated access to admin endpoint
        url = reverse('admin-poster-order-list')
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        # Authenticated admin access
        self.client.force_authenticate(user=self.admin_user)
        res_auth = self.client.get(url)
        self.assertEqual(res_auth.status_code, status.HTTP_200_OK)
