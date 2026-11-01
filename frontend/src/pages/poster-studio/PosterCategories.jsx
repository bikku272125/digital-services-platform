import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Palette, Sparkles, Filter } from 'lucide-react';
import { posterAPI } from '../../api/client';
import { getVisualForCategory } from './posterData';

export default function PosterCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    posterAPI.getCategories()
      .then((res) => {
        setCategories(res.data || []);
      })
      .catch((err) => {
        console.error('Failed to load poster categories', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
            <span>Poster Design Studio</span>
            <span>•</span>
            <span>All Categories</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Explore Poster Categories
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg mt-3">
            Choose from a wide variety of specialized poster categories crafted for social, political, festival, business, and educational occasions.
          </p>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat) => {
              const visual = getVisualForCategory(cat.slug);
              const IconComp = visual.icon;

              return (
                <div
                  key={cat.id || cat.slug}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={visual.sampleImage}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent"></div>

                    <div className="absolute top-4 left-4">
                      <div className={`p-2.5 rounded-xl backdrop-blur-md bg-white/90 dark:bg-slate-900/90 shadow text-indigo-600 dark:text-indigo-400`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                        {visual.badge}
                      </span>
                      <h3 className="text-xl font-bold mt-1.5">{cat.name}</h3>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {cat.description || visual.tagline}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {visual.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <Link
                        to={`/poster-studio/templates?category=${cat.slug}`}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        Browse Templates
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        to={`/poster-studio/order?category=${cat.id}`}
                        className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                      >
                        Order Poster
                      </Link>
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
