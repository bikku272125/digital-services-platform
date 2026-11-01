import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Palette,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Layers,
  ChevronRight,
  HelpCircle,
  FileCheck,
  Smartphone,
  Eye,
  Send
} from 'lucide-react';
import { posterAPI } from '../../api/client';
import { getVisualForCategory } from './posterData';

export default function PosterStudioLanding() {
  const [categories, setCategories] = useState([]);
  const [featuredTemplates, setFeaturedTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    Promise.all([
      posterAPI.getCategories().catch(() => ({ data: [] })),
      posterAPI.getTemplates({ featured: true }).catch(() => ({ data: [] }))
    ]).then(([catRes, tmplRes]) => {
      setCategories(catRes.data || []);
      setFeaturedTemplates((tmplRes.data || []).slice(0, 6));
      setLoading(false);
    });
  }, []);

  const howItWorksSteps = [
    {
      step: '01',
      title: 'Pick a Category or Template',
      desc: 'Browse through Panchayat, Business, Festival, Birthday, Wedding, or Academic poster templates tailored for Indian occasions.'
    },
    {
      step: '02',
      title: 'Provide Content & Upload Photos',
      desc: 'Enter your Hindi or English heading, announcements, slogans, and attach your personal photographs or shop logo.'
    },
    {
      step: '03',
      title: 'Crafted with Professional Design Tools',
      desc: 'Our expert graphic designers craft your poster using Canva and AI design tools with perfect typography and color harmony.'
    },
    {
      step: '04',
      title: 'Preview, Revise & Get HD Files',
      desc: 'Inspect your poster preview, request fast revisions if needed, and receive print-ready JPG, PNG or PDF files.'
    }
  ];

  const pricingTiers = [
    {
      name: 'Festival & Personal Wishes',
      price: '₹79 - ₹99',
      features: [
        'Personal Photo Integration',
        'Hindi / English Custom Greetings',
        'WhatsApp & Instagram 1:1 Size',
        'Same Day Delivery (within 4 hrs)',
        '1 Free Revision'
      ],
      popular: false
    },
    {
      name: 'Business & Event Advert',
      price: '₹149 - ₹199',
      features: [
        'Shop Logo & Offer Badges',
        'Custom Colors matching your brand',
        'Print-Ready A4 & Social Sizes',
        'High-Resolution 300 DPI Export',
        '2 Free Revisions'
      ],
      popular: true
    },
    {
      name: 'Panchayat & Political Banner',
      price: '₹149 - ₹249',
      features: [
        'Prominent Candidate Portrait Slot',
        'Authorized Election Rule Compliance',
        'Party/Election Symbol Alignment',
        'Ultra HD Printable & Flex Banner Ready',
        'Priority Turnaround & Revision Support'
      ],
      popular: false
    }
  ];

  const faqs = [
    {
      q: 'Can you write content in Hindi and local dialects?',
      a: 'Yes, absolutely! We specialize in both Hindi (Devanagari) and English typography, including bilingual formats popular for Panchayat notices, shop promotions, and festival greetings.'
    },
    {
      q: 'How do I send my photo or shop logo?',
      a: 'Our intuitive order form lets you upload customer photographs, business logos, and reference layout samples directly from your phone or PC with live upload progress.'
    },
    {
      q: 'What is the turnaround time for a poster?',
      a: 'Most standard festival and business posters are crafted and shared for preview within 2 to 6 hours. Emergency expedited deliveries can also be specified in the order instructions.'
    },
    {
      q: 'Can I request changes if I want to adjust the text or image?',
      a: 'Yes! Every poster design includes complimentary revisions. You can provide feedback and our designers will adjust the colors, fonts, or positioning until you are satisfied.'
    },
    {
      q: 'Will you support an online browser editor in the future?',
      a: 'Yes! Our platform architecture is built to support a browser-based drag-and-drop poster editor in future updates. Currently, all posters are professionally composed by our designers to ensure top aesthetic quality.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                <span>Professional Indian Poster Design Studio</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Beautiful Posters</span> for Every Occasion
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Customized Hindi and English posters crafted for Gram Panchayat elections, shop promotions, birthdays, festivals, weddings, and coaching admissions. Handled with professional design tools and delivered in high resolution.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/poster-studio/editor"
                  className="px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition shadow-lg shadow-indigo-600/25 flex items-center gap-2 group"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                  <span>Open Live Online Editor</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/poster-studio/order"
                  className="px-5 py-3.5 rounded-xl font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition flex items-center gap-2"
                >
                  <span>Order Custom Request</span>
                </Link>
                <Link
                  to="/poster-studio/templates"
                  className="px-4 py-3.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition"
                >
                  Browse Templates →
                </Link>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">100% Hindi/Eng</div>
                  <div className="text-xs text-slate-500">Perfect Devanagari Type</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Under 4 Hours</div>
                  <div className="text-xs text-slate-500">Fast Turnaround Preview</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">₹79 Onwards</div>
                  <div className="text-xs text-slate-500">Affordable Indian Pricing</div>
                </div>
              </div>
            </div>

            {/* Visual Hero Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl blur-2xl opacity-30"></div>
                <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div className="p-4 bg-slate-100 dark:bg-slate-800 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    </div>
                    <span className="text-xs font-mono text-slate-500">Poster Studio Design Studio</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-600 text-[10px] font-semibold">Active</span>
                  </div>

                  <div className="p-4 sm:p-6 space-y-4">
                    <div className="relative rounded-xl overflow-hidden aspect-[4/5] bg-gradient-to-tr from-amber-600 via-orange-600 to-amber-900 text-white p-6 flex flex-col justify-between shadow-inner">
                      <div className="flex justify-between items-start">
                        <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-md text-xs font-medium">
                          ग्राम पंचायत चुनाव 2026
                        </span>
                        <span className="text-xs font-mono bg-black/30 px-2 py-0.5 rounded">
                          Sample Design
                        </span>
                      </div>
                      <div className="space-y-2 text-center py-6">
                        <div className="w-20 h-20 mx-auto rounded-full border-2 border-white/60 bg-white/10 flex items-center justify-center backdrop-blur-sm shadow-lg overflow-hidden">
                          <img
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                            alt="Candidate sample"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="text-xl font-extrabold tracking-wide text-white drop-shadow">
                          कर्मठ, जुझारू एवं योग्य प्रत्याशी
                        </h4>
                        <p className="text-xs text-amber-100 max-w-xs mx-auto">
                          ग्राम सभा के सर्वांगीण विकास एवं जनसेवा हेतु अपना अमूल्य मत देकर भारी मतों से विजयी बनाएं।
                        </p>
                      </div>
                      <div className="p-2.5 bg-black/40 backdrop-blur-md rounded-lg flex items-center justify-between text-xs">
                        <span>चुनाव चिन्ह: कलम-दवात</span>
                        <span className="font-semibold text-amber-300">विकास ही संकल्प</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span>✓ Multi-format export (JPG, PNG, PDF)</span>
                      <span>✓ Print Ready A4 / Social</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                Explore Occasions
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Popular Poster Categories</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                Select an occasion to view templates or request a tailor-made design.
              </p>
            </div>
            <Link
              to="/poster-studio/categories"
              className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              <span>View all categories</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0, 6).map((cat) => {
              const visual = getVisualForCategory(cat.slug);
              const IconComp = visual.icon;
              return (
                <div
                  key={cat.id || cat.slug}
                  className="group bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-6 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${visual.lightBg}`}>
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {visual.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                      {cat.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mt-2 line-clamp-2">
                      {cat.description || visual.tagline}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {visual.tags.map((tag, i) => (
                        <span key={i} className="text-[11px] font-medium px-2 py-0.5 rounded bg-white dark:bg-slate-700/70 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                    <Link
                      to={`/poster-studio/templates?category=${cat.slug}`}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      Browse Templates
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to={`/poster-studio/order?category=${cat.id}`}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                    >
                      Create Request
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Templates Gallery */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
                Handcrafted Inspiration
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Featured Poster Templates</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                Browse our curated templates. You can customize any template with your own details.
              </p>
            </div>
            <Link
              to="/poster-studio/templates"
              className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-700"
            >
              <span>Explore full template gallery</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTemplates.map((template) => {
              const visual = getVisualForCategory(template.category_slug);
              return (
                <div
                  key={template.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition group flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={visual.sampleImage}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute top-3 left-3">
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/90 text-slate-900 backdrop-blur-md shadow">
                        {template.category_name}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h4 className="font-bold text-base line-clamp-1">{template.name}</h4>
                      <p className="text-xs text-slate-200 line-clamp-1 mt-0.5">{template.description}</p>
                    </div>
                  </div>

                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-slate-500 uppercase tracking-wider">Starts From</div>
                      <div className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                        ₹{parseFloat(template.starting_price || 99).toFixed(0)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/poster-studio/templates/${template.slug}`}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                        title="Quick View"
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
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
              Simple & Transparent
            </div>
            <h2 className="text-3xl font-bold tracking-tight">How Poster Studio Works</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
              From idea to print-ready poster in four seamless steps. No complicated software needed on your end.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((item, idx) => (
              <div
                key={idx}
                className="relative bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-200 dark:border-slate-800"
              >
                <div className="text-3xl font-black text-indigo-600/40 dark:text-indigo-400/40 font-mono mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Information */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
              Affordable Pricing
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Transparent Package Rates</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
              Pay only for the poster tier you require. All rates include custom typography and revisions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pricingTiers.map((tier, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition ${
                  tier.popular
                    ? 'bg-white dark:bg-slate-900 border-2 border-indigo-600 shadow-xl relative'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full shadow">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="text-xl font-bold">{tier.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">{tier.price}</span>
                    <span className="text-xs text-slate-500 ml-2">/ per poster</span>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8 mt-8 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    to="/poster-studio/order"
                    className={`w-full py-3 rounded-xl font-semibold text-center block transition ${
                      tier.popular
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
              Everything you need to know about our custom poster design process.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-800"
              >
                <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-start gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 pl-7 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Design Your High-Impact Poster?
          </h2>
          <p className="text-indigo-200 text-base sm:text-lg max-w-2xl mx-auto">
            Submit your poster request in 2 minutes. Attach your photos and text in Hindi or English, and let our designers deliver your masterpiece.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              to="/poster-studio/order"
              className="px-8 py-3.5 rounded-xl font-semibold bg-white text-indigo-900 hover:bg-indigo-50 transition shadow-xl"
            >
              Start Your Request Now
            </Link>
            <Link
              to="/poster-studio/categories"
              className="px-8 py-3.5 rounded-xl font-semibold bg-indigo-700/60 border border-indigo-400/40 text-white hover:bg-indigo-700 transition"
            >
              Browse All Categories
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
