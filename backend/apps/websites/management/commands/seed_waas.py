from django.core.management.base import BaseCommand
from apps.websites.models import WebsiteCategory, WebsitePackage, WebsiteTemplate


class Command(BaseCommand):
    help = 'Seeds initial Website-as-a-Service categories, pricing tiers, and sample templates'

    def handle(self, *args, **options):
        self.stdout.write("Seeding Website-as-a-Service data...")

        # 1. Categories
        categories_data = [
            {"name": "Education", "slug": "education", "icon_name": "GraduationCap", "display_order": 1, "description": "Schools, colleges, coaching centers, academy & tutor portals."},
            {"name": "Healthcare", "slug": "healthcare", "icon_name": "Activity", "display_order": 2, "description": "Hospitals, private clinics, dental practices, doctor appointment portals."},
            {"name": "Business & Corporate", "slug": "business", "icon_name": "Building2", "display_order": 3, "description": "Companies, corporate firms, MSMEs, startups & B2B brands."},
            {"name": "Retail & Shops", "slug": "retail", "icon_name": "ShoppingBag", "display_order": 4, "description": "Clothing stores, grocery marts, electronics showrooms, local shops."},
            {"name": "Food & Hospitality", "slug": "food", "icon_name": "Utensils", "display_order": 5, "description": "Restaurants, cafes, cloud kitchens, bakeries, boutique hotels."},
            {"name": "Professional & Portfolio", "slug": "professional", "icon_name": "UserCheck", "display_order": 6, "description": "Lawyers, CAs, architects, photographers, personal executive profiles."},
            {"name": "Services & Agencies", "slug": "services", "icon_name": "Briefcase", "display_order": 7, "description": "Digital agencies, real estate, repair services, travel & logistics."},
            {"name": "Custom Development", "slug": "custom", "icon_name": "Code2", "display_order": 8, "description": "Bespoke SaaS, portal applications, specialized workflows."},
        ]

        cat_objs = {}
        for c in categories_data:
            obj, _ = WebsiteCategory.objects.update_or_create(
                slug=c['slug'],
                defaults=c
            )
            cat_objs[c['slug']] = obj
        self.stdout.write(f"✓ Seeded {len(cat_objs)} Website Categories")

        # 2. Packages & Pricing Tiers
        packages_data = [
            {
                "tier": "starter",
                "name": "Starter Website",
                "price_inr": 2999.00,
                "billing_period": "year",
                "tagline": "Ideal for local businesses, coaching institutes & individual professionals.",
                "is_popular": False,
                "features": [
                    "Up to 5 Responsive Pages (Home, About, Services, Gallery, Contact)",
                    "Free Branded Subdomain (yourname.aaradhyaenertech.com)",
                    "High-Speed Cloud Hosting Included",
                    "SSL Security Certificate (HTTPS)",
                    "WhatsApp Chat Button & Inquiry Form",
                    "Mobile & Tablet Optimized",
                    "Annual Maintenance & Free Backups",
                    "Full Code & Data Export Allowed",
                ],
                "subdomain_included": True,
                "custom_domain_supported": True,
                "ssl_included": True,
                "hosting_included": True,
                "pages_limit": 5,
                "export_allowed": True,
                "display_order": 1,
            },
            {
                "tier": "business",
                "name": "Business Growth",
                "price_inr": 5999.00,
                "billing_period": "year",
                "tagline": "Best for established schools, hospitals, retail shops & expanding companies.",
                "is_popular": True,
                "features": [
                    "Up to 12 Custom Designed Pages",
                    "Custom Domain Connection (.com / .in / .org support)",
                    "Interactive Lead Capture & CRM Inquiry Integration",
                    "Google Maps & Search Console Indexing Setup",
                    "Product / Service Catalog with Inquiry Buttons",
                    "Superfast CDN & Zero Downtime Hosting",
                    "Priority WhatsApp & Email Support",
                    "1-Click Full Website Portability ZIP Export",
                ],
                "subdomain_included": True,
                "custom_domain_supported": True,
                "ssl_included": True,
                "hosting_included": True,
                "pages_limit": 12,
                "export_allowed": True,
                "display_order": 2,
            },
            {
                "tier": "professional",
                "name": "Professional Enterprise",
                "price_inr": 9999.00,
                "billing_period": "year",
                "tagline": "Full-featured web presence for large organizations, multi-branch hospitals & brands.",
                "is_popular": False,
                "features": [
                    "Unlimited Pages & Dynamic CMS Content",
                    "Online Appointment / Booking Engine",
                    "Payment Gateway Integration (UPI, Cards, NetBanking)",
                    "Custom Email Accounts Setup (info@yourcompany.com)",
                    "Comprehensive SEO & Speed Optimization (95+ Google Score)",
                    "Monthly Backup Snapshots & Security Audits",
                    "Dedicated Account Manager",
                    "Complete Source Code & Database Ownership",
                ],
                "subdomain_included": True,
                "custom_domain_supported": True,
                "ssl_included": True,
                "hosting_included": True,
                "pages_limit": 99,
                "export_allowed": True,
                "display_order": 3,
            },
            {
                "tier": "custom",
                "name": "Custom Development",
                "price_inr": 15000.00,
                "billing_period": "one-time + AMC",
                "tagline": "Custom full-stack web applications, portals & specialized enterprise systems.",
                "is_popular": False,
                "features": [
                    "Bespoke UI/UX Designed from Scratch",
                    "Custom Backend APIs (Django / Node / Python)",
                    "Multi-User Role Permissions & Client Portals",
                    "Third-Party Software, ERP & Database Integrations",
                    "Dedicated Staging & Production Environments",
                    "Complete Intellectual Property Transfer",
                ],
                "subdomain_included": True,
                "custom_domain_supported": True,
                "ssl_included": True,
                "hosting_included": True,
                "pages_limit": 999,
                "export_allowed": True,
                "display_order": 4,
            },
        ]

        for p in packages_data:
            WebsitePackage.objects.update_or_create(
                tier=p['tier'],
                defaults=p
            )
        self.stdout.write("✓ Seeded 4 Pricing Packages")

        # 3. Ready-Made Website Templates
        templates_data = [
            {
                "category_slug": "education",
                "title": "EduPrime Academy & School",
                "slug": "eduprime-academy-school",
                "description": "Modern educational website featuring course catalogues, admission notice board, faculty profiles, and student inquiry portal.",
                "thumbnail_url": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
                "demo_url": "https://digital.aaradhyaenertech.com/templates/demo/eduprime",
                "features": ["Course Syllabus Downloads", "Online Admission Form", "Notice Board & Announcements", "Photo & Event Gallery"],
                "tech_stack": "React / Tailwind / Node",
                "is_featured": True,
            },
            {
                "category_slug": "healthcare",
                "title": "CarePlus Hospital & Clinic",
                "slug": "careplus-hospital-clinic",
                "description": "Clean, trustworthy medical website with doctor department listings, OPD timing charts, doctor profiles, and 1-click appointment booking.",
                "thumbnail_url": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
                "demo_url": "https://digital.aaradhyaenertech.com/templates/demo/careplus",
                "features": ["Doctor Appointment Engine", "OPD & Emergency Schedule", "Department Directory", "Patient Testimonials"],
                "tech_stack": "React / Tailwind",
                "is_featured": True,
            },
            {
                "category_slug": "business",
                "title": "Apex Corporate & MSME Suite",
                "slug": "apex-corporate-suite",
                "description": "Authoritative corporate portal designed for manufacturing enterprises, engineering firms, B2B vendors, and consulting groups.",
                "thumbnail_url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
                "demo_url": "https://digital.aaradhyaenertech.com/templates/demo/apex",
                "features": ["Product & Capability Matrix", "Corporate Brochure Download", "Client Case Studies", "Interactive RFQ / Quote Calculator"],
                "tech_stack": "React / Tailwind / Django",
                "is_featured": True,
            },
            {
                "category_slug": "food",
                "title": "SpiceVilla Cafe & Restaurant",
                "slug": "spicevilla-restaurant",
                "description": "Appetizing culinary showcase with categorized food & beverage menu, table reservation booking, and direct WhatsApp order dispatch.",
                "thumbnail_url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
                "demo_url": "https://digital.aaradhyaenertech.com/templates/demo/spicevilla",
                "features": ["Categorized Digital Food Menu", "Table Reservation Modal", "Direct WhatsApp Food Orders", "Chef's Specials Showcase"],
                "tech_stack": "React / Tailwind",
                "is_featured": True,
            },
            {
                "category_slug": "retail",
                "title": "UrbanCart Showroom & Boutique",
                "slug": "urbancart-showroom-boutique",
                "description": "Elegantly showcases clothing collections, electronics, or retail inventory with product catalogs, price tags, and store locator.",
                "thumbnail_url": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
                "demo_url": "https://digital.aaradhyaenertech.com/templates/demo/urbancart",
                "features": ["Collection Grid with Quick View", "WhatsApp Buy-Now Integration", "Store Opening Hours & Map", "Discount Promo Banners"],
                "tech_stack": "React / Tailwind",
                "is_featured": False,
            },
            {
                "category_slug": "professional",
                "title": "LexPro Advocate & Consultant Profile",
                "slug": "lexpro-professional-profile",
                "description": "Sophisticated portfolio and appointment portal for lawyers, chartered accountants, financial advisers, and senior consultants.",
                "thumbnail_url": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
                "demo_url": "https://digital.aaradhyaenertech.com/templates/demo/lexpro",
                "features": ["Practice Areas Overview", "Schedule Consultation Form", "Publications & Insights", "Verified Client Reviews"],
                "tech_stack": "React / Tailwind",
                "is_featured": False,
            },
        ]

        for t in templates_data:
            cat = cat_objs.get(t.pop('category_slug'))
            if cat:
                WebsiteTemplate.objects.update_or_create(
                    slug=t['slug'],
                    defaults={**t, "category": cat}
                )
        self.stdout.write(f"✓ Seeded {len(templates_data)} Website Templates")
        self.stdout.write(self.style.SUCCESS("Website-as-a-Service seeding complete!"))
