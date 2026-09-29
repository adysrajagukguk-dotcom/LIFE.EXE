import React from 'react';
import { PlayerStats } from '../types/game';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  statDeltas?: Partial<PlayerStats>;
  type?: 'info' | 'success' | 'warning';
}

interface NotificationToastProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-20 right-4 z-40 flex flex-col gap-2 max-w-sm w-full pointer-events-none font-sans">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-slate-950/90 backdrop-blur-md border border-slate-800 p-3.5 rounded-xl shadow-xl space-y-1.5 animate-slide-left transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs text-cyan-400 font-mono tracking-wide uppercase">
              {toast.title}
            </span>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-500 hover:text-slate-300 text-xs px-1"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-slate-200 leading-snug">{toast.message}</p>

          {toast.statDeltas && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-mono tabular-nums">
              {toast.statDeltas.energy !== undefined && (
                <span
                  className={
                    toast.statDeltas.energy >= 0 ? 'text-emerald-400' : 'text-amber-400'
                  }
                >
                  {toast.statDeltas.energy >= 0 ? '+' : ''}
                  {toast.statDeltas.energy} Energy
                </span>
              )}
              {toast.statDeltas.knowledge !== undefined && (
                <span className="text-purple-400">
                  {toast.statDeltas.knowledge >= 0 ? '+' : ''}
                  {toast.statDeltas.knowledge} Knowl.
                </span>
              )}
              {toast.statDeltas.money !== undefined && (
                <span
                  className={
                    toast.statDeltas.money >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }
                >
                  {toast.statDeltas.money >= 0 ? '+' : ''}${toast.statDeltas.money}
                </span>
              )}
              {toast.statDeltas.relationships !== undefined && (
                <span className="text-rose-400">
                  {toast.statDeltas.relationships >= 0 ? '+' : ''}
                  {toast.statDeltas.relationships} Rel.
                </span>
              )}
              {toast.statDeltas.confidence !== undefined && (
                <span className="text-sky-400">
                  {toast.statDeltas.confidence >= 0 ? '+' : ''}
                  {toast.statDeltas.confidence} Conf.
                </span>
              )}
              {toast.statDeltas.stress !== undefined && (
                <span
                  className={
                    toast.statDeltas.stress <= 0 ? 'text-emerald-400' : 'text-amber-400'
                  }
                >
                  {toast.statDeltas.stress > 0 ? '+' : ''}
                  {toast.statDeltas.stress} Stress
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
