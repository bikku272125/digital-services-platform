import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { serviceAPI, requestAPI } from '../api/client';
import { LoadingSpinner, ErrorMessage } from '../components/UIComponents';
import {
  Send,
  CheckCircle,
  UploadCloud,
  File,
  X,
  ShieldCheck,
  AlertCircle,
  Copy,
  ArrowRight
} from 'lucide-react';

import { usePageSEO } from '../utils/useSEO';

export default function RequestServicePage() {
  usePageSEO({
    title: 'Request a Service — Digital Services Platform',
    description: 'Submit your digital project brief with zero signup required. Receive a transparent scope-based quotation within 24 hours.',
  });

  const [searchParams] = useSearchParams();
  const preselectCatId = searchParams.get('category');
  const preselectServId = searchParams.get('service');

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    customer_type: 'INDIVIDUAL',
    company_name: '',
    category: preselectCatId || '',
    service: preselectServId || '',
    description: '',
    budget: '',
    deadline: '',
    preferred_contact_method: 'EMAIL',
    existing_website_url: '',
    additional_notes: '',
    privacy_consent: false,
  });

  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadFormMetadata() {
      try {
        setLoadingInitial(true);
        const [catRes, servRes] = await Promise.all([
          serviceAPI.getCategories(),
          serviceAPI.getServices(),
        ]);
        setCategories(catRes.data || []);
        setServices(servRes.data.results || servRes.data || []);

        if (preselectCatId) {
          setFormData((prev) => ({ ...prev, category: preselectCatId }));
        }
        if (preselectServId) {
          setFormData((prev) => ({ ...prev, service: preselectServId }));
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setLoadingInitial(false);
      }
    }
    loadFormMetadata();
  }, [preselectCatId, preselectServId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      // Validate file size (<10MB)
      const validFiles = selected.filter((file) => {
        if (file.size > 10 * 1024 * 1024) {
          alert(`File "${file.name}" exceeds maximum allowed size of 10MB.`);
          return false;
        }
        return true;
      });
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    // Client-side validations
    if (!formData.customer_name.trim()) {
      setSubmitError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setSubmitError('Please enter a valid email address.');
      return;
    }
    if (!formData.phone.trim()) {
      setSubmitError('Please enter your phone number.');
      return;
    }
    if (!formData.description.trim() || formData.description.trim().length < 15) {
      setSubmitError('Please provide at least 15 characters describing your project requirements.');
      return;
    }
    if (!formData.budget.trim()) {
      setSubmitError('Please indicate your budget range or amount.');
      return;
    }
    if (!formData.deadline.trim()) {
      setSubmitError('Please provide your preferred completion deadline.');
      return;
    }
    if (!formData.privacy_consent) {
      setSubmitError('You must agree to the privacy policy to submit your request.');
      return;
    }

    try {
      setIsSubmitting(true);
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val !== null && val !== undefined && val !== '') {
          data.append(key, val);
        }
      });
      files.forEach((file) => {
        data.append('attachments', file);
      });

      const response = await requestAPI.createRequest(data);
      setSubmitSuccess(response.data);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReference = () => {
    if (submitSuccess?.public_reference) {
      navigator.clipboard.writeText(submitSuccess.public_reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loadingInitial) {
    return <LoadingSpinner message="Preparing service request form..." />;
  }

  // Filter services if category is selected
  const availableServices = formData.category
    ? services.filter((s) => String(s.category) === String(formData.category))
    : services;

  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl border border-emerald-200/80 p-8 sm:p-12 text-center shadow-lg space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle className="w-9 h-9" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Request Received Successfully!
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
            Thank you, <strong className="text-slate-800">{submitSuccess.customer_name}</strong>. We have logged your service inquiry into our system. Our team will review your specifications and prepare your customized quote.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-md mx-auto space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Your Unique Request Reference
            </span>
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl font-mono font-black text-indigo-600">
                {submitSuccess.public_reference}
              </span>
              <button
                type="button"
                onClick={copyReference}
                className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                title="Copy reference"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            {copied && <p className="text-xs text-emerald-600 font-semibold">Reference copied to clipboard!</p>}
          </div>

          <div className="text-left bg-indigo-50/60 rounded-xl p-5 border border-indigo-100 text-xs text-indigo-950 space-y-2">
            <p className="font-bold">Next Steps:</p>
            <ol className="list-decimal list-inside space-y-1 text-slate-700">
              <li>Our team reviews your project scope and files within 2-4 hours.</li>
              <li>You receive a clear quotation, breakdown, and estimated delivery timeline via your preferred contact method ({formData.preferred_contact_method}).</li>
              <li>Once you approve terms, work begins promptly.</li>
            </ol>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/services"
              className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
            >
              Back to Services
            </Link>
            <button
              onClick={() => {
                setSubmitSuccess(null);
                setFormData({
                  customer_name: '',
                  email: '',
                  phone: '',
                  customer_type: 'INDIVIDUAL',
                  company_name: '',
                  category: '',
                  service: '',
                  description: '',
                  budget: '',
                  deadline: '',
                  preferred_contact_method: 'EMAIL',
                  existing_website_url: '',
                  additional_notes: '',
                  privacy_consent: false,
                });
                setFiles([]);
              }}
              className="px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Request a Digital Service
        </h1>
        <p className="text-sm text-slate-600">
          Tell us what you need. No account creation required — fill the details below and we will contact you with a transparent quote.
        </p>
      </div>

      {submitError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span className="whitespace-pre-line">{submitError}</span>
        </div>
      )}

      {/* Main Request Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
        {/* Section 1: Contact Details */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
            1. Your Contact Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleInputChange}
                required
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="e.g. ramesh@example.com"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone / WhatsApp Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="+91 9161420942"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Client Type <span className="text-rose-500">*</span>
              </label>
              <select
                name="customer_type"
                value={formData.customer_type}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="INDIVIDUAL">Individual / Freelancer</option>
                <option value="BUSINESS">Company / Startup / Local Business</option>
              </select>
            </div>

            {formData.customer_type === 'BUSINESS' && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  placeholder="e.g. Acme Tech Solutions Pvt Ltd"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Service Selection */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
            2. Desired Service
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value,
                    service: '', // reset service selection when category changes
                  }));
                }}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">-- Select Category (or Custom) --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specific Service Package (Optional)
              </label>
              <select
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">-- Custom Scope / Not Listed --</option>
                {availableServices.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Project Requirements */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
            3. Project Requirements & Timeline
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Project Description & Goals <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Describe what you want to achieve, features required, target audience, or specific problem to solve (min 15 characters)..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Approximate Budget Range <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                required
                placeholder="e.g. Flexible, Under 10k, or define your range"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Deadline <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                required
                placeholder="e.g. 5 days, 2 weeks, or by end of month"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Existing Website / Reference Link
              </label>
              <input
                type="url"
                name="existing_website_url"
                value={formData.existing_website_url}
                onChange={handleInputChange}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Communication Channel
              </label>
              <select
                name="preferred_contact_method"
                value={formData.preferred_contact_method}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="EMAIL">Email</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="PHONE">Phone Call</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: File Attachments */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
            4. Attachments & Assets (Optional)
          </h2>

          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-indigo-400 transition bg-slate-50/50">
            <UploadCloud className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700 mb-1">
              Upload requirement documents, mockups, or source files
            </p>
            <p className="text-[11px] text-slate-500 mb-3">
              Supported: PDF, DOCX, PNG, JPG, ZIP, CSV, XLSX (Max 10MB per file)
            </p>
            <label className="cursor-pointer px-4 py-2 bg-white border border-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-50 transition text-slate-700 shadow-sm inline-block">
              Choose Files
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg,.zip,.csv,.xlsx"
              />
            </label>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-700">Selected files ({files.length}):</p>
              <div className="space-y-1.5">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center space-x-2 truncate">
                      <File className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate font-medium text-slate-800">{f.name}</span>
                      <span className="text-slate-400">({(f.size / 1024).toFixed(0)} KB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 5: Consent & Submit */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="privacy_consent"
              checked={formData.privacy_consent}
              onChange={handleInputChange}
              required
              className="mt-1 w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
            />
            <span className="text-xs text-slate-600 leading-relaxed">
              I agree to the <Link to="/privacy-policy" className="text-indigo-600 underline">Privacy Policy</Link> and understand that my contact details will be used solely to communicate regarding this service request and quotation.
            </span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold text-sm transition shadow-sm hover:shadow flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <span>Submitting Your Requirements...</span>
            ) : (
              <>
                <span>Submit Service Request</span>
                <Send className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
