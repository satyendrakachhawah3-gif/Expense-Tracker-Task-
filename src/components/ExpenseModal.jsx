import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Tag, Building2, CreditCard, Paperclip, FileText, CheckCircle2, Clock } from 'lucide-react';
import { useExpenseTracker } from '../context/ExpenseContext';
import { CATEGORIES, PAYMENT_METHODS } from '../data/initialData';

export default function ExpenseModal({ isOpen, onClose, initialData = null }) {
  const { projects, addExpense, updateExpense, selectedProjectId, currencyObj } = useExpenseTracker();

  const [formData, setFormData] = useState({
    title: '',
    projectId: '',
    amount: '',
    category: 'dev',
    date: new Date().toISOString().split('T')[0],
    vendor: '',
    paymentMethod: PAYMENT_METHODS[0],
    status: 'Paid',
    recurring: 'One-time',
    notes: '',
    receipt: null
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        projectId: initialData.projectId || projects[0]?.id || '',
        amount: initialData.amount ?? '',
        category: initialData.category || 'dev',
        date: initialData.date || new Date().toISOString().split('T')[0],
        vendor: initialData.vendor || '',
        paymentMethod: initialData.paymentMethod || PAYMENT_METHODS[0],
        status: initialData.status || 'Paid',
        recurring: initialData.recurring || 'One-time',
        notes: initialData.notes || '',
        receipt: initialData.receipt || null
      });
    } else {
      setFormData({
        title: '',
        projectId: selectedProjectId !== 'ALL' ? selectedProjectId : projects[0]?.id || '',
        amount: '',
        category: 'dev',
        date: new Date().toISOString().split('T')[0],
        vendor: '',
        paymentMethod: PAYMENT_METHODS[0],
        status: 'Paid',
        recurring: 'One-time',
        notes: '',
        receipt: null
      });
    }
    setErrors({});
  }, [initialData, isOpen, projects, selectedProjectId]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    if (!formData.amount || Number(formData.amount) <= 0) errs.amount = 'Valid positive amount required';
    if (!formData.projectId) errs.projectId = 'Please select a project';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (initialData) {
      updateExpense(initialData.id, formData);
    } else {
      addExpense(formData);
    }
    onClose();
  };

  const handleSimulateReceipt = () => {
    const sampleReceipts = [
      { fileName: `INV-${Math.floor(1000 + Math.random() * 9000)}.pdf`, fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60' },
      { fileName: `Receipt-${Math.floor(1000 + Math.random() * 9000)}.jpg`, fileUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&auto=format&fit=crop&q=60' }
    ];
    const receipt = sampleReceipts[Math.floor(Math.random() * sampleReceipts.length)];
    setFormData(prev => ({ ...prev, receipt }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-modal-in">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            {initialData ? 'Edit Expense Record' : 'Log New Project Expense'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Expense Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Senior Frontend Engineer Consultation"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.title && <p className="text-[11px] text-rose-400 mt-1">{errors.title}</p>}
          </div>

          {/* Project & Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Target Project *
              </label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Project</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              {errors.projectId && <p className="text-[11px] text-rose-400 mt-1">{errors.projectId}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount & Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Amount ({currencyObj.symbol}) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">{currencyObj.symbol}</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {errors.amount && <p className="text-[11px] text-rose-400 mt-1">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Expense Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Vendor & Payment Method Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Vendor / Payee
              </label>
              <input
                type="text"
                placeholder="e.g. AWS, Figma Inc, Freelancer"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {PAYMENT_METHODS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status & Recurring Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Payment Status
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'Paid' })}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                    formData.status === 'Paid'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Paid
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'Pending' })}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                    formData.status === 'Pending'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  Pending
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Recurring Schedule
              </label>
              <select
                value={formData.recurring}
                onChange={(e) => setFormData({ ...formData, recurring: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="One-time">One-time Expense</option>
                <option value="Monthly">Monthly Recurring</option>
                <option value="Weekly">Weekly Recurring</option>
                <option value="Yearly">Yearly Recurring</option>
              </select>
            </div>
          </div>

          {/* Receipt Attachment */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Receipt / Invoice Attachment
            </label>
            <div className="flex items-center gap-3">
              {formData.receipt ? (
                <div className="flex items-center justify-between w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs">
                  <span className="text-indigo-400 truncate max-w-[250px] font-mono">{formData.receipt.fileName}</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, receipt: null })}
                    className="text-rose-400 hover:text-rose-300 text-xs font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSimulateReceipt}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  <Paperclip className="w-4 h-4 text-cyan-400" />
                  <span>Attach Sample Receipt</span>
                </button>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Notes & Reference
            </label>
            <textarea
              rows={2}
              placeholder="Additional details or PO reference number..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all"
            >
              {initialData ? 'Update Expense' : 'Save Expense'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
