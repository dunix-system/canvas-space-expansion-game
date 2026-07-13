import * as React from "react";
import { cn } from "@/lib/utils";

interface KnobProps {
  value: number; // 0 to 360
  onValueChange: (value: number) => void;
  className?: string;
}

export function Knob({ value, onValueChange, className }: KnobProps) {
  const knobRef = React.useRef<HTMLDivElement>(null);
  const isDragging = React.useRef(false);

  const calculateAngle = (e: React.PointerEvent) => {
    if (!knobRef.current) return;
    
    const rect = knobRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const clientX = e.clientX;
    const clientY = e.clientY;
    
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    // Make 0 at top, increasing clockwise
    angle = angle + 90;
    if (angle < 0) {
      angle += 360;
    }
    
    onValueChange(Math.round(angle));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    if (knobRef.current) {
        knobRef.current.setPointerCapture(e.pointerId);
    }
    calculateAngle(e);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (isDragging.current) {
      calculateAngle(e);
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    if (knobRef.current) {
        knobRef.current.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div 
      ref={knobRef}
      className={cn(
        "relative w-16 h-16 rounded-full bg-sidebar-accent border border-sidebar-border cursor-pointer touch-none select-none flex items-center justify-center hover:bg-sidebar-accent/80 transition-colors", 
        className
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div 
        className="absolute w-full h-full pointer-events-none"
        style={{ transform: `rotate(${value}deg)` }}
      >
        <div className="w-1 h-3 rounded-full bg-sidebar-foreground mx-auto mt-1" />
      </div>
      <div className="w-8 h-8 rounded-full bg-background shadow-inner pointer-events-none" />
    </div>
  );
}
