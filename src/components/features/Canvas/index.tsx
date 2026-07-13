import clsx from "clsx";
import { useRef, useEffect, useCallback } from "react";

const CANVAS_COLOR_BG = "#000";
const CIRCLE_COLOR = "#ffffff";
const SPEED_FACTOR = 0.2;

interface CanvasComponentProps {
  circleRad: number;
  circleGap: number;
  angle: number;
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({ circleGap, circleRad, angle }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraRef = useRef<{ u: number; v: number }>({ u: 0, v: 0 });
  const startMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentMouseRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number | null>(null);

  const propsRef = useRef({ circleRad, circleGap, angle });

  useEffect(() => {
    propsRef.current = { circleRad, circleGap, angle };
  }, [circleRad, circleGap, angle]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { circleRad, circleGap, angle } = propsRef.current;

    const logicalWidth = canvas.offsetWidth;
    const logicalHeight = canvas.offsetHeight;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = logicalWidth * dpr;
    canvas.height = logicalHeight * dpr;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    const centerX = logicalWidth / 2;
    const centerY = logicalHeight / 2;

    ctx.fillStyle = CANVAS_COLOR_BG;
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

    ctx.translate(-camWorldX, -camWorldY);

    const diagonal = Math.sqrt(logicalWidth * logicalWidth + logicalHeight * logicalHeight);
    const startCol = Math.floor((camWorldX - diagonal / 2) / step) - 1;
    const startRow = Math.floor((camWorldY - diagonal / 2) / step) - 1;
    const endCol = Math.floor((camWorldX + diagonal / 2) / step) + 1;
    const endRow = Math.floor((camWorldY + diagonal / 2) / step) + 1;

    for (let rowNum = startRow; rowNum <= endRow; rowNum += 1) {
      for (let colNum = startCol; colNum <= endCol; colNum += 1) {
        ctx.fillStyle = CIRCLE_COLOR;
        ctx.beginPath();
        ctx.arc(step * colNum, step * rowNum, circleRad, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }, []);

  const updateMovement = useCallback(
    function loop() {
      if (!currentMouseRef.current) return;

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
        draw();
      }

      rafRef.current = requestAnimationFrame(loop);
    },
    [draw],
  );

  useEffect(() => {
    draw();
  }, [draw, circleRad, circleGap, angle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onPointerMove = (event: PointerEvent) => {
      currentMouseRef.current = { x: event.pageX, y: event.pageY };
    };

    const onPointerUp = (event: PointerEvent) => {
      canvas.releasePointerCapture(event.pointerId);

      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);

      currentMouseRef.current = null;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      canvas.setPointerCapture(event.pointerId);

      startMouseRef.current = { x: event.pageX, y: event.pageY };
      currentMouseRef.current = { x: event.pageX, y: event.pageY };

      canvas.addEventListener("pointermove", onPointerMove);
      canvas.addEventListener("pointerup", onPointerUp);
      canvas.addEventListener("pointercancel", onPointerUp);

      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(updateMovement);
      }
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", draw);

    return () => {
      window.removeEventListener("resize", draw);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [draw, updateMovement]);

  return <canvas ref={canvasRef} className={clsx("h-full w-full touch-none")} />;
};

export default CanvasComponent;
