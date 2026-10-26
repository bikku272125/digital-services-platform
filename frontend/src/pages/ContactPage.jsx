import React, { useState } from 'react';
import { Mail, Phone, Clock, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { usePageSEO } from '../utils/useSEO';

export default function ContactPage() {
  usePageSEO({
    title: 'Contact Us — 24/7 Digital Support & Quotes',
    description: 'Reach our team directly via phone, WhatsApp, or email. Available 24/7 based in Gurugram with remote access across India.',
  });

  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Get in Touch
        </h1>
        <p className="text-sm text-slate-600">
          Have an inquiry, partnership proposal, or question before submitting a service request? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact info column */}
        <div className="space-y-6 md:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Communication Channels
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">Email Address</p>
                  <a href="mailto:bikkuyadav9190@gmail.com" className="text-indigo-600 hover:underline">bikkuyadav9190@gmail.com</a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">Phone & WhatsApp</p>
                  <a href="tel:+919161420942" className="text-indigo-600 hover:underline font-medium">+91 9161420942</a>
                  <p className="text-[11px] text-slate-500">24/7 Available for Calls & WhatsApp</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">Response Time</p>
                  <p className="text-slate-500">Fast 24-hour turnaround on requests & quotes</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">Location</p>
                  <p className="text-slate-500">Gurugram and Remote Access India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            {sent ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">Message Received!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Thank you for reaching out. A team member will respond to your email within 1 business day.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-4 px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-bold text-slate-900 text-base mb-2">Send us a direct message</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="General inquiry, bulk request, partnership..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center shadow-sm"
                >
                  Send Inquiry <Send className="w-3.5 h-3.5 ml-2" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
