import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  TrendingUp,
  Clock,
  Eye,
  ArrowRight,
  Sparkles,
  Tag,
  BookOpen,
  Zap,
  Globe,
  Radio,
  ExternalLink,
  Flame,
  RefreshCw
} from 'lucide-react';
import { blogAPI } from '../../api/client';

export default function NewsHome() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [newsPosts, setNewsPosts] = useState([]);
  const [trendingPost, setTrendingPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    window.scrollTo(0, 0);
    blogAPI.getCategories()
      .then(res => setCategories(res.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { post_type: 'news' };
    if (selectedCategory) params.category = selectedCategory;
    if (searchQuery) params.search = searchQuery;

    blogAPI.getPosts(params)
      .then(res => {
        const data = res.data?.results || res.data || [];
        setNewsPosts(data);
        if (data.length > 0) {
          const topTrending = data.find(p => p.is_trending) || data[0];
          setTrendingPost(topTrending);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery]);

  const handleCategoryClick = (slug) => {
    const next = new URLSearchParams(searchParams);
    if (slug) {
      next.set('category', slug);
    } else {
      next.delete('category');
    }
    setSearchParams(next);
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    const next = new URLSearchParams(searchParams);
    if (val) {
      next.set('search', val);
    } else {
      next.delete('search');
    }
    setSearchParams(next);
  };

  const newsCategories = categories.filter(c => ['technology', 'business', 'trending-news'].includes(c.slug));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Top Breaking News Banner */}
      <div className="bg-rose-600 text-white text-xs font-semibold px-4 py-2 flex items-center justify-center gap-2 shadow-sm">
        <Radio className="w-4 h-4 animate-pulse text-white" />
        <span>Live Trending Feed: Automated Google News & Industry Ingest every 6 hours</span>
      </div>

      {/* Hero Header */}
      <section className="relative overflow-hidden py-12 md:py-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5" />
                <span>Real-Time Industry Radar</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                Trending News & Market Watch
              </h1>
              <p className="text-base text-slate-600 dark:text-slate-400">
                Curated executive digests on AI breakthroughs, MSME economy, smart grids, and digital transformation in India.
              </p>
            </div>

            {/* Search Input */}
            <div className="w-full md:w-80">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search live news headlines..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Quick Categories Filter */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => handleCategoryClick('')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                !selectedCategory
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              All News
            </button>
            {newsCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat.slug
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-slate-400">Loading live news feed...</p>
          </div>
        ) : newsPosts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
            <Globe className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold">No trending stories found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Top Trending Headline Banner */}
            {trendingPost && (
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl overflow-hidden shadow-xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        Trending Story
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {trendingPost.source_name || 'Google News'}
                      </span>
                    </div>
                    <Link to={`/news/${trendingPost.category_slug}/${trendingPost.slug}`}>
                      <h2 className="text-2xl sm:text-3xl font-black hover:text-rose-400 transition leading-snug">
                        {trendingPost.title}
                      </h2>
                    </Link>
                    <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed">
                      {trendingPost.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-700/60 text-xs">
                    <div className="flex items-center gap-3 text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {trendingPost.read_time_minutes} min read
                      </span>
                      <span>•</span>
                      <span>{new Date(trendingPost.published_at).toLocaleDateString()}</span>
                    </div>
                    <Link
                      to={`/news/${trendingPost.category_slug}/${trendingPost.slug}`}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <span>Read Story</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5 relative h-64 lg:h-auto min-h-[260px] bg-slate-800">
                  <img
                    src={trendingPost.featured_image}
                    alt={trendingPost.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-transparent to-transparent"></div>
                </div>
              </div>
            )}

            {/* News Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-rose-600" />
                  <span>Latest News Dispatches</span>
                </h2>
                <span className="text-xs text-slate-500">Auto-updated via Google News feeds</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
                  >
                    <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80';
                        }}
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur text-white text-[10px] font-black uppercase tracking-wider">
                        {post.category_name}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                          <span className="font-semibold text-rose-600 dark:text-rose-400">
                            {post.source_name || 'News Wire'}
                          </span>
                          <span>{new Date(post.published_at).toLocaleDateString()}</span>
                        </div>
                        <Link to={`/news/${post.category_slug}/${post.slug}`}>
                          <h3 className="font-bold text-base line-clamp-2 group-hover:text-rose-600 transition leading-snug">
                            {post.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mt-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.read_time_minutes}m read
                        </span>
                        <Link
                          to={`/news/${post.category_slug}/${post.slug}`}
                          className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                        >
                          <span>Full Story</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
