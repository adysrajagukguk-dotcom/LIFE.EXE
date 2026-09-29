import React, { useRef, useState } from 'react';

interface MobileControlsProps {
  onMoveChange: (vector: { x: number; y: number }) => void;
  onInteract: () => void;
  canInteract: boolean;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onMoveChange,
  onInteract,
  canInteract,
}) => {
  const joystickRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [touching, setTouching] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouching(true);
    handleTouchMove(e);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!joystickRef.current) return;
    const touch = e.touches[0];
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = touch.clientX - centerX;
    const deltaY = touch.clientY - centerY;
    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxRadius = 38;

    const clampedDist = Math.min(dist, maxRadius);
    const angle = Math.atan2(deltaY, deltaX);

    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;

    setKnobPos({ x: knobX, y: knobY });

    // Normalized move vector (-1 to 1)
    onMoveChange({
      x: knobX / maxRadius,
      y: knobY / maxRadius,
    });
  };

  const handleTouchEnd = () => {
    setTouching(false);
    setKnobPos({ x: 0, y: 0 });
    onMoveChange({ x: 0, y: 0 });
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex md:hidden justify-between items-end p-6 select-none font-sans">
      {/* Left: Virtual Joystick */}
      <div
        ref={joystickRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="w-28 h-28 rounded-full bg-slate-950/60 backdrop-blur-sm border-2 border-slate-700/80 flex items-center justify-center pointer-events-auto touch-none shadow-xl"
      >
        <div
          className="w-12 h-12 rounded-full bg-cyan-400/80 border-2 border-white/50 shadow-md transition-transform"
          style={{
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          }}
        />
      </div>

      {/* Right: Interact [E] Button */}
      <div className="pointer-events-auto">
        <button
          onClick={onInteract}
          className={`w-18 h-18 rounded-2xl flex flex-col items-center justify-center font-bold shadow-2xl transition-all active:scale-90 cursor-pointer ${
            canInteract
              ? 'bg-cyan-400 text-slate-950 border-2 border-cyan-200 animate-pulse'
              : 'bg-slate-900/80 text-slate-500 border border-slate-700/60'
          }`}
        >
          <span className="text-xl">E</span>
          <span className="text-[10px] uppercase font-mono">Action</span>
        </button>
      </div>
    </div>
  );
};
