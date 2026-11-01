import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import RequestServicePage from './pages/RequestServicePage';
import HowItWorksPage from './pages/HowItWorksPage';
import PortfolioPage from './pages/PortfolioPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { PrivacyPolicyPage, TermsPage, RefundPolicyPage } from './pages/LegalPages';
import PosterStudioLanding from './pages/poster-studio/PosterStudioLanding';
import PosterCategories from './pages/poster-studio/PosterCategories';
import PosterTemplates from './pages/poster-studio/PosterTemplates';
import PosterTemplateDetail from './pages/poster-studio/PosterTemplateDetail';
import PosterOrderForm from './pages/poster-studio/PosterOrderForm';
import PosterOrderSuccess from './pages/poster-studio/PosterOrderSuccess';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="services/:slug" element={<ServiceDetailPage />} />
          <Route path="request" element={<RequestServicePage />} />
          <Route path="how-it-works" element={<HowItWorksPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="admin-dashboard" element={<AdminDashboardPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="terms-conditions" element={<TermsPage />} />
          <Route path="cancellation-refunds" element={<RefundPolicyPage />} />

          {/* Poster Design Studio Routes */}
          <Route path="poster-studio" element={<PosterStudioLanding />} />
          <Route path="poster-studio/categories" element={<PosterCategories />} />
          <Route path="poster-studio/templates" element={<PosterTemplates />} />
          <Route path="poster-studio/templates/:slug" element={<PosterTemplateDetail />} />
          <Route path="poster-studio/order" element={<PosterOrderForm />} />
          <Route path="poster-studio/order-success" element={<PosterOrderSuccess />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
