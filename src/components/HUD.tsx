import React from 'react';
import { PlayerStats } from '../types/game';
import { InteractiveZone } from '../game3d/CityBuilder';
import {
  Volume2,
  VolumeX,
  MapPin,
  HelpCircle,
  Zap,
  Flame,
  BookOpen,
  DollarSign,
  Heart,
  Award,
  Clock,
  Compass,
} from 'lucide-react';

interface HUDProps {
  stats: PlayerStats;
  day: number;
  hour: number;
  activeZone: InteractiveZone | null;
  onInteract: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onToggleMap: () => void;
  onToggleHelp: () => void;
  playerPos: { x: number; z: number };
  playerAngle: number;
  currentObjective: string;
}

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const HUD: React.FC<HUDProps> = ({
  stats,
  day,
  hour,
  activeZone,
  onInteract,
  isMuted,
  onToggleMute,
  onToggleMap,
  onToggleHelp,
  playerPos,
  playerAngle,
  currentObjective,
}) => {
  // Format hour into 12-hour AM/PM string
  const wholeHour = Math.floor(hour);
  const minutes = Math.floor((hour - wholeHour) * 60);
  const ampm = wholeHour >= 12 ? 'PM' : 'AM';
  const displayHour = wholeHour % 12 === 0 ? 12 : wholeHour % 12;
  const timeString = `${displayHour}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  const dayName = DAY_NAMES[(day - 1) % 7];

  // Energy color
  const energyColor =
    stats.energy > 50 ? 'bg-emerald-500' : stats.energy > 25 ? 'bg-amber-500' : 'bg-rose-500';

  // Stress warning
  const isHighStress = stats.stress >= 65;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 md:p-5 select-none z-10 font-sans">
      {/* TOP BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pointer-events-auto">
        {/* Left: Brand, Day & Time */}
        <div className="flex items-center gap-3 bg-slate-950/85 backdrop-blur-md border border-slate-800/80 px-4 py-2.5 rounded-xl shadow-lg">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-wider text-cyan-400 font-mono text-base md:text-lg">
              LIFE.EXE
            </span>
            <span className="text-slate-600">|</span>
          </div>

          <div className="flex items-center gap-2 text-xs md:text-sm text-slate-200">
            <span className="font-semibold text-amber-400">DAY {day}/7</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300 font-medium">{dayName}</span>
            <span className="text-slate-500">·</span>
            <div className="flex items-center gap-1 font-mono tabular-nums text-slate-100">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{timeString}</span>
            </div>
          </div>
        </div>

        {/* Middle: Energy & Stress Gauges */}
        <div className="flex items-center gap-4 bg-slate-950/85 backdrop-blur-md border border-slate-800/80 px-4 py-2 rounded-xl shadow-lg">
          {/* Energy */}
          <div className="flex items-center gap-2 min-w-[130px]">
            <Zap className={`w-4 h-4 ${stats.energy <= 25 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`} />
            <div className="flex-1">
              <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
                <span className="font-medium">Energy</span>
                <span className="font-mono tabular-nums">{Math.round(stats.energy)}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${energyColor}`}
                  style={{ width: `${Math.max(0, Math.min(100, stats.energy))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stress */}
          <div className="flex items-center gap-2 min-w-[130px]">
            <Flame className={`w-4 h-4 ${isHighStress ? 'text-rose-500 animate-bounce' : 'text-amber-400'}`} />
            <div className="flex-1">
              <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
                <span className="font-medium">Stress</span>
                <span className="font-mono tabular-nums">{Math.round(stats.stress)}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isHighStress ? 'bg-rose-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.max(0, Math.min(100, stats.stress))}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Stats Strip & Utility Actions */}
        <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md border border-slate-800/80 px-3 py-1.5 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 text-xs pr-2 border-r border-slate-800">
            {/* Knowledge */}
            <div className="flex items-center gap-1 text-purple-300" title="Knowledge">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span className="font-mono tabular-nums">{Math.round(stats.knowledge)}</span>
            </div>

            {/* Money */}
            <div className="flex items-center gap-1 text-emerald-300" title="Money ($)">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono tabular-nums">${Math.round(stats.money)}</span>
            </div>

            {/* Relationships */}
            <div className="flex items-center gap-1 text-rose-300" title="Relationships">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span className="font-mono tabular-nums">{Math.round(stats.relationships)}</span>
            </div>

            {/* Confidence */}
            <div className="flex items-center gap-1 text-sky-300" title="Confidence">
              <Award className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-mono tabular-nums">{Math.round(stats.confidence)}</span>
            </div>
          </div>

          {/* Action buttons */}
          <button
            onClick={onToggleMap}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="City Map (M)"
          >
            <Compass className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleHelp}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Controls & Guide (H)"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleMute}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </div>

      {/* TOP LEFT: Active Objective */}
      <div className="mt-3 max-w-sm pointer-events-auto">
        <div className="bg-slate-950/75 backdrop-blur-md border border-slate-800/80 px-3 py-2 rounded-xl text-xs shadow-md">
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>CURRENT FOCUS</span>
          </div>
          <p className="text-slate-200 line-clamp-2">{currentObjective}</p>
        </div>
      </div>

      {/* BOTTOM CENTER: Contextual Interaction Prompt */}
      {activeZone && (
        <div className="self-center mb-6 pointer-events-auto animate-fade-in">
          <button
            onClick={onInteract}
            className="group flex items-center gap-3 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950 px-5 py-3 rounded-2xl font-bold shadow-xl shadow-cyan-500/25 transition-all transform hover:scale-105 active:scale-95 cursor-pointer border-2 border-cyan-300/60"
          >
            <span className="bg-slate-950 text-cyan-300 px-2 py-0.5 rounded font-mono text-sm shadow-inner group-hover:bg-slate-900">
              E
            </span>
            <span className="text-sm tracking-wide">
              {activeZone.type === 'npc' ? `Talk to ${activeZone.name}` : `Enter ${activeZone.name}`}
            </span>
          </button>
        </div>
      )}

      {/* BOTTOM ROW: Controls Helper & Mini-Radar */}
      <div className="flex items-end justify-between pointer-events-auto">
        {/* Controls helper bar */}
        <div className="hidden sm:flex items-center gap-3 bg-slate-950/70 backdrop-blur-md border border-slate-800/70 px-3 py-1.5 rounded-lg text-[11px] text-slate-300">
          <span className="flex items-center gap-1">
            <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-200">WASD</kbd> Move
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1">
            <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-200">E</kbd> Interact
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1">
            <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-200">Right-Drag</kbd> Camera
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1">
            <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-200">M</kbd> Map
          </span>
        </div>

        {/* Circular Mini-Radar Widget */}
        <div
          onClick={onToggleMap}
          className="relative w-24 h-24 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-full shadow-xl overflow-hidden cursor-pointer hover:border-cyan-500/60 transition-colors group"
          title="Click to view full City Map (M)"
        >
          {/* Radar background grid */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full border border-slate-800" />
            <div className="w-8 h-8 rounded-full border border-slate-800/60" />
            <div className="absolute w-full h-[1px] bg-slate-800/40" />
            <div className="absolute h-full w-[1px] bg-slate-800/40" />
          </div>

          {/* Locations blips on radar */}
          {/* Center = (0,0), radius 60 mapped to 48px */}
          {/* Apartment: [-28, -26] */}
          <div
            className="absolute w-2 h-2 rounded-full bg-blue-400"
            style={{ left: `${48 + (-28 / 65) * 40}px`, top: `${48 + (-26 / 65) * 40}px` }}
            title="Apartment"
          />
          {/* University: [-26, 26] */}
          <div
            className="absolute w-2 h-2 rounded-full bg-purple-400"
            style={{ left: `${48 + (-26 / 65) * 40}px`, top: `${48 + (26 / 65) * 40}px` }}
            title="University"
          />
          {/* Cafe: [24, -26] */}
          <div
            className="absolute w-2 h-2 rounded-full bg-amber-400"
            style={{ left: `${48 + (24 / 65) * 40}px`, top: `${48 + (-26 / 65) * 40}px` }}
            title="Cafe"
          />
          {/* Office: [28, 26] */}
          <div
            className="absolute w-2 h-2 rounded-full bg-cyan-400"
            style={{ left: `${48 + (28 / 65) * 40}px`, top: `${48 + (26 / 65) * 40}px` }}
            title="Office"
          />
          {/* Park: [0, -28] */}
          <div
            className="absolute w-2 h-2 rounded-full bg-emerald-400"
            style={{ left: `${48 + (0 / 65) * 40}px`, top: `${48 + (-28 / 65) * 40}px` }}
            title="Park"
          />
          {/* Creative Hub: [0, 28] */}
          <div
            className="absolute w-2 h-2 rounded-full bg-pink-400"
            style={{ left: `${48 + (0 / 65) * 40}px`, top: `${48 + (28 / 65) * 40}px` }}
            title="Creative Hub"
          />

          {/* Player marker */}
          <div
            className="absolute w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-white shadow-sm shadow-white flex items-center justify-center"
            style={{
              left: `${48 + Math.max(-42, Math.min(42, (playerPos.x / 65) * 40))}px`,
              top: `${48 + Math.max(-42, Math.min(42, (playerPos.z / 65) * 40))}px`,
            }}
          >
            <div
              className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-cyan-400 transform"
              style={{ transform: `rotate(${-playerAngle}rad)` }}
            />
          </div>

          <div className="absolute bottom-1 w-full text-center text-[8px] font-mono text-slate-400 group-hover:text-cyan-400 transition-colors">
            RADAR
          </div>
        </div>
      </div>
    </div>
  );
};
