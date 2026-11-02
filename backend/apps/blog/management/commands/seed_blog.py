from django.core.management.base import BaseCommand
from apps.blog.models import BlogCategory, BlogPost

CATEGORIES_DATA = [
    {
        "name": "Technology & AI",
        "slug": "technology",
        "description": "Latest breakthroughs in Artificial Intelligence, web development, and digital tools.",
        "icon_name": "Cpu",
        "color": "indigo",
        "display_order": 1,
    },
    {
        "name": "Business & Startups",
        "slug": "business",
        "description": "Entrepreneurship strategies, funding insights, and market trends across India.",
        "icon_name": "TrendingUp",
        "color": "emerald",
        "display_order": 2,
    },
    {
        "name": "Trending News",
        "slug": "trending-news",
        "description": "Curated national and global developments, policy changes, and viral updates.",
        "icon_name": "Zap",
        "color": "amber",
        "display_order": 3,
    },
    {
        "name": "Design & Creativity",
        "slug": "design",
        "description": "Graphic design, brand identity, UI/UX aesthetics, and creative workflows.",
        "icon_name": "Palette",
        "color": "pink",
        "display_order": 4,
    },
    {
        "name": "Government Schemes & Notices",
        "slug": "schemes-notices",
        "description": "Important public welfare announcements, subsidies, and MSME support initiatives.",
        "icon_name": "FileText",
        "color": "blue",
        "display_order": 5,
    },
]

INITIAL_POSTS = [
    {
        "category_slug": "technology",
        "title": "How Generative AI is Reshaping On-Demand Digital Work in 2026",
        "slug": "generative-ai-reshaping-digital-work-2026",
        "excerpt": "Discover how businesses are leveraging automated code execution, AI design tools, and intelligent workflows to deliver digital projects 5x faster.",
        "content": """
<h2>The Paradigm Shift in Digital Execution</h2>
<p>In 2026, the traditional workflow of waiting weeks for software prototypes or brand designs has fundamentally changed. Startups, agencies, and regional businesses across India are turning to unified digital execution studios that blend human craftsmanship with high-speed AI tools.</p>

<h3>Key Transformations Driving Speed:</h3>
<ul>
  <li><strong>Instant Data Automation:</strong> Routine spreadsheet modeling and reporting tasks that once took days are now synthesized in seconds using Python automation scripts.</li>
  <li><strong>AI-Augmented Graphic Design:</strong> High-resolution banners, festival posters, and marketing graphics can be composed and localized to Hindi and English on demand.</li>
  <li><strong>Zero-Latency Customer Engagement:</strong> AI chatbots plugged directly into WhatsApp provide 24/7 client onboarding and quotation calculations.</li>
</ul>

<h3>The Winning Formula for Modern Businesses</h3>
<p>Winning organizations don't replace people with technology—they empower creative teams with automated pipelines. By removing repetitive overhead, developers and designers focus purely on polish, security, and strategic client results.</p>
""",
        "featured_image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
        "author_name": "Tech Editorial Desk",
        "tags": ["AI", "Automation", "Future of Work", "Startups"],
        "read_time_minutes": 4,
        "is_trending": True,
        "is_featured": True,
    },
    {
        "category_slug": "business",
        "title": "Why Indian MSMEs Need Clean Digital Footprints and Dedicated Subdomains",
        "slug": "why-msmes-need-clean-digital-footprints",
        "excerpt": "Explore why splitting core industrial manufacturing from digital SaaS operations on verified subdomains accelerates Google visibility and customer trust.",
        "content": """
<h2>Domain Architecture for Modern Enterprises</h2>
<p>Many growing industrial and services companies face a common architectural hurdle: how to market advanced digital services without confusing B2B clients looking for physical manufacturing products.</p>

<h3>The Subdomain Strategy Explained</h3>
<p>By hosting your core manufacturing portfolio on <code>www.yourdomain.com</code> and branching specialized tech modules onto <code>digital.yourdomain.com</code>, you achieve two powerful advantages:</p>
<ol>
  <li><strong>Clean Brand Segmentation:</strong> B2B industrial clients see dedicated technical specifications, while tech clients land on high-converting SaaS interfaces.</li>
  <li><strong>Unified SEO Authority:</strong> Google recognizes both as part of the same root entity, passing domain trust and search visibility between both branches.</li>
</ol>
<p>Implementing proper canonical tags and XML sitemaps guarantees that every page ranks for its specific intent without internal search cannibalization.</p>
""",
        "featured_image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        "author_name": "Business Insights Team",
        "tags": ["SEO", "B2B", "MSME", "Digital Growth"],
        "read_time_minutes": 5,
        "is_trending": True,
        "is_featured": False,
    },
    {
        "category_slug": "trending-news",
        "title": "India's Clean Energy & Smart Grid Expansion: Powering Industrial Growth",
        "slug": "indias-clean-energy-smart-grid-expansion",
        "excerpt": "Government initiatives and utility-scale solar installations drive unprecedented demand for high-efficiency power transformers and precision CRGO core solutions.",
        "content": """
<h2>Green Infrastructure on the Rise</h2>
<p>India's ambitious target of achieving 500 GW of non-fossil energy capacity by 2030 has created record demand for state-of-the-art power distribution infrastructure.</p>

<h3>Why Transformer Efficiency Matters</h3>
<p>Solar and wind generation plants operate with significant harmonic variations. To ensure zero loss during transmission, modern solar parks mandate BIS-compliant inverter duty transformers and laser-scribed CRGO steel cores.</p>
<p>Manufacturers who produce step-lap stacked laminations with ultra-low watt loss are positioning themselves at the forefront of the green grid revolution.</p>
""",
        "featured_image": "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
        "author_name": "Industry Watch",
        "tags": ["Clean Energy", "Transformers", "Infrastructure", "India 2026"],
        "read_time_minutes": 3,
        "is_trending": False,
        "is_featured": True,
    }
]


class Command(BaseCommand):
    help = "Seed initial blog categories and articles."

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Seeding Blog & News Studio data..."))
        cats_created = 0
        posts_created = 0

        for c_data in CATEGORIES_DATA:
            cat, created = BlogCategory.objects.get_or_create(
                slug=c_data["slug"],
                defaults=c_data
            )
            if created:
                cats_created += 1

        for p_data in INITIAL_POSTS:
            cat_slug = p_data.pop("category_slug")
            category = BlogCategory.objects.get(slug=cat_slug)
            title = p_data["title"]
            if not BlogPost.objects.filter(title=title).exists():
                BlogPost.objects.create(category=category, **p_data)
                posts_created += 1

        self.stdout.write(
            self.style.SUCCESS(f"Blog seeded: {cats_created} categories, {posts_created} posts!")
        )
