import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { serviceAPI } from '../api/client';
import { formatINR } from '../utils/formatters';
import { LoadingSpinner, ErrorMessage } from '../components/UIComponents';
import {
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true);
        const res = await serviceAPI.getServiceBySlug(slug);
        setService(res.data);
      } catch (err) {
        setError(err.message || 'Service not found.');
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [slug]);

  if (loading) return <LoadingSpinner message="Loading service details..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!service) return null;

  // Format deliverables into bullets if plain text
  const deliverablesList = service.deliverables
    ? service.deliverables.split('\n').filter((line) => line.trim().length > 0)
    : [];

  const requirementsList = service.customer_requirements
    ? service.customer_requirements.split('\n').filter((line) => line.trim().length > 0)
    : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-slate-800">Home</Link>
        <span>/</span>
        <Link to="/services" className="hover:text-slate-800">Services</Link>
        <span>/</span>
        <span className="text-slate-800 font-medium">{service.name}</span>
      </nav>

      {/* Main Header & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="inline-block px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold">
            {service.category?.name}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {service.name}
          </h1>

          <p className="text-base text-slate-600 leading-relaxed">
            {service.full_description || service.short_description}
          </p>

          {/* Key Deliverables */}
          {deliverablesList.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" />
                Included Deliverables
              </h3>
              <ul className="space-y-2.5">
                {deliverablesList.map((item, idx) => (
                  <li key={idx} className="flex items-start text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 mr-3 shrink-0"></span>
                    <span>{item.replace(/^[•\-*]\s*/, '')}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* What We Need From You */}
          {requirementsList.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center">
                <FileText className="w-4 h-4 text-indigo-500 mr-2" />
                Customer Requirements to Begin
              </h3>
              <ul className="space-y-2.5">
                {requirementsList.map((item, idx) => (
                  <li key={idx} className="flex items-start text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 mr-3 shrink-0"></span>
                    <span>{item.replace(/^[•\-*]\s*/, '')}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Pricing & CTA Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-medium block">
                Pricing Structure
              </span>
              <div className="text-xl font-extrabold text-slate-900 mt-1">
                Custom Scope & Quote
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Pricing is determined based on your specific requirements and deliverables.
              </p>
            </div>

            {service.estimated_delivery_text && (
              <div className="flex items-center text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <Clock className="w-4 h-4 text-indigo-600 mr-2 shrink-0" />
                <span>Typical Turnaround: <strong>{service.estimated_delivery_text}</strong></span>
              </div>
            )}

            <Link
              to={`/request?category=${service.category?.id}&service=${service.id}`}
              className="w-full flex items-center justify-center px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition shadow-sm"
            >
              Request This Service
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Zero registration required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Includes revision rounds</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Secure guest request reference</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-800 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Scope & Pricing Disclaimer: Advertised prices are baseline benchmarks. You will receive an exact quote based on your detailed brief before any payment.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
