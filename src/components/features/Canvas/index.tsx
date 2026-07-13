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
  inertiaEnabled: boolean;
  joinMovementEnabled: boolean;
  randomizePlacementEnabled: boolean;
  placementRandomness: number;
  randomizeSizeEnabled: boolean;
  sizeRandomness: number;
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({ circleGap, circleRad, angle, glowEnabled, glowIntensity, glowStrength, trailEnabled, inertiaEnabled, joinMovementEnabled, randomizePlacementEnabled, placementRandomness, randomizeSizeEnabled, sizeRandomness }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraRef = useRef<{ u: number; v: number }>({ u: 0, v: 0 });
  const startMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentMouseRef = useRef<{ x: number; y: number } | null>(null);
  const velocityRef = useRef<{ u: number; v: number }>({ u: 0, v: 0 });
  const isFloatingAnimActiveRef = useRef<boolean>(true);
  const rafRef = useRef<number | null>(null);
  const prevCameraRef = useRef<{ u: number; v: number }>({ u: 0, v: 0 });

  const propsRef = useRef({ circleRad, circleGap, angle, glowEnabled, glowIntensity, glowStrength, trailEnabled, inertiaEnabled, joinMovementEnabled, randomizePlacementEnabled, placementRandomness, randomizeSizeEnabled, sizeRandomness });

  useEffect(() => {
    propsRef.current = { circleRad, circleGap, angle, glowEnabled, glowIntensity, glowStrength, trailEnabled, inertiaEnabled, joinMovementEnabled, randomizePlacementEnabled, placementRandomness, randomizeSizeEnabled, sizeRandomness };
  }, [circleRad, circleGap, angle, glowEnabled, glowIntensity, glowStrength, trailEnabled, inertiaEnabled, joinMovementEnabled, randomizePlacementEnabled, placementRandomness, randomizeSizeEnabled, sizeRandomness]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { circleRad, circleGap, angle, glowEnabled, glowIntensity, glowStrength, trailEnabled, randomizePlacementEnabled, placementRandomness, randomizeSizeEnabled, sizeRandomness } = propsRef.current;

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

    if (resized || !trailEnabled) {
      ctx.fillStyle = CANVAS_COLOR_BG;
    } else {
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    }
    ctx.fillRect(0, 0, logicalWidth, logicalHeight);

    ctx.translate(centerX, centerY);
    const angleRad = (angle * Math.PI) / 180;
    ctx.rotate(angleRad);

    const circleDiam = circleRad * 2;
    // Calculate relative step based on disk size. 20 gap = 1 full disk width.
    // Range [-7, 7] maps to 7 for performance and visual reasons.
    // Clamp to minimum of 5 to prevent infinite loops and freezing.
    const effectiveGap = Math.max(7, Math.abs(circleGap));
    const step = Math.max(5, circleDiam * (effectiveGap / 20));

    const camWorldX = cameraRef.current.u * step;
    const camWorldY = cameraRef.current.v * step;

    const prevCamWorldX = prevCameraRef.current.u * step;
    const prevCamWorldY = prevCameraRef.current.v * step;
    const dx = camWorldX - prevCamWorldX;
    const dy = camWorldY - prevCamWorldY;
    
    const isMoving = Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1;
    const shouldDrawLines = isMoving && propsRef.current.joinMovementEnabled;

    ctx.translate(-camWorldX, -camWorldY);

    const diagonal = Math.sqrt(logicalWidth * logicalWidth + logicalHeight * logicalHeight);
    const startCol = Math.floor((camWorldX - diagonal / 2) / step) - 1;
    const startRow = Math.floor((camWorldY - diagonal / 2) / step) - 1;
    const endCol = Math.floor((camWorldX + diagonal / 2) / step) + 1;
    const endRow = Math.floor((camWorldY + diagonal / 2) / step) + 1;

    const disks: { cx: number; cy: number; actualRad: number }[] = [];

    for (let rowNum = startRow; rowNum <= endRow; rowNum += 1) {
      for (let colNum = startCol; colNum <= endCol; colNum += 1) {
        let cx = step * colNum;
        let cy = step * rowNum;
        let actualRad = circleRad;

        if (randomizePlacementEnabled || randomizeSizeEnabled) {
          const rand1 = Math.sin(rowNum * 12.9898 + colNum * 78.233) * 43758.5453;
          const randFrac1 = rand1 - Math.floor(rand1);
          const offset1 = randFrac1 * 2 - 1;

          const rand2 = Math.cos(rowNum * 39.346 + colNum * 53.483) * 32832.1234;
          const randFrac2 = rand2 - Math.floor(rand2);
          const offset2 = randFrac2 * 2 - 1;

          if (randomizePlacementEnabled) {
            cx += offset1 * placementRandomness;
            cy += offset2 * placementRandomness;
          }

          if (randomizeSizeEnabled) {
            // Calculate a scale factor based on sizeRandomness (max 50)
            const factor = 1 + Math.abs(offset1) * (sizeRandomness / 10);
            if (offset1 > 0) {
              actualRad = circleRad * factor;
            } else {
              actualRad = Math.max(1, circleRad / factor);
            }
          }
        }
        
        disks.push({ cx, cy, actualRad });
      }
    }

    const drawPaths = () => {
      if (shouldDrawLines) {
        if (randomizeSizeEnabled) {
          ctx.lineCap = "round";
          ctx.strokeStyle = CIRCLE_COLOR;
          for (let i = 0; i < disks.length; i++) {
            const d = disks[i];
            ctx.beginPath();
            ctx.lineWidth = d.actualRad * 2;
            ctx.moveTo(d.cx + dx, d.cy + dy);
            ctx.lineTo(d.cx, d.cy);
            ctx.stroke();
          }
        } else {
          ctx.beginPath();
          for (let i = 0; i < disks.length; i++) {
            const d = disks[i];
            ctx.moveTo(d.cx + dx, d.cy + dy);
            ctx.lineTo(d.cx, d.cy);
          }
          ctx.lineWidth = circleRad * 2;
          ctx.lineCap = "round";
          ctx.strokeStyle = CIRCLE_COLOR;
          ctx.stroke();
        }
      } else {
        ctx.beginPath();
        for (let i = 0; i < disks.length; i++) {
          const d = disks[i];
          ctx.moveTo(d.cx + d.actualRad, d.cy);
          ctx.arc(d.cx, d.cy, d.actualRad, 0, 2 * Math.PI);
        }
        ctx.fillStyle = CIRCLE_COLOR;
        ctx.fill();
      }
    };

    if (glowEnabled) {
      ctx.shadowColor = CIRCLE_COLOR;
      ctx.globalCompositeOperation = "lighter";
      
      for (let i = glowStrength; i > 0; i--) {
        ctx.shadowBlur = (glowIntensity / glowStrength) * i;
        drawPaths();
      }
      
      ctx.globalCompositeOperation = "source-over";
    } else {
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
      drawPaths();
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
        const effectiveGap = Math.max(7, Math.abs(circleGap));
        const step = Math.max(5, circleDiam * (effectiveGap / 20));

        const du = (worldDx * SPEED_FACTOR) / step;
        const dv = (worldDy * SPEED_FACTOR) / step;

        cameraRef.current = {
          u: cameraRef.current.u + du,
          v: cameraRef.current.v + dv,
        };
        velocityRef.current = { u: du, v: dv };
      } else {
        // Apply inertia when mouse is released
        if (propsRef.current.inertiaEnabled && (Math.abs(velocityRef.current.u) > 0.0001 || Math.abs(velocityRef.current.v) > 0.0001)) {
          cameraRef.current = {
            u: cameraRef.current.u + velocityRef.current.u,
            v: cameraRef.current.v + velocityRef.current.v,
          };
          velocityRef.current.u *= 0.95;
          velocityRef.current.v *= 0.95;
        } else {
          velocityRef.current.u = 0;
          velocityRef.current.v = 0;

          if (isFloatingAnimActiveRef.current) {
          // Play slow animation of floating through space on first launch
          const { angle, circleRad, circleGap } = propsRef.current;
          const circleDiam = circleRad * 2;
          const effectiveGap = Math.max(7, Math.abs(circleGap));
          const step = Math.max(5, circleDiam * (effectiveGap / 20));
          
          const angleRad = (angle * Math.PI) / 180;
          const cosA = Math.cos(angleRad);
          const sinA = Math.sin(angleRad);
          
          // Move slowly in a diagonal direction
          const worldDx = 2 * cosA + 2 * sinA;
          const worldDy = -2 * sinA + 2 * cosA;
          
          const du = (worldDx * SPEED_FACTOR) / step;
          const dv = (worldDy * SPEED_FACTOR) / step;
          
          cameraRef.current = {
            u: cameraRef.current.u + du,
            v: cameraRef.current.v + dv,
          };
        }
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

      isFloatingAnimActiveRef.current = false; // Stop animation after first click

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
