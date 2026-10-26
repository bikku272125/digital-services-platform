import React from 'react';

export default function LegalPage({ title, lastUpdated = 'October 2026', children }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block mb-1">
          Draft Legal Policy — Subject to Business Review
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
        <p className="text-xs text-slate-500 mt-2">Last updated: {lastUpdated}</p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 leading-relaxed space-y-6">
        {children}
      </div>
    </div>
  );
}

export function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
        <p>
          We collect personal identification details provided voluntarily by customers when requesting a service or quotation, including full name, email address, telephone/WhatsApp number, company name, and project specifications.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">2. Use of Information</h2>
        <p>
          The information collected is used exclusively for evaluating requirements, generating accurate quotations, executing agreed digital work, communicating project updates, and delivering deliverables. We do not sell or rent customer data to third parties.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">3. File Uploads & Confidentiality</h2>
        <p>
          Documents, files, spreadsheets, and media uploaded as part of requests are stored securely on our protected servers. Files are accessed strictly by the project lead responsible for fulfilling the work.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">4. Retention and Contact</h2>
        <p>
          Customer records and quotations are retained for tax, administrative, and accounting purposes. Customers may request deletion of non-accounting contact details by emailing bikkuyadav9190@gmail.com.
        </p>
      </section>
    </LegalPage>
  );
}

export function TermsPage() {
  return (
    <LegalPage title="Terms and Conditions">
      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
        <p>
          By submitting a service request, approving a quotation, or transferring payment, you agree to be bound by these Terms and Conditions.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">2. Scope and Quotation</h2>
        <p>
          Starting prices on the public catalog are indicative benchmarks. A binding contract exists only upon written confirmation of a formal quotation detailing the agreed deliverables, payment schedule, and turnaround timeline.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">3. Intellectual Property Rights</h2>
        <p>
          Upon receipt of final verified payment in full, all proprietary rights in custom software code, graphics, or content created specifically for the client are assigned to the client, excluding open-source libraries or third-party assets used.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">4. Client Obligations</h2>
        <p>
          Timely delivery depends on the client providing required credentials, brand guidelines, content text, and timely feedback during the review window.
        </p>
      </section>
    </LegalPage>
  );
}

export function RefundPolicyPage() {
  return (
    <LegalPage title="Cancellation and Refund Policy">
      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">1. Advance Payments</h2>
        <p>
          Custom service projects generally require an agreed advance deposit (typically 50%) prior to project kickoff to allocate engineering and design resources.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">2. Cancellations Before Work Commences</h2>
        <p>
          If a client requests cancellation before engineering or design labor has begun, the advance deposit will be refunded in full minus any non-refundable banking fees within 7-10 business days.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">3. In-Progress Cancellations</h2>
        <p>
          Once work has commenced, refunds are prorated based on completed milestones and deliverables provided up to the date of cancellation notice.
        </p>
      </section>
    </LegalPage>
  );
}
