import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  FileText,
  User,
  Briefcase,
  Layers,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  Trash2
} from 'lucide-react';
import { posterAPI } from '../../api/client';

export default function PosterOrderForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    customer_type: 'INDIVIDUAL',
    category: searchParams.get('category') || '',
    template: searchParams.get('template') || '',
    heading: '',
    content: '',
    language: 'BOTH',
    colour_preference: '',
    custom_instructions: '',
    output_size: 'WHATSAPP',
    output_format: 'PNG',
    budget: '',
    required_delivery_date: '',
    privacy_consent: false,
  });

  // Uploaded files states
  const [customerPhotos, setCustomerPhotos] = useState([]);
  const [businessLogos, setBusinessLogos] = useState([]);
  const [referenceImages, setReferenceImages] = useState([]);

  // UI status
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    Promise.all([
      posterAPI.getCategories().catch(() => ({ data: [] })),
      posterAPI.getTemplates().catch(() => ({ data: [] }))
    ]).then(([catRes, tmplRes]) => {
      setCategories(catRes.data || []);
      setTemplates(tmplRes.data || []);
      setLoadingInitial(false);

      // Pre-select category if none was provided
      if (!formData.category && catRes.data && catRes.data.length > 0) {
        setFormData(prev => ({ ...prev, category: catRes.data[0].id }));
      }
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileDrop = (files, setter) => {
    const validFiles = Array.from(files).filter(f => {
      const isAllowed = /\.(png|jpe?g|webp|pdf|svg)$/i.test(f.name);
      const isUnderLimit = f.size <= 10 * 1024 * 1024; // 10MB limit
      return isAllowed && isUnderLimit;
    });
    setter(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index, setter) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const errors = {};
    if (!formData.customer_name.trim()) errors.customer_name = 'Customer name is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Valid email is required';
    if (!formData.phone.trim()) errors.phone = 'Contact phone number is required';
    if (!formData.category) errors.category = 'Please select a poster category';
    if (!formData.heading.trim()) errors.heading = 'Poster heading or slogan is required';
    if (!formData.content.trim()) errors.content = 'Poster text content / message is required';
    if (!formData.privacy_consent) errors.privacy_consent = 'You must agree to the design & privacy terms';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    setUploadProgress(10);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (val !== null && val !== undefined && val !== '') {
        payload.append(key, val);
      }
    });

    customerPhotos.forEach(f => payload.append('customer_photos', f));
    businessLogos.forEach(f => payload.append('business_logos', f));
    referenceImages.forEach(f => payload.append('reference_images', f));

    try {
      const response = await posterAPI.createOrder(payload, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      });

      if (response.data && response.data.order) {
        navigate('/poster-studio/order-success', {
          state: {
            order: response.data.order,
            reference: response.data.order.public_reference,
            customer_name: formData.customer_name,
            email: formData.email,
          }
        });
      }
    } catch (err) {
      console.error('Order submission error', err);
      setErrorMessage(err.message || 'Failed to submit order. Please verify your inputs and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter templates matching current category
  const filteredTemplates = templates.filter(t => {
    if (!formData.category) return true;
    return String(t.category) === String(formData.category);
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
            <span>Poster Design Studio</span>
            <span>•</span>
            <span>Custom Order Form</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Request a Custom Poster Design
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Fill in your poster content in Hindi or English, attach photos or logos, and our design team will craft your print-ready poster.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-8 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Submission Failed</div>
              <div className="whitespace-pre-line mt-1">{errorMessage}</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Customer Information */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              <User className="w-5 h-5 text-indigo-600" />
              <span>1. Customer & Contact Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  placeholder="e.g. Brijesh Kumar Yadav"
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border ${
                    formErrors.customer_name ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`}
                />
                {formErrors.customer_name && <p className="text-red-500 text-xs mt-1">{formErrors.customer_name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. bikkuyadav9190@gmail.com"
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border ${
                    formErrors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`}
                />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Mobile Number / WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 9161420942"
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border ${
                    formErrors.phone ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`}
                />
                {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Customer Type
                </label>
                <select
                  name="customer_type"
                  value={formData.customer_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="INDIVIDUAL">Individual / Personal</option>
                  <option value="BUSINESS">Business / Shop / Organization</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Poster Content & Category */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              <Layers className="w-5 h-5 text-indigo-600" />
              <span>2. Poster Details & Customized Content</span>
            </h2>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Poster Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    <option value="">Select an occasion category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {formErrors.category && <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Select Template (Optional)
                  </label>
                  <select
                    name="template"
                    value={formData.template}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    <option value="">No specific template (Custom Layout)</option>
                    {filteredTemplates.map(t => (
                      <option key={t.id} value={t.id}>{t.name} (₹{parseFloat(t.starting_price).toFixed(0)})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Poster Heading / Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="heading"
                  value={formData.heading}
                  onChange={handleChange}
                  placeholder="e.g. ग्राम प्रधान पद हेतु कर्मठ प्रत्याशी OR Mega Grand Opening 50% Off"
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border ${
                    formErrors.heading ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`}
                />
                {formErrors.heading && <p className="text-red-500 text-xs mt-1">{formErrors.heading}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Complete Poster Content & Text <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  rows={4}
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Enter the slogans, candidate or host name, event date, venue, shop address, contact numbers, or any specific bullet points in Hindi or English."
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border ${
                    formErrors.content ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`}
                />
                {formErrors.content && <p className="text-red-500 text-xs mt-1">{formErrors.content}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Preferred Language
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    <option value="HINDI">Hindi (हिंदी)</option>
                    <option value="ENGLISH">English</option>
                    <option value="BOTH">Both (Hindi & English Bilingual)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Color Preferences
                  </label>
                  <input
                    type="text"
                    name="colour_preference"
                    value={formData.colour_preference}
                    onChange={handleChange}
                    placeholder="e.g. Royal Golden & Red, Navy Blue & White"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Additional Design Instructions
                </label>
                <input
                  type="text"
                  name="custom_instructions"
                  value={formData.custom_instructions}
                  onChange={handleChange}
                  placeholder="e.g. Please put candidate photo on right side and election symbol on left"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 3: File & Asset Uploads */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              <Upload className="w-5 h-5 text-indigo-600" />
              <span>3. Image & Asset Uploads</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Customer Photo */}
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center hover:border-indigo-500 transition">
                <ImageIcon className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">Customer / Candidate Photo</div>
                <div className="text-[11px] text-slate-500 mt-0.5">High quality portrait or passport photo</div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  id="photo-upload"
                  className="hidden"
                  onChange={(e) => handleFileDrop(e.target.files, setCustomerPhotos)}
                />
                <label
                  htmlFor="photo-upload"
                  className="mt-3 inline-block px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-semibold cursor-pointer hover:bg-indigo-100"
                >
                  Choose Photos
                </label>

                {customerPhotos.length > 0 && (
                  <div className="mt-3 space-y-1 text-left">
                    {customerPhotos.map((f, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px] bg-slate-100 dark:bg-slate-800 p-1.5 rounded">
                        <span className="truncate max-w-[130px]">{f.name}</span>
                        <button type="button" onClick={() => removeFile(i, setCustomerPhotos)} className="text-red-500">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Business Logo */}
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center hover:border-indigo-500 transition">
                <Briefcase className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">Business / Shop Logo</div>
                <div className="text-[11px] text-slate-500 mt-0.5">PNG transparent or SVG preferred</div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  id="logo-upload"
                  className="hidden"
                  onChange={(e) => handleFileDrop(e.target.files, setBusinessLogos)}
                />
                <label
                  htmlFor="logo-upload"
                  className="mt-3 inline-block px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-semibold cursor-pointer hover:bg-indigo-100"
                >
                  Choose Logos
                </label>

                {businessLogos.length > 0 && (
                  <div className="mt-3 space-y-1 text-left">
                    {businessLogos.map((f, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px] bg-slate-100 dark:bg-slate-800 p-1.5 rounded">
                        <span className="truncate max-w-[130px]">{f.name}</span>
                        <button type="button" onClick={() => removeFile(i, setBusinessLogos)} className="text-red-500">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reference Image */}
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center hover:border-indigo-500 transition">
                <FileText className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">Reference Image / Sample</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Any sample design you like</div>
                <input
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  id="ref-upload"
                  className="hidden"
                  onChange={(e) => handleFileDrop(e.target.files, setReferenceImages)}
                />
                <label
                  htmlFor="ref-upload"
                  className="mt-3 inline-block px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-semibold cursor-pointer hover:bg-indigo-100"
                >
                  Choose Samples
                </label>

                {referenceImages.length > 0 && (
                  <div className="mt-3 space-y-1 text-left">
                    {referenceImages.map((f, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px] bg-slate-100 dark:bg-slate-800 p-1.5 rounded">
                        <span className="truncate max-w-[130px]">{f.name}</span>
                        <button type="button" onClick={() => removeFile(i, setReferenceImages)} className="text-red-500">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Output Preferences */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              <Clock className="w-5 h-5 text-indigo-600" />
              <span>4. Output Dimensions & Deadlines</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Output Size
                </label>
                <select
                  name="output_size"
                  value={formData.output_size}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="WHATSAPP">WhatsApp (1:1 / 4:5)</option>
                  <option value="INSTAGRAM_POST">Instagram Post (1:1)</option>
                  <option value="INSTAGRAM_STORY">Instagram Story (9:16)</option>
                  <option value="A4">A4 Printable Poster</option>
                  <option value="CUSTOM">Custom Dimensions</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Output Format
                </label>
                <select
                  name="output_format"
                  value={formData.output_format}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="PNG">PNG (High Resolution)</option>
                  <option value="JPG">JPG (Standard)</option>
                  <option value="PDF">PDF (Print Ready)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Required Delivery Date
                </label>
                <input
                  type="text"
                  name="required_delivery_date"
                  value={formData.required_delivery_date}
                  onChange={handleChange}
                  placeholder="e.g. Today evening / 24 hrs"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Budget (INR)
                </label>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="e.g. ₹99 / ₹149"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Privacy Consent & Submit */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="privacy_consent"
                name="privacy_consent"
                checked={formData.privacy_consent}
                onChange={handleChange}
                className="w-4 h-4 mt-1 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="privacy_consent" className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                I agree to the processing of my uploaded photographs and poster content for design purposes. All political and election-related claims provided are factual, authorized and compliant with election regulations.
              </label>
            </div>
            {formErrors.privacy_consent && (
              <p className="text-red-500 text-xs">{formErrors.privacy_consent}</p>
            )}

            {submitting && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span>Submitting poster design request & uploading files...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 text-base"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing Request...</span>
                </>
              ) : (
                <>
                  <span>Submit Poster Design Request</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
