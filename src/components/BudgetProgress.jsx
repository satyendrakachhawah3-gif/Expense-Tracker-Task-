import React from 'react';
import { Layers, AlertCircle, CheckCircle, PieChart, ShieldAlert } from 'lucide-react';
import { useExpenseTracker } from '../context/ExpenseContext';
import { CATEGORIES } from '../data/initialData';

export default function BudgetProgress() {
  const { 
    projects, 
    expenses, 
    selectedProjectId, 
    formatCurrency, 
    totalBudget, 
    totalSpent 
  } = useExpenseTracker();

  // If a specific project is selected, show category breakdown for that project.
  // Otherwise, show project list progress bars.

  const activeProjectsList = selectedProjectId === 'ALL'
    ? projects
    : projects.filter(p => p.id === selectedProjectId);

  // Category breakdown calculation
  const categoryStats = CATEGORIES.map(cat => {
    const catExpenses = expenses.filter(e => {
      const matchProj = selectedProjectId === 'ALL' || e.projectId === selectedProjectId;
      return matchProj && e.category === cat.id;
    });
    const totalCatSpent = catExpenses.reduce((sum, e) => sum + e.amount, 0);
    const count = catExpenses.length;
    const shareOfTotalSpent = totalSpent > 0 ? (totalCatSpent / totalSpent) * 100 : 0;

    return {
      ...cat,
      spent: totalCatSpent,
      count,
      share: shareOfTotalSpent
    };
  }).filter(c => c.spent > 0 || selectedProjectId !== 'ALL');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Left Column: Project Budget Breakdown */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Project Budget Utilization</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {activeProjectsList.length} {activeProjectsList.length === 1 ? 'Project' : 'Projects'}
          </span>
        </div>

        <div className="space-y-4">
          {activeProjectsList.map(proj => {
            const projExpenses = expenses.filter(e => e.projectId === proj.id);
            const projSpent = projExpenses.reduce((sum, e) => sum + e.amount, 0);
            const pct = proj.budget > 0 ? (projSpent / proj.budget) * 100 : 0;
            const remaining = proj.budget - projSpent;

            let statusColor = 'bg-indigo-500';
            let badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
            let statusText = 'Within Budget';

            if (pct > 100) {
              statusColor = 'bg-rose-500';
              badgeStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
              statusText = `Over by ${formatCurrency(Math.abs(remaining))}`;
            } else if (pct > 85) {
              statusColor = 'bg-amber-500';
              badgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
              statusText = 'Near Limit';
            }

            return (
              <div key={proj.id} className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between text-xs">
                  <div className="font-semibold text-slate-200 truncate max-w-[200px]" title={proj.name}>
                    {proj.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${badgeStyle}`}>
                      {statusText}
                    </span>
                    <span className="font-mono font-bold text-slate-300">
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${statusColor}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Spent: <strong className="text-slate-200">{formatCurrency(projSpent)}</strong></span>
                  <span>Budget: <strong className="text-slate-200">{formatCurrency(proj.budget)}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Category Spending Distribution */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Category Allocation Breakdown</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Total Spent: {formatCurrency(totalSpent)}</span>
        </div>

        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {categoryStats.map(cat => (
            <div key={cat.id} className="p-3 rounded-xl bg-slate-800/40 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-3 h-3 rounded-full shrink-0" 
                    style={{ backgroundColor: cat.color }} 
                  />
                  <span className="font-medium text-slate-200">{cat.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">({cat.count} items)</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-slate-200">{formatCurrency(cat.spent)}</span>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                    {cat.share.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Progress bar per category share */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(cat.share, 100)}%`, backgroundColor: cat.color }}
                />
              </div>
            </div>
          ))}

          {categoryStats.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-xs">
              No category spending recorded for the selected scope.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
