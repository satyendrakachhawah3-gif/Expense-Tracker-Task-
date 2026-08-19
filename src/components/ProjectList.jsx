import React from 'react';
import { 
  FolderKanban, 
  FolderPlus, 
  Edit3, 
  Trash2, 
  Calendar, 
  User, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useExpenseTracker } from '../context/ExpenseContext';

export default function ProjectList({ onOpenProjectModal, onEditProject }) {
  const { 
    projects, 
    expenses, 
    deleteProject, 
    setSelectedProjectId, 
    selectedProjectId,
    formatCurrency 
  } = useExpenseTracker();

  const statusStyles = {
    Active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Planning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Completed: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    'On Hold': 'bg-rose-500/10 text-rose-400 border-rose-500/30'
  };

  return (
    <div className="space-y-5">
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            Project Portfolio
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {projects.length} Total
            </span>
          </h3>
          <p className="text-xs text-slate-400">Manage client projects, allocated budgets, and timeline deadlines</p>
        </div>

        <button
          onClick={onOpenProjectModal}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/30 transition-all"
        >
          <FolderPlus className="w-4 h-4 text-cyan-300" />
          <span>New Project</span>
        </button>
      </div>

      {/* Grid of Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {projects.map(proj => {
          const projExpenses = expenses.filter(e => e.projectId === proj.id);
          const totalSpent = projExpenses.reduce((sum, e) => sum + e.amount, 0);
          const utilizationPct = proj.budget > 0 ? (totalSpent / proj.budget) * 100 : 0;
          const isSelected = selectedProjectId === proj.id;

          return (
            <div
              key={proj.id}
              className={`relative overflow-hidden rounded-2xl bg-slate-900/60 backdrop-blur-md border transition-all duration-300 flex flex-col justify-between p-5 space-y-4 shadow-lg group ${
                isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/30 shadow-indigo-950/40' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                
                {/* Header & Status Pill */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">{proj.category || 'General'}</span>
                    <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                      {proj.name}
                    </h4>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${statusStyles[proj.status] || 'bg-slate-800 text-slate-400'}`}>
                    {proj.status}
                  </span>
                </div>

                {/* Description & Client */}
                {proj.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>{proj.client || 'Internal'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-mono text-[11px]">{proj.startDate}</span>
                  </div>
                </div>

                {/* Budget Utilization Bar */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Spent: <strong className="text-white">{formatCurrency(totalSpent)}</strong></span>
                    <span className="text-slate-400">Budget: <strong className="text-white">{formatCurrency(proj.budget)}</strong></span>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        utilizationPct > 100 ? 'bg-rose-500' : utilizationPct > 85 ? 'bg-amber-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${Math.min(utilizationPct, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                    <span>{projExpenses.length} Expenses logged</span>
                    <span className={`font-mono font-bold ${utilizationPct > 100 ? 'text-rose-400' : 'text-slate-300'}`}>
                      {utilizationPct.toFixed(1)}% used
                    </span>
                  </div>
                </div>

              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => setSelectedProjectId(isSelected ? 'ALL' : proj.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
                  }`}
                >
                  <span>{isSelected ? 'Filtered' : 'Filter View'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditProject(proj)}
                    className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Edit Project"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete project "${proj.name}" and all associated expenses?`)) {
                        deleteProject(proj.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}

        {/* Empty Add Project Card */}
        <div 
          onClick={onOpenProjectModal}
          className="rounded-2xl border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-900/30 hover:bg-indigo-950/10 p-6 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer transition-all duration-300 min-h-[260px] group"
        >
          <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-indigo-600/20 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 transition-colors">
            <FolderPlus className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-200 group-hover:text-indigo-300">Create New Project</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-[200px]">Define target budget, dates, and category caps</p>
          </div>
        </div>

      </div>

    </div>
  );
}
