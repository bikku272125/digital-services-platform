import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Globe,
  Search,
  CheckCircle2,
  Clock,
  Download,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  FileCode2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { waasAPI } from '../../api/client';

export default function WebsiteStatusPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRef = searchParams.get('ref') || '';
  const initialToken = searchParams.get('token') || '';

  const [orderRef, setOrderRef] = useState(initialRef);
  const [emailOrToken, setEmailOrToken] = useState(initialToken);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Export Request state
  const [exportNotes, setExportNotes] = useState('');
  const [exportSubmitting, setExportSubmitting] = useState(false);
  const [exportSuccessMsg, setExportSuccessMsg] = useState('');

  const fetchStatus = (refVal, authVal) => {
    if (!refVal && !authVal) return;
    setLoading(true);
    setErrorMsg('');

    const params = {};
    if (refVal) params.ref = refVal;
    if (authVal) {
      if (authVal.includes('@')) {
        params.email = authVal;
      } else {
        params.token = authVal;
      }
    }

    waasAPI.getOrderStatus(params)
      .then(res => setOrder(res.data))
      .catch(err => {
        console.error(err);
        setOrder(null);
        setErrorMsg('Website order not found. Please verify your Order Reference and Email/Token.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (initialRef || initialToken) {
      fetchStatus(initialRef, initialToken);
    }
  }, [initialRef, initialToken]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const next = new URLSearchParams();
    if (orderRef) next.set('ref', orderRef);
    if (emailOrToken) next.set('token', emailOrToken);
    setSearchParams(next);
    fetchStatus(orderRef, emailOrToken);
  };

  const handleTriggerExport = async (e) => {
    e.preventDefault();
    if (!order) return;
    setExportSubmitting(true);
    setExportSuccessMsg('');

    try {
      const payload = {
        token: order.access_token,
        notes: exportNotes,
      };
      const res = await waasAPI.triggerExport(order.order_ref, payload);
      setExportSuccessMsg(res.data.message || 'Export request received! We are archiving your website files.');
      // Refresh order to show latest export status
      fetchStatus(order.order_ref, order.access_token);
    } catch (err) {
      console.error(err);
      alert('Failed to request export: ' + (err.message || 'Unknown error'));
    } finally {
      setExportSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">Live & Active</span>;
      case 'deployed_preview':
        return <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 font-bold text-xs">Preview Ready on Subdomain</span>;
      case 'in_development':
        return <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs">In Development</span>;
      case 'under_review':
        return <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">Requirements Under Review</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-bold text-xs">Order Received</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3 border border-indigo-200 dark:border-indigo-800">
            <Globe className="w-3.5 h-3.5" />
            <span>Customer Portal</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Track Website & Subdomain Status
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            View live subdomain links, SSL state, deployment timeline, and export your website code and database anytime.
          </p>
        </div>

        {/* Lookup Box */}
        <form onSubmit={handleSearchSubmit} className="mb-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Order Reference (e.g. WAAS-12345678)"
            value={orderRef}
            onChange={(e) => setOrderRef(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Customer Email or Access Token"
            value={emailOrToken}
            onChange={(e) => setEmailOrToken(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider transition shrink-0 flex items-center justify-center gap-2"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Search className="w-4 h-4" />}
            <span>Lookup</span>
          </button>
        </form>

        {errorMsg && (
          <div className="mb-8 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Order Details Display */}
        {order && (
          <div className="space-y-8">
            
            {/* Main Status Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project Portal</span>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                    {order.organization_name}
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-1">Ref: {order.order_ref}</p>
                </div>
                <div>{getStatusBadge(order.status)}</div>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Selected Package</span>
                  <p className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                    {order.package_details?.name || 'Annual Package'}
                  </p>
                  <p className="text-slate-500 mt-0.5">₹{Number(order.total_amount_inr).toLocaleString('en-IN')}/year</p>
                </div>

                <div>
                  <span className="text-slate-400 font-medium">Assigned Subdomain</span>
                  <p className="font-bold text-sm text-indigo-600 mt-1">
                    {order.assigned_subdomain ? `${order.assigned_subdomain}.aaradhyaenertech.com` : (order.requested_subdomain ? `${order.requested_subdomain}.aaradhyaenertech.com` : 'Pending Assignment')}
                  </p>
                  {order.deployed_url && (
                    <a
                      href={order.deployed_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-indigo-600 font-semibold hover:underline mt-1"
                    >
                      <span>Open Live Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div>
                  <span className="text-slate-400 font-medium">Custom Domain</span>
                  <p className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                    {order.custom_domain || 'None requested yet'}
                  </p>
                  <p className="text-slate-400 text-[11px] mt-0.5">DNS: Point CNAME to digital.aaradhyaenertech.com</p>
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Deployment Pipeline</h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className={`p-3 rounded-xl border ${['pending', 'under_review', 'in_development', 'deployed_preview', 'active'].includes(order.status) ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30' : 'border-slate-200'}`}>
                    <span className="text-[10px] font-bold text-indigo-600">Step 1</span>
                    <p className="font-semibold mt-1">Order Received</p>
                  </div>
                  <div className={`p-3 rounded-xl border ${['under_review', 'in_development', 'deployed_preview', 'active'].includes(order.status) ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30' : 'border-slate-200'}`}>
                    <span className="text-[10px] font-bold text-indigo-600">Step 2</span>
                    <p className="font-semibold mt-1">Design & Content</p>
                  </div>
                  <div className={`p-3 rounded-xl border ${['deployed_preview', 'active'].includes(order.status) ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30' : 'border-slate-200'}`}>
                    <span className="text-[10px] font-bold text-indigo-600">Step 3</span>
                    <p className="font-semibold mt-1">Subdomain Preview</p>
                  </div>
                  <div className={`p-3 rounded-xl border ${order.status === 'active' ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30' : 'border-slate-200'}`}>
                    <span className="text-[10px] font-bold text-emerald-600">Step 4</span>
                    <p className="font-semibold mt-1">Live & SSL Active</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Website Portability / 1-Click Export Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center shrink-0">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Website Portability & Export
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Under our platform principles, you retain complete ownership of your website. Request a full ZIP archive containing your static source code, HTML/CSS, images, and database export anytime.
                  </p>
                </div>
              </div>

              {exportSuccessMsg && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{exportSuccessMsg}</span>
                </div>
              )}

              {/* Existing Export Requests */}
              {order.export_requests && order.export_requests.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-500">Recent Export Archives:</h4>
                  {order.export_requests.map((exp) => (
                    <div key={exp.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">Website Package ZIP</span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-mono">
                            {exp.status}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px]">{exp.admin_instructions}</p>
                      </div>
                      {exp.archive_file ? (
                        <a
                          href={exp.archive_file}
                          download
                          className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Archive</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">Preparing archive...</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Request New Export Form */}
              <form onSubmit={handleTriggerExport} className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Reason for Export or Destination Hosting</label>
                  <input
                    type="text"
                    placeholder="e.g. Routine backup, or migrating to our internal AWS/Hostinger server"
                    value={exportNotes}
                    onChange={(e) => setExportNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={exportSubmitting}
                  className="py-2.5 px-6 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs uppercase tracking-wider hover:opacity-90 transition flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{exportSubmitting ? 'Requesting Export...' : 'Generate New Website Export'}</span>
                </button>
              </form>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
