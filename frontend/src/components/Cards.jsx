import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../utils/formatters';

export function ServiceCard({ service }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-lg hover:border-indigo-200 transition group duration-200">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
            {service.category_name || service.category?.name || 'Digital Service'}
          </span>
          {service.is_featured && (
            <span className="text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
              Popular
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition mb-2">
          {service.name}
        </h3>

        <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
          {service.short_description}
        </p>

        {service.estimated_delivery_text && (
          <div className="flex items-center text-xs text-slate-500 mb-4">
            <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
            <span>Delivery: {service.estimated_delivery_text}</span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-400 uppercase tracking-wide block">Pricing</span>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
            Custom Quote
          </span>
        </div>

        <Link
          to={`/services/${service.slug}`}
          className="inline-flex items-center text-xs font-semibold text-indigo-600 group-hover:text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100/80 px-3 py-2 rounded-lg transition"
        >
          View Scope
          <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

export function CategoryCard({ category, onClick, isSelected }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-4 rounded-xl border transition flex items-center justify-between w-full ${
        isSelected
          ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
          : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/40'
      }`}
    >
      <div>
        <p className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-slate-900'}`}>
          {category.name}
        </p>
        {category.description && (
          <p className={`text-xs mt-0.5 line-clamp-1 ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
            {category.description}
          </p>
        )}
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ml-2 ${
        isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600'
      }`}>
        {category.services_count ?? ''}
      </span>
    </button>
  );
}
