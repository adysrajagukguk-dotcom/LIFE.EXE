import React from 'react';
import { LOCATIONS, NPCS } from '../data/cityData';
import { X, MapPin, Navigation, Compass, User } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface CityMapModalProps {
  playerPos: { x: number; z: number };
  onClose: () => void;
  onFastTravel?: (x: number, z: number) => void;
}

export const CityMapModal: React.FC<CityMapModalProps> = ({ playerPos, onClose, onFastTravel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">New Day City Map</h2>
              <p className="text-xs text-slate-400">Metropolitan district navigation & landmarks</p>
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

        {/* Map Visual & District Directory */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Stylized 2D City Grid Layout */}
          <div className="relative w-full aspect-[16/10] max-h-80 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center">
            {/* Grid roads */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* EW road */}
              <div className="w-full h-10 bg-slate-800/80 border-y border-slate-700/60 flex items-center justify-center">
                <div className="w-full border-t border-dashed border-slate-600/80" />
              </div>
              {/* NS road */}
              <div className="absolute h-full w-10 bg-slate-800/80 border-x border-slate-700/60 flex items-center justify-center">
                <div className="h-full border-l border-dashed border-slate-600/80" />
              </div>
              {/* Central Plaza circle */}
              <div className="absolute w-16 h-16 rounded-full bg-slate-800 border-2 border-cyan-500/40 flex items-center justify-center shadow-lg">
                <div className="w-6 h-6 rounded-full bg-cyan-500/30 border border-cyan-400" />
              </div>
            </div>

            {/* Location Landmarks on Map */}
            {Object.values(LOCATIONS).map((loc) => {
              const [lx, , lz] = loc.position;
              // Map from range [-50, 50] to percentages [10%, 90%]
              const leftPercent = 50 + (lx / 65) * 40;
              const topPercent = 50 + (lz / 65) * 40;

              return (
                <div
                  key={loc.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
                  style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-lg transition-transform group-hover:scale-125 border border-white/20"
                    style={{ backgroundColor: loc.color }}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="mt-1 px-1.5 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[10px] font-semibold text-slate-200 whitespace-nowrap shadow-md">
                    {loc.name}
                  </span>
                </div>
              );
            })}

            {/* Current Player Pin */}
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none"
              style={{
                left: `${50 + (playerPos.x / 65) * 40}%`,
                top: `${50 + (playerPos.z / 65) * 40}%`,
              }}
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute w-6 h-6 rounded-full bg-cyan-400 animate-ping opacity-75" />
                <div className="w-4 h-4 rounded-full bg-white border-2 border-cyan-400 shadow-md flex items-center justify-center">
                  <User className="w-2.5 h-2.5 text-slate-900" />
                </div>
              </div>
              <span className="mt-1 px-1.5 py-0.5 rounded bg-cyan-500 text-slate-950 font-bold text-[9px] uppercase tracking-wider shadow">
                YOU
              </span>
            </div>
          </div>

          {/* Directory list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Object.values(LOCATIONS).map((loc) => (
              <div
                key={loc.id}
                className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: loc.color }}
                  />
                  <h4 className="font-semibold text-white text-xs">{loc.name}</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{loc.tagline}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Explore freely on foot using WASD or arrow keys.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            Close Map
          </button>
        </div>
      </div>
    </div>
  );
};
