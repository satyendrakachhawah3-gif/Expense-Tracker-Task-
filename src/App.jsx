import React, { useState } from 'react';
import { ExpenseProvider, useExpenseTracker } from './context/ExpenseContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import KpiCards from './components/KpiCards';
import BudgetProgress from './components/BudgetProgress';
import AnalyticsCharts from './components/AnalyticsCharts';
import ExpenseList from './components/ExpenseList';
import ProjectList from './components/ProjectList';
import ExpenseModal from './components/ExpenseModal';
import ProjectModal from './components/ProjectModal';
import ReportModal from './components/ReportModal';
import ReceiptViewerModal from './components/ReceiptViewerModal';
import ToastContainer from './components/Toast';
import { Layers, Plus, ArrowRight, TrendingUp } from 'lucide-react';

function DashboardContent({ onOpenExpenseModal, onOpenProjectModal, onEditExpense, onViewReceipt }) {
  const { activeTab, setActiveTab, selectedProjectId, projects, formatCurrency } = useExpenseTracker();

  const selectedProjectObj = selectedProjectId !== 'ALL'
    ? projects.find(p => p.id === selectedProjectId)
    : null;

  return (
    <div className="space-y-6">
      
      {/* Scope Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-slate-900 border border-indigo-500/20 p-6 backdrop-blur-md shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold tracking-wider uppercase border border-indigo-500/30">
                {selectedProjectObj ? `Project Scope: ${selectedProjectObj.name}` : 'Global Overview'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {selectedProjectObj ? selectedProjectObj.name : 'Financial Command Center'}
            </h2>
            <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
              {selectedProjectObj 
                ? (selectedProjectObj.description || `Tracking allocated budget of ${formatCurrency(selectedProjectObj.budget)} for ${selectedProjectObj.client || 'client'}.`)
                : 'Monitor cross-project expenditures, budget caps, real-time variance, and vendor invoices.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenProjectModal}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
            >
              + Project
            </button>
            <button
              onClick={onOpenExpenseModal}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Log Expense</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Statistic Cards */}
      <KpiCards />

      {/* Budget Progress & Utilization */}
      <BudgetProgress />

      {/* Visual Analytics Charts Preview */}
      <AnalyticsCharts />

      {/* Filterable Expense Table */}
      <ExpenseList 
        onOpenExpenseModal={onOpenExpenseModal}
        onEditExpense={onEditExpense}
        onViewReceipt={onViewReceipt}
      />
    </div>
  );
}

function MainApp() {
  const { activeTab, setActiveTab } = useExpenseTracker();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [reportModalOpen, setReportModalOpen] = useState(false);
  
  const [receiptModal, setReceiptModal] = useState({ open: false, data: null, title: '' });

  // Open Expense Modal for Edit
  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setExpenseModalOpen(true);
  };

  // Open Expense Modal for Create
  const handleOpenNewExpense = () => {
    setEditingExpense(null);
    setExpenseModalOpen(true);
  };

  // Open Project Modal for Edit
  const handleEditProject = (project) => {
    setEditingProject(project);
    setProjectModalOpen(true);
  };

  // Open Project Modal for Create
  const handleOpenNewProject = () => {
    setEditingProject(null);
    setProjectModalOpen(true);
  };

  // View Receipt Modal
  const handleViewReceipt = (receipt, title) => {
    setReceiptModal({ open: true, data: receipt, title });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Top Navbar */}
      <Navbar
        onOpenExpenseModal={handleOpenNewExpense}
        onOpenProjectModal={handleOpenNewProject}
        onOpenReportModal={() => setReportModalOpen(true)}
        mobileMenuOpen={mobileSidebarOpen}
        setMobileMenuOpen={setMobileSidebarOpen}
      />

      {/* Main Layout Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        
        {/* Sidebar */}
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
          onOpenExpenseModal={handleOpenNewExpense}
          onOpenProjectModal={handleOpenNewProject}
          onOpenReportModal={() => setReportModalOpen(true)}
        />

        {/* Content View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <DashboardContent 
              onOpenExpenseModal={handleOpenNewExpense}
              onOpenProjectModal={handleOpenNewProject}
              onEditExpense={handleEditExpense}
              onViewReceipt={handleViewReceipt}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectList
              onOpenProjectModal={handleOpenNewProject}
              onEditProject={handleEditProject}
            />
          )}

          {activeTab === 'expenses' && (
            <ExpenseList
              onOpenExpenseModal={handleOpenNewExpense}
              onEditExpense={handleEditExpense}
              onViewReceipt={handleViewReceipt}
            />
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-white">Visual Analytics & Expenditure Trends</h2>
                <p className="text-xs text-slate-400">Interactive charts and category distribution</p>
              </div>
              <AnalyticsCharts />
              <BudgetProgress />
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Trackify PRO • Enterprise Project Expense Tracker</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Client-side Storage</span>
            <span>•</span>
            <span>Real-time Variance</span>
            <span>•</span>
            <span>Printable Audits</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ExpenseModal
        isOpen={expenseModalOpen}
        onClose={() => { setExpenseModalOpen(false); setEditingExpense(null); }}
        initialData={editingExpense}
      />

      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() => { setProjectModalOpen(false); setEditingProject(null); }}
        initialData={editingProject}
      />

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />

      <ReceiptViewerModal
        isOpen={receiptModal.open}
        onClose={() => setReceiptModal({ open: false, data: null, title: '' })}
        receipt={receiptModal.data}
        title={receiptModal.title}
      />

      {/* Toast Alerts */}
      <ToastContainer />

    </div>
  );
}

export default function App() {
  return (
    <ExpenseProvider>
      <MainApp />
    </ExpenseProvider>
  );
}
