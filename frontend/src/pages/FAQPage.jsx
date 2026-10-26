import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: 'How do I request a digital service?',
      a: 'Simply click "Request a Service" anywhere on our platform, fill out the basic requirements form (no customer registration needed), and submit. We will review your scope and provide a formal quotation.',
    },
    {
      q: 'How are quotes and prices determined?',
      a: 'Catalog starting prices serve as transparent baseline benchmarks. Your final quote is calculated based on exact deliverables, technical complexity, custom design assets, and urgency. You will always know the total cost before confirming.',
    },
    {
      q: 'What currency is used for pricing?',
      a: 'All our prices and quotations are denominated in Indian Rupees (₹ INR). For domestic clients, GST and invoicing details are provided on requests.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept direct bank transfers (NEFT / IMPS / RTGS) and UPI payments (Google Pay, PhonePe, Paytm, BHIM). Once paid, our admin verifies the transaction reference and confirms your order status.',
    },
    {
      q: 'How do revisions work if I need changes?',
      a: 'Each quotation includes a clear number of revision rounds (typically 2 rounds). Revisions cover styling tweaks, copy adjustments, and minor layout modifications within the original project scope.',
    },
    {
      q: 'Can I request a custom service that is not in the catalog?',
      a: 'Yes, absolutely. Select "Custom Digital Requests" or describe your project in the general request form. We review specialized automation scripts, multi-framework apps, and unique technical problems.',
    },
    {
      q: 'How is customer privacy and sensitive file data handled?',
      a: 'We never sell or distribute your data. Uploaded attachments are stored securely in protected storage folders, accessed only by the authorized technical lead assigned to your project, and kept strictly confidential.',
    },
    {
      q: 'What is your cancellation and refund policy?',
      a: 'If a project is cancelled before work commences, advance amounts may be refunded minus any transactional expenses. Once custom engineering or design production has started, payment covers the hours invested.',
    },
  ];

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-600">
          Everything you need to know about our services, quotations, workflows, and deliverables.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition shadow-sm"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <span className="font-bold text-sm sm:text-base text-slate-900">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-indigo-600' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still Have Questions CTA */}
      <div className="bg-slate-100 rounded-2xl p-8 text-center space-y-3">
        <h3 className="font-bold text-slate-900 text-base">Still have questions?</h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          We’re happy to answer any questions about your project scope or technical requirements.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
        >
          Contact our team directly <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>
    </div>
  );
}
