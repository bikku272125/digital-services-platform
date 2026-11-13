import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layers, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Templates', path: '/templates', badge: 'WaaS' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Services', path: '/services' },
    { name: 'News', path: '/news', badge: 'Live' },
    { name: 'Blog', path: '/blog' },
    // { name: 'Poster Studio', path: '/poster-studio', badge: 'New' },
    { name: 'My Website', path: '/website-status' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-700 transition">
              <Layers className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <span className="text-base font-bold text-slate-900 tracking-tight whitespace-nowrap">
                Digital Services<span className="text-indigo-600">.</span>
              </span>
              <p className="text-[9px] text-slate-500 font-medium tracking-wide uppercase">On-Demand Studio</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                  isActive(link.path)
                    ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full text-white ${
                    link.badge === 'Live' ? 'bg-rose-600 animate-pulse' : 'bg-indigo-600'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* CTAs */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3 shrink-0">
            <Link
              to="/request"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition shadow-sm hover:shadow whitespace-nowrap"
            >
              Request a Service
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>

          {/* Mobile & Tablet menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Menu dropdown */}
      {isOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white/98 backdrop-blur px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-medium transition ${
                isActive(link.path)
                  ? 'text-indigo-600 bg-indigo-50 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/request"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center px-4 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition shadow"
            >
              Request a Service
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
