import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Download, 
  Plus, 
  Paperclip, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Building2,
  Tag,
  CreditCard,
  FileText
} from 'lucide-react';
import { useExpenseTracker } from '../context/ExpenseContext';
import { CATEGORIES } from '../data/initialData';

export default function ExpenseList({ onOpenExpenseModal, onEditExpense, onViewReceipt }) {
  const { 
    expenses, 
    projects, 
    selectedProjectId, 
    deleteExpense, 
    toggleExpenseStatus, 
    formatCurrency,
    addToast
  } = useExpenseTracker();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('date-desc');

  // Filter & Sort Logic
  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      // Filter by Project
      if (selectedProjectId !== 'ALL' && exp.projectId !== selectedProjectId) {
        return false;
      }
      // Filter by Category
      if (selectedCategory !== 'ALL' && exp.category !== selectedCategory) {
        return false;
      }
      // Filter by Status
      if (selectedStatus !== 'ALL' && exp.status !== selectedStatus) {
        return false;
      }
      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const proj = projects.find(p => p.id === exp.projectId);
        const cat = CATEGORIES.find(c => c.id === exp.category);
        const matchTitle = exp.title.toLowerCase().includes(query);
        const matchVendor = (exp.vendor || '').toLowerCase().includes(query);
        const matchCat = cat?.name.toLowerCase().includes(query);
        const matchProj = proj?.name.toLowerCase().includes(query);
        if (!matchTitle && !matchVendor && !matchCat && !matchProj) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [expenses, selectedProjectId, selectedCategory, selectedStatus, searchQuery, sortBy, projects]);

  // CSV Export helper
  const handleExportCSV = () => {
    if (filteredExpenses.length === 0) {
      addToast('No expenses available to export.', 'warning');
      return;
    }

    const headers = ['ID', 'Project', 'Title', 'Category', 'Amount', 'Date', 'Vendor', 'Payment Method', 'Status', 'Notes'];
    const rows = filteredExpenses.map(exp => {
      const proj = projects.find(p => p.id === exp.projectId);
      const cat = CATEGORIES.find(c => c.id === exp.category);
      return [
        exp.id,
        `"${proj?.name || exp.projectId}"`,
        `"${exp.title.replace(/"/g, '""')}"`,
        `"${cat?.name || exp.category}"`,
        exp.amount,
        exp.date,
        `"${(exp.vendor || '').replace(/"/g, '""')}"`,
        `"${(exp.paymentMethod || '').replace(/"/g, '""')}"`,
        exp.status,
        `"${(exp.notes || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Expenses-Export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link);
    addToast(`Exported ${filteredExpenses.length} expenses to CSV!`);
  };

  const totalFilteredAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-lg space-y-5">
      
      {/* Header & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            Expense Records
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {filteredExpenses.length} items
            </span>
          </h3>
          <p className="text-xs text-slate-400">Total Filtered Amount: <span className="font-mono font-bold text-indigo-400">{formatCurrency(totalFilteredAmount)}</span></p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenExpenseModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search vendor, title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Category Selector */}
        <div className="relative">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Selector */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Payment Statuses</option>
            <option value="Paid">Status: Paid</option>
            <option value="Pending">Status: Pending</option>
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div className="relative">
          <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="date-desc">Sort: Date (Newest First)</option>
            <option value="date-asc">Sort: Date (Oldest First)</option>
            <option value="amount-desc">Sort: Amount (High to Low)</option>
            <option value="amount-asc">Sort: Amount (Low to High)</option>
            <option value="title">Sort: Title (A-Z)</option>
          </select>
        </div>

      </div>

      {/* Expenses Data Table (Desktop) */}
      <div className="hidden md:block overflow-x-auto border border-slate-800 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/90 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-700">
            <tr>
              <th className="py-3 px-4">Expense Title</th>
              <th className="py-3 px-4">Project</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Vendor</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Receipt</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {filteredExpenses.map(exp => {
              const proj = projects.find(p => p.id === exp.projectId);
              const cat = CATEGORIES.find(c => c.id === exp.category);
              const isPaid = exp.status === 'Paid';

              return (
                <tr key={exp.id} className="hover:bg-slate-800/40 transition-colors group">
                  
                  {/* Title & Notes */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                      {exp.title}
                    </div>
                    {exp.notes && (
                      <div className="text-[10px] text-slate-500 truncate max-w-[220px]" title={exp.notes}>
                        {exp.notes}
                      </div>
                    )}
                  </td>

                  {/* Project Tag */}
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700 max-w-[140px] truncate" title={proj?.name}>
                      {proj?.name || 'Unassigned'}
                    </span>
                  </td>

                  {/* Category Pill */}
                  <td className="py-3 px-4">
                    {cat && (
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${cat.bg} ${cat.text} border ${cat.border}`}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
                        {cat.name}
                      </span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    {exp.date}
                  </td>

                  {/* Vendor */}
                  <td className="py-3 px-4 text-slate-300 font-medium">
                    {exp.vendor || '—'}
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-100 text-sm">
                    {formatCurrency(exp.amount)}
                  </td>

                  {/* Status Toggle */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleExpenseStatus(exp.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                        isPaid 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                      }`}
                      title="Click to toggle Paid / Pending status"
                    >
                      {isPaid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      <span>{exp.status}</span>
                    </button>
                  </td>

                  {/* Receipt Modal Trigger */}
                  <td className="py-3 px-4 text-center">
                    {exp.receipt ? (
                      <button
                        onClick={() => onViewReceipt(exp.receipt, exp.title)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20 transition-colors text-[10px] font-medium"
                        title="View Receipt Attachment"
                      >
                        <Paperclip className="w-3 h-3" />
                        <span>View</span>
                      </button>
                    ) : (
                      <span className="text-slate-600 text-[10px]">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEditExpense(exp)}
                        className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit Expense"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete expense "${exp.title}"?`)) {
                            deleteExpense(exp.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Delete Expense"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredExpenses.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-xs space-y-2">
            <FileText className="w-8 h-8 text-slate-600 mx-auto" />
            <p>No matching expenses found.</p>
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {filteredExpenses.map(exp => {
          const proj = projects.find(p => p.id === exp.projectId);
          const cat = CATEGORIES.find(c => c.id === exp.category);
          const isPaid = exp.status === 'Paid';

          return (
            <div key={exp.id} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/80 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">{exp.title}</h4>
                  <p className="text-xs text-slate-400">{proj?.name}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-indigo-400 text-base">{formatCurrency(exp.amount)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                {cat && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cat.bg} ${cat.text} border ${cat.border}`}>
                    {cat.name}
                  </span>
                )}
                <span className="text-slate-400 font-mono text-[11px]">{exp.date}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                <button
                  onClick={() => toggleExpenseStatus(exp.id)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                    isPaid ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {isPaid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  <span>{exp.status}</span>
                </button>

                <div className="flex items-center gap-2">
                  {exp.receipt && (
                    <button
                      onClick={() => onViewReceipt(exp.receipt, exp.title)}
                      className="p-1.5 text-indigo-400 hover:bg-slate-700 rounded-lg text-xs"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onEditExpense(exp)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete expense "${exp.title}"?`)) {
                        deleteExpense(exp.id);
                      }
                    }}
                    className="p-1.5 text-rose-400 hover:bg-slate-700 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredExpenses.length === 0 && (
          <div className="py-8 text-center text-slate-500 text-xs">
            No matching expenses found.
          </div>
        )}
      </div>

    </div>
  );
}
