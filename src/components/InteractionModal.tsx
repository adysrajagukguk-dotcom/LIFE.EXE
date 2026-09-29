import React from 'react';
import { LocationData, Activity, PlayerStats } from '../types/game';
import {
  X,
  Clock,
  Zap,
  BookOpen,
  DollarSign,
  Heart,
  Award,
  Flame,
  ArrowRight,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface InteractionModalProps {
  location: LocationData;
  stats: PlayerStats;
  currentHour: number;
  onSelectActivity: (activity: Activity) => void;
  onClose: () => void;
}

export const InteractionModal: React.FC<InteractionModalProps> = ({
  location,
  stats,
  currentHour,
  onSelectActivity,
  onClose,
}) => {
  const handlePerform = (activity: Activity) => {
    soundManager.playClick();
    onSelectActivity(activity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in font-sans">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{ borderColor: `${location.color}44` }}
      >
        {/* Header with location theme accent */}
        <div
          className="p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${location.color}15 0%, rgba(15, 23, 42, 0.95) 100%)`,
          }}
        >
          <div className="space-y-1 pr-6">
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-cyan-400">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: location.color }}
              />
              <span>{location.subtitle}</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{location.name}</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              {location.description}
            </p>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: List of activities */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
            <span className="font-semibold uppercase tracking-wider text-slate-300">
              Available Activities
            </span>
            <span className="font-mono">Current Time: {Math.floor(currentHour)}:00</span>
          </div>

          <div className="grid gap-3.5">
            {location.activities.map((act) => {
              // Check requirements
              const hasEnergy =
                !act.requires?.minEnergy || stats.energy >= act.requires.minEnergy;
              const hasMoney =
                !act.requires?.minMoney || stats.money >= act.requires.minMoney;
              const hasKnowledge =
                !act.requires?.minKnowledge || stats.knowledge >= act.requires.minKnowledge;
              const hasConfidence =
                !act.requires?.minConfidence || stats.confidence >= act.requires.minConfidence;
              const canPerform = hasEnergy && hasMoney && hasKnowledge && hasConfidence;

              return (
                <div
                  key={act.id}
                  className={`p-4 rounded-xl border transition-all ${
                    canPerform
                      ? 'bg-slate-800/50 hover:bg-slate-800/80 border-slate-700/80 hover:border-slate-600'
                      : 'bg-slate-900/40 border-slate-800/60 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white text-base">{act.title}</h3>
                        {act.id === 'sleep_night' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                            NEXT DAY
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 leading-normal">{act.description}</p>

                      {/* Cost & Stat preview strip */}
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400">
                        {/* Time */}
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="font-mono text-slate-300">{act.timeHours}h</span>
                        </div>

                        {/* Energy */}
                        <div className="flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          <span
                            className={`font-mono ${
                              act.energyCost < 0 ? 'text-emerald-400' : 'text-slate-300'
                            }`}
                          >
                            {act.energyCost < 0
                              ? `+${Math.abs(act.energyCost)} Energy`
                              : `-${act.energyCost} Energy`}
                          </span>
                        </div>

                        {/* Stat effects */}
                        {act.statEffects.knowledge && (
                          <span className="text-purple-300 font-mono">
                            +{act.statEffects.knowledge} Knowl.
                          </span>
                        )}
                        {act.statEffects.money && (
                          <span
                            className={`font-mono ${
                              act.statEffects.money > 0 ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {act.statEffects.money > 0
                              ? `+$${act.statEffects.money}`
                              : `-$${Math.abs(act.statEffects.money)}`}
                          </span>
                        )}
                        {act.statEffects.relationships && (
                          <span className="text-rose-300 font-mono">
                            +{act.statEffects.relationships} Rel.
                          </span>
                        )}
                        {act.statEffects.confidence && (
                          <span className="text-sky-300 font-mono">
                            +{act.statEffects.confidence} Conf.
                          </span>
                        )}
                        {act.statEffects.stress && (
                          <span
                            className={`font-mono ${
                              act.statEffects.stress < 0 ? 'text-emerald-400' : 'text-amber-400'
                            }`}
                          >
                            {act.statEffects.stress < 0
                              ? `${act.statEffects.stress} Stress`
                              : `+${act.statEffects.stress} Stress`}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="sm:self-center shrink-0">
                      {canPerform ? (
                        <button
                          onClick={() => handlePerform(act)}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-950 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 transition-all cursor-pointer shadow-md hover:shadow-cyan-400/20"
                        >
                          <span>{act.id === 'sleep_night' ? 'Sleep Now' : 'Engage'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-rose-400 px-3 py-2 bg-rose-950/40 rounded-xl border border-rose-900/50">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>
                            {!hasEnergy
                              ? `Need ${act.requires?.minEnergy}% Energy`
                              : !hasMoney
                              ? `Need $${act.requires?.minMoney}`
                              : !hasKnowledge
                              ? `Need ${act.requires?.minKnowledge} Knowl.`
                              : `Need ${act.requires?.minConfidence} Conf.`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Every decision consumes finite city hours. Choose with intention.</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
};
