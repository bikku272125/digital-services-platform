# Poster Design Studio - Flutter Mobile App

A cross-platform mobile application for Android & iOS built with Flutter, connected directly to the **Digital Services Platform Django REST API**.

---

## Features
- **Live WYSIWYG Poster Canvas**: Real-time rendering of election posters, birthday wishes, festival greetings, and business banners.
- **Hindi & English Typography**: Native support for Devanagari fonts via `google_fonts`.
- **Photo Integration**: Pick candidate portraits or shop logos from mobile Gallery or Camera.
- **Ultra-HD 300 DPI Export**: Uses `RepaintBoundary` (`pixelRatio: 3.0`) for crisp high-resolution image rendering.
- **Instant WhatsApp Sharing**: Share exported PNG directly to WhatsApp status and chats with 1-tap via `share_plus`.
- **Django REST API Connected**: Connects directly to `https://digital-services-platform-slnw.onrender.com/api/v1/posters/...` for categories, templates, and order dispatch.

---

## Getting Started

### 1. Requirements
- Flutter SDK (>= 3.0.0)
- Android Studio / Xcode

### 2. Install Dependencies
```bash
cd flutter_poster_app
flutter pub get
```

### 3. Run on Device or Emulator
```bash
flutter run
```

---

## Directory Structure
- `lib/models/poster_models.dart`: Category, Template, and Order models matching the Django backend schema.
- `lib/services/poster_api_service.dart`: HTTP API client with multipart file upload support.
- `lib/screens/flutter_poster_live_editor.dart`: Interactive live canvas, theme presets, photo upload, and HD rendering.
- `lib/main.dart`: App entry point with dark mode theme.
