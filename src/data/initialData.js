export const CATEGORIES = [
  { id: 'dev', name: 'Development', color: '#6366f1', bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  { id: 'design', name: 'Design & UI/UX', color: '#ec4899', bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30' },
  { id: 'infra', name: 'Infrastructure & Hosting', color: '#06b6d4', bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  { id: 'marketing', name: 'Marketing & PR', color: '#f59e0b', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  { id: 'legal', name: 'Legal & Finance', color: '#8b5cf6', bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  { id: 'contractors', name: 'Freelancers & Contractors', color: '#10b981', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  { id: 'hardware', name: 'Hardware & Tools', color: '#3b82f6', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  { id: 'misc', name: 'Miscellaneous', color: '#64748b', bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30' }
];

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' }
];

export const PAYMENT_METHODS = [
  'Corporate Credit Card',
  'Wire Transfer',
  'PayPal',
  'Stripe Direct',
  'Company Account',
  'Petty Cash'
];

export const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    name: 'NextGen Mobile Banking App',
    client: 'Apex Financial Ltd.',
    budget: 120000,
    startDate: '2026-01-15',
    endDate: '2026-10-30',
    status: 'Active',
    category: 'Fintech Mobile App',
    description: 'Cross-platform iOS/Android banking application with biometric auth, card management, and instant P2P transfer features.',
    categoryBudgets: {
      dev: 55000,
      design: 25000,
      infra: 15000,
      legal: 10000,
      contractors: 15000
    }
  },
  {
    id: 'proj-2',
    name: 'Cloud Infrastructure & Security Migration',
    client: 'Enterprise Systems Corp',
    budget: 85000,
    startDate: '2026-02-01',
    endDate: '2026-07-15',
    status: 'Active',
    category: 'Cloud Infrastructure',
    description: 'Transition legacy server infrastructure to AWS Kubernetes clusters with SOC2 compliance and zero-downtime database replication.',
    categoryBudgets: {
      infra: 40000,
      dev: 25000,
      legal: 10000,
      hardware: 10000
    }
  },
  {
    id: 'proj-3',
    name: 'Global Brand Identity & PR Campaign',
    client: 'Internal Product Division',
    budget: 45000,
    startDate: '2026-03-10',
    endDate: '2026-08-30',
    status: 'Planning',
    category: 'Branding & Marketing',
    description: 'Modernize company visual assets, produce high-impact promo video assets, and execute targeted developer conference marketing.',
    categoryBudgets: {
      marketing: 25000,
      design: 12000,
      contractors: 8000
    }
  },
  {
    id: 'proj-4',
    name: 'AI Customer Support Suite',
    client: 'Retail Giant Inc.',
    budget: 60000,
    startDate: '2025-10-01',
    endDate: '2026-04-15',
    status: 'Completed',
    category: 'AI / Automation',
    description: 'LLM customer service assistant integrated with Zendesk, real-time ticket classification, and automated refund routing.',
    categoryBudgets: {
      dev: 35000,
      infra: 15000,
      contractors: 10000
    }
  }
];

export const INITIAL_EXPENSES = [
  {
    id: 'exp-101',
    projectId: 'proj-1',
    title: 'Senior Flutter Lead Consultancy',
    category: 'dev',
    amount: 14500,
    date: '2026-07-10',
    vendor: 'CodeCraft Solutions LLC',
    paymentMethod: 'Wire Transfer',
    status: 'Paid',
    recurring: 'One-time',
    receipt: {
      fileName: 'INV-2026-089.pdf',
      fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60'
    },
    notes: 'Sprint 5 & 6 core architecture setup for banking encryption module.'
  },
  {
    id: 'exp-102',
    projectId: 'proj-1',
    title: 'Figma Enterprise Workspace Annual Renewal',
    category: 'design',
    amount: 3200,
    date: '2026-06-18',
    vendor: 'Figma Inc.',
    paymentMethod: 'Corporate Credit Card',
    status: 'Paid',
    recurring: 'Yearly',
    receipt: {
      fileName: 'Figma-Receipt-9982.png',
      fileUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&auto=format&fit=crop&q=60'
    },
    notes: '20 team seats for Mobile App UI design systems.'
  },
  {
    id: 'exp-103',
    projectId: 'proj-1',
    title: 'AWS GovCloud Development Cluster',
    category: 'infra',
    amount: 4850,
    date: '2026-08-01',
    vendor: 'Amazon Web Services',
    paymentMethod: 'Corporate Credit Card',
    status: 'Paid',
    recurring: 'Monthly',
    receipt: {
      fileName: 'AWS-Invoice-Aug2026.pdf',
      fileUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=60'
    },
    notes: 'Monthly staging environment, VPC peering, and RDS PostgreSQL cluster.'
  },
  {
    id: 'exp-104',
    projectId: 'proj-1',
    title: 'Financial Compliance Audit & Pen Testing',
    category: 'legal',
    amount: 8500,
    date: '2026-08-14',
    vendor: 'CyberGuard Auditing LLP',
    paymentMethod: 'Wire Transfer',
    status: 'Pending',
    recurring: 'One-time',
    receipt: {
      fileName: 'PenTest-Quote-7712.pdf',
      fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=60'
    },
    notes: 'ISO 27001 & PCI-DSS compliance verification audit before beta release.'
  },
  {
    id: 'exp-105',
    projectId: 'proj-2',
    title: 'AWS Dedicated Reserved Instances (3-Year)',
    category: 'infra',
    amount: 22400,
    date: '2026-02-15',
    vendor: 'Amazon Web Services',
    paymentMethod: 'Wire Transfer',
    status: 'Paid',
    recurring: 'One-time',
    receipt: {
      fileName: 'AWS-RI-Contract-2026.pdf',
      fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60'
    },
    notes: 'Upfront payment for 8x EC2 r6i.4xlarge nodes to maximize discount.'
  },
  {
    id: 'exp-106',
    projectId: 'proj-2',
    title: 'Kubernetes Migration DevOps Contractor',
    category: 'dev',
    amount: 12500,
    date: '2026-04-20',
    vendor: 'CloudOps Experts Ltd',
    paymentMethod: 'Stripe Direct',
    status: 'Paid',
    recurring: 'One-time',
    receipt: null,
    notes: 'Terraform script creation, Helm chart setup, and CI/CD deployment pipelines.'
  },
  {
    id: 'exp-107',
    projectId: 'proj-2',
    title: 'Datadog Enterprise Monitoring Subscription',
    category: 'infra',
    amount: 6200,
    date: '2026-07-05',
    vendor: 'Datadog Inc.',
    paymentMethod: 'Corporate Credit Card',
    status: 'Paid',
    recurring: 'Monthly',
    receipt: {
      fileName: 'Datadog-INV-882.pdf',
      fileUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&auto=format&fit=crop&q=60'
    },
    notes: 'Log management, APM, and infrastructure metrics for 45 nodes.'
  },
  {
    id: 'exp-108',
    projectId: 'proj-3',
    title: 'Brand Identity Guidelines & 3D Motion Assets',
    category: 'design',
    amount: 9800,
    date: '2026-04-02',
    vendor: 'Studio Aesthetic Agency',
    paymentMethod: 'Wire Transfer',
    status: 'Paid',
    recurring: 'One-time',
    receipt: {
      fileName: 'StudioAesthetic-Inv-04.pdf',
      fileUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=60'
    },
    notes: 'Complete rebrand deck, typography, icon set, and 3D logo splash video.'
  },
  {
    id: 'exp-109',
    projectId: 'proj-3',
    title: 'TechCrunch & ProductHunt Promo Sponsorships',
    category: 'marketing',
    amount: 15000,
    date: '2026-06-01',
    vendor: 'Yahoo / Tech Media Network',
    paymentMethod: 'Corporate Credit Card',
    status: 'Pending',
    recurring: 'One-time',
    receipt: null,
    notes: 'Sponsored newsletter spot and featured launch placement.'
  },
  {
    id: 'exp-110',
    projectId: 'proj-4',
    title: 'OpenAI API Token Credits (Enterprise)',
    category: 'dev',
    amount: 18500,
    date: '2025-11-20',
    vendor: 'OpenAI LLC',
    paymentMethod: 'Corporate Credit Card',
    status: 'Paid',
    recurring: 'Monthly',
    receipt: {
      fileName: 'OpenAI-Receipt-10023.pdf',
      fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60'
    },
    notes: 'GPT-4o fine-tuning and inference credits for support bot training.'
  },
  {
    id: 'exp-111',
    projectId: 'proj-4',
    title: 'Pinecone Vector DB Enterprise Cluster',
    category: 'infra',
    amount: 7400,
    date: '2026-01-10',
    vendor: 'Pinecone Systems Inc',
    paymentMethod: 'PayPal',
    status: 'Paid',
    recurring: 'Monthly',
    receipt: null,
    notes: 'High-throughput vector indexing for product catalog embeddings.'
  }
];
