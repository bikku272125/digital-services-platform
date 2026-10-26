import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-500">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-6 text-center max-w-lg mx-auto my-8">
      <p className="text-sm font-semibold text-rose-800 mb-2">Something went wrong</p>
      <p className="text-xs text-rose-600 mb-4 whitespace-pre-line">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 transition"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title = 'No items found', description, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center max-w-md mx-auto my-8">
      <p className="text-base font-semibold text-slate-800 mb-1">{title}</p>
      {description && <p className="text-sm text-slate-500 mb-4">{description}</p>}
      {action}
    </div>
  );
}

export function StatusBadge({ status }) {
  const styles = {
    NEW: 'bg-blue-50 text-blue-700 border-blue-200',
    REVIEWING: 'bg-amber-50 text-amber-700 border-amber-200',
    QUOTED: 'bg-purple-50 text-purple-700 border-purple-200',
    ACCEPTED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
    CANCELLED: 'bg-slate-100 text-slate-600 border-slate-300',
    // Order statuses
    PENDING_PAYMENT: 'bg-amber-50 text-amber-700 border-amber-200',
    CONFIRMED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    IN_PROGRESS: 'bg-sky-50 text-sky-700 border-sky-200',
    DELIVERED: 'bg-teal-50 text-teal-700 border-teal-200',
    COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  const cleanStatus = status || 'NEW';
  const styleClass = styles[cleanStatus] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styleClass}`}>
      {cleanStatus.replace(/_/g, ' ')}
    </span>
  );
}
