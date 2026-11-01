import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import {
  CheckCircle2,
  Copy,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
  HelpCircle,
  FileCheck
} from 'lucide-react';

export default function PosterOrderSuccess() {
  const location = useLocation();
  const [copied, setCopied] = React.useState(false);

  const state = location.state;
  if (!state || !state.reference) {
    return <Navigate to="/poster-studio" replace />;
  }

  const { reference, order, customer_name, email } = state;

  const copyReference = () => {
    navigator.clipboard.writeText(reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nextSteps = [
    {
      title: 'Design Review & Composition',
      desc: 'Our graphic design team inspects your uploaded photos, slogans, and color choices in our professional design studio.'
    },
    {
      title: 'Quotation & Preview Generation',
      desc: 'You will receive a watermarked preview image via WhatsApp or email for your review.'
    },
    {
      title: 'Revisions & Final HD Delivery',
      desc: 'You can request text or color adjustments. Upon satisfaction, receive high-resolution print-ready files.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 md:py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-xl text-center">
          {/* Animated checkmark icon */}
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-3 border border-emerald-200 dark:border-emerald-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Poster Request Received</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Thank You, {customer_name || 'Customer'}!
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
            Your poster design request has been successfully submitted to the Poster Design Studio.
          </p>

          {/* Reference Box */}
          <div className="my-8 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Your Order Reference Number
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="font-mono text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-wider">
                {reference}
              </span>
              <button
                onClick={copyReference}
                className="p-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition"
                title="Copy reference code"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            {copied && (
              <div className="text-emerald-600 text-xs font-semibold mt-1.5 animate-fade-in">
                Copied to clipboard!
              </div>
            )}
            <p className="text-[11px] text-slate-400 mt-2">
              Please save this reference code. All updates will also be communicated to <span className="text-slate-600 dark:text-slate-300 font-semibold">{email}</span>.
            </p>
          </div>

          {/* Order Snapshot */}
          {order && (
            <div className="text-left bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-xs space-y-2 mb-8">
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{order.category}</span>
              </div>
              {order.template && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Selected Template:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{order.template}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Current Status:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 uppercase">{order.status || 'NEW'}</span>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="text-left space-y-4 mb-8">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              What Happens Next?
            </h3>
            <div className="space-y-3">
              {nextSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{step.title}: </span>
                    <span className="text-slate-600 dark:text-slate-400">{step.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/poster-studio"
              className="flex-1 py-3 px-4 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition text-sm text-center"
            >
              Back to Poster Studio
            </Link>
            <Link
              to="/"
              className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition text-sm text-center"
            >
              Home Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
