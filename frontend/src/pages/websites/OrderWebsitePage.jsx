import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Globe,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Layers,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { waasAPI } from '../../api/client';

export default function OrderWebsitePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const preselectedTemplateId = searchParams.get('template') || '';
  const preselectedPackageId = searchParams.get('package') || '';
  const isCustom = searchParams.get('mode') === 'custom';

  const [packages, setPackages] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    organization_name: '',
    business_type: '',
    city: '',
    package: preselectedPackageId,
    template: preselectedTemplateId,
    is_custom_development: isCustom,
    requested_subdomain: '',
    custom_domain: '',
    requirements_note: '',
  });

  const [logoFile, setLogoFile] = useState(null);
  const [brochureFile, setBrochureFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    Promise.all([waasAPI.getPackages(), waasAPI.getTemplates()])
      .then(([pkgRes, tmplRes]) => {
        const pkgs = pkgRes.data || [];
        const tmpls = tmplRes.data?.results || tmplRes.data || [];
        setPackages(pkgs);
        setTemplates(tmpls);

        // Preselect default package if none specified
        if (!preselectedPackageId && pkgs.length > 0) {
          const defaultPkg = isCustom
            ? pkgs.find(p => p.tier === 'custom')
            : (pkgs.find(p => p.is_popular) || pkgs[0]);
          if (defaultPkg) {
            setFormData(prev => ({ ...prev, package: defaultPkg.id }));
          }
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingInitial(false));
  }, [preselectedPackageId, isCustom]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubdomainChange = (e) => {
    // Sanitize subdomain input: lowercase, alphanumeric and hyphens only
    const clean = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setFormData(prev => ({ ...prev, requested_subdomain: clean }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.customer_name || !formData.customer_email || !formData.customer_phone || !formData.organization_name) {
      setErrorMsg('Please complete all required customer and organization fields.');
      return;
    }

    if (!formData.package) {
      setErrorMsg('Please select a pricing package.');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
          data.append(key, formData[key]);
        }
      });

      if (logoFile) data.append('uploaded_logo', logoFile);
      if (brochureFile) data.append('uploaded_brochure', brochureFile);

      const res = await waasAPI.createOrder(data);
      setOrderSuccess(res.data);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to submit order. Please check inputs and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Success Confirmation Screen
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4">
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600">Order Confirmed</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Your Website is Being Initialized!
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Thank you, <strong className="text-slate-900 dark:text-white">{orderSuccess.customer_name}</strong>. Our engineering team has received your order for <strong className="text-slate-900 dark:text-white">{orderSuccess.organization_name}</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Order Reference:</span>
              <span className="font-mono font-bold text-indigo-600">{orderSuccess.order_ref}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Package:</span>
              <span className="font-bold">{orderSuccess.package_details?.name || 'Selected Package'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Subdomain Reserved:</span>
              <span className="font-semibold">{orderSuccess.requested_subdomain ? `${orderSuccess.requested_subdomain}.aaradhyaenertech.com` : 'Standard Platform Subdomain'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold uppercase text-[10px]">
                {orderSuccess.status}
              </span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={`/website-status?ref=${orderSuccess.order_ref}&token=${orderSuccess.access_token}`}
              className="py-3 px-6 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition"
            >
              Track Project Progress & Portal
            </Link>
            <Link
              to="/"
              className="py-3 px-6 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const selectedTemplateObj = templates.find(t => String(t.id) === String(formData.template));
  const selectedPackageObj = packages.find(p => String(p.id) === String(formData.package));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3 border border-indigo-200 dark:border-indigo-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Your Website</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Website Order & Customization
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Fill in your business details, select your preferred plan, reserve your subdomain, and upload your logo.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-8 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm">
          
          {/* Step 1: Package Selection */}
          <div className="space-y-4">
            <h3 className="text-base font-bold flex items-center gap-2 text-indigo-600">
              <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center text-xs">1</span>
              <span>Select Pricing Package</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {packages.map((pkg) => {
                const isSelected = String(formData.package) === String(pkg.id);
                const isTrial = pkg.tier === 'trial';
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setFormData(prev => ({ ...prev, package: pkg.id }))}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all text-left flex flex-col justify-between ${
                      isSelected
                        ? (isTrial ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500 shadow-sm' : 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500 shadow-sm')
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{pkg.name}</h4>
                        {isTrial && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase">
                            Free
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{pkg.tagline}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-baseline justify-between">
                      <span className={`font-black text-lg ${isTrial ? 'text-emerald-600' : 'text-indigo-600'}`}>
                        {Number(pkg.price_inr) === 0 ? 'FREE' : `₹${Number(pkg.price_inr).toLocaleString('en-IN')}`}
                      </span>
                      <span className="text-[10px] text-slate-400">/{pkg.billing_period}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Template Selection */}
          <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold flex items-center gap-2 text-indigo-600">
              <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center text-xs">2</span>
              <span>Template Selection</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Choose Base Template Design
              </label>
              <select
                name="template"
                value={formData.template}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">-- No specific template (Let team propose best UI) --</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    [{t.category_name}] {t.title}
                  </option>
                ))}
              </select>
            </div>

            {selectedTemplateObj && (
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900 flex items-center gap-4 text-xs">
                <div className="w-16 h-12 rounded-lg bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                  <img
                    src={selectedTemplateObj.thumbnail_url}
                    alt={selectedTemplateObj.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white">{selectedTemplateObj.title}</h5>
                  <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-1">{selectedTemplateObj.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Organization & Contact Info */}
          <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold flex items-center gap-2 text-indigo-600">
              <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center text-xs">3</span>
              <span>Business & Contact Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Organization / School / Business Name *</label>
                <input
                  type="text"
                  name="organization_name"
                  placeholder="e.g. Apex International School"
                  required
                  value={formData.organization_name}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Business Type / Industry</label>
                <input
                  type="text"
                  name="business_type"
                  placeholder="e.g. CBSE School, Multi-speciality Clinic, Restaurant"
                  value={formData.business_type}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Contact Person Name *</label>
                <input
                  type="text"
                  name="customer_name"
                  placeholder="e.g. Rajesh Sharma"
                  required
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Official Email Address *</label>
                <input
                  type="email"
                  name="customer_email"
                  placeholder="e.g. principal@apexschool.in"
                  required
                  value={formData.customer_email}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">WhatsApp / Phone Number *</label>
                <input
                  type="tel"
                  name="customer_phone"
                  placeholder="e.g. +91 98765 43210"
                  required
                  value={formData.customer_phone}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">City / State</label>
                <input
                  type="text"
                  name="city"
                  placeholder="e.g. Varanasi, UP"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Step 4: Domain & Subdomain Configuration */}
          <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold flex items-center gap-2 text-indigo-600">
              <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center text-xs">4</span>
              <span>Domain & Subdomain Setup</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Free Platform Subdomain</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    name="requested_subdomain"
                    placeholder="apexschool"
                    value={formData.requested_subdomain}
                    onChange={handleSubdomainChange}
                    className="flex-1 px-3.5 py-2.5 rounded-l-xl border border-r-0 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <span className="px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 text-xs rounded-r-xl font-medium">
                    .aaradhyaenertech.com
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Instant active preview URL while subscription is active.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Own Registered Domain (Optional)</label>
                <input
                  type="text"
                  name="custom_domain"
                  placeholder="e.g. www.apexschool.org"
                  value={formData.custom_domain}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">We will provide DNS instructions to point your domain.</p>
              </div>
            </div>
          </div>

          {/* Step 5: Uploads & Requirements */}
          <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold flex items-center gap-2 text-indigo-600">
              <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center text-xs">5</span>
              <span>Content, Logo & Notes</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold mb-1">Website Pages, Features & Requirements</label>
              <textarea
                name="requirements_note"
                rows={3}
                placeholder="Mention sections needed (e.g. About, Principal Message, Courses, Fee Structure, Faculty, Location map, WhatsApp button)..."
                value={formData.requirements_note}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Upload Organization Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Upload Brochure / Content Document (Optional)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setBrochureFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left text-xs">
              <span className="text-slate-500">Selected Plan: </span>
              <strong className="text-slate-900 dark:text-white">
                {selectedPackageObj ? `${selectedPackageObj.name} (₹${Number(selectedPackageObj.price_inr).toLocaleString('en-IN')}/${selectedPackageObj.billing_period})` : 'Select a package'}
              </strong>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting Order...</span>
                </>
              ) : (
                <>
                  <span>Submit Website Order</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
