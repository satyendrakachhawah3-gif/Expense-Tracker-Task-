import React from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useExpenseTracker } from '../context/ExpenseContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useExpenseTracker();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          info: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          error: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
        };

        const bgClasses = {
          success: 'bg-slate-900/90 border-emerald-500/30 text-slate-100 shadow-emerald-950/40',
          info: 'bg-slate-900/90 border-sky-500/30 text-slate-100 shadow-sky-950/40',
          warning: 'bg-slate-900/90 border-amber-500/30 text-slate-100 shadow-amber-950/40',
          error: 'bg-slate-900/90 border-rose-500/30 text-slate-100 shadow-rose-950/40'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border backdrop-blur-md shadow-xl transition-all duration-300 animate-modal-in ${bgClasses[toast.type] || bgClasses.info}`}
          >
            <div className="flex items-center gap-3">
              {icons[toast.type] || icons.info}
              <p className="text-sm font-medium leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
