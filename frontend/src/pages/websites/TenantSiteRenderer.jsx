import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  BookOpen,
  Award,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { waasAPI } from '../../api/client';

export default function TenantSiteRenderer() {
  const { subdomain } = useParams();
  const [searchParams] = useSearchParams();
  const orderRef = searchParams.get('ref');
  const isPreviewParam = searchParams.get('preview') === 'true';

  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-detect if loaded via subdomain (e.g. drglobal.aaradhyaenertech.com)
  const currentHostname = window.location.hostname;
  const isSubdomainHost = currentHostname.includes('.aaradhyaenertech.com') && !currentHostname.startsWith('digital.') && !currentHostname.startsWith('www.');
  const detectedSubdomain = isSubdomainHost ? currentHostname.split('.')[0] : (subdomain || 'drglobal');

  useEffect(() => {
    window.scrollTo(0, 0);
    const params = {};
    if (orderRef) {
      params.ref = orderRef;
    } else if (detectedSubdomain) {
      params.subdomain = detectedSubdomain;
    }

    waasAPI.getOrderStatus(params)
      .then(res => setSiteData(res.data))
      .catch(() => {
        // Fallback default demo data
        setSiteData({
          organization_name: "DR GLOBAL SCHOOL",
          city: "Khalilabad, Sant Kabir Nagar, UP",
          customer_phone: "+91 9369928423",
          customer_email: "info@drglobalschool.edu.in",
          requirements_note: "CBSE Curriculum • Holistic Development • Modern Labs",
          uploaded_logo: "https://digital-services-platform-slnw.onrender.com/media/websites/logos/2026/11/bird-colorful-logo-gradient-vector_343694-1365.avif"
        });
      })
      .finally(() => setLoading(false));
  }, [detectedSubdomain, orderRef]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const schoolName = siteData?.organization_name || "DR GLOBAL SCHOOL";
  const phone = siteData?.customer_phone || "+91 9369928423";
  const city = siteData?.city || "Khalilabad, UP";
  const logo = siteData?.uploaded_logo || "";

  // Show banner only if explicit ?preview=true is requested
  const showPreviewBanner = isPreviewParam || searchParams.has('ref');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-amber-500 selection:text-white">
      
      {/* Optional Preview Notification Banner (Only shows when in admin preview mode) */}
      {showPreviewBanner && (
        <div className="bg-slate-900 text-slate-300 px-4 py-2 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span><strong>Preview Mode:</strong> Active on <code className="text-amber-400 font-mono">digital.aaradhyaenertech.com/{detectedSubdomain}</code></span>
          </div>
          <Link
            to="/dashboard"
            className="text-amber-400 hover:underline font-bold flex items-center gap-1"
          >
            <span>Return to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Header / Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {logo ? (
              <img src={logo} alt={schoolName} className="w-12 h-12 object-contain rounded-xl" />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-900 to-indigo-700 text-amber-400 flex items-center justify-center shadow-md">
                <GraduationCap className="w-7 h-7" />
              </div>
            )}
            <div>
              <span className="text-xl font-black text-blue-950 tracking-tight leading-tight block">
                {schoolName}
              </span>
              <p className="text-[11px] font-bold text-amber-600 tracking-wider uppercase">
                Excellence in Education • {city}
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-bold text-slate-700">
            <a href="#home" className="text-blue-900 hover:text-amber-600 transition">Home</a>
            <a href="#about" className="hover:text-amber-600 transition">About</a>
            <a href="#academics" className="hover:text-amber-600 transition">Academics</a>
            <a href="#admissions" className="hover:text-amber-600 transition">Admissions 2026</a>
            <a href="#contact" className="hover:text-amber-600 transition">Contact</a>
          </nav>

          <a
            href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(schoolName)},%20I%20would%20like%20information%20regarding%20admissions.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-800 text-white font-bold text-xs shadow-md hover:shadow-lg hover:from-blue-950 transition flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Admissions Inquiry</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Admissions Open for Session 2026–27</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              Shaping Tomorrow's Leaders at <span className="text-amber-400">{schoolName}</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Empowering students with world-class academics, digital learning labs, competitive sports, and values-driven character building.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#admissions"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg transition"
              >
                Apply for Admission
              </a>
              <a
                href="#about"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition"
              >
                Explore Campus Tour
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80"
                alt="School Campus"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white text-slate-900 p-4 rounded-2xl shadow-xl border border-slate-100 hidden sm:flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-xl">
                100%
              </div>
              <div className="text-xs">
                <span className="font-black block">CBSE Excellence</span>
                <span className="text-slate-500">Board Exam Results</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-black text-lg text-slate-900">Modern Curriculum</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Smart classrooms equipped with interactive panels, digital audio-visual modules, and STEM science kits.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-black text-lg text-slate-900">Expert Faculty</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Highly qualified, dedicated educators providing personalized attention to every student's learning pace.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-black text-lg text-slate-900">Safe Campus & GPS Bus</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                24x7 CCTV surveillance, biometric security, and live GPS-tracked transportation across Khalilabad & surrounding regions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-900 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-black text-lg text-slate-900">Sports & Arts Arena</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cricket turf, basketball, martial arts, classical music, and cultural clubs for all-round personality development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Online Admission Inquiry Form Section */}
      <section id="admissions" className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xl space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-600">Online Registration</span>
              <h2 className="text-3xl font-black text-blue-950">
                Book a Campus Tour & Admission Counseling
              </h2>
              <p className="text-xs text-slate-500">
                Leave your details below and our academic counselor will contact you within 24 hours.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(`Thank you! Your admission inquiry for ${schoolName} has been submitted.`);
              }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs"
            >
              <div>
                <label className="block font-bold mb-1">Student's Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Class / Grade Seeking Admission *</label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-900 focus:outline-none font-medium">
                  <option>Playgroup / Nursery / KG</option>
                  <option>Primary School (Class 1 to 5)</option>
                  <option>Middle School (Class 6 to 8)</option>
                  <option>Secondary (Class 9 & 10)</option>
                  <option>Senior Secondary (Class 11 & 12 Science / Commerce)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Parent / Guardian Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Sharma"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">WhatsApp / Contact Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-black uppercase tracking-wider text-xs shadow-lg transition"
                >
                  Submit Admission Application
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h4 className="text-white font-black text-base">{schoolName}</h4>
            <p className="text-slate-400 leading-relaxed">
              Committed to providing world-class academic standards, moral values, and global opportunities.
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="text-white font-bold uppercase text-[11px] tracking-wider">Contact & Address</h5>
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-400 shrink-0" /> {city}</p>
            <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-amber-400 shrink-0" /> {phone}</p>
            <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-amber-400 shrink-0" /> info@drglobalschool.edu.in</p>
          </div>

          <div className="space-y-2">
            <h5 className="text-white font-bold uppercase text-[11px] tracking-wider">School Timings</h5>
            <p>Monday – Saturday: 08:00 AM – 02:30 PM</p>
            <p>Sunday: Closed</p>
            <p className="text-amber-400 text-[10px] mt-2 font-mono">Affiliation: CBSE Curriculum Guidelines</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-800 text-center text-[11px] text-slate-500">
          © {new Date().getFullYear()} {schoolName}. All rights reserved. Powered by Digital Services Platform.
        </div>
      </footer>

      {/* Floating WhatsApp Action Button */}
      <a
        href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(schoolName)}`}
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
