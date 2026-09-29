import React, { useEffect } from 'react';
import { FinalProfile, DecisionRecord } from '../types/game';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Sparkles,
  BookOpen,
  DollarSign,
  Heart,
  Award,
  Zap,
  Flame,
  CheckCircle,
} from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface EndGameProfileModalProps {
  profile: FinalProfile;
  decisions: DecisionRecord[];
  onRestart: () => void;
}

export const EndGameProfileModal: React.FC<EndGameProfileModalProps> = ({
  profile,
  decisions,
  onRestart,
}) => {
  useEffect(() => {
    // Launch celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    soundManager.playSuccess();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-fade-in font-sans overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 my-auto">
        {/* Archetype Hero Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/50 text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>LIFE.EXE EVALUATION COMPLETE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-serif">
            {profile.archetype}
          </h1>

          <p className="text-sm font-medium text-cyan-300 italic">{profile.tagline}</p>
        </div>

        {/* Narrative Description & Core Philosophy */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3">
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {profile.description}
          </p>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Core Axiom:</span>
            <span className="text-amber-400 font-semibold italic">
              "You can't optimize everything."
            </span>
          </div>
        </div>

        {/* Final Stats Overview */}
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Final Life Metrics
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Knowledge */}
            <div className="bg-slate-800/50 border border-slate-700/60 p-3 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-purple-300">
                  <BookOpen className="w-3.5 h-3.5" /> Knowledge
                </span>
                <span className="font-mono text-purple-200 font-bold">
                  {Math.round(profile.finalStats.knowledge)}
                </span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full"
                  style={{ width: `${Math.min(100, profile.finalStats.knowledge)}%` }}
                />
              </div>
            </div>

            {/* Money */}
            <div className="bg-slate-800/50 border border-slate-700/60 p-3 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-emerald-300">
                  <DollarSign className="w-3.5 h-3.5" /> Balance
                </span>
                <span className="font-mono text-emerald-200 font-bold">
                  ${Math.round(profile.finalStats.money)}
                </span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full"
                  style={{ width: `${Math.min(100, profile.finalStats.money / 2)}%` }}
                />
              </div>
            </div>

            {/* Relationships */}
            <div className="bg-slate-800/50 border border-slate-700/60 p-3 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-rose-300">
                  <Heart className="w-3.5 h-3.5" /> Connections
                </span>
                <span className="font-mono text-rose-200 font-bold">
                  {Math.round(profile.finalStats.relationships)}
                </span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full"
                  style={{ width: `${Math.min(100, profile.finalStats.relationships)}%` }}
                />
              </div>
            </div>

            {/* Confidence */}
            <div className="bg-slate-800/50 border border-slate-700/60 p-3 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-sky-300">
                  <Award className="w-3.5 h-3.5" /> Confidence
                </span>
                <span className="font-mono text-sky-200 font-bold">
                  {Math.round(profile.finalStats.confidence)}
                </span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full"
                  style={{ width: `${Math.min(100, profile.finalStats.confidence)}%` }}
                />
              </div>
            </div>

            {/* Energy */}
            <div className="bg-slate-800/50 border border-slate-700/60 p-3 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-amber-300">
                  <Zap className="w-3.5 h-3.5" /> Final Energy
                </span>
                <span className="font-mono text-amber-200 font-bold">
                  {Math.round(profile.finalStats.energy)}%
                </span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full"
                  style={{ width: `${Math.min(100, profile.finalStats.energy)}%` }}
                />
              </div>
            </div>

            {/* Stress */}
            <div className="bg-slate-800/50 border border-slate-700/60 p-3 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-orange-300">
                  <Flame className="w-3.5 h-3.5" /> Residual Stress
                </span>
                <span className="font-mono text-orange-200 font-bold">
                  {Math.round(profile.finalStats.stress)}%
                </span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-orange-500 h-full"
                  style={{ width: `${Math.min(100, profile.finalStats.stress)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Life Decisions Recap */}
        <div className="space-y-2 text-xs">
          <div className="text-slate-400 font-semibold uppercase tracking-wider">
            Behavioral Anatomy
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2.5">
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Most Frequent Routine:</span>
              <span className="font-medium text-white">{profile.mostFrequentActivity}</span>
            </div>

            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Dominant Strength:</span>
              <span className="font-medium text-emerald-300">{profile.dominantStrength}</span>
            </div>

            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Greatest Sacrifice / Trade-off:</span>
              <span className="font-medium text-rose-300">{profile.greatestTradeoff}</span>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-1">
              <div className="text-slate-400">Pivotal Defining Choice:</div>
              <div className="text-cyan-200 font-medium italic">
                "{profile.pivotalDecision}"
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-slate-400">Opportunity Reflection:</div>
              <div className="text-slate-300 leading-normal">
                {profile.opportunityReflection}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button: Restart */}
        <button
          onClick={() => {
            soundManager.playClick();
            onRestart();
          }}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all cursor-pointer shadow-xl shadow-cyan-400/25"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reboot LIFE.EXE (New Playthrough)</span>
        </button>
      </div>
    </div>
  );
};
