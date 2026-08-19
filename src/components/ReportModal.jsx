import React from 'react';
import { X, Printer, Download, FileSpreadsheet, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useExpenseTracker } from '../context/ExpenseContext';
import { CATEGORIES } from '../data/initialData';

export default function ReportModal({ isOpen, onClose }) {
  const { 
    projects, 
    expenses, 
    formatCurrency, 
    totalBudget, 
    totalSpent, 
    remainingBudget, 
    budgetUtilization,
    currencyObj 
  } = useExpenseTracker();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-modal-in flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80 no-print">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Financial Summary & Executive Report</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 bg-slate-950 text-slate-100 print:bg-white print:text-black print:p-0">
          
          {/* Executive Header */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-white print:text-black">
                PROJECT EXPENSE FINANCIAL AUDIT
              </h2>
              <p className="text-xs text-slate-400 print:text-slate-600 mt-0.5">
                Generated on {new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-bold font-mono">
                CURRENCY: {currencyObj.code} ({currencyObj.symbol})
              </span>
            </div>
          </div>

          {/* Key Metric Highlights Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 print:bg-gray-100 print:border-gray-300">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Total Portfolio Budget</p>
              <p className="text-lg font-bold font-mono text-white print:text-black">{formatCurrency(totalBudget)}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 print:bg-gray-100 print:border-gray-300">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Total Logged Spent</p>
              <p className="text-lg font-bold font-mono text-emerald-400 print:text-black">{formatCurrency(totalSpent)}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 print:bg-gray-100 print:border-gray-300">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Net Balance</p>
              <p className="text-lg font-bold font-mono text-cyan-400 print:text-black">{formatCurrency(remainingBudget)}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 print:bg-gray-100 print:border-gray-300">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Budget Utilization</p>
              <p className="text-lg font-bold font-mono text-amber-400 print:text-black">{budgetUtilization.toFixed(1)}%</p>
            </div>
          </div>

          {/* Project Breakdown Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider print:text-black">
              1. Project Portfolio Breakdown
            </h4>
            <div className="overflow-x-auto border border-slate-800 rounded-xl print:border-gray-300">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800 print:bg-gray-200 print:text-black">
                  <tr>
                    <th className="py-2.5 px-3">Project Name</th>
                    <th className="py-2.5 px-3">Client</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Budget</th>
                    <th className="py-2.5 px-3 text-right">Spent</th>
                    <th className="py-2.5 px-3 text-right">Utilization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-gray-300 font-mono">
                  {projects.map(p => {
                    const projSpent = expenses.filter(e => e.projectId === p.id).reduce((sum, e) => sum + e.amount, 0);
                    const pct = p.budget > 0 ? (projSpent / p.budget) * 100 : 0;

                    return (
                      <tr key={p.id} className="print:text-black">
                        <td className="py-2.5 px-3 font-sans font-bold text-slate-200 print:text-black">{p.name}</td>
                        <td className="py-2.5 px-3 font-sans text-slate-400 print:text-slate-700">{p.client || '—'}</td>
                        <td className="py-2.5 px-3 font-sans text-slate-300 print:text-black">{p.status}</td>
                        <td className="py-2.5 px-3 text-right">{formatCurrency(p.budget)}</td>
                        <td className="py-2.5 px-3 text-right">{formatCurrency(projSpent)}</td>
                        <td className="py-2.5 px-3 text-right font-bold">{pct.toFixed(1)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Category Share Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider print:text-black">
              2. Category Expenditure Share
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map(cat => {
                const spent = expenses.filter(e => e.category === cat.id).reduce((sum, e) => sum + e.amount, 0);
                if (spent === 0) return null;
                return (
                  <div key={cat.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 text-xs space-y-1 print:bg-gray-50 print:border-gray-300">
                    <p className="font-semibold text-slate-300 print:text-black truncate">{cat.name}</p>
                    <p className="font-mono font-bold text-white print:text-black">{formatCurrency(spent)}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audit Verification Footer */}
          <div className="pt-4 border-t border-slate-800 text-slate-500 text-[11px] flex items-center justify-between print:text-slate-600">
            <p>Trackify Financial Reporting System • Confirmed Verified</p>
            <p>Page 1 of 1</p>
          </div>

        </div>

      </div>
    </div>
  );
}
