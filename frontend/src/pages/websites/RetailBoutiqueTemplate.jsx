import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  MessageCircle,
  Tag,
  CheckCircle,
  Truck,
  ShieldCheck,
  Percent,
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function RetailBoutiqueTemplate({ siteData }) {
  const shopName = siteData?.organization_name || "Yadav Fancy Vastralya";
  const phone = siteData?.customer_phone || "+91 9369928423";
  const city = siteData?.city || "Khalilabad, Sant Kabir Nagar, UP";
  const logo = siteData?.uploaded_logo || "";
  const [selectedCategory, setSelectedCategory] = useState('all');

  const cleanPhone = phone.replace(/[^0-9]/g, '');

  const categories = [
    { id: 'all', label: 'All Collections' },
    { id: 'sarees', label: 'Bridal & Designer Sarees' },
    { id: 'lehengas', label: 'Partywear Lehengas' },
    { id: 'suits', label: 'Salwar Suits & Kurtis' },
    { id: 'mens', label: 'Men\'s Kurta & Sherwani' },
  ];

  const products = [
    {
      id: 1,
      category: 'sarees',
      name: 'Pure Banarasi Katan Silk Saree',
      price: '₹3,499',
      mrp: '₹5,999',
      discount: '40% OFF',
      tag: 'Best Seller',
      img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      description: 'Handwoven zari border with rich pallu design. Ideal for weddings and festive functions.'
    },
    {
      id: 2,
      category: 'sarees',
      name: 'Designer Organza Floral Embroidery Saree',
      price: '₹2,299',
      mrp: '₹3,999',
      discount: '42% OFF',
      tag: 'Trending',
      img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      description: 'Lightweight pastel organza with intricate handwork scalloped border.'
    },
    {
      id: 3,
      category: 'lehengas',
      name: 'Royal Velvet Embroidered Bridal Lehenga',
      price: '₹8,999',
      mrp: '₹14,999',
      discount: '40% OFF',
      tag: 'Wedding Special',
      img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      description: 'Heavy dori and sequin work with matching double dupatta and velvet choli.'
    },
    {
      id: 4,
      category: 'suits',
      name: 'Chanderi Silk Partywear Anarkali Suit',
      price: '₹1,899',
      mrp: '₹2,999',
      discount: '36% OFF',
      tag: 'New Arrival',
      img: 'https://images.unsplash.com/photo-1596783074418-c9994c63be3d?auto=format&fit=crop&w=800&q=80',
      description: 'Embroidered neckline with pure dupatta and comfortable cotton pants.'
    },
    {
      id: 5,
      category: 'mens',
      name: 'Groom Silk Kurta Pyjama with Jacket',
      price: '₹2,799',
      mrp: '₹4,499',
      discount: '38% OFF',
      tag: 'Festive',
      img: 'https://images.unsplash.com/photo-1622122201714-77da0ca8e5d2?auto=format&fit=crop&w=800&q=80',
      description: 'Jacquard woven Nehru jacket paired with breathable art silk kurta pyjama set.'
    },
    {
      id: 6,
      category: 'sarees',
      name: 'Traditional Kanjeevaram Gold Zari Saree',
      price: '₹4,199',
      mrp: '₹6,999',
      discount: '40% OFF',
      tag: 'Festive Classic',
      img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      description: 'Authentic temple border with contrast brocade pallu and unstitched blouse piece.'
    }
  ];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-rose-50/30 text-slate-800 font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 text-white px-4 py-2 text-xs text-center font-medium flex items-center justify-center gap-3">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Wedding Season Special: Up to 50% Off on All New Saree & Lehenga Collections!</span>
        </span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline text-amber-200">Visit Us at {city}</span>
      </div>

      {/* Main Header / Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-rose-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {logo ? (
              <img src={logo} alt={shopName} className="w-12 h-12 object-contain rounded-xl" />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center shadow-md">
                <ShoppingBag className="w-7 h-7" />
              </div>
            )}
            <div>
              <span className="text-xl font-black text-rose-950 tracking-tight leading-tight block">
                {shopName}
              </span>
              <p className="text-[11px] font-bold text-rose-600 tracking-wider uppercase">
                Premium Sarees, Suits & Garments • {city}
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-bold text-slate-700">
            <a href="#collections" className="text-rose-700 hover:text-rose-900 transition">Collections</a>
            <a href="#highlights" className="hover:text-rose-600 transition">Why Choose Us</a>
            <a href="#location" className="hover:text-rose-600 transition">Store Location</a>
            <a href="#contact" className="hover:text-rose-600 transition">Contact</a>
          </nav>

          <a
            href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(shopName)},%20I%20am%20interested%20in%20your%20saree%20and%20garment%20collection.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-emerald-200" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </header>

      {/* Hero Showcase Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-950 via-slate-900 to-rose-900 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 backdrop-blur border border-rose-400/30 text-rose-200 text-xs font-bold uppercase tracking-wider">
              <Tag className="w-4 h-4 text-amber-400" />
              <span>Exclusive Festive & Wedding Collection 2026</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              Grace, Tradition & Elegance at <span className="text-amber-400">{shopName}</span>
            </h1>
            <p className="text-base sm:text-lg text-rose-100 max-w-xl leading-relaxed">
              Explore Khalilabad's favorite boutique for authentic Banarasi sarees, designer bridal lehengas, partywear salwar suits, and premium menswear fabrics.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#collections"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black text-sm uppercase tracking-wider shadow-xl transition"
              >
                View Latest Collections
              </a>
              <a
                href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(shopName)},%20please%20share%20your%20latest%20catalog.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Request WhatsApp Catalog</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-rose-300/20 aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80"
                alt="Bridal Sarees"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 bg-white text-slate-900 p-4 rounded-2xl shadow-xl border border-rose-100 hidden sm:flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black text-xl">
                ★ 4.9
              </div>
              <div className="text-xs">
                <span className="font-black block">Trusted by 5,000+ Families</span>
                <span className="text-slate-500">Across Khalilabad & Gorakhpur</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Highlights */}
      <section id="highlights" className="py-12 bg-white border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-rose-50/50 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">100% Pure Fabric</h4>
              <p className="text-[11px] text-slate-500">Authentic silk, georgette & velvet guarantee</p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/50 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <Percent className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Wholesale Price Benefit</h4>
              <p className="text-[11px] text-slate-500">Direct factory rates with retail warmth</p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/50 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Open 7 Days a Week</h4>
              <p className="text-[11px] text-slate-500">10:00 AM – 9:00 PM for all occasions</p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/50 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-900 flex items-center justify-center mx-auto">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Home Delivery Available</h4>
              <p className="text-[11px] text-slate-500">Order on WhatsApp & get fast delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection Grid */}
      <section id="collections" className="py-20 bg-rose-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-rose-600 bg-rose-100 px-3 py-1 rounded-full">
              Explore Our Store
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              Handpicked Festive & Bridal Showroom
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
              Click any collection to view details or book via WhatsApp with direct item reference.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-center flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${
                  selectedCategory === c.id
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-rose-50 border border-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-3xl border border-rose-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-rose-600 text-white font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    {p.tag}
                  </div>
                  <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-full shadow">
                    {p.discount}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-black text-lg text-slate-900 group-hover:text-rose-600 transition">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-rose-50 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 line-through mr-2">{p.mrp}</span>
                      <span className="text-xl font-black text-rose-700">{p.price}</span>
                    </div>

                    <a
                      href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(shopName)},%20I%20am%20interested%20in%20"${encodeURIComponent(p.name)}"%20listed%20for%20${encodeURIComponent(p.price)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-200" />
                      <span>Order on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit Store Section */}
      <section id="location" className="py-16 bg-white border-t border-rose-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-rose-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Visit Our Showroom</span>
              <h2 className="text-3xl font-black">{shopName}</h2>
              <p className="text-xs text-rose-200 leading-relaxed">
                Step inside our showroom to touch and feel pure fabrics, inspect authentic zari work, and enjoy warm festive hospitality.
              </p>
              <div className="space-y-2 text-xs pt-2">
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-400 shrink-0" /> {city}</p>
                <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-amber-400 shrink-0" /> {phone}</p>
                <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-400 shrink-0" /> Open Everyday: 10:00 AM – 9:00 PM</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur border border-white/20 p-6 rounded-2xl text-center space-y-4">
              <h3 className="text-lg font-black text-amber-300">Need Custom Orders or Bridal Booking?</h3>
              <p className="text-xs text-rose-100">
                Call our showroom directly or message us on WhatsApp for bridal appointments and custom stitching support.
              </p>
              <a
                href={`tel:${phone.replace(/[^0-9]/g, '')}`}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow transition"
              >
                <Phone className="w-4 h-4" />
                <span>Call Store: {phone}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-950 text-slate-400 py-10 border-t border-slate-900 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h4 className="text-white font-black text-lg">{shopName}</h4>
          <p className="text-slate-400 text-xs max-w-md mx-auto">
            Your destination for Banarasi Sarees, Bridal Lehengas, Designer Kurtis, and Festive Menswear in {city}.
          </p>
          <div className="pt-4 border-t border-slate-900 text-slate-500 text-[11px] flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© {new Date().getFullYear()} {shopName}. All rights reserved. Powered by Digital Services Platform.</span>
            <Link
              to={siteData?.order_ref ? `/client-portal?ref=${siteData.order_ref}` : `/client-portal`}
              className="text-slate-400 hover:text-white transition flex items-center gap-1 font-semibold"
            >
              <span>Client Admin Portal</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Action Button */}
      <a
        href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(shopName)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-emerald-500 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
}
