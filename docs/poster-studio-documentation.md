# Poster Design Studio - Technical & Architectural Documentation

## 1. Overview
The **Poster Design Studio** is an integrated module within the Digital Services Platform enabling customers across India to discover, customize, and request high-impact posters for diverse cultural, political, educational, and business occasions.

Initially, designs are professionally assembled and styled by the platform administrators using modern design tools (Canva, AI design workflows, typography engines). The underlying architecture is engineered with decoupled JSON metadata fields to allow future integration of an interactive canvas editor (e.g. Fabric.js / React-Konva) without schema migration or breaking backward compatibility.

---

## 2. Poster Categories
1. **Panchayat & Community Posters (`panchayat-community`)**: Candidate introduction banners, Gram Sabha development notices, Swachh Bharat cleanliness drives, and public welfare announcements. Fully compliant with verified election regulations.
2. **Birthday & Anniversary (`birthday-anniversary`)**: Royal gold balloon banners, silver jubilee couple portraits, and kid-themed birthday posters with Hindi/English blessings.
3. **Business Advertisement (`business-advertisement`)**: Grand opening flyers, festival discount announcements, retail promotions, and restaurant menu highlights.
4. **Festival Posters (`festival-posters`)**: Deepawali, Rangotsav (Holi), Eid, Independence Day, Republic Day, and religious greetings.
5. **Wedding & Events (`wedding-events`)**: Royal Indian Vivah Nimantran Patra with Lord Ganesha motifs, modern pastel ring ceremony invites, and spiritual Katha/Satsang notices.
6. **Education (`education`)**: School admission open flyers, coaching institute target batches (IIT/NEET), and meritorious toppers felicitation showcases.

---

## 3. Database Models & Schema

### `PosterCategory`
- `name`: String (unique)
- `slug`: SlugField (unique)
- `description`: Text
- `image`: ImageField (upload_to='poster_studio/categories/')
- `is_active`: Boolean
- `display_order`: PositiveIntegerField
- `created_at` / `updated_at`: DateTime

### `PosterTemplate`
- `category`: ForeignKey to `PosterCategory`
- `name`: String
- `slug`: SlugField (unique)
- `description`: Text
- `preview_image`: ImageField
- `starting_price`: DecimalField (e.g., ₹79.00 - ₹199.00)
- `supported_languages`: JSONField (e.g. `["Hindi", "English", "Both"]`)
- `supported_sizes`: JSONField (e.g. `["WhatsApp", "Instagram Post", "A4"]`)
- `canvas_metadata`: JSONField (Extensible JSON structure reserved for interactive online canvas editor)
- `is_featured`: Boolean
- `is_active`: Boolean
- `display_order`: PositiveIntegerField

### `PosterOrder`
- `public_reference`: String (e.g. `PST-A1B2C3D4`, collision-resistant non-sequential token)
- `customer_name`: String
- `email`: EmailField
- `phone`: String
- `customer_type`: Choices (`INDIVIDUAL`, `BUSINESS`)
- `category`: ForeignKey to `PosterCategory`
- `template`: Nullable ForeignKey to `PosterTemplate`
- `heading`: String
- `content`: Text (Hindi / English body content, slogans, program dates)
- `language`: Choices (`HINDI`, `ENGLISH`, `BOTH`)
- `colour_preference`: String
- `custom_instructions`: Text
- `output_size`: Choices (`WHATSAPP`, `INSTAGRAM_POST`, `INSTAGRAM_STORY`, `A4`, `CUSTOM`)
- `output_format`: Choices (`JPG`, `PNG`, `PDF`)
- `budget`: String
- `required_delivery_date`: String
- `revisions_requested_count`: Integer
- `status`: Workflow choices (`NEW` -> `REVIEWING` -> `QUOTED` -> `APPROVED` -> `IN_PROGRESS` -> `PREVIEW_SHARED` -> `REVISION_REQUESTED` -> `DELIVERED` -> `COMPLETED`)
- `quoted_price`: Nullable DecimalField
- `admin_notes`: Text
- `privacy_consent`: Boolean

### `PosterAsset`
- `poster_order`: ForeignKey to `PosterOrder`
- `file`: FileField (upload_to='poster_studio/order_assets/')
- `original_filename`: String
- `asset_type`: Choices (`CUSTOMER_PHOTO`, `BUSINESS_LOGO`, `REFERENCE_IMAGE`)
- `uploaded_at`: DateTime

### `PosterRevision`
- `poster_order`: ForeignKey to `PosterOrder`
- `revision_number`: Integer
- `customer_feedback`: Text
- `admin_notes`: Text
- `preview_file`: Nullable FileField
- `status`: Choices (`REQUESTED`, `IN_REVIEW`, `RESOLVED`)
- `created_at`: DateTime

### `PosterDeliverable`
- `poster_order`: ForeignKey to `PosterOrder`
- `title`: String
- `description`: Text
- `file`: FileField (upload_to='poster_studio/deliverables/')
- `output_format`: String
- `created_at`: DateTime

---

## 4. API Reference

### Public Customer Endpoints
- `GET /api/v1/posters/categories/` - List all active poster categories.
- `GET /api/v1/posters/templates/` - List active templates (supports `?category=<slug_or_id>&featured=true&search=<query>`).
- `GET /api/v1/posters/templates/<slug>/` - Retrieve full template details by slug.
- `POST /api/v1/posters/orders/` - Submit custom poster request (`multipart/form-data`) with multiple file attachments (`customer_photos`, `business_logos`, `reference_images`).
- `GET /api/v1/posters/orders/<reference>/?email=<email>` - Secure order status lookup.

### Admin Endpoints (Require `IsAdminUser`)
- `GET /api/v1/admin/posters/orders/` - Query and filter all incoming customer poster requests.
- `GET, PUT, PATCH /api/v1/admin/posters/orders/<reference>/` - Order inspection and notes update.
- `POST /api/v1/admin/posters/orders/<reference>/status/` - Advance order lifecycle status (`QUOTED`, `IN_PROGRESS`, `COMPLETED`, etc.) and set quotation price.
- `POST /api/v1/admin/posters/orders/<reference>/deliverables/` - Upload final high-resolution deliverable file.

---

## 5. Frontend Pages
- `/poster-studio` - Studio landing page with hero showcase, benefits, category cards, pricing tiers, workflow, and FAQs.
- `/poster-studio/categories` - Occasions and category showcase.
- `/poster-studio/templates` - Searchable and filterable template gallery with starting price indicators.
- `/poster-studio/templates/:slug` - Single template view with dimensions and languages.
- `/poster-studio/order` - Comprehensive multi-section order form with live upload progress.
- `/poster-studio/order-success` - Confirmation screen with one-click copyable reference code and next steps.
