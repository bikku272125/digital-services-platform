import React, { useEffect, useState } from 'react';
import apiClient from '../api/client';
import {
  Inbox,
  FileCheck,
  Package,
  CreditCard,
  Search,
  ExternalLink,
  CheckCircle,
  Clock,
  Send,
  PlusCircle,
  FileText,
  DollarSign,
  AlertCircle,
  LogIn,
  LogOut,
  RefreshCw,
  Phone,
  Mail,
  Building,
  User,
  Calendar,
  Layers
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('dsp_admin_auth') === 'true'
  );
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState('requests'); // requests | orders
  const [requests, setRequests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Quote Form in Modal / Drawer
  const [quoteForm, setQuoteForm] = useState({
    amount: '',
    scope_of_work: '',
    estimated_delivery_days: 7,
    revision_limit: 2,
    terms: '50% advance to start, 50% upon final delivery review.',
  });
  const [actionSuccess, setActionSuccess] = useState(null);
  const [actionError, setActionError] = useState(null);

  // Helper for auth header
  const getAuthHeaders = () => {
    const creds = localStorage.getItem('dsp_admin_creds');
    if (!creds) return {};
    return {
      Authorization: `Basic ${creds}`,
    };
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const basicToken = btoa(`${username}:${password}`);
      // Test request to admin endpoint
      await apiClient.get('/admin/requests/', {
        headers: { Authorization: `Basic ${basicToken}` },
      });
      localStorage.setItem('dsp_admin_auth', 'true');
      localStorage.setItem('dsp_admin_creds', basicToken);
      setIsAuthenticated(true);
      fetchDashboardData(basicToken);
    } catch (err) {
      setLoginError('Invalid username or password. (Default is admin / admin1234)');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dsp_admin_auth');
    localStorage.removeItem('dsp_admin_creds');
    setIsAuthenticated(false);
  };

  const fetchDashboardData = async (tokenOverride) => {
    try {
      setLoading(true);
      const headers = tokenOverride
        ? { Authorization: `Basic ${tokenOverride}` }
        : getAuthHeaders();

      const [reqRes, ordRes] = await Promise.all([
        apiClient.get('/admin/requests/', { headers }),
        apiClient.get('/admin/orders/', { headers }),
      ]);
      setRequests(reqRes.data.results || reqRes.data || []);
      setOrders(ordRes.data.results || ordRes.data || []);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const handleCreateQuote = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;
    setActionError(null);
    setActionSuccess(null);
    try {
      const headers = getAuthHeaders();
      // 1. Create Quote
      const quoteRes = await apiClient.post(
        `/admin/requests/${selectedRequest.id}/quotes/`,
        quoteForm,
        { headers }
      );
      const quoteId = quoteRes.data.id;

      // 2. Mark Sent
      await apiClient.post(`/admin/quotes/${quoteId}/send/`, {}, { headers });

      setActionSuccess(`Quote created and marked SENT for ${selectedRequest.public_reference}!`);
      fetchDashboardData();
      // Refresh current selected item
      const updated = await apiClient.get(`/admin/requests/${selectedRequest.id}/`, { headers });
      setSelectedRequest(updated.data);
    } catch (err) {
      setActionError(err.message || 'Failed to generate quotation.');
    }
  };

  const handleAcceptQuote = async (quoteId) => {
    if (!window.confirm('Confirm customer acceptance and generate formal Order?')) return;
    try {
      const headers = getAuthHeaders();
      await apiClient.post(`/admin/quotes/${quoteId}/accept/`, {}, { headers });
      alert('Quote accepted! Order has been created.');
      fetchDashboardData();
      if (selectedRequest) {
        const updated = await apiClient.get(`/admin/requests/${selectedRequest.id}/`, { headers });
        setSelectedRequest(updated.data);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Login Screen if unauthenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xl max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
              <Layers className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Portal</h1>
            <p className="text-xs text-slate-500">
              Sign in to manage service requests, quotations, orders, and deliverables.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">Default credentials: admin / admin1234</p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow flex items-center justify-center space-x-2"
            >
              <span>Sign In to Admin</span>
              <LogIn className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
            Live Management Dashboard
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Platform Operations</h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchDashboardData()}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <a
            href="http://127.0.0.1:8080/admin/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <span>Django Admin</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => {
            setActiveTab('requests');
            setSelectedRequest(null);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'requests'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Incoming Requests ({requests.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('orders');
            setSelectedOrder(null);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'orders'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Active Orders & Work ({orders.length})</span>
        </button>
      </div>

      {/* Main Content Area */}
      {activeTab === 'requests' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Requests List */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Customer Requests
            </h2>
            {requests.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                No customer requests submitted yet.
              </div>
            ) : (
              requests.map((r) => {
                const isSelected = selectedRequest?.id === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => {
                      setSelectedRequest(r);
                      setQuoteForm({
                        amount: '',
                        scope_of_work: `Deliverables for ${r.customer_name}: ${r.description.slice(0, 100)}...`,
                        estimated_delivery_days: 7,
                        revision_limit: 2,
                        terms: '50% advance to start, 50% upon final delivery review.',
                      });
                      setActionSuccess(null);
                      setActionError(null);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-400 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-black text-indigo-600">
                        {r.public_reference}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {r.status}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 truncate">{r.customer_name}</p>
                    <p className="text-xs text-slate-500 truncate">{r.email} • {r.phone}</p>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">{r.description}</p>
                  </div>
                );
              })
            )}
          </div>

          {/* Request Inspection & Quotation Action */}
          <div className="lg:col-span-2">
            {selectedRequest ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-indigo-600">
                      {selectedRequest.public_reference}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                      {selectedRequest.customer_name}
                    </h2>
                    {selectedRequest.company_name && (
                      <p className="text-xs text-slate-500 font-medium">
                        {selectedRequest.company_name} ({selectedRequest.customer_type})
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                      Status: {selectedRequest.status}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                    <span className="text-slate-400 font-medium">Contact:</span>
                    <p className="font-semibold text-slate-800 flex items-center">
                      <Mail className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {selectedRequest.email}
                    </p>
                    <p className="font-semibold text-slate-800 flex items-center">
                      <Phone className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {selectedRequest.phone} ({selectedRequest.preferred_contact_method})
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 font-medium">Scope Info:</span>
                    <p className="font-semibold text-slate-800">Budget: {selectedRequest.budget}</p>
                    <p className="font-semibold text-slate-800">Deadline: {selectedRequest.deadline}</p>
                    {selectedRequest.category_name && (
                      <p className="text-slate-600">Category: {selectedRequest.category_name}</p>
                    )}
                  </div>
                </div>

                {/* Full Description */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Requirements
                  </h3>
                  <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-800 leading-relaxed border border-slate-100 whitespace-pre-wrap">
                    {selectedRequest.description}
                  </div>
                </div>

                {/* Attachments */}
                {selectedRequest.attachments?.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Client Uploads ({selectedRequest.attachments.length})
                    </h3>
                    <div className="space-y-2">
                      {selectedRequest.attachments.map((att) => (
                        <a
                          key={att.id}
                          href={att.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-indigo-600 hover:bg-indigo-50/50 transition"
                        >
                          <span>{att.original_filename}</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Create Quotation Form */}
                <div className="pt-4 border-t border-slate-200 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center">
                    <DollarSign className="w-4 h-4 text-indigo-600 mr-1" />
                    Generate & Send Quotation to Customer
                  </h3>

                  {actionSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{actionSuccess}</span>
                    </div>
                  )}

                  {actionError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                      {actionError}
                    </div>
                  )}

                  <form onSubmit={handleCreateQuote} className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Amount in INR (₹) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={quoteForm.amount}
                          onChange={(e) => setQuoteForm({ ...quoteForm, amount: e.target.value })}
                          placeholder="e.g. 8500"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Delivery Days *
                        </label>
                        <input
                          type="number"
                          required
                          value={quoteForm.estimated_delivery_days}
                          onChange={(e) => setQuoteForm({ ...quoteForm, estimated_delivery_days: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Revision Rounds
                        </label>
                        <input
                          type="number"
                          value={quoteForm.revision_limit}
                          onChange={(e) => setQuoteForm({ ...quoteForm, revision_limit: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Agreed Scope of Work *
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={quoteForm.scope_of_work}
                        onChange={(e) => setQuoteForm({ ...quoteForm, scope_of_work: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Issue Quote & Update Status</span>
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-12 bg-white rounded-3xl border border-dashed border-slate-200 text-xs text-slate-400">
                Select a customer request on the left to review requirements and generate a quotation.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Orders & Active Work View */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">Active Orders ({orders.length})</h2>
          {orders.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No orders converted yet. Once a customer quotation is accepted, it turns into an order here.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div key={ord.id} className="p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-indigo-600">
                        {ord.public_reference}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 mt-0.5">
                        {ord.customer_name} ({ord.customer_email})
                      </h3>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="px-2.5 py-1 rounded-full font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        {ord.status}
                      </span>
                      <span className="px-2.5 py-1 rounded-full font-bold bg-slate-100 text-slate-700">
                        Payment: {ord.payment_status}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                    <span>Agreed Quote Amount: <strong>₹{ord.quote_amount}</strong></span>
                    <span>Due Date: {ord.due_date || 'Standard turnaround'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
