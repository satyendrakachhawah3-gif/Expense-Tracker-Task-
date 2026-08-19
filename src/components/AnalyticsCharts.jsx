import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  CartesianGrid,
  Legend
} from 'recharts';
import { BarChart3, PieChart as PieIcon, TrendingUp, DollarSign } from 'lucide-react';
import { useExpenseTracker } from '../context/ExpenseContext';
import { CATEGORIES } from '../data/initialData';

export default function AnalyticsCharts() {
  const { 
    projects, 
    expenses, 
    selectedProjectId, 
    formatCurrency, 
    currencyObj 
  } = useExpenseTracker();

  const [timeRange, setTimeRange] = useState('ALL');

  // Filter expenses based on selected project
  const filteredExpenses = selectedProjectId === 'ALL'
    ? expenses
    : expenses.filter(e => e.projectId === selectedProjectId);

  // 1. Prepare Data for Budget vs Actual Bar Chart
  const budgetVsActualData = projects
    .filter(p => selectedProjectId === 'ALL' || p.id === selectedProjectId)
    .map(p => {
      const projSpent = expenses
        .filter(e => e.projectId === p.id)
        .reduce((sum, e) => sum + e.amount, 0);

      return {
        name: p.name.length > 18 ? `${p.name.substring(0, 18)}...` : p.name,
        fullName: p.name,
        Budget: p.budget,
        Spent: projSpent
      };
    });

  // 2. Prepare Data for Category Pie Chart
  const categoryChartData = CATEGORIES.map(cat => {
    const totalSpent = filteredExpenses
      .filter(e => e.category === cat.id)
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      name: cat.name,
      value: totalSpent,
      color: cat.color
    };
  }).filter(c => c.value > 0);

  // 3. Prepare Data for Monthly Spending Trend Area Chart
  const monthlyMap = {};
  filteredExpenses.forEach(exp => {
    if (!exp.date) return;
    const monthKey = exp.date.substring(0, 7); // e.g. "2026-08"
    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = 0;
    }
    monthlyMap[monthKey] += exp.amount;
  });

  const monthlyTrendData = Object.keys(monthlyMap)
    .sort()
    .map(key => {
      const [year, month] = key.split('-');
      const dateObj = new Date(year, month - 1);
      const label = dateObj.toLocaleString('en-US', { month: 'short', year: '2-digit' });
      return {
        month: label,
        Amount: monthlyMap[key]
      };
    });

  // Custom Tooltip Formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs space-y-1">
          <p className="font-bold text-slate-200">{label || payload[0]?.name}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5" style={{ color: entry.color || entry.fill }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
                {entry.name}:
              </span>
              <span className="font-mono font-bold text-white">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Grid: Budget vs Actual & Category Share */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Budget vs Actual (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="text-base font-bold text-white">Budget vs. Actual Spending</h3>
                <p className="text-xs text-slate-400">Comparison of allocated budget against total logged expenses</p>
              </div>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetVsActualData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false} 
                  interval={0}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false}
                  tickFormatter={(val) => `${currencyObj.symbol}${val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                <Bar dataKey="Budget" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Spent" fill="#06b6d4" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Donut (1 Col) */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-pink-400" />
            <div>
              <h3 className="text-base font-bold text-white">Category Breakdown</h3>
              <p className="text-xs text-slate-400">Share of total expenditure</p>
            </div>
          </div>

          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(15, 23, 42, 0.8)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Inner Donut Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Categories</span>
              <span className="text-lg font-bold font-mono text-white">{categoryChartData.length}</span>
            </div>
          </div>

          {/* Mini Legend List */}
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-800 max-h-24 overflow-y-auto">
            {categoryChartData.map((cat, i) => (
              <div key={i} className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="truncate text-slate-300">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Area Chart: Monthly Spending Trend */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white">Monthly Expense Timeline</h3>
              <p className="text-xs text-slate-400">Spending velocity and month-over-month trajectory</p>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          {monthlyTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false}
                  tickFormatter={(val) => `${currencyObj.symbol}${val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="Amount" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              No historical date timeline data available.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
