import React, { useState } from 'react';
import { NPCData, PlayerStats } from '../types/game';
import { X, MessageSquare, Heart, Clock, Zap, ArrowRight } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface NPCModalProps {
  npc: NPCData;
  stats: PlayerStats;
  onTalk: (topic: NPCData['dialogue']['topics'][0]) => void;
  onClose: () => void;
}

export const NPCModal: React.FC<NPCModalProps> = ({ npc, stats, onTalk, onClose }) => {
  const [activeResponse, setActiveResponse] = useState<string | null>(null);

  const handleTopicClick = (topic: NPCData['dialogue']['topics'][0]) => {
    soundManager.playClick();
    setActiveResponse(topic.response);
    onTalk(topic);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in font-sans">
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ borderColor: `${npc.color}55` }}
      >
        {/* Header */}
        <div
          className="p-5 border-b border-slate-800 flex items-start justify-between"
          style={{
            background: `linear-gradient(135deg, ${npc.color}15 0%, rgba(15, 23, 42, 0.95) 100%)`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md"
              style={{ backgroundColor: npc.color }}
            >
              {npc.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">{npc.name}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span>{npc.title}</span>
                <span className="text-slate-600">·</span>
                <div className="flex items-center gap-1 text-rose-400">
                  <Heart className="w-3 h-3 fill-current" />
                  <span className="font-mono tabular-nums">{npc.relationshipScore} Rel.</span>
                </div>
              </div>
            </div>
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

        {/* Conversation Box */}
        <div className="p-5 space-y-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 leading-relaxed shadow-inner">
            <p className="italic text-cyan-200">
              "{activeResponse || npc.dialogue.greeting}"
            </p>
          </div>

          {/* Topics */}
          <div className="space-y-2 pt-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Discuss Topics</span>
            </div>

            <div className="grid gap-2">
              {npc.dialogue.topics.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTopicClick(t)}
                  className="w-full text-left p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 transition-all flex items-center justify-between gap-3 group cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-slate-200 group-hover:text-white">
                      {t.label}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      {t.timeHours && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          <span>{t.timeHours}h</span>
                        </span>
                      )}
                      {t.energyCost !== undefined && (
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-400" />
                          <span>
                            {t.energyCost < 0
                              ? `+${Math.abs(t.energyCost)} En.`
                              : `-${t.energyCost} En.`}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
          >
            Goodbye
          </button>
        </div>
      </div>
    </div>
  );
};
