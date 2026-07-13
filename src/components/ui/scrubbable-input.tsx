import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ScrubbableInputProps extends Omit<React.ComponentProps<"input">, "onChange" | "value"> {
  value: number;
  onValueChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  sensitivity?: number;
}

export const ScrubbableInput = React.forwardRef<HTMLInputElement, ScrubbableInputProps>(
  ({ value, onValueChange, min = -Infinity, max = Infinity, step = 1, sensitivity = 1, className, ...props }, ref) => {
    const internalRef = React.useRef<HTMLInputElement | null>(null);
    const startX = React.useRef(0);
    const startValue = React.useRef(0);
    const isDragging = React.useRef(false);
    const hasDragged = React.useRef(false);

    // Combine refs
    const setRefs = React.useCallback(
      (node: HTMLInputElement) => {
        internalRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    const handlePointerDown = (e: React.PointerEvent<HTMLInputElement>) => {
      // Allow normal selection if already focused
      if (document.activeElement === internalRef.current) {
        return;
      }
      
      isDragging.current = true;
      hasDragged.current = false;
      startX.current = e.clientX;
      startValue.current = value;
      
      e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLInputElement>) => {
      if (!isDragging.current) return;
      
      const dx = e.clientX - startX.current;
      
      if (Math.abs(dx) > 3) {
        hasDragged.current = true;
        
        let newValue = startValue.current + Math.round((dx * sensitivity) / step) * step;
        if (newValue < min) newValue = min;
        if (newValue > max) newValue = max;
        
        onValueChange(newValue);
      }
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLInputElement>) => {
      if (!isDragging.current) return;
      
      isDragging.current = false;
      e.currentTarget.releasePointerCapture(e.pointerId);
      
      if (!hasDragged.current) {
        // Just a click, let it focus
        internalRef.current?.focus();
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = Number(e.target.value);
      if (isNaN(val)) return;
      if (val < min) val = min;
      if (val > max) val = max;
      onValueChange(val);
    };

    return (
      <Input
        ref={setRefs}
        type="number"
        value={value}
        onChange={handleChange}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={cn("cursor-ew-resize focus:cursor-auto", className)}
        {...props}
      />
    );
  }
);
ScrubbableInput.displayName = "ScrubbableInput";
