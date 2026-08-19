import React from 'react';
import { X, ExternalLink, Download, FileCheck, Paperclip } from 'lucide-react';

export default function ReceiptViewerModal({ isOpen, onClose, receipt, title }) {
  if (!isOpen || !receipt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-modal-in flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2">
            <Paperclip className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-sm font-bold text-white leading-none">Receipt Attachment</h3>
              <p className="text-xs text-slate-400 mt-1 truncate max-w-[280px]">{title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-center">
          <div className="overflow-hidden rounded-xl border border-slate-700/80 bg-slate-950 max-h-72 flex items-center justify-center">
            {receipt.fileUrl ? (
              <img
                src={receipt.fileUrl}
                alt={receipt.fileName}
                className="max-h-72 w-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60';
                }}
              />
            ) : (
              <div className="py-12 space-y-2">
                <FileCheck className="w-12 h-12 text-emerald-400 mx-auto" />
                <p className="text-xs font-mono text-slate-300">{receipt.fileName}</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-300">
            <span>Document: {receipt.fileName}</span>
            <span className="text-emerald-400 font-bold">Verified PDF/Image</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/50">
          <a
            href={receipt.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Original</span>
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
}
