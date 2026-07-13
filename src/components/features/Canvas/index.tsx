import clsx from "clsx";
import { useRef, useEffect, useCallback } from "react";

const CANVAS_COLOR_BG = "#000";
const CIRCLE_COLOR = "#ffffff";
const SPEED_FACTOR = 0.2;

interface CanvasComponentProps {
  circleRad: number;
  circleGap: number;
  angle: number;
  glowEnabled: boolean;
  glowIntensity: number;
  glowStrength: number;
  trailEnabled: boolean;
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({ circleGap, circleRad, angle, glowEnabled, glowIntensity, glowStrength, trailEnabled }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraRef = useRef<{ u: number; v: number }>({ u: 0, v: 0 });
  const startMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentMouseRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  const fadeCounterRef = useRef<number>(0);
  const prevCameraRef = useRef<{ u: number; v: number }>({ u: 0, v: 0 });

  const propsRef = useRef({ circleRad, circleGap, angle, glowEnabled, glowIntensity, glowStrength, trailEnabled });

  useEffect(() => {
    propsRef.current = { circleRad, circleGap, angle, glowEnabled, glowIntensity, glowStrength, trailEnabled };
  }, [circleRad, circleGap, angle, glowEnabled, glowIntensity, glowStrength, trailEnabled]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { circleRad, circleGap, angle, glowEnabled, glowIntensity, glowStrength, trailEnabled } = propsRef.current;

    const logicalWidth = canvas.offsetWidth;
    const logicalHeight = canvas.offsetHeight;
    const dpr = window.devicePixelRatio || 1;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let resized = false;
    if (canvas.width !== Math.floor(logicalWidth * dpr) || canvas.height !== Math.floor(logicalHeight * dpr)) {
      canvas.width = Math.floor(logicalWidth * dpr);
      canvas.height = Math.floor(logicalHeight * dpr);
      resized = true;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    const centerX = logicalWidth / 2;
    const centerY = logicalHeight / 2;

    let doFade = false;
    if (currentMouseRef.current) {
      fadeCounterRef.current = 40; // ~0.6 seconds fade out
      doFade = true;
    } else if (fadeCounterRef.current > 0) {
      fadeCounterRef.current -= 1;
      doFade = true;
    }

    if (resized || !trailEnabled || !doFade) {
      ctx.fillStyle = CANVAS_COLOR_BG;
    } else {
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    }
    ctx.fillRect(0, 0, logicalWidth, logicalHeight);

    ctx.translate(centerX, centerY);
    const angleRad = (angle * Math.PI) / 180;
    ctx.rotate(angleRad);

    const circleDiam = circleRad * 2;
    const circleExt = circleDiam + circleGap;
    if (Math.abs(circleExt) < 5) return; // Prevent infinite loops and browser freeze

    const step = Math.abs(circleExt);

    const camWorldX = cameraRef.current.u * step;
    const camWorldY = cameraRef.current.v * step;

    const prevCamWorldX = prevCameraRef.current.u * step;
    const prevCamWorldY = prevCameraRef.current.v * step;
    const dx = camWorldX - prevCamWorldX;
    const dy = camWorldY - prevCamWorldY;
    
    const isMoving = Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1;

    ctx.translate(-camWorldX, -camWorldY);

    const diagonal = Math.sqrt(logicalWidth * logicalWidth + logicalHeight * logicalHeight);
    const startCol = Math.floor((camWorldX - diagonal / 2) / step) - 1;
    const startRow = Math.floor((camWorldY - diagonal / 2) / step) - 1;
    const endCol = Math.floor((camWorldX + diagonal / 2) / step) + 1;
    const endRow = Math.floor((camWorldY + diagonal / 2) / step) + 1;

    ctx.beginPath();
    for (let rowNum = startRow; rowNum <= endRow; rowNum += 1) {
      for (let colNum = startCol; colNum <= endCol; colNum += 1) {
        const cx = step * colNum;
        const cy = step * rowNum;
        if (isMoving) {
          ctx.moveTo(cx + dx, cy + dy);
          ctx.lineTo(cx, cy);
        } else {
          ctx.moveTo(cx + circleRad, cy);
          ctx.arc(cx, cy, circleRad, 0, 2 * Math.PI);
        }
      }
    }

    if (isMoving) {
      ctx.lineWidth = circleRad * 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = CIRCLE_COLOR;
    } else {
      ctx.fillStyle = CIRCLE_COLOR;
    }

    if (glowEnabled) {
      ctx.shadowColor = CIRCLE_COLOR;
      ctx.globalCompositeOperation = currentMouseRef.current ? "lighter" : "source-over";
      
      for (let i = glowStrength; i > 0; i--) {
        ctx.shadowBlur = (glowIntensity / glowStrength) * i;
        if (isMoving) {
          ctx.stroke();
        } else {
          ctx.fill();
        }
      }
      
      ctx.globalCompositeOperation = "source-over";
    } else {
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
      if (isMoving) {
        ctx.stroke();
      } else {
        ctx.fill();
      }
    }

    prevCameraRef.current = { u: cameraRef.current.u, v: cameraRef.current.v };
    ctx.restore();
  }, []);

  const updateMovement = useCallback(
    function loop() {
      draw();

      if (currentMouseRef.current) {
        const screenDx = currentMouseRef.current.x - startMouseRef.current.x;
        const screenDy = currentMouseRef.current.y - startMouseRef.current.y;

        const { angle, circleRad, circleGap } = propsRef.current;

        const angleRad = (angle * Math.PI) / 180;
        const cosA = Math.cos(angleRad);
        const sinA = Math.sin(angleRad);

        const worldDx = screenDx * cosA + screenDy * sinA;
        const worldDy = -screenDx * sinA + screenDy * cosA;

        const circleDiam = circleRad * 2;
        const circleExt = circleDiam + circleGap;
        if (Math.abs(circleExt) >= 5) {
          const step = Math.abs(circleExt);

          cameraRef.current = {
            u: cameraRef.current.u + (worldDx * SPEED_FACTOR) / step,
            v: cameraRef.current.v + (worldDy * SPEED_FACTOR) / step,
          };
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    },
    [draw],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(updateMovement);
    }

    const onPointerMove = (event: PointerEvent) => {
      currentMouseRef.current = { x: event.pageX, y: event.pageY };
    };

    const onPointerUp = (event: PointerEvent) => {
      canvas.releasePointerCapture(event.pointerId);

      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);

      currentMouseRef.current = null;
    };

    const onPointerDown = (event: PointerEvent) => {
      canvas.setPointerCapture(event.pointerId);

      startMouseRef.current = { x: event.pageX, y: event.pageY };
      currentMouseRef.current = { x: event.pageX, y: event.pageY };

      canvas.addEventListener("pointermove", onPointerMove);
      canvas.addEventListener("pointerup", onPointerUp);
      canvas.addEventListener("pointercancel", onPointerUp);
    };

    canvas.addEventListener("pointerdown", onPointerDown);

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [updateMovement]);

  return <canvas ref={canvasRef} className={clsx("h-full w-full touch-none")} />;
};

export default CanvasComponent;
