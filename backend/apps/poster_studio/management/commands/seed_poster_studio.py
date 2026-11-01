from decimal import Decimal
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from apps.poster_studio.models import PosterCategory, PosterTemplate


# Simple 1x1 base PNG bytes or small valid SVG/PNG for placeholder preview images
MINIMAL_PNG_BYTES = (
    b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06'
    b'\x00\x00\x00\x1f\x15c4\x00\x00\x00\rIDATx\x9cc`\x00\x00\x00\x02\x00\x01'
    b'\xe5\'\xde\xfc\x00\x00\x00\x00IEND\xaeB`\x82'
)


CATEGORIES_DATA = [
    {
        "name": "Panchayat & Community Posters",
        "slug": "panchayat-community",
        "description": "Candidate introduction, election information, village event announcements, and public awareness posters.",
        "display_order": 1,
        "templates": [
            {
                "name": "Gram Pradhan Candidate Introduction",
                "slug": "gram-pradhan-candidate-intro",
                "description": "Dignified election poster layout with prominent candidate photo frame, election symbol placeholder, and development agenda bullet points in Hindi.",
                "starting_price": Decimal("149.00"),
                "supported_languages": ["Hindi", "English", "Both"],
                "supported_sizes": ["WhatsApp (1:1 / 4:5)", "Instagram Post (1:1)", "A4 Printable", "Custom Dimensions"],
                "is_featured": True,
            },
            {
                "name": "Village Development & Jan Sabha Notice",
                "slug": "village-development-jan-sabha-notice",
                "description": "Clear public notice poster for Gram Sabha meetings, government schemes, and community development discussions.",
                "starting_price": Decimal("99.00"),
                "supported_languages": ["Hindi", "English"],
                "supported_sizes": ["WhatsApp (1:1 / 4:5)", "A4 Printable"],
                "is_featured": False,
            },
            {
                "name": "Social Awareness & Cleanliness Drive",
                "slug": "social-awareness-cleanliness-drive",
                "description": "Swachh Bharat & rural health awareness poster design with slogan placeholders.",
                "starting_price": Decimal("99.00"),
                "supported_languages": ["Hindi", "Both"],
                "supported_sizes": ["WhatsApp (1:1 / 4:5)", "Instagram Post (1:1)", "A4 Printable"],
                "is_featured": False,
            }
        ]
    },
    {
        "name": "Birthday & Anniversary",
        "slug": "birthday-anniversary",
        "description": "Personalized birthday photo wishes, marriage anniversary greetings, and family celebration posters.",
        "display_order": 2,
        "templates": [
            {
                "name": "Royal Gold Birthday Wishes Banner",
                "slug": "royal-gold-birthday-wishes",
                "description": "Premium golden balloon & confetti design with multi-photo slots and custom warm blessings in Hindi/English.",
                "starting_price": Decimal("99.00"),
                "supported_languages": ["Hindi", "English", "Both"],
                "supported_sizes": ["WhatsApp (1:1 / 4:5)", "Instagram Post (1:1)", "Instagram Story (9:16)"],
                "is_featured": True,
            },
            {
                "name": "Silver Jubilee Anniversary Celebration",
                "slug": "silver-jubilee-anniversary-celebration",
                "description": "Elegant floral border couple portrait poster with anniversary wishes and couple quote.",
                "starting_price": Decimal("129.00"),
                "supported_languages": ["Hindi", "English", "Both"],
                "supported_sizes": ["WhatsApp (1:1 / 4:5)", "Instagram Story (9:16)", "A4 Printable"],
                "is_featured": False,
            },
            {
                "name": "Kids Cartoon Fun Birthday Poster",
                "slug": "kids-cartoon-fun-birthday-poster",
                "description": "Playful, colorful celebration graphic for young kids' birthday parties.",
                "starting_price": Decimal("99.00"),
                "supported_languages": ["English", "Hindi"],
                "supported_sizes": ["Instagram Post (1:1)", "A4 Printable"],
                "is_featured": False,
            }
        ]
    },
    {
        "name": "Business Advertisement",
        "slug": "business-advertisement",
        "description": "Shop grand opening flyers, promotional discount offers, product launches, and business contact banners.",
        "display_order": 3,
        "templates": [
            {
                "name": "Grand Opening & Inauguration Poster",
                "slug": "grand-opening-inauguration-poster",
                "description": "Festive ribbon-cutting retail promo with big discount badge, shop address, and contact details.",
                "starting_price": Decimal("149.00"),
                "supported_languages": ["Hindi", "English", "Both"],
                "supported_sizes": ["WhatsApp (1:1 / 4:5)", "Instagram Post (1:1)", "A4 Printable"],
                "is_featured": True,
            },
            {
                "name": "Super Sale & Festive Discount Banner",
                "slug": "super-sale-festive-discount-banner",
                "description": "High-conversion product discount poster with countdown and call-to-action.",
                "starting_price": Decimal("119.00"),
                "supported_languages": ["English", "Hindi", "Both"],
                "supported_sizes": ["Instagram Post (1:1)", "Instagram Story (9:16)"],
                "is_featured": True,
            },
            {
                "name": "Restaurant & Cafe Menu Special",
                "slug": "restaurant-cafe-menu-special",
                "description": "Delicious food showcase with price tags, chef special highlight, and QR code area.",
                "starting_price": Decimal("149.00"),
                "supported_languages": ["English", "Hindi"],
                "supported_sizes": ["Instagram Post (1:1)", "A4 Printable"],
                "is_featured": False,
            }
        ]
    },
    {
        "name": "Festival Posters",
        "slug": "festival-posters",
        "description": "Diwali, Holi, Eid, Raksha Bandhan, Independence Day, Republic Day, and cultural greetings.",
        "display_order": 4,
        "templates": [
            {
                "name": "Subh Deepawali Shubhkaamnayein",
                "slug": "subh-deepawali-shubhkaamnayein",
                "description": "Luminous diya glow festival template with sender photo, business logo, and traditional Sanskrit/Hindi verse.",
                "starting_price": Decimal("79.00"),
                "supported_languages": ["Hindi", "English", "Both"],
                "supported_sizes": ["WhatsApp (1:1 / 4:5)", "Instagram Post (1:1)", "Instagram Story (9:16)"],
                "is_featured": True,
            },
            {
                "name": "Holi Mahotsav Rangotsav Greeting",
                "slug": "holi-mahotsav-rangotsav-greeting",
                "description": "Vibrant gulal splash poster with personalized family or business wishing badge.",
                "starting_price": Decimal("79.00"),
                "supported_languages": ["Hindi", "English", "Both"],
                "supported_sizes": ["WhatsApp (1:1 / 4:5)", "Instagram Post (1:1)"],
                "is_featured": False,
            },
            {
                "name": "National Day (Independence / Republic Day)",
                "slug": "national-day-patriot-greeting",
                "description": "Tricolor patriotic design with Ashok Chakra, leadership photos, and organization wishes.",
                "starting_price": Decimal("89.00"),
                "supported_languages": ["Hindi", "English", "Both"],
                "supported_sizes": ["WhatsApp (1:1 / 4:5)", "Instagram Post (1:1)", "A4 Printable"],
                "is_featured": False,
            }
        ]
    },
    {
        "name": "Wedding & Events",
        "slug": "wedding-events",
        "description": "Digital wedding invitations, engagement announcements, Sangeet programs, and religious ceremonies.",
        "display_order": 5,
        "templates": [
            {
                "name": "Royal Indian Vivah Nimantran Patra",
                "slug": "royal-indian-vivah-nimantran",
                "description": "Traditional paisley motif marriage invite with Lord Ganesha icon, bride & groom names, and venue details.",
                "starting_price": Decimal("199.00"),
                "supported_languages": ["Hindi", "English", "Both"],
                "supported_sizes": ["WhatsApp (1:1 / 4:5)", "Instagram Story (9:16)", "A4 Printable"],
                "is_featured": True,
            },
            {
                "name": "Modern Minimalist Ring Ceremony Invitation",
                "slug": "modern-minimalist-ring-ceremony",
                "description": "Sleek pastel aesthetic invitation for engagement ceremonies and save-the-date notices.",
                "starting_price": Decimal("149.00"),
                "supported_languages": ["English", "Hindi"],
                "supported_sizes": ["Instagram Story (9:16)", "WhatsApp (1:1 / 4:5)"],
                "is_featured": False,
            },
            {
                "name": "Shrimad Bhagwat Katha / Religious Event",
                "slug": "religious-katha-satsang-poster",
                "description": "Spiritual program poster with Vyaspeeth photo, date-wise program itinerary, and organizer credits.",
                "starting_price": Decimal("149.00"),
                "supported_languages": ["Hindi"],
                "supported_sizes": ["WhatsApp (1:1 / 4:5)", "A4 Printable"],
                "is_featured": False,
            }
        ]
    },
    {
        "name": "Education",
        "slug": "education",
        "description": "School admissions open flyers, coaching institute batches, board exam toppers, and tuition adverts.",
        "display_order": 6,
        "templates": [
            {
                "name": "New Admissions Open 2026-27 School Flyer",
                "slug": "admissions-open-school-flyer",
                "description": "Clean educational flyer with salient features, campus facilities, contact numbers, and admission helpline.",
                "starting_price": Decimal("129.00"),
                "supported_languages": ["English", "Hindi", "Both"],
                "supported_sizes": ["A4 Printable", "WhatsApp (1:1 / 4:5)", "Instagram Post (1:1)"],
                "is_featured": True,
            },
            {
                "name": "IIT-JEE & NEET New Target Batch Banner",
                "slug": "coaching-batch-announcement",
                "description": "High-impact coaching institute announcement with faculty highlights, scholarship test dates, and registration QR.",
                "starting_price": Decimal("149.00"),
                "supported_languages": ["English", "Hindi", "Both"],
                "supported_sizes": ["Instagram Post (1:1)", "WhatsApp (1:1 / 4:5)", "A4 Printable"],
                "is_featured": True,
            },
            {
                "name": "Toppers Felicitation & Result Showcase",
                "slug": "toppers-felicitation-result-showcase",
                "description": "Grid layout highlighting meritorious student ranks, photos, and percentage scores.",
                "starting_price": Decimal("169.00"),
                "supported_languages": ["English", "Hindi", "Both"],
                "supported_sizes": ["A4 Printable", "WhatsApp (1:1 / 4:5)"],
                "is_featured": False,
            }
        ]
    }
]


class Command(BaseCommand):
    help = "Seed Poster Design Studio categories and initial sample templates."

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Seeding Poster Design Studio data..."))
        created_cats = 0
        created_templates = 0

        for cat_data in CATEGORIES_DATA:
            templates_data = cat_data.pop("templates", [])
            category, cat_created = PosterCategory.objects.get_or_create(
                slug=cat_data["slug"],
                defaults=cat_data
            )
            if cat_created:
                created_cats += 1

            for t_data in templates_data:
                slug = t_data["slug"]
                if not PosterTemplate.objects.filter(slug=slug).exists():
                    template = PosterTemplate(
                        category=category,
                        name=t_data["name"],
                        slug=slug,
                        description=t_data["description"],
                        starting_price=t_data["starting_price"],
                        supported_languages=t_data["supported_languages"],
                        supported_sizes=t_data["supported_sizes"],
                        is_featured=t_data.get("is_featured", False),
                        is_active=True,
                    )
                    # Create a sample placeholder image file
                    filename = f"{slug}.png"
                    template.preview_image.save(filename, ContentFile(MINIMAL_PNG_BYTES), save=False)
                    template.save()
                    created_templates += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully seeded: {created_cats} categories, {created_templates} templates!"
            )
        )
