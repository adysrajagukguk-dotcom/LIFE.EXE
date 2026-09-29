import React from 'react';
import { PlayerStats, DaySummary } from '../types/game';
import { Moon, Sunrise, Zap, Flame, ArrowRight, BookOpen } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface SleepTransitionModalProps {
  completedDay: number;
  nextDay: number;
  stats: PlayerStats;
  summary: DaySummary;
  onAdvanceDay: () => void;
}

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const SleepTransitionModal: React.FC<SleepTransitionModalProps> = ({
  completedDay,
  nextDay,
  stats,
  summary,
  onAdvanceDay,
}) => {
  const handleProceed = () => {
    soundManager.playClick();
    onAdvanceDay();
  };

  const prevDayName = DAY_NAMES[(completedDay - 1) % 7];
  const nextDayName = DAY_NAMES[(nextDay - 1) % 7];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fade-in font-sans">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-950 border border-blue-800/60 flex items-center justify-center text-blue-400 mb-2">
            <Moon className="w-6 h-6" />
          </div>
          <div className="text-xs font-mono uppercase tracking-widest text-blue-400 font-semibold">
            NIGHT RECHARGE // UNIT 404
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Day {completedDay} Complete ({prevDayName})
          </h2>
          <p className="text-xs text-slate-300">
            You rest and reboot your biological engine for the day ahead.
          </p>
        </div>

        {/* Day Recap Journal Note */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Evening Journal Entry</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed italic">
            "{summary.note}"
          </p>
        </div>

        {/* Stats Recovery Summary */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-800/50 border border-slate-700/60 p-3 rounded-xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-950/50 text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Energy Restored</div>
              <div className="font-mono font-bold text-emerald-400 text-sm">100%</div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/60 p-3 rounded-xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-950/50 text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Stress Relieved</div>
              <div className="font-mono font-bold text-amber-400 text-sm">-20%</div>
            </div>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={handleProceed}
          className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all cursor-pointer shadow-lg shadow-cyan-400/25"
        >
          <Sunrise className="w-4 h-4" />
          <span>Awaken to Day {nextDay} ({nextDayName})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
