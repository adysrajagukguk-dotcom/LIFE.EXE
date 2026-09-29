import React from 'react';
import { Play, Sparkles, Navigation, Clock, Compass } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface OnboardingModalProps {
  onStart: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onStart }) => {
  const handleStart = () => {
    soundManager.playClick();
    soundManager.playSuccess();
    onStart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fade-in font-sans">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Lockup & Brief Prose */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-cyan-400 text-xs font-mono font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>3D LIFE SIMULATION</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-serif">
            LIFE<span className="text-cyan-400">.EXE</span>
          </h1>

          <div className="py-2 space-y-1.5 text-sm sm:text-base text-slate-300 font-medium">
            <p className="text-cyan-300 font-semibold">Your life is running.</p>
            <p>You have 7 days.</p>
            <p>Every decision has a consequence.</p>
            <p className="text-amber-300 font-medium italic">What kind of life will you build?</p>
          </div>
        </div>

        {/* City & Exploration Guide */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-3 text-xs text-slate-300">
          <div className="text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Welcome to New Day City</span>
          </div>

          <p className="leading-relaxed">
            Explore 6 unique city districts: the <strong className="text-white">University</strong>, <strong className="text-white">Cafe</strong>, <strong className="text-white">Apex Office</strong>, <strong className="text-white">City Park</strong>, <strong className="text-white">Creative Hub</strong>, and your <strong className="text-white">Apartment</strong>. Meet NPCs, make decisions, balance stress and energy, and discover how choices shape your future.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 rounded bg-slate-800 font-mono text-slate-200">WASD</kbd>
              <span>Move character</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 rounded bg-slate-800 font-mono text-slate-200">E</kbd>
              <span>Interact</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 rounded bg-slate-800 font-mono text-slate-200">Right-Drag</kbd>
              <span>Orbit Camera</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 rounded bg-slate-800 font-mono text-slate-200">M</kbd>
              <span>City Map</span>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-sm text-slate-950 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 transition-all cursor-pointer shadow-xl shadow-cyan-400/25 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Launch Simulation</span>
        </button>
      </div>
    </div>
  );
};
