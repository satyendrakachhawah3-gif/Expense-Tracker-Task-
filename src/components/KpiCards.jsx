import React from 'react';
import { 
  Wallet, 
  CreditCard, 
  PiggyBank, 
  ShieldCheck, 
  AlertTriangle,
  TrendingDown,
  ArrowUpRight,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { useExpenseTracker } from '../context/ExpenseContext';

export default function KpiCards() {
  const { 
    totalBudget, 
    totalSpent, 
    remainingBudget, 
    budgetUtilization,
    formatCurrency,
    activeExpenses,
    activeProjects,
    selectedProjectId,
    projects
  } = useExpenseTracker();

  // Selected project details if single project selected
  const currentProject = selectedProjectId !== 'ALL' 
    ? projects.find(p => p.id === selectedProjectId)
    : null;

  // Determine budget health risk status
  let healthLabel = 'Optimal';
  let healthColor = 'text-emerald-400';
  let healthBg = 'bg-emerald-500/10 border-emerald-500/30';
  let HealthIcon = ShieldCheck;

  if (budgetUtilization > 100) {
    healthLabel = 'Over Budget';
    healthColor = 'text-rose-400';
    healthBg = 'bg-rose-500/10 border-rose-500/30';
    HealthIcon = AlertTriangle;
  } else if (budgetUtilization > 85) {
    healthLabel = 'High Utilization';
    healthColor = 'text-amber-400';
    healthBg = 'bg-amber-500/10 border-amber-500/30';
    HealthIcon = AlertTriangle;
  }

  const cards = [
    {
      title: 'Total Allocated Budget',
      value: formatCurrency(totalBudget),
      subtext: currentProject ? `Client: ${currentProject.client}` : `${activeProjects.length} Active Projects`,
      icon: Wallet,
      gradient: 'from-indigo-500/20 via-indigo-600/10 to-transparent',
      borderColor: 'border-indigo-500/20',
      iconBg: 'bg-indigo-500/20 text-indigo-400',
      badge: 'Budget Limit'
    },
    {
      title: 'Total Expenses Logged',
      value: formatCurrency(totalSpent),
      subtext: `${activeExpenses.length} Transactions logged`,
      icon: CreditCard,
      gradient: 'from-purple-500/20 via-purple-600/10 to-transparent',
      borderColor: 'border-purple-500/20',
      iconBg: 'bg-purple-500/20 text-purple-400',
      badge: `${activeExpenses.filter(e => e.status === 'Paid').length} Paid`
    },
    {
      title: 'Remaining Balance',
      value: formatCurrency(remainingBudget),
      subtext: `${budgetUtilization.toFixed(1)}% Budget Utilized`,
      icon: PiggyBank,
      gradient: remainingBudget >= 0 ? 'from-cyan-500/20 via-cyan-600/10 to-transparent' : 'from-rose-500/20 via-rose-600/10 to-transparent',
      borderColor: remainingBudget >= 0 ? 'border-cyan-500/20' : 'border-rose-500/20',
      iconBg: remainingBudget >= 0 ? 'bg-cyan-500/20 text-cyan-400' : 'bg-rose-500/20 text-rose-400',
      badge: remainingBudget >= 0 ? 'Available' : 'Deficit',
      badgeStyle: remainingBudget >= 0 ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
    },
    {
      title: 'Financial Health Risk',
      value: healthLabel,
      subtext: `Avg Expense: ${formatCurrency(activeExpenses.length ? totalSpent / activeExpenses.length : 0)}`,
      icon: HealthIcon,
      gradient: 'from-emerald-500/20 via-emerald-600/10 to-transparent',
      borderColor: 'border-slate-800',
      iconBg: healthBg,
      badge: `${(100 - budgetUtilization).toFixed(0)}% Margin`,
      customHealth: true
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div 
            key={idx}
            className={`relative overflow-hidden rounded-2xl border ${card.borderColor} bg-slate-900/60 backdrop-blur-md p-5 shadow-lg hover:border-slate-700 transition-all duration-300 group`}
          >
            {/* Background Accent Glow */}
            <div className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${card.gradient} rounded-full blur-2xl group-hover:opacity-100 opacity-60 transition-opacity`} />

            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">{card.title}</span>
                <div className={`p-2.5 rounded-xl border ${card.iconBg} shadow-inner`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
                  {card.value}
                </h3>
              </div>

              {/* Progress bar for utilization */}
              {idx === 2 && (
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      budgetUtilization > 100 ? 'bg-rose-500' : budgetUtilization > 85 ? 'bg-amber-500' : 'bg-cyan-400'
                    }`}
                    style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                  />
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                <span className="text-slate-400 truncate">{card.subtext}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${card.badgeStyle || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                  {card.badge}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
