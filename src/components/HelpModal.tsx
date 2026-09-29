import React from 'react';
import { X, HelpCircle, Sparkles, Zap, Flame, Clock, Award } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">LIFE.EXE Player Guide</h2>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300">
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="text-amber-400 font-semibold uppercase tracking-wider text-[11px]">
              The Core Rule: "You Can't Optimize Everything"
            </div>
            <p className="leading-relaxed">
              You have 7 days in New Day City. Each day runs from 08:00 to 23:00 with 100% energy. Grinding all-nighters gives massive knowledge or money, but spikes stress and drains energy. Socializing and resting in the park reduce stress but use precious hours.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              Key Life Metrics
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-800">
                <span className="font-bold text-purple-300">Knowledge:</span> Boosted by university study, library research, workshops.
              </div>
              <div className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-800">
                <span className="font-bold text-emerald-300">Money:</span> Earned via barista shifts, freelance contracts, hackathon prizes.
              </div>
              <div className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-800">
                <span className="font-bold text-rose-300">Relationships:</span> Built by chatting with NPCs, collaborating, attending gatherings.
              </div>
              <div className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-800">
                <span className="font-bold text-sky-300">Confidence:</span> Grown through shipping projects, taking calculated risks, standing firm.
              </div>
              <div className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-800">
                <span className="font-bold text-amber-300">Energy:</span> Spent by activities. Restored by sleep at apartment, power naps, coffee.
              </div>
              <div className="p-2.5 bg-slate-800/40 rounded-lg border border-slate-800">
                <span className="font-bold text-orange-400">Stress:</span> Spikes from overworking and deadlines. Reduced in City Park and sleep.
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <div className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              Controls
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 grid grid-cols-2 gap-2 text-[11px]">
              <div><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">W / A / S / D</kbd> Move character</div>
              <div><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">E</kbd> Interact with building or NPC</div>
              <div><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">Right-Drag</kbd> Orbit camera</div>
              <div><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">M</kbd> Open city map</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs hover:bg-cyan-300 transition-colors cursor-pointer"
          >
            Got it, let's explore!
          </button>
        </div>
      </div>
    </div>
  );
};
