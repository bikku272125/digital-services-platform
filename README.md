# Digital Services Platform Architecture & Setup Guide

## 1. Overview
The **Digital Services Platform** is a full-stack on-demand service delivery system built using:
- **Frontend**: React (Vite), React Router v6, Tailwind CSS, Axios, Lucide React icons.
- **Backend**: Python 3.14+, Django 5.2, Django REST Framework, django-cors-headers, Pillow.
- **Database**: SQLite (local development), PostgreSQL-compatible (production via Django ORM).
- **Primary Market**: India (INR ₹).

## 2. API Specification
Base URL: `/api/v1/`

### Public Endpoints
- `GET /api/v1/categories/`: List active service categories.
- `GET /api/v1/services/`: List active services (supports `?category=<slug>`, `?featured=true`, `?search=<term>`).
- `GET /api/v1/services/{slug}/`: Retrieve service detail including deliverables, starting price, and client requirements.
- `POST /api/v1/requests/`: Create guest service request with multipart file attachments. Returns server-generated `public_reference` (e.g. `REQ-XXXXXXXX`) and secure `access_token`.
- `GET /api/v1/requests/status/?ref={ref}&token={token}`: Minimal guest lookup for request status.

### Admin Endpoints (Require Authentication & IsAdminUser)
- `GET /api/v1/admin/requests/`: List and search incoming requests.
- `GET /api/v1/admin/requests/{id}/`: Retrieve request details and attachments.
- `PATCH /api/v1/admin/requests/{id}/`: Update request status.
- `POST /api/v1/admin/requests/{id}/quotes/`: Create quotation with amount, scope, and revision limits.
- `PATCH /api/v1/admin/quotes/{id}/`: Edit quote.
- `POST /api/v1/admin/quotes/{id}/send/`: Mark quote as SENT (updates request status to QUOTED).
- `POST /api/v1/admin/quotes/{id}/accept/`: Record acceptance and auto-instantiate linked Order.
- `GET /api/v1/admin/orders/`: List orders.
- `GET /api/v1/admin/orders/{id}/`: Order details, deliverables, internal notes, and payments.
- `POST /api/v1/admin/orders/{id}/payments/`: Record verified manual payment (UPI/NEFT) and auto-recalculate payment status.
- `POST /api/v1/admin/orders/{id}/deliverables/`: Register downloadable deliverable files or live links.
- `POST /api/v1/admin/orders/{id}/notes/`: Internal administration notes.

## 3. Running Locally

### Backend
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_services
python manage.py runserver 8000
```
Default admin credentials: `admin` / `admin1234`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:3000`
