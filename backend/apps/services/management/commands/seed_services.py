from django.core.management.base import BaseCommand
from apps.services.models import ServiceCategory, Service
from decimal import Decimal

class Command(BaseCommand):
    help = 'Seeds initial service categories and services based on Master Project Prompt'

    def handle(self, *args, **options):
        categories_data = [
            {
                'name': 'Website and Development',
                'slug': 'website-and-development',
                'description': 'High performance business websites, custom landing pages, web apps, API development and ongoing maintenance.',
                'display_order': 1,
                'services': [
                    {
                        'name': 'Business Website Development',
                        'slug': 'business-website-development',
                        'short_description': 'Professional, responsive multi-page website tailored for companies, agencies, and local businesses.',
                        'full_description': 'Get an elegant, fast-loading, SEO-ready business website built with modern tools. Includes responsive layout for mobile, tablet, and desktop, contact forms, service showcases, and clean brand typography.',
                        'deliverables': '• Up to 5 custom-designed responsive pages\n• Fast loading speed & SEO optimization\n• Contact form with email notifications\n• Cross-device and cross-browser testing\n• 30 days post-launch support',
                        'customer_requirements': '• Company branding assets (logo, brand colors)\n• Page copy and image assets (or brief for draft copy)\n• Domain and hosting credentials (if already purchased)',
                        'starting_price': Decimal('14999.00'),
                        'estimated_delivery_text': '7-10 business days',
                        'is_featured': True,
                        'display_order': 1,
                    },
                    {
                        'name': 'High-Converting Landing Page',
                        'slug': 'high-converting-landing-page',
                        'short_description': 'Single-page landing site designed specifically for ad campaigns, product launches, or lead capture.',
                        'full_description': 'Maximize lead conversions and campaign ROI with an intentional landing page focused on clear value proposition, social proof, and seamless call-to-actions.',
                        'deliverables': '• 1 responsive conversion-focused landing page\n• Hero section, benefits, proof points, FAQ & CTA\n• WhatsApp / Form lead capture integration\n• Analytics & pixel tracking setup',
                        'customer_requirements': '• Target audience details & main offer\n• Brand guidelines or logo\n• Desired action (form fill, WhatsApp, phone call)',
                        'starting_price': Decimal('7999.00'),
                        'estimated_delivery_text': '3-5 business days',
                        'is_featured': True,
                        'display_order': 2,
                    },
                    {
                        'name': 'Django & REST API Development',
                        'slug': 'django-rest-api-development',
                        'short_description': 'Scalable Python Django backend architectures, RESTful APIs, database design, and integrations.',
                        'full_description': 'Custom backend engineering using Django REST Framework. Ideal for mobile app backends, third-party webhook integrations, custom business logic, and database migrations.',
                        'deliverables': '• Clean Django REST Framework architecture\n• Relational database schema & migrations\n• Secure token / session authentication\n• API documentation & test suite',
                        'customer_requirements': '• Detailed specification or user stories\n• Preferred database & deployment target\n• Third-party API documentation if integrating external systems',
                        'starting_price': Decimal('19999.00'),
                        'estimated_delivery_text': '10-14 business days',
                        'is_featured': True,
                        'display_order': 3,
                    },
                    {
                        'name': 'Website Redesign & Speed Optimization',
                        'slug': 'website-redesign-speed-optimization',
                        'short_description': 'Modernize outdated designs, fix mobile responsiveness, and drastically improve page load speed.',
                        'full_description': 'Transform your clunky website into a sleek modern experience while boosting Google PageSpeed scores, image compression, and core web vitals.',
                        'deliverables': '• Modern UI/UX refresh\n• Mobile responsiveness audit & fix\n• Asset compression & caching implementation\n• Before/after performance benchmark report',
                        'customer_requirements': '• Existing website URL and codebase access\n• Key pain points with the current website',
                        'starting_price': Decimal('8999.00'),
                        'estimated_delivery_text': '4-6 business days',
                        'is_featured': False,
                        'display_order': 4,
                    },
                    {
                        'name': 'Website Maintenance & Bug Fixes',
                        'slug': 'website-maintenance-bug-fixes',
                        'short_description': 'On-demand debugging, layout fixes, script errors, security patching, and content updates.',
                        'full_description': 'Fix broken layouts, form submission errors, SSL issues, plugin conflicts, and ensure your web assets stay online and bug-free.',
                        'deliverables': '• Root-cause analysis and code fixes\n• Regression testing\n• Detailed fix summary report',
                        'customer_requirements': '• Specific bug description and reproduction steps\n• Code repository or hosting server access',
                        'starting_price': Decimal('2499.00'),
                        'estimated_delivery_text': '1-2 business days',
                        'is_featured': False,
                        'display_order': 5,
                    },
                ]
            },
            {
                'name': 'Design and Branding',
                'slug': 'design-and-branding',
                'description': 'Distinctive visual identities, marketing collateral, corporate decks, posters, and digital graphics.',
                'display_order': 2,
                'services': [
                    {
                        'name': 'Posters, Flyers & Digital Banners',
                        'slug': 'posters-flyers-digital-banners',
                        'short_description': 'Eye-catching graphic designs for business events, promotional campaigns, and social channels.',
                        'full_description': 'Professional print-ready and digital creatives created with precise visual hierarchy, clear messaging, and high-resolution export files.',
                        'deliverables': '• High-resolution print-ready PDF (CMYK)\n• Web-optimized PNG/JPG (RGB)\n• 2 distinct creative concept options\n• Source design files',
                        'customer_requirements': '• Exact text copy, dimensions, and preferred orientation\n• Brand logo and any specific imagery',
                        'starting_price': Decimal('1499.00'),
                        'estimated_delivery_text': '2-3 business days',
                        'is_featured': False,
                        'display_order': 1,
                    },
                    {
                        'name': 'Corporate Company Profile & Brochure',
                        'slug': 'company-profile-brochure',
                        'short_description': 'Structured corporate booklets, tri-fold brochures, and capability statements that win clients.',
                        'full_description': 'Polished multi-page corporate profile highlighting your company background, services, leadership, credentials, and contact information.',
                        'deliverables': '• 4-8 page corporate profile layout\n• Interactive clickable PDF version\n• Print-ready high-DPI export',
                        'customer_requirements': '• Company history, services list, team credentials\n• High-resolution logo and past project photos',
                        'starting_price': Decimal('4999.00'),
                        'estimated_delivery_text': '4-6 business days',
                        'is_featured': True,
                        'display_order': 2,
                    },
                    {
                        'name': 'Pitch Deck & Business Presentation',
                        'slug': 'pitch-deck-business-presentation',
                        'short_description': 'Persuasive presentation decks for investor pitches, sales meetings, and client proposals.',
                        'full_description': 'Turn boring bullet points into engaging, beautifully formatted visual slides using PowerPoint, Keynote, or Google Slides.',
                        'deliverables': '• 10-15 professionally styled slides\n• Custom charts, iconography, and layout\n• Editable PowerPoint/Keynote file + PDF',
                        'customer_requirements': '• Slide draft or outline of points\n• Brand guidelines and logo',
                        'starting_price': Decimal('3999.00'),
                        'estimated_delivery_text': '3-5 business days',
                        'is_featured': False,
                        'display_order': 3,
                    },
                    {
                        'name': 'Logo & Basic Brand Identity Kit',
                        'slug': 'logo-brand-identity-kit',
                        'short_description': 'Clean, memorable logos paired with color palettes, typography rules, and usage guides.',
                        'full_description': 'Foundational visual branding designed to position your venture credibly and consistently across web, social, and print.',
                        'deliverables': '• 3 original logo concepts\n• Primary logo, monochrome & favicon variations\n• Vector files (SVG, AI/EPS) and PNGs\n• 1-page Brand Guideline sheet (colors, fonts)',
                        'customer_requirements': '• Business name, target audience, and preferred aesthetic (minimal, playful, corporate)',
                        'starting_price': Decimal('4499.00'),
                        'estimated_delivery_text': '4-5 business days',
                        'is_featured': False,
                        'display_order': 4,
                    },
                ]
            },
            {
                'name': 'Marketing and Content',
                'slug': 'marketing-and-content',
                'description': 'Strategic social media content, editorial calendars, campaign assets, and technical SEO basics.',
                'display_order': 3,
                'services': [
                    {
                        'name': 'Monthly Social Media Content Calendar',
                        'slug': 'monthly-social-media-content-calendar',
                        'short_description': '30 days of structured post ideas, captions, hashtags, and visual direction for LinkedIn & Instagram.',
                        'full_description': 'Never struggle with what to post. Get a strategically designed monthly calendar with content pillars, hooks, captions, call-to-actions, and design briefs.',
                        'deliverables': '• 12-20 ready-to-publish post captions & hooks\n• Hashtag research by niche\n• Visual suggestion notes for graphic designer',
                        'customer_requirements': '• Niche, target customer profile, and current profiles',
                        'starting_price': Decimal('3999.00'),
                        'estimated_delivery_text': '3-4 business days',
                        'is_featured': False,
                        'display_order': 1,
                    },
                    {
                        'name': 'Fundamental Website SEO Audit & Optimization',
                        'slug': 'website-seo-audit-optimization',
                        'short_description': 'On-page SEO configuration, meta tags, sitemaps, robots.txt, and keyword optimization.',
                        'full_description': 'Make your business discoverable on search engines. We inspect meta titles, headings, image alt texts, structured data, and Google Search Console indexing.',
                        'deliverables': '• Technical audit report of crawl errors\n• Optimization of 5 key target pages\n• XML sitemap & robots.txt verification\n• Search Console setup guide',
                        'customer_requirements': '• Website URL and target search terms',
                        'starting_price': Decimal('4999.00'),
                        'estimated_delivery_text': '4-6 business days',
                        'is_featured': False,
                        'display_order': 2,
                    },
                ]
            },
            {
                'name': 'Data and Office Work',
                'slug': 'data-and-office-work',
                'description': 'Excel spreadsheet cleanup, PDF-to-Excel conversion, formatted reports, and automated data entry.',
                'display_order': 4,
                'services': [
                    {
                        'name': 'Excel Data Cleanup & Formatting',
                        'slug': 'excel-data-cleanup-formatting',
                        'short_description': 'Clean messy spreadsheets, deduplicate rows, normalize columns, and build automated formulas.',
                        'full_description': 'Transform cluttered, inconsistent customer or product lists into structured, error-free Excel workbooks with VLOOKUP/XLOOKUP, conditional formatting, and pivot summaries.',
                        'deliverables': '• Cleaned and standardized Excel/CSV workbook\n• Automated formula configuration\n• Summary pivot dashboard',
                        'customer_requirements': '• Source files (Excel, CSV, or text dumps)\n• Expected output format instructions',
                        'starting_price': Decimal('1999.00'),
                        'estimated_delivery_text': '1-2 business days',
                        'is_featured': False,
                        'display_order': 1,
                    },
                    {
                        'name': 'PDF to Excel / Structured Data Extraction',
                        'slug': 'pdf-to-excel-data-extraction',
                        'short_description': 'Accurate extraction of bank statements, invoices, receipts, and tabular PDFs into spreadsheets.',
                        'full_description': 'Convert scanned or digital PDFs containing tables and records into editable, structured spreadsheets with verified line-item accuracy.',
                        'deliverables': '• Validated Excel (.xlsx) and CSV files\n• Cross-checked totals and row integrity',
                        'customer_requirements': '• Sample or batch of PDF files to be extracted',
                        'starting_price': Decimal('1499.00'),
                        'estimated_delivery_text': '1-2 business days',
                        'is_featured': False,
                        'display_order': 2,
                    },
                    {
                        'name': 'Repetitive Office Task Automation',
                        'slug': 'repetitive-office-task-automation',
                        'short_description': 'Custom Python scripts to automate repetitive file renaming, email report parsing, and data merging.',
                        'full_description': 'Save hours of manual effort every week. We build lightweight, executable Python automation scripts or Google Sheets automations tailored to your daily workflow.',
                        'deliverables': '• Standalone script or Google Apps Script\n• Quick start video / step-by-step user guide\n• Sample test run verification',
                        'customer_requirements': '• Step-by-step description of your current manual routine',
                        'starting_price': Decimal('3499.00'),
                        'estimated_delivery_text': '2-3 business days',
                        'is_featured': False,
                        'display_order': 3,
                    },
                ]
            },
            {
                'name': 'AI and Automation',
                'slug': 'ai-and-automation',
                'description': 'AI customer support chatbots, lead capture workflows, content pipelines, and business automations.',
                'display_order': 5,
                'services': [
                    {
                        'name': 'Custom Business FAQ Chatbot',
                        'slug': 'custom-business-faq-chatbot',
                        'short_description': 'AI-assisted web widget trained on your business documents to answer customer queries 24/7.',
                        'full_description': 'Empower your website visitors with instant answers about your pricing, services, timings, and policies, reducing routine inquiry emails.',
                        'deliverables': '• Embeddable web chatbot widget\n• Knowledge base configuration with your FAQs\n• Lead collection webhook to email or CRM',
                        'customer_requirements': '• Product/service documentation or list of common questions',
                        'starting_price': Decimal('8999.00'),
                        'estimated_delivery_text': '4-6 business days',
                        'is_featured': True,
                        'display_order': 1,
                    },
                    {
                        'name': 'Lead Capture & WhatsApp/Email Notification Flow',
                        'slug': 'lead-capture-automation-workflow',
                        'short_description': 'Instant automated notifications to your WhatsApp and email whenever a customer submits an inquiry.',
                        'full_description': 'Never lose a lead. Automate immediate lead notifications to your team, automated customer acknowledgment emails, and spreadsheet logging.',
                        'deliverables': '• Multi-channel notification pipeline\n• Automatic Google Sheet or CRM sync\n• Professional customer confirmation email template',
                        'customer_requirements': '• Notification destination numbers/emails\n• Existing form or site location',
                        'starting_price': Decimal('4499.00'),
                        'estimated_delivery_text': '2-3 business days',
                        'is_featured': False,
                        'display_order': 2,
                    },
                ]
            },
            {
                'name': 'Custom Digital Requests',
                'slug': 'custom-digital-requests',
                'description': 'Special projects, multi-disciplinary requirements, or digital problems that do not fit standard categories.',
                'display_order': 6,
                'services': [
                    {
                        'name': 'Custom Scope Digital Project',
                        'slug': 'custom-scope-digital-project',
                        'short_description': 'Tell us your exact requirement and get an individualized scope, timeline, and transparent quote.',
                        'full_description': 'Have a unique requirement combining coding, design, AI tooling, or data processing? Describe your goals and constraints. We will review your project and prepare a tailored action plan.',
                        'deliverables': '• Tailored proposal and technical scope\n• Milestone-based delivery timeline\n• Transparent quotation based on complexity',
                        'customer_requirements': '• Comprehensive overview of your project requirements and expected outcome',
                        'starting_price': None,
                        'estimated_delivery_text': 'Custom quotation',
                        'is_featured': True,
                        'display_order': 1,
                    }
                ]
            }
        ]

        for cat_info in categories_data:
            services_info = cat_info.pop('services')
            category, created = ServiceCategory.objects.update_or_create(
                slug=cat_info['slug'],
                defaults=cat_info
            )
            cat_action = "Created" if created else "Updated"
            self.stdout.write(self.style.SUCCESS(f"{cat_action} category: {category.name}"))

            for s_info in services_info:
                service, s_created = Service.objects.update_or_create(
                    slug=s_info['slug'],
                    category=category,
                    defaults=s_info
                )
                s_action = "Created" if s_created else "Updated"
                self.stdout.write(f"  └─ {s_action} service: {service.name}")

        self.stdout.write(self.style.SUCCESS("Successfully seeded categories and services!"))
