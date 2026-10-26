import React, { useState } from 'react';
import { ExternalLink, Tag, Sparkles, Layers } from 'lucide-react';

export default function PortfolioPage() {
  const [filter, setFilter] = useState('ALL');

  const demoProjects = [
    {
      id: 1,
      title: 'Aaradhya Enertech Corporate Showcase',
      category: 'WEBSITE',
      categoryLabel: 'Website & Development',
      description: 'Clean responsive industrial equipment and services website with product catalogs, dynamic contact capture, and high performance score.',
      tech: ['React', 'Tailwind CSS', 'Vite', 'SEO'],
      demoUrl: 'https://aaradhyaenertech.demo',
      badge: 'Verified Case Study Demo',
    },
    {
      id: 2,
      title: 'Solar Inverter Technical Brochure & Profile',
      category: 'DESIGN',
      categoryLabel: 'Design & Branding',
      description: 'Comprehensive 8-page corporate equipment brochure featuring technical spec sheets, schematic diagrams, and print-ready high-DPI assets.',
      tech: ['Figma', 'Illustrator', 'Print CMYK'],
      demoUrl: '#',
      badge: 'Client Deliverable Demo',
    },
    {
      id: 3,
      title: 'E-Commerce Multi-Vendor Backend API',
      category: 'BACKEND',
      categoryLabel: 'Django & REST APIs',
      description: 'Robust Django REST Framework architecture with JWT authentication, custom order state transitions, and automated invoice PDF generation.',
      tech: ['Python', 'Django REST Framework', 'PostgreSQL'],
      demoUrl: '#',
      badge: 'Architecture Demo',
    },
    {
      id: 4,
      title: 'Bank Statement & Invoice Data Extraction Pipeline',
      category: 'DATA',
      categoryLabel: 'Data & Office Work',
      description: 'Python automated extraction engine converting monthly multi-page scanned PDF invoices into structured, normalized Excel spreadsheets.',
      tech: ['Python', 'Pandas', 'OpenPyXL'],
      demoUrl: '#',
      badge: 'Automation Demo',
    },
    {
      id: 5,
      title: '24/7 AI Customer Inquiry & Lead Assistant',
      category: 'AI',
      categoryLabel: 'AI & Automation',
      description: 'FAQ chatbot widget integrated into website footer answering product queries and instantly pushing qualified leads to business WhatsApp.',
      tech: ['OpenAI API', 'FastAPI', 'WhatsApp Webhook'],
      demoUrl: '#',
      badge: 'AI Tool Demo',
    },
    {
      id: 6,
      title: 'D2C Brand Identity & Social Content Engine',
      category: 'MARKETING',
      categoryLabel: 'Marketing & Content',
      description: '30-day branded social media graphic suite, story templates, and caption hooks developed for a modern organic lifestyle brand.',
      tech: ['Canva Pro', 'Figma', 'Copywriting'],
      demoUrl: '#',
      badge: 'Creative Demo',
    },
  ];

  const filteredProjects = filter === 'ALL'
    ? demoProjects
    : demoProjects.filter((p) => p.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Curated Demonstrations & Past Deliverables</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Sample Work & Portfolio
        </h1>
        <p className="text-sm text-slate-600">
          Explore genuine representative samples of websites, technical designs, scripts, and workflows created by our team.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {[
          { key: 'ALL', label: 'All Projects' },
          { key: 'WEBSITE', label: 'Websites' },
          { key: 'DESIGN', label: 'Design & Branding' },
          { key: 'BACKEND', label: 'APIs & Backend' },
          { key: 'DATA', label: 'Data & Automation' },
          { key: 'AI', label: 'AI Workflows' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              filter === tab.key
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg hover:border-indigo-200 transition group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                  {project.categoryLabel}
                </span>
                <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {project.badge}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition mb-2">
                {project.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {project.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-200/60"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
