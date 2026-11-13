import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Download,
  HelpCircle
} from 'lucide-react';
import { waasAPI } from '../../api/client';

export default function PricingPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    waasAPI.getPackages()
      .then(res => setPackages(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-200 dark:border-indigo-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent Annual Subscription Plans</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Website-as-a-Service Pricing
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg mt-3">
            Everything your business needs: ready-made design, cloud hosting, free subdomain or custom domain, annual maintenance, and complete 100% data portability.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-slate-400">Loading pricing plans...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {packages.map((pkg) => {
              const isPopular = pkg.is_popular;
              return (
                <div
                  key={pkg.id}
                  className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                    isPopular
                      ? 'bg-slate-900 text-white shadow-2xl border-2 border-indigo-500 scale-105 z-10'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                      Most Popular Plan
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-bold">{pkg.name}</h3>
                    <p className={`text-xs mt-2 line-clamp-2 leading-relaxed ${isPopular ? 'text-slate-300' : 'text-slate-500'}`}>
                      {pkg.tagline}
                    </p>

                    <div className="mt-6 mb-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl font-black">
                          ₹{Number(pkg.price_inr).toLocaleString('en-IN')}
                        </span>
                        <span className={`text-xs font-medium ${isPopular ? 'text-slate-300' : 'text-slate-400'}`}>
                          /{pkg.billing_period}
                        </span>
                      </div>
                      <p className={`text-[11px] mt-1 ${isPopular ? 'text-indigo-300' : 'text-indigo-600 font-semibold'}`}>
                        Includes Hosting & SSL Certificate
                      </p>
                    </div>

                    {/* Features list */}
                    <div className="space-y-3 pt-2">
                      {pkg.features && pkg.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isPopular ? 'text-indigo-400' : 'text-indigo-600'}`} />
                          <span className={isPopular ? 'text-slate-200' : 'text-slate-600 dark:text-slate-300'}>
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <Link
                      to={`/order-website?package=${pkg.id}`}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm ${
                        isPopular
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                          : 'bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                      }`}
                    >
                      <span>Choose {pkg.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Portability & Multi-Tenancy Guarantee Notice */}
        <div className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shrink-0">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">100% Website Portability</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                You own your content and code. Export your entire website (HTML, CSS, media, database dump) in a clean ZIP file at any time.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shrink-0">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Free Subdomain or Custom Domain</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Launch instantly on yourname.aaradhyaenertech.com or connect your registered .com or .in domain with automated SSL.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Managed Backups & Updates</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Zero server headache. We handle cloud uptime, CDN caching, security patching, and annual renewal management for you.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
