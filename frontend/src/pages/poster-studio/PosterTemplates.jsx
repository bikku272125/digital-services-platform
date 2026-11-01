import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Eye,
  ArrowRight,
  Layers,
  Sparkles,
  Tag,
  CheckCircle,
  X
} from 'lucide-react';
import { posterAPI } from '../../api/client';
import { getVisualForCategory } from './posterData';

export default function PosterTemplates() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    posterAPI.getCategories()
      .then((res) => setCategories(res.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (selectedCategory) params.category = selectedCategory;
    if (searchQuery) params.search = searchQuery;

    posterAPI.getTemplates(params)
      .then((res) => {
        setTemplates(res.data || []);
      })
      .catch((err) => {
        console.error('Failed to load templates', err);
      })
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery]);

  const handleCategoryFilter = (slug) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug) {
      newParams.set('category', slug);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set('search', val);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title & Filters Bar */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
            <span>Poster Design Studio</span>
            <span>•</span>
            <span>Template Gallery</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Browse Poster Templates
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            Select an occasion-specific template below to customize with your own text, photos, and slogans.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search templates, festivals, election..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              <button
                onClick={() => handleCategoryFilter('')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                  !selectedCategory
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id || cat.slug}
                  onClick={() => handleCategoryFilter(cat.slug)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                    selectedCategory === cat.slug
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {(selectedCategory || searchQuery) && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <div>
                Showing results for {selectedCategory && <span className="font-semibold text-indigo-600">"{selectedCategory}"</span>} {searchQuery && <span>query "{searchQuery}"</span>}
              </div>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-red-500 hover:text-red-600 font-medium"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear Filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : templates.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-lg mx-auto">
            <Layers className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Templates Found</h3>
            <p className="text-sm text-slate-500 mt-1">
              We couldn't find templates matching your filters. You can always submit a custom poster request directly.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                Reset Filters
              </button>
              <Link
                to="/poster-studio/order"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Custom Request
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => {
              const visual = getVisualForCategory(template.category_slug);

              return (
                <div
                  key={template.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={visual.sampleImage}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent"></div>

                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white backdrop-blur-md shadow">
                        {template.category_name}
                      </span>
                    </div>

                    {template.is_featured && (
                      <div className="absolute top-3 right-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white shadow flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Featured
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-bold text-lg line-clamp-1">{template.name}</h3>
                      <p className="text-xs text-slate-200 line-clamp-2 mt-1">{template.description}</p>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(template.supported_languages || ['Hindi', 'English']).map((lang, lIdx) => (
                        <span key={lIdx} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {lang}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-500">Starting At</div>
                        <div className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                          ₹{parseFloat(template.starting_price || 99).toFixed(0)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/poster-studio/templates/${template.slug}`}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/poster-studio/order?template=${template.id}&category=${template.category}`}
                          className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                        >
                          Select Template
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
