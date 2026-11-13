import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Globe,
  ExternalLink,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Code2,
  Layers,
  GraduationCap,
  Activity,
  Building2,
  ShoppingBag,
  Utensils,
  UserCheck,
  Briefcase,
  Search
} from 'lucide-react';
import { waasAPI } from '../../api/client';

const ICON_MAP = {
  GraduationCap,
  Activity,
  Building2,
  ShoppingBag,
  Utensils,
  UserCheck,
  Briefcase,
  Code2,
  Globe,
};

export default function TemplatesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    window.scrollTo(0, 0);
    waasAPI.getCategories()
      .then(res => setCategories(res.data || []))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (selectedCategory) params.category = selectedCategory;

    waasAPI.getTemplates(params)
      .then(res => {
        const data = res.data?.results || res.data || [];
        setTemplates(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const handleCategorySelect = (slug) => {
    const next = new URLSearchParams(searchParams);
    if (slug) {
      next.set('category', slug);
    } else {
      next.delete('category');
    }
    setSearchParams(next);
  };

  const filteredTemplates = templates.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-200 dark:border-indigo-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Turnkey Website Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Ready-to-Deploy Website Templates
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg mt-3">
            Choose a professionally designed architecture for your school, hospital, business or restaurant. Deployed live with high-speed hosting and custom domain support in 24–48 hours.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search templates (e.g. school, clinic, cafe)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-sm"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          <button
            onClick={() => handleCategorySelect('')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-2 ${
              !selectedCategory
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>All Categories</span>
          </button>
          {categories.map((cat) => {
            const Icon = ICON_MAP[cat.icon_name] || Globe;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-2 ${
                  selectedCategory === cat.slug
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-slate-400">Loading website templates...</p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 max-w-lg mx-auto">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold">No templates found</h3>
            <p className="text-xs text-slate-500 mt-1">Try another category or request a fully custom website development.</p>
            <Link
              to="/pricing"
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition"
            >
              <span>Explore Custom Development</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Thumbnail Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={template.thumbnail_url}
                    alt={template.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur text-white text-[10px] font-black uppercase tracking-wider">
                      {template.category_name}
                    </span>
                    {template.is_featured && (
                      <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider">
                        Popular
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 transition">
                      {template.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {template.description}
                    </p>

                    {/* Features Checklist */}
                    {template.features && template.features.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                        {template.features.slice(0, 3).map((f, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                    <Link
                      to={`/order-website?template=${template.id}`}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs text-center transition shadow-sm hover:shadow"
                    >
                      Choose This Template
                    </Link>
                    <Link
                      to={`/order-website?template=${template.id}&mode=preview`}
                      className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:border-indigo-500 transition flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Banner */}
        <div className="mt-16 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-indigo-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black">Need a Completely Custom Website?</h3>
            <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
              Have unique workflow requirements, customized APIs, student portals or payment flows? We build bespoke web applications starting from ₹15,000.
            </p>
          </div>
          <Link
            to="/order-website?mode=custom"
            className="px-6 py-3.5 rounded-2xl bg-white text-indigo-900 font-extrabold text-xs uppercase tracking-wider hover:bg-indigo-50 transition shadow-lg shrink-0"
          >
            Request Custom Development
          </Link>
        </div>

      </div>
    </div>
  );
}
