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
import BlogHome from './pages/blog/BlogHome';
import BlogPostDetail from './pages/blog/BlogPostDetail';
import NewsHome from './pages/news/NewsHome';
import TemplatesPage from './pages/websites/TemplatesPage';
import PricingPage from './pages/websites/PricingPage';
import OrderWebsitePage from './pages/websites/OrderWebsitePage';
import WebsiteStatusPage from './pages/websites/WebsiteStatusPage';
import TenantSiteRenderer from './pages/websites/TenantSiteRenderer';
import ClientAdminPortalPage from './pages/websites/ClientAdminPortalPage';
import PosterStudioLanding from './pages/poster-studio/PosterStudioLanding';
import PosterCategories from './pages/poster-studio/PosterCategories';
import PosterTemplates from './pages/poster-studio/PosterTemplates';
import PosterTemplateDetail from './pages/poster-studio/PosterTemplateDetail';
import PosterOrderForm from './pages/poster-studio/PosterOrderForm';
import PosterOrderSuccess from './pages/poster-studio/PosterOrderSuccess';
import PosterLiveEditor from './pages/poster-studio/PosterLiveEditor';

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
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="admin-dashboard" element={<AdminDashboardPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="terms-conditions" element={<TermsPage />} />
          <Route path="cancellation-refunds" element={<RefundPolicyPage />} />

          {/* In-depth Editorial Blog */}
          <Route path="blog" element={<BlogHome />} />
          <Route path="blog/:category/:slug" element={<BlogPostDetail />} />

          {/* Real-time Trending News Radar */}
          <Route path="news" element={<NewsHome />} />
          <Route path="news/:category/:slug" element={<BlogPostDetail />} />

          {/* Website-as-a-Service (WaaS) Modules */}
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="order-website" element={<OrderWebsitePage />} />
          <Route path="website-status" element={<WebsiteStatusPage />} />
          <Route path="client-portal" element={<ClientAdminPortalPage />} />
          <Route path="client-admin" element={<ClientAdminPortalPage />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        {/* Standalone Client Websites - Dedicated Full-Screen Outside RootLayout */}
        <Route path="drglobal" element={<TenantSiteRenderer />} />
        <Route path="drglobal/admin" element={<ClientAdminPortalPage />} />
        <Route path="yadavfancy" element={<TenantSiteRenderer />} />
        <Route path="yadavfancy/admin" element={<ClientAdminPortalPage />} />
        <Route path="sites/:subdomain" element={<TenantSiteRenderer />} />
        <Route path="sites/:subdomain/admin" element={<ClientAdminPortalPage />} />
        <Route path="school/:subdomain" element={<TenantSiteRenderer />} />
        <Route path="client/:subdomain" element={<TenantSiteRenderer />} />
      </Routes>
    </BrowserRouter>
  );
}
