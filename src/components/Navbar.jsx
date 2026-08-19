import React from 'react';
import { 
  PlusCircle, 
  FolderPlus, 
  Moon, 
  Sun, 
  TrendingUp, 
  Layers, 
  RotateCcw,
  Menu,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { useExpenseTracker } from '../context/ExpenseContext';
import { CURRENCIES } from '../data/initialData';

export default function Navbar({ 
  onOpenExpenseModal, 
  onOpenProjectModal,
  onOpenReportModal,
  mobileMenuOpen,
  setMobileMenuOpen
}) {
  const { 
    theme, 
    toggleTheme, 
    currencyCode, 
    setCurrencyCode, 
    projects, 
    selectedProjectId, 
    setSelectedProjectId,
    resetToDemoData
  } = useExpenseTracker();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Brand Logo & Project Dropdown */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setSelectedProjectId('ALL')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5 leading-none">
                  Trackify <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">PRO</span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Project Financial Suite</p>
              </div>
            </div>

            {/* Project Quick Selector */}
            <div className="hidden md:flex items-center gap-2 bg-slate-800/80 border border-slate-700/70 rounded-lg p-1">
              <Layers className="w-4 h-4 text-slate-400 ml-2" />
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="bg-transparent text-xs font-medium text-slate-200 focus:outline-none cursor-pointer pr-2 py-1"
              >
                <option value="ALL" className="bg-slate-900 text-slate-100">All Projects ({projects.length})</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-slate-100">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right: Currency, Theme, Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Currency Selector */}
            <select
              value={currencyCode}
              onChange={(e) => setCurrencyCode(e.target.value)}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              title="Change Currency"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>
                  {c.symbol} {c.code}
                </option>
              ))}
            </select>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-slate-100 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/70 rounded-lg transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* Printable Report Summary Button */}
            <button
              onClick={onOpenReportModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Report</span>
            </button>

            {/* Reset Demo Data Button */}
            <button
              onClick={resetToDemoData}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-lg transition-colors"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Demo</span>
            </button>

            {/* New Project Button */}
            <button
              onClick={onOpenProjectModal}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg shadow-sm hover:border-slate-600 transition-all"
            >
              <FolderPlus className="w-4 h-4 text-cyan-400" />
              <span>New Project</span>
            </button>

            {/* New Expense Primary Button */}
            <button
              onClick={onOpenExpenseModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-lg shadow-md shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Expense</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-slate-100 bg-slate-800 border border-slate-700 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
