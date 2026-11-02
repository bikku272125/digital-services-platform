import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Eye,
  Calendar,
  Share2,
  Tag,
  BookOpen,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { blogAPI } from '../../api/client';

export default function BlogPostDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    blogAPI.getPostBySlug(slug)
      .then(res => setPost(res.data))
      .catch(err => console.error('Error fetching post', err))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">Article Not Found</h2>
          <p className="text-sm text-slate-500 mb-6">The article you are looking for has moved or does not exist.</p>
          <Link
            to="/blog"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition"
          >
            Back to Insights
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Articles</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:border-indigo-500 transition shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>{copied ? 'Link Copied!' : 'Share Article'}</span>
          </button>
        </div>

        {/* Category & Title */}
        <div className="space-y-4 mb-8">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
            {post.category_name}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-b border-slate-200 dark:border-slate-800 pb-4">
            <span>By <strong className="text-slate-800 dark:text-slate-200">{post.author_name}</strong></span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.read_time_minutes} min read
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {post.views_count} views
            </span>
            {post.source_name && (
              <>
                <span>•</span>
                <span className="text-slate-400">Source: {post.source_name}</span>
              </>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="rounded-3xl overflow-hidden aspect-[16/9] mb-10 shadow-lg bg-slate-100 dark:bg-slate-800">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Excerpt Lead Paragraph */}
        <div className="text-lg sm:text-xl font-medium text-slate-700 dark:text-slate-300 leading-relaxed mb-8 border-l-4 border-indigo-600 pl-4 py-1 italic bg-indigo-50/40 dark:bg-indigo-950/20 rounded-r-2xl">
          {post.excerpt}
        </div>

        {/* Full Body HTML Content */}
        <div
          className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-indigo-600 prose-img:rounded-2xl leading-relaxed text-base space-y-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-2 items-center">
            <Tag className="w-4 h-4 text-slate-400" />
            {post.tags.map((t, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Related Articles */}
        {post.related_posts && post.related_posts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-2xl font-bold mb-6">Related Articles in {post.category_name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {post.related_posts.map((rp) => (
                <Link
                  key={rp.id}
                  to={`/blog/${rp.category_slug}/${rp.slug}`}
                  className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold text-indigo-600">{rp.category_name}</span>
                    <h4 className="font-bold text-sm group-hover:text-indigo-600 line-clamp-2 leading-snug">
                      {rp.title}
                    </h4>
                  </div>
                  <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-indigo-600 font-semibold flex items-center gap-1">
                    <span>Read now</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
