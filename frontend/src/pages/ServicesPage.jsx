import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { serviceAPI } from '../api/client';
import { ServiceCard } from '../components/Cards';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../components/UIComponents';
import { Search, Filter, Sparkles, Layers, ArrowRight } from 'lucide-react';

export default function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'all';
  const [searchTerm, setSearchTerm] = useState('');

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const [catRes, servRes] = await Promise.all([
          serviceAPI.getCategories(),
          serviceAPI.getServices({
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            search: searchTerm || undefined,
          }),
        ]);
        setCategories(catRes.data || []);
        setServices(servRes.data.results || servRes.data || []);
      } catch (err) {
        setError(err.message || 'Unable to fetch services.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedCategory, searchTerm]);

  const handleCategorySelect = (slug) => {
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Services Catalog
        </h1>
        <p className="text-base text-slate-600">
          Browse our standardized offerings with deliverables, customer requirements, and estimated turnaround times.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by keyword, e.g. Excel, Django, Landing..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Services
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat.slug
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Services List / Grid */}
      {loading ? (
        <LoadingSpinner message="Fetching available services..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => handleCategorySelect(selectedCategory)} />
      ) : services.length === 0 ? (
        <EmptyState
          title="No services matched your query"
          description="Try modifying your keyword search or category filter. You can also request a custom project."
          action={
            <Link
              to="/request"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              Submit Custom Request
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}

      {/* Custom Request Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Don't see exactly what you need?</h3>
          <p className="text-xs text-slate-400">
            We handle specialized workflows, complex software integrations, and one-off assignments.
          </p>
        </div>
        <Link
          to="/request"
          className="shrink-0 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition flex items-center shadow"
        >
          Submit a Custom Brief <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </Link>
      </div>
    </div>
  );
}
