import React, { useRef } from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Receipt, 
  PieChart, 
  FileText,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  Plus,
  FolderPlus
} from 'lucide-react';
import { useExpenseTracker } from '../context/ExpenseContext';

export default function Sidebar({ mobileOpen, setMobileOpen, onOpenExpenseModal, onOpenProjectModal, onOpenReportModal }) {
  const { 
    activeTab, 
    setActiveTab, 
    projects, 
    selectedProjectId, 
    setSelectedProjectId,
    exportDataJSON,
    importDataJSON,
    resetToDemoData,
    formatCurrency
  } = useExpenseTracker();

  const fileInputRef = useRef(null);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects & Budgets', icon: FolderKanban, count: projects.length },
    { id: 'expenses', label: 'Expense Log', icon: Receipt },
    { id: 'analytics', label: 'Visual Analytics', icon: PieChart },
    { id: 'reports', label: 'Reports & Export', icon: FileText }
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      importDataJSON(event.target.result);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <>
      {/* Hidden file input for JSON import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".json"
        className="hidden"
      />

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm md:hidden"
        />
      )}

      <aside className={`
        fixed md:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-slate-800 bg-slate-900/95 md:bg-slate-900/50 backdrop-blur-xl transition-transform duration-300 flex flex-col justify-between p-4
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="space-y-6 overflow-y-auto pr-1">
          
          {/* Quick Actions (Mobile/Tablet) */}
          <div className="md:hidden space-y-2 pb-3 border-b border-slate-800">
            <button
              onClick={() => { onOpenExpenseModal(); setMobileOpen(false); }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" />
              Add Expense
            </button>
            <button
              onClick={() => { onOpenProjectModal(); setMobileOpen(false); }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs"
            >
              <FolderPlus className="w-4 h-4 text-cyan-400" />
              Add Project
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-bold tracking-wider text-slate-500 uppercase">Navigation</p>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'reports') {
                      onOpenReportModal();
                    } else {
                      setActiveTab(item.id);
                    }
                    setMobileOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group
                    ${isActive 
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Project Quick Filter Section */}
          <div className="space-y-2 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between px-3">
              <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">Active Filter</p>
              {selectedProjectId !== 'ALL' && (
                <button
                  onClick={() => setSelectedProjectId('ALL')}
                  className="text-[10px] text-indigo-400 hover:underline"
                >
                  Clear Filter
                </button>
              )}
            </div>

            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedProjectId('ALL')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                  selectedProjectId === 'ALL'
                    ? 'bg-slate-800 text-indigo-300 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <span>All Projects</span>
                <span className="text-[10px] font-mono text-slate-500">{projects.length}</span>
              </button>

              {projects.map(proj => {
                const statusColors = {
                  Active: 'bg-emerald-400',
                  Planning: 'bg-amber-400',
                  Completed: 'bg-cyan-400',
                  'On Hold': 'bg-rose-400'
                };

                return (
                  <button
                    key={proj.id}
                    onClick={() => setSelectedProjectId(proj.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between group ${
                      selectedProjectId === proj.id
                        ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className={`w-2 h-2 rounded-full ${statusColors[proj.status] || 'bg-slate-400'}`} />
                      <span className="truncate">{proj.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">
                      {formatCurrency(proj.budget)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom Actions: Export / Import JSON & Demo Reset */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={exportDataJSON}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-semibold transition-colors"
              title="Export JSON Backup"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-semibold transition-colors"
              title="Import JSON Backup"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Import</span>
            </button>
          </div>

          <button
            onClick={resetToDemoData}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-medium transition-colors border border-dashed border-slate-800 hover:border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </aside>
    </>
  );
}
