import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Mail, Phone, MapPin, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Digital Services<span className="text-indigo-400">.</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Tell us what you need. We'll help you get it done. Reliable digital execution for businesses, creators, and entrepreneurs in India.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1.5 rounded-full w-fit">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Transparent Pricing • Verified Deliveries</span>
            </div>
          </div>

          {/* Core Services */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Service Pillars
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services?category=website-and-development" className="hover:text-white transition">
                  Websites & Landing Pages
                </Link>
              </li>
              <li>
                <Link to="/services?category=design-and-branding" className="hover:text-white transition">
                  Company Profiles & Design
                </Link>
              </li>
              <li>
                <Link to="/services?category=marketing-and-content" className="hover:text-white transition">
                  Content & Basic SEO
                </Link>
              </li>
              <li>
                <Link to="/services?category=data-and-office-work" className="hover:text-white transition">
                  Data Cleanup & Automation
                </Link>
              </li>
              <li>
                <Link to="/services?category=ai-and-automation" className="hover:text-white transition">
                  AI Workflows & Chatbots
                </Link>
              </li>
              <li>
                <Link to="/request" className="text-indigo-400 hover:text-indigo-300 font-medium transition inline-flex items-center">
                  Custom Digital Request <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/how-it-works" className="hover:text-white transition">How It Works</Link></li>
              <li><Link to="/portfolio" className="hover:text-white transition">Sample Work & Demos</Link></li>
              <li><Link to="/faq" className="hover:text-white transition">Frequently Asked Questions</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact & Business Inquiry</Link></li>
              <li><Link to="/admin-dashboard" className="text-indigo-400 hover:text-indigo-300 font-semibold transition">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Get In Touch
            </h3>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <a href="mailto:bikkuyadav9190@gmail.com" className="hover:text-white transition">bikkuyadav9190@gmail.com</a>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <a href="tel:+919161420942" className="hover:text-white transition">+91 9161420942 (24/7 Available)</a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <span>Gurugram and Remote Access India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Digital Services Platform. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link to="/privacy-policy" className="hover:text-slate-400 transition">Privacy Policy (Draft)</Link>
            <Link to="/terms-conditions" className="hover:text-slate-400 transition">Terms & Conditions</Link>
            <Link to="/cancellation-refunds" className="hover:text-slate-400 transition">Cancellation & Refunds</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
