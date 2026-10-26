from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from decimal import Decimal
from apps.services.models import ServiceCategory, Service
from apps.requests.models import ServiceRequest
from apps.quotes.models import Quote
from apps.orders.models import Order, PaymentRecord
from django.contrib.auth import get_user_model

User = get_user_model()

class PlatformCoreFlowTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_superuser('testadmin', 'test@example.com', 'adminpass123')
        
        self.category = ServiceCategory.objects.create(
            name="Website and Development",
            slug="website-and-development",
            description="Web dev services",
            display_order=1,
            is_active=True
        )
        self.service = Service.objects.create(
            category=self.category,
            name="Landing Page Pro",
            slug="landing-page-pro",
            short_description="High-converting landing page",
            full_description="Complete responsive single page site with form",
            starting_price=Decimal("7999.00"),
            is_active=True,
            is_featured=True
        )
        self.inactive_service = Service.objects.create(
            category=self.category,
            name="Archived Service",
            slug="archived-service",
            short_description="Inactive",
            full_description="Inactive description",
            starting_price=Decimal("1000.00"),
            is_active=False
        )

    def test_public_category_list(self):
        response = self.client.get('/api/v1/categories/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verify category exists
        slugs = [c['slug'] for c in response.data]
        self.assertIn("website-and-development", slugs)

    def test_public_service_list_hides_inactive(self):
        response = self.client.get('/api/v1/services/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should only list active services
        slugs = [s['slug'] for s in response.data['results']]
        self.assertIn("landing-page-pro", slugs)
        self.assertNotIn("archived-service", slugs)

    def test_public_service_detail(self):
        response = self.client.get('/api/v1/services/landing-page-pro/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Landing Page Pro")
        self.assertEqual(Decimal(response.data['starting_price']), Decimal("7999.00"))

    def test_guest_request_submission_validation(self):
        # Missing required fields
        response = self.client.post('/api/v1/requests/', {
            'customer_name': 'Test Client',
            # missing email, description, budget, deadline, privacy_consent
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Valid submission
        valid_payload = {
            'customer_name': 'Rohan Sharma',
            'email': 'rohan@example.com',
            'phone': '+91 9876543210',
            'customer_type': 'BUSINESS',
            'company_name': 'Sharma Enterprises',
            'category': self.category.id,
            'service': self.service.id,
            'description': 'We need a high quality product landing page for our new organic tea launch.',
            'budget': '₹8,000 - ₹12,000',
            'deadline': 'Within 2 weeks',
            'preferred_contact_method': 'WHATSAPP',
            'privacy_consent': True,
        }
        res = self.client.post('/api/v1/requests/', valid_payload)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertIn('public_reference', res.data)
        self.assertIn('access_token', res.data)
        ref = res.data['public_reference']
        token = res.data['access_token']

        # Verify record in DB
        req_obj = ServiceRequest.objects.get(public_reference=ref)
        self.assertEqual(req_obj.status, 'NEW')

        # Test guest status lookup
        status_res = self.client.get(f'/api/v1/requests/status/?ref={ref}&token={token}')
        self.assertEqual(status_res.status_code, status.HTTP_200_OK)
        self.assertEqual(status_res.data['public_reference'], ref)
        self.assertEqual(status_res.data['status'], 'NEW')

    def test_unauthorized_admin_access_rejected(self):
        response = self.client.get('/api/v1/admin/requests/')
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_full_admin_quotation_and_order_workflow(self):
        # 1. Create a request
        req = ServiceRequest.objects.create(
            customer_name="Anita Roy",
            email="anita@example.com",
            phone="+91 9123456789",
            category=self.category,
            service=self.service,
            description="Complete website development for boutique bakery.",
            budget="₹15,000",
            deadline="15 days",
            privacy_consent=True
        )

        # Authenticate as admin
        self.client.force_authenticate(user=self.admin_user)

        # 2. Admin creates quote
        quote_payload = {
            'amount': '14500.00',
            'scope_of_work': '5 page responsive bakery website with ordering inquiries.',
            'estimated_delivery_days': 10,
            'revision_limit': 2,
            'terms': '50% advance, 50% upon delivery review.'
        }
        quote_res = self.client.post(f'/api/v1/admin/requests/{req.id}/quotes/', quote_payload)
        self.assertEqual(quote_res.status_code, status.HTTP_201_CREATED)
        quote_id = quote_res.data['id']

        # 3. Mark Quote Sent
        send_res = self.client.post(f'/api/v1/admin/quotes/{quote_id}/send/')
        self.assertEqual(send_res.status_code, status.HTTP_200_OK)
        quote_obj = Quote.objects.get(pk=quote_id)
        self.assertEqual(quote_obj.status, 'SENT')
        req.refresh_from_db()
        self.assertEqual(req.status, 'QUOTED')

        # 4. Mark Quote Accepted -> Auto creates order
        accept_res = self.client.post(f'/api/v1/admin/quotes/{quote_id}/accept/')
        self.assertEqual(accept_res.status_code, status.HTTP_200_OK)
        self.assertTrue(accept_res.data['order_created'])
        order = Order.objects.get(accepted_quote=quote_obj)
        self.assertEqual(order.status, 'PENDING_PAYMENT')
        self.assertEqual(order.payment_status, 'UNPAID')

        # 5. Record verified advance payment
        payment_payload = {
            'amount': '7250.00',
            'payment_method': 'UPI',
            'transaction_reference': 'UPI-TXN-982374619'
        }
        pay_res = self.client.post(f'/api/v1/admin/orders/{order.id}/payments/', payment_payload)
        self.assertEqual(pay_res.status_code, status.HTTP_201_CREATED)
        order.refresh_from_db()
        self.assertEqual(order.payment_status, 'PARTIALLY_PAID')

        # 6. Add deliverable
        deliv_payload = {
            'title': 'Bakery Website Staging Preview',
            'description': 'Initial deployed staging preview for review.',
            'external_url': 'https://staging.bakerypreview.com'
        }
        deliv_res = self.client.post(f'/api/v1/admin/orders/{order.id}/deliverables/', deliv_payload)
        self.assertEqual(deliv_res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(order.deliverables.count(), 1)
