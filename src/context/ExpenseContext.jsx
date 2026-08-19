import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PROJECTS, INITIAL_EXPENSES, CURRENCIES, CATEGORIES } from '../data/initialData';
import confetti from 'canvas-confetti';

const ExpenseContext = createContext();

const STORAGE_KEYS = {
  PROJECTS: 'trackify_projects_v1',
  EXPENSES: 'trackify_expenses_v1',
  CURRENCY: 'trackify_currency_v1',
  THEME: 'trackify_theme_v1'
};

export function ExpenseProvider({ children }) {
  // Theme state
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    return savedTheme || 'dark';
  });

  // Currency state
  const [currencyCode, setCurrencyCode] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENCY);
    return saved || 'USD';
  });

  // Selected Project Filter ('ALL' or project ID)
  const [selectedProjectId, setSelectedProjectId] = useState('ALL');

  // Active View Tab ('dashboard' | 'projects' | 'expenses' | 'analytics' | 'reports')
  const [activeTab, setActiveTab] = useState('dashboard');

  // Projects state
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch (e) {
      console.error('Error loading projects from localStorage', e);
      return INITIAL_PROJECTS;
    }
  });

  // Expenses state
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    } catch (e) {
      console.error('Error loading expenses from localStorage', e);
      return INITIAL_EXPENSES;
    }
  });

  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  // Sync projects to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  // Sync expenses to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }, [expenses]);

  // Sync currency to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENCY, currencyCode);
  }, [currencyCode]);

  // Sync theme
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Toast Helper
  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    addToast(`Switched to ${nextTheme} theme`, 'info');
  };

  // Currency helper
  const currencyObj = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];

  const formatCurrency = (amount) => {
    const val = Number(amount) || 0;
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyObj.code,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(val);
    } catch {
      return `${currencyObj.symbol}${val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    }
  };

  // Project Actions
  const addProject = (projectData) => {
    const newProj = {
      ...projectData,
      id: `proj-${Date.now()}`,
      budget: Number(projectData.budget) || 0,
      categoryBudgets: projectData.categoryBudgets || {}
    };
    setProjects(prev => [newProj, ...prev]);
    addToast(`Project "${newProj.name}" created successfully!`);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    return newProj.id;
  };

  const updateProject = (id, updatedFields) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, ...updatedFields, budget: Number(updatedFields.budget ?? p.budget) };
      }
      return p;
    }));
    addToast(`Project updated successfully!`, 'info');
  };

  const deleteProject = (id) => {
    const proj = projects.find(p => p.id === id);
    setProjects(prev => prev.filter(p => p.id !== id));
    // Also remove associated expenses
    setExpenses(prev => prev.filter(e => e.projectId !== id));
    if (selectedProjectId === id) {
      setSelectedProjectId('ALL');
    }
    addToast(`Deleted project "${proj?.name || ''}" and its expenses.`, 'warning');
  };

  // Expense Actions
  const addExpense = (expenseData) => {
    const newExp = {
      ...expenseData,
      id: `exp-${Date.now()}`,
      amount: Number(expenseData.amount) || 0,
      date: expenseData.date || new Date().toISOString().split('T')[0]
    };
    setExpenses(prev => [newExp, ...prev]);
    addToast(`Added expense "${newExp.title}" (${formatCurrency(newExp.amount)})`);

    // Check project budget health
    const proj = projects.find(p => p.id === newExp.projectId);
    if (proj) {
      const projExpenses = [...expenses, newExp].filter(e => e.projectId === proj.id);
      const totalSpent = projExpenses.reduce((sum, e) => sum + e.amount, 0);
      if (totalSpent > proj.budget) {
        addToast(`Alert: "${proj.name}" is over budget by ${formatCurrency(totalSpent - proj.budget)}!`, 'error');
      }
    }
  };

  const updateExpense = (id, updatedFields) => {
    setExpenses(prev => prev.map(e => {
      if (e.id === id) {
        return { ...e, ...updatedFields, amount: Number(updatedFields.amount ?? e.amount) };
      }
      return e;
    }));
    addToast(`Expense updated successfully!`, 'info');
  };

  const deleteExpense = (id) => {
    const exp = expenses.find(e => e.id === id);
    setExpenses(prev => prev.filter(e => e.id !== id));
    addToast(`Removed expense "${exp?.title || ''}"`, 'warning');
  };

  const toggleExpenseStatus = (id) => {
    setExpenses(prev => prev.map(e => {
      if (e.id === id) {
        const nextStatus = e.status === 'Paid' ? 'Pending' : 'Paid';
        addToast(`Marked "${e.title}" as ${nextStatus}`, 'info');
        return { ...e, status: nextStatus };
      }
      return e;
    }));
  };

  // Reset to Demo Data
  const resetToDemoData = () => {
    setProjects(INITIAL_PROJECTS);
    setExpenses(INITIAL_EXPENSES);
    setSelectedProjectId('ALL');
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.EXPENSES);
    addToast('Reset to sample demo dataset!', 'success');
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
  };

  // Clear all data
  const clearAllData = () => {
    setProjects([]);
    setExpenses([]);
    setSelectedProjectId('ALL');
    addToast('Cleared all project and expense data', 'warning');
  };

  // Export JSON
  const exportDataJSON = () => {
    const data = {
      projects,
      expenses,
      currencyCode,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Trackify-Expense-Backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Exported backup JSON file successfully!');
  };

  // Import JSON
  const importDataJSON = (jsonText) => {
    try {
      const parsed = JSON.parse(jsonText);
      if (Array.isArray(parsed.projects) && Array.isArray(parsed.expenses)) {
        setProjects(parsed.projects);
        setExpenses(parsed.expenses);
        if (parsed.currencyCode) setCurrencyCode(parsed.currencyCode);
        addToast('Imported data backup successfully!', 'success');
        confetti({ particleCount: 70, spread: 70 });
      } else {
        throw new Error('Invalid file structure. Expected "projects" and "expenses" arrays.');
      }
    } catch (err) {
      addToast(`Import Failed: ${err.message}`, 'error');
    }
  };

  // Compute calculated metrics
  const activeProjects = selectedProjectId === 'ALL'
    ? projects
    : projects.filter(p => p.id === selectedProjectId);

  const activeExpenses = selectedProjectId === 'ALL'
    ? expenses
    : expenses.filter(e => e.projectId === selectedProjectId);

  const totalBudget = activeProjects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const totalSpent = activeExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const remainingBudget = totalBudget - totalSpent;
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const paidExpensesCount = activeExpenses.filter(e => e.status === 'Paid').length;
  const pendingExpensesCount = activeExpenses.filter(e => e.status === 'Pending').length;

  return (
    <ExpenseContext.Provider value={{
      theme,
      toggleTheme,
      currencyCode,
      setCurrencyCode,
      currencyObj,
      formatCurrency,
      projects,
      expenses,
      selectedProjectId,
      setSelectedProjectId,
      activeTab,
      setActiveTab,
      addProject,
      updateProject,
      deleteProject,
      addExpense,
      updateExpense,
      deleteExpense,
      toggleExpenseStatus,
      resetToDemoData,
      clearAllData,
      exportDataJSON,
      importDataJSON,
      toasts,
      addToast,
      removeToast,
      // Aggregates
      totalBudget,
      totalSpent,
      remainingBudget,
      budgetUtilization,
      paidExpensesCount,
      pendingExpensesCount,
      activeProjects,
      activeExpenses
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenseTracker() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenseTracker must be used within an ExpenseProvider');
  }
  return context;
}
