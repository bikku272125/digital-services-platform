import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Calculator,
  CheckCircle,
  Play,
  PackageCheck,
  RefreshCw,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      step: 'Step 1',
      title: 'Choose a Service or Describe Your Problem',
      desc: 'Browse our standardized catalog of business websites, graphic design, data work, and AI workflows, or submit a custom requirement if your project does not fit neatly into one box.',
      icon: <FileText className="w-6 h-6 text-indigo-600" />,
    },
    {
      step: 'Step 2',
      title: 'Submit Your Requirements & Files',
      desc: 'Fill out our lightweight request form. You do not need to register an account. Specify your timeline, approximate budget in INR (₹), and upload any brand assets or reference documents.',
      icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
    },
    {
      step: 'Step 3',
      title: 'Receive a Formal Quotation & Delivery Estimate',
      desc: 'We review your scope and generate a clear quotation outlining the exact scope of work, turnaround days, included revision rounds, and milestone payment terms.',
      icon: <Calculator className="w-6 h-6 text-amber-600" />,
    },
    {
      step: 'Step 4',
      title: 'Confirm Scope & Starting Terms',
      desc: 'Review terms and agree on starting conditions (standard 50% advance for custom builds). Once verified, your order is locked into production.',
      icon: <Play className="w-6 h-6 text-blue-600" />,
    },
    {
      step: 'Step 5',
      title: 'Direct Execution & Progress Updates',
      desc: 'Work begins immediately. We provide regular status updates or staging links via your preferred channel (WhatsApp or Email).',
      icon: <PackageCheck className="w-6 h-6 text-purple-600" />,
    },
    {
      step: 'Step 6',
      title: 'Final Delivery & Inspection',
      desc: 'Receive all final files, source code, design assets, or spreadsheets via secure access links.',
      icon: <ShieldCheck className="w-6 h-6 text-teal-600" />,
    },
    {
      step: 'Step 7',
      title: 'Included Revision Rounds',
      desc: 'Test and inspect the delivery. If minor adjustments are required within the agreed scope, we implement them quickly during your revision window.',
      icon: <RefreshCw className="w-6 h-6 text-rose-600" />,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How It Works
        </h1>
        <p className="text-base text-slate-600">
          A predictable, transparent workflow designed for busy founders, managers, and entrepreneurs.
        </p>
      </div>

      {/* Process Timeline */}
      <div className="space-y-6">
        {steps.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-sm hover:shadow-md transition"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
              {item.icon}
            </div>
            <div className="flex-grow space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 font-mono">
                {item.step}
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                {item.title}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6">
        <h3 className="text-2xl sm:text-3xl font-extrabold">Have a project in mind?</h3>
        <p className="text-slate-300 text-sm max-w-xl mx-auto">
          Start with Step 1 right now. Requesting a quote is 100% free with zero obligation.
        </p>
        <Link
          to="/request"
          className="inline-flex items-center px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition shadow"
        >
          Submit Your Request <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
}
