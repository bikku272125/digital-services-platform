import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { serviceAPI } from '../api/client';
import { ServiceCard } from '../components/Cards';
import { LoadingSpinner, ErrorMessage } from '../components/UIComponents';
import {
  Code2,
  Palette,
  FileSpreadsheet,
  Bot,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featuredServices, setFeaturedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const [catRes, featRes] = await Promise.all([
          serviceAPI.getCategories(),
          serviceAPI.getServices({ featured: true }),
        ]);
        setCategories(catRes.data || []);
        setFeaturedServices(featRes.data.results || featRes.data || []);
      } catch (err) {
        setError(err.message || 'Unable to load services catalog.');
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const categoryIcons = {
    'website-and-development': <Code2 className="w-6 h-6 text-indigo-600" />,
    'design-and-branding': <Palette className="w-6 h-6 text-pink-600" />,
    'marketing-and-content': <Sparkles className="w-6 h-6 text-amber-600" />,
    'data-and-office-work': <FileSpreadsheet className="w-6 h-6 text-emerald-600" />,
    'ai-and-automation': <Bot className="w-6 h-6 text-purple-600" />,
    'custom-digital-requests': <Layers className="w-6 h-6 text-blue-600" />,
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 pt-20 pb-24 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-100/70 border border-indigo-200 text-indigo-800 text-xs font-semibold tracking-wide">
              <span>Verified On-Demand Digital Studio</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
              <span>Scope-Based Transparent Quotations</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Your Digital Work, <br />
              <span className="text-indigo-600">Taken Care Of.</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Websites, creative design, data work and AI solutions — all in one place. No lengthy recruitment cycles or bloated agency overhead.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/request"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold text-base hover:bg-indigo-700 transition shadow-sm hover:shadow-md flex items-center justify-center"
              >
                Request a Service
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/services"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white text-slate-700 font-semibold text-base border border-slate-300 hover:bg-slate-50 transition flex items-center justify-center"
              >
                Explore Services
              </Link>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Transparent quotes upfront</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Direct engineer & designer communication</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Revisions included in scope</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Service Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">Capabilities</h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Comprehensive Digital Solutions
          </p>
          <p className="text-slate-600 text-sm mt-2">
            Select a category to view specialized services, deliverables, and estimated timelines.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading catalog..." />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/services?category=${cat.slug}`}
                className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-indigo-50 border border-slate-200/80 group-hover:border-indigo-200 flex items-center justify-center mb-4 transition">
                    {categoryIcons[cat.slug] || <Layers className="w-6 h-6 text-indigo-600" />}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {cat.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                  <span>Explore services</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 3. How It Works Section */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">How It Works</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              Simple, Transparent 4-Step Process
            </p>
            <p className="text-slate-400 text-sm mt-2">
              From requirement submission to final delivery — no ambiguity, no unexpected charges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Submit Requirements',
                desc: 'Fill out our quick guest request form with your project details, timeline, and any reference files.',
              },
              {
                step: '02',
                title: 'Review Quotation',
                desc: 'We evaluate your request and send a detailed scope of work, exact timeline, and transparent INR price.',
              },
              {
                step: '03',
                title: 'Execution & Updates',
                desc: 'Work begins after agreed starting terms. You get direct progress updates via email or WhatsApp.',
              },
              {
                step: '04',
                title: 'Final Delivery & Review',
                desc: 'Receive your deliverables, inspect everything with included revision rounds, and sign off.',
              },
            ].map((item, idx) => (
              <div key={idx} className="relative p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-3xl font-black text-indigo-400 block mb-3 font-mono">{item.step}</span>
                <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/how-it-works"
              className="inline-flex items-center text-xs font-semibold text-indigo-300 hover:text-white transition"
            >
              Read full workflow guide & policies <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Featured Services */}
      {featuredServices.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">Popular Picks</h2>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Featured Digital Packages
              </p>
            </div>
            <Link
              to="/services"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 mt-2 md:mt-0 flex items-center"
            >
              Browse all catalog <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredServices.slice(0, 6).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Why Choose Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">Why Work With Us</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Genuine Service Benefits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base">Direct Senior Execution</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No inexperienced junior pass-throughs. Every task is planned and reviewed directly by skilled engineers and designers.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base">Direct Scope Quotes</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Marketplaces take 20%+ cuts and cause miscommunication. We review your exact brief and deliver a straightforward, transparent quotation.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base">Guaranteed Delivery Milestones</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear deadlines committed before work starts, with safe staging links, deliverables verification, and included revision cycles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-700 to-indigo-900 text-white p-8 sm:p-12 text-center shadow-lg">
          <h2 className="text-3xl font-extrabold mb-4">Ready to get your project moving?</h2>
          <p className="text-indigo-200 text-sm max-w-xl mx-auto mb-8">
            Describe what you need in 2 minutes. We’ll review your request, assess requirements, and reply with a clear quote.
          </p>
          <Link
            to="/request"
            className="inline-flex items-center px-8 py-3.5 rounded-xl bg-white text-indigo-950 font-bold text-sm hover:bg-indigo-50 transition shadow"
          >
            Request a Service Now
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
