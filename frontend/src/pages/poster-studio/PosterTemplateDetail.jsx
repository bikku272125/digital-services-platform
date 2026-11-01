import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Palette,
  Maximize2,
  Globe,
  FileText,
  ArrowRight
} from 'lucide-react';
import { posterAPI } from '../../api/client';
import { getVisualForCategory } from './posterData';

export default function PosterTemplateDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    posterAPI.getTemplateBySlug(slug)
      .then((res) => {
        setTemplate(res.data);
      })
      .catch((err) => {
        setError('Template not found or has been removed.');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-bold mb-2">Template Not Found</h3>
          <p className="text-sm text-slate-500 mb-6">{error || 'This template is not available.'}</p>
          <Link
            to="/poster-studio/templates"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition"
          >
            Back to Templates
          </Link>
        </div>
      </div>
    );
  }

  const visual = getVisualForCategory(template.category_slug);

  const defaultSizes = [
    'WhatsApp DP & Status (1:1 / 4:5)',
    'Instagram Post (1080 x 1080)',
    'Instagram Story / Reel Cover (1080 x 1920)',
    'A4 Printable Poster (300 DPI)',
    'Custom Banner Dimensions'
  ];

  const sizes = template.supported_sizes && template.supported_sizes.length > 0
    ? template.supported_sizes
    : defaultSizes;

  const languages = template.supported_languages && template.supported_languages.length > 0
    ? template.supported_languages
    : ['Hindi (हिंदी)', 'English', 'Both (Bilingual)'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Templates</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Preview Image */}
          <div className="lg:col-span-6">
            <div className="sticky top-24 space-y-4">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-xl group">
                <img
                  src={visual.sampleImage}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                <div className="absolute top-4 left-4">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white backdrop-blur-md shadow">
                    {template.category_name}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-xs font-mono uppercase text-indigo-300">Live Sample Design</div>
                  <div className="text-lg font-bold">{template.name}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-3 text-xs text-indigo-700 dark:text-indigo-300">
                <Sparkles className="w-4 h-4 shrink-0 text-indigo-500" />
                <span>
                  Our designers will customize this exact layout with your personal photo, shop logo, Hindi/English headlines and chosen color scheme.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Template Info & Order CTA */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
                <span>{template.category_name}</span>
                <span>•</span>
                <span>Template Details</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {template.name}
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-base mt-3 leading-relaxed">
                {template.description}
              </p>
            </div>

            {/* Price Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-500">Starting Price</div>
                  <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                    ₹{parseFloat(template.starting_price || 99).toFixed(0)}
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
                  Inclusive of revisions
                </span>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
                <Link
                  to={`/poster-studio/order?template=${template.id}&category=${template.category}`}
                  className="flex-1 py-3.5 px-6 rounded-xl font-bold text-center text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                >
                  <span>Select This Template & Customize</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Available Dimensions */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <Maximize2 className="w-4 h-4 text-indigo-600" />
                <span>Available Dimensions & Formats</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {sizes.map((s, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Supported Languages */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <Globe className="w-4 h-4 text-indigo-600" />
                <span>Supported Content Languages</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {languages.map((lang, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 text-xs">
                <Clock className="w-4 h-4 text-indigo-600 mb-1" />
                <div className="font-bold">Fast Turnaround</div>
                <div className="text-slate-500">Preview delivered in hours</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
                <div className="font-bold">100% Satisfaction</div>
                <div className="text-slate-500">Includes free design revisions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
