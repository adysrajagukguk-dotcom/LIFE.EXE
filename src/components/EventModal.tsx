import React, { useState } from 'react';
import { GameEvent, GameEventChoice, PlayerStats } from '../types/game';
import { Sparkles, Clock, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface EventModalProps {
  event: GameEvent;
  stats: PlayerStats;
  onChoiceSelected: (choice: GameEventChoice) => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, stats, onChoiceSelected }) => {
  const [selectedChoice, setSelectedChoice] = useState<GameEventChoice | null>(null);

  const handleSelect = (choice: GameEventChoice) => {
    soundManager.playClick();
    setSelectedChoice(choice);
  };

  const handleConfirm = () => {
    if (!selectedChoice) return;
    soundManager.playSuccess();
    onChoiceSelected(selectedChoice);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-cyan-950/40 to-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CITY EVENT // {event.subtitle}</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{event.title}</h2>
        </div>

        {/* Narrative & Choices */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Situation Prose */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 text-sm text-slate-200 leading-relaxed">
            {event.description}
          </div>

          {/* If choice selected, show outcome confirmation */}
          {selectedChoice ? (
            <div className="bg-cyan-950/30 border border-cyan-800/50 rounded-xl p-4 space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 text-cyan-300 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Decision Selected</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed italic">
                "{selectedChoice.outcomeText}"
              </p>

              {/* Trade-off summary */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
                {selectedChoice.timeHours && (
                  <span className="text-slate-400">Time: +{selectedChoice.timeHours}h</span>
                )}
                {selectedChoice.energyCost && (
                  <span className="text-amber-400">Energy: -{selectedChoice.energyCost}</span>
                )}
                {selectedChoice.statEffects.knowledge && (
                  <span className="text-purple-400">
                    +{selectedChoice.statEffects.knowledge} Knowledge
                  </span>
                )}
                {selectedChoice.statEffects.money && (
                  <span
                    className={
                      selectedChoice.statEffects.money > 0 ? 'text-emerald-400' : 'text-rose-400'
                    }
                  >
                    {selectedChoice.statEffects.money > 0 ? '+' : ''}$
                    {selectedChoice.statEffects.money}
                  </span>
                )}
                {selectedChoice.statEffects.relationships && (
                  <span className="text-rose-400">
                    +{selectedChoice.statEffects.relationships} Rel.
                  </span>
                )}
                {selectedChoice.statEffects.confidence && (
                  <span className="text-sky-400">
                    +{selectedChoice.statEffects.confidence} Conf.
                  </span>
                )}
                {selectedChoice.statEffects.stress && (
                  <span
                    className={
                      selectedChoice.statEffects.stress < 0 ? 'text-emerald-400' : 'text-amber-400'
                    }
                  >
                    {selectedChoice.statEffects.stress > 0 ? '+' : ''}
                    {selectedChoice.statEffects.stress} Stress
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Choose Your Response
              </div>

              <div className="grid gap-3">
                {event.choices.map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(choice)}
                    className="w-full text-left p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 transition-all space-y-1.5 group cursor-pointer"
                  >
                    <div className="font-semibold text-white text-sm flex items-center justify-between">
                      <span className="group-hover:text-cyan-300 transition-colors">
                        {choice.text}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                    <p className="text-xs text-slate-300 leading-normal">{choice.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500 italic">"You can't optimize everything."</div>
          {selectedChoice && (
            <button
              onClick={handleConfirm}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all cursor-pointer shadow-lg shadow-cyan-400/20"
            >
              <span>Commit Decision</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
