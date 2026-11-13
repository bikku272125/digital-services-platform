import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import {
  Globe,
  Store,
  ShieldCheck,
  ExternalLink,
  Edit3,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Save,
  CheckCircle,
  Download,
  FileCode2,
  Lock,
  Layers,
  ArrowRight,
  LogOut,
  Image as ImageIcon
} from 'lucide-react';
import { waasAPI } from '../../api/client';

export default function ClientAdminPortalPage() {
  const [searchParams] = useSearchParams();
  const { subdomain } = useParams();

  const refFromUrl = searchParams.get('ref') || '';
  const tokenFromUrl = searchParams.get('token') || '';

  // Credentials State
  const [orderRef, setOrderRef] = useState(refFromUrl);
  const [clientKey, setClientKey] = useState(tokenFromUrl);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Order & Content State
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  // Editable fields by client
  const [clientForm, setClientForm] = useState({
    organization_name: '',
    customer_phone: '',
    customer_email: '',
    city: '',
    requirements_note: '',
  });

  // Export State
  const [exporting, setExporting] = useState(false);
  const [exportMsg, setExportMsg] = useState('');

  const loadClientSite = async (ref, key) => {
    if (!ref) return;
    setLoading(true);
    setLoginError('');
    try {
      const params = { ref };
      if (key) {
        if (key.includes('@')) params.email = key;
        else params.token = key;
      }
      const res = await waasAPI.getOrderStatus(params);
      setOrderData(res.data);
      setIsAuthenticated(true);
      setClientForm({
        organization_name: res.data.organization_name || '',
        customer_phone: res.data.customer_phone || '',
        customer_email: res.data.customer_email || '',
        city: res.data.city || '',
        requirements_note: res.data.requirements_note || '',
      });
      // Store in session
      sessionStorage.setItem('client_admin_ref', ref);
      sessionStorage.setItem('client_admin_key', key || '');
    } catch (err) {
      console.error(err);
      setLoginError('Could not find website with these credentials. Please check Order Reference and Phone/Email.');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedRef = refFromUrl || sessionStorage.getItem('client_admin_ref');
    const savedKey = tokenFromUrl || sessionStorage.getItem('client_admin_key');
    if (savedRef) {
      setOrderRef(savedRef);
      if (savedKey) setClientKey(savedKey);
      loadClientSite(savedRef, savedKey);
    } else if (subdomain) {
      // Auto-load by subdomain
      waasAPI.getOrderStatus({ subdomain })
        .then(res => {
          setOrderData(res.data);
          setOrderRef(res.data.order_ref);
          setClientForm({
            organization_name: res.data.organization_name || '',
            customer_phone: res.data.customer_phone || '',
            customer_email: res.data.customer_email || '',
            city: res.data.city || '',
            requirements_note: res.data.requirements_note || '',
          });
          setIsAuthenticated(true);
        })
        .catch(() => {});
    }
  }, [refFromUrl, tokenFromUrl, subdomain]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    loadClientSite(orderRef, clientKey);
  };

  const handleClientSave = async (e) => {
    e.preventDefault();
    if (!orderData) return;
    setSaving(true);
    setSaveSuccess('');

    try {
      // Update public order record
      const res = await waasAPI.updateAdminOrder(orderData.order_ref, clientForm);
      setOrderData(res.data);
      setSaveSuccess('Your website information & contact details were updated successfully!');
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err) {
      alert('Failed to save changes: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleRequestDownload = async () => {
    if (!orderData) return;
    setExporting(true);
    setExportMsg('');
    try {
      const res = await waasAPI.triggerExport(orderData.order_ref, {
        token: orderData.access_token,
        notes: 'Client requested source archive from Client Admin Portal',
      });
      setExportMsg(res.data.message || '100% Portability ZIP generation queued! You will receive all code, media & database.');
    } catch (err) {
      alert('Failed to trigger ZIP package: ' + (err.message || 'Unknown error'));
    } finally {
      setExporting(false);
    }
  };

  const liveUrl = orderData?.deployed_url || (orderData?.requested_subdomain ? `https://digital.aaradhyaenertech.com/${orderData.requested_subdomain}` : '');

  // Login Screen if not yet authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg">
              <Store className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Client Website Manager</h1>
            <p className="text-xs text-slate-500">
              Sign in to manage your live business website, update phone numbers, timing, and download 1-click backups.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Order Reference ID *</label>
              <input
                type="text"
                required
                placeholder="e.g. WAAS-7741F454"
                value={orderRef}
                onChange={(e) => setOrderRef(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Registered Phone or Email</label>
              <input
                type="text"
                placeholder="e.g. +91 9369928423 or client@gmail.com"
                value={clientKey}
                onChange={(e) => setClientKey(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Access My Website Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <Link to="/website-status" className="text-xs text-indigo-600 hover:underline font-bold">
              Looking for public order tracking instead? →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Header */}
      <header className="bg-slate-900 text-white px-4 sm:px-8 py-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white">{orderData.organization_name}</h1>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-black text-[10px] uppercase">
                  {orderData.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">Ref: {orderData.order_ref}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow"
              >
                <span>View Live Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={() => {
                sessionStorage.removeItem('client_admin_ref');
                sessionStorage.removeItem('client_admin_key');
                setIsAuthenticated(false);
              }}
              className="p-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* Banner Alert for Free Trial / Status */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 to-purple-900 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-amber-300 text-xs font-black uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
              <Sparkles className="w-4 h-4" />
              <span>{orderData.is_trial ? '7-Day Free Trial Active' : 'Premium Subscription'}</span>
            </span>
            <h2 className="text-xl font-black">Your Website is Live & Ready to Receive Customers</h2>
            <p className="text-xs text-indigo-200">
              Live link: <code className="bg-white/10 px-2 py-0.5 rounded font-mono text-white">{liveUrl || 'Generating...'}</code>
            </p>
          </div>

          <button
            onClick={handleRequestDownload}
            disabled={exporting}
            className="px-5 py-3 rounded-2xl bg-white text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-slate-100 transition shadow flex items-center gap-2 shrink-0"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>{exporting ? 'Packaging...' : 'Export 100% Code & ZIP'}</span>
          </button>
        </div>

        {exportMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{exportMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Client Editable Information */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-indigo-600" />
                  <span>Update Business Information</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Changes made here update instantly on your live website banner, header, and WhatsApp click-to-chat.
                </p>
              </div>
              {saveSuccess && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {saveSuccess}
                </span>
              )}
            </div>

            <form onSubmit={handleClientSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Business / Store Name *</label>
                  <input
                    type="text"
                    required
                    value={clientForm.organization_name}
                    onChange={(e) => setClientForm({ ...clientForm, organization_name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp & Call Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 9369928423"
                    value={clientForm.customer_phone}
                    onChange={(e) => setClientForm({ ...clientForm, customer_phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-bold text-emerald-600"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Used for all customer WhatsApp inquiries</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Email Address</label>
                  <input
                    type="email"
                    value={clientForm.customer_email}
                    onChange={(e) => setClientForm({ ...clientForm, customer_email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Store City / Full Address</label>
                  <input
                    type="text"
                    value={clientForm.city}
                    onChange={(e) => setClientForm({ ...clientForm, city: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Opening Hours, Offers & Tagline</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Festival Sarees 50% Off • Open Everyday 10:00 AM - 9:00 PM • Main Market Khalilabad"
                  value={clientForm.requirements_note}
                  onChange={(e) => setClientForm({ ...clientForm, requirements_note: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider transition shadow flex items-center gap-2"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save & Publish Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Plan Details & Assets */}
          <div className="space-y-6">
            
            {/* Plan Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 text-xs">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Subscription Plan</span>
              </h4>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Package:</span>
                  <span className="font-bold text-slate-900">{orderData.package_details?.name || '7-Day Free Trial'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Design Template:</span>
                  <span className="font-bold text-indigo-600">{orderData.template_details?.title || 'UrbanCart Showroom & Boutique'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Domain Mode:</span>
                  <span className="font-bold text-slate-900 font-mono">digital.aaradhyaenertech.com/{orderData.requested_subdomain}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2">
                  <span className="text-slate-500">Payment Status:</span>
                  <span className="font-black text-emerald-700 uppercase">{orderData.payment_status}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-700 block">Support & Upgrades:</span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Need a custom .com domain, payment gateway, or extra product categories? Contact our engineer directly on WhatsApp:
                </p>
                <a
                  href="https://wa.me/919369928423?text=Hello,%20I%20want%20to%20upgrade%20my%20website%20subscription."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-100 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Platform Support (+91 9369928423)</span>
                </a>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">Quick Links</h4>
              <Link
                to={liveUrl || '#'}
                target="_blank"
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold flex items-center justify-between transition"
              >
                <span>Open Public Website</span>
                <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
              </Link>
              <Link
                to={`/website-status?ref=${orderData.order_ref}`}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold flex items-center justify-between transition"
              >
                <span>Track Subscription Lifecycle</span>
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
              </Link>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
