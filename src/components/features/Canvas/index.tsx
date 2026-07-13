import clsx from "clsx";
import { useRef, useEffect } from "react";

const CANVAS_COLOR_BG = "#000";
const CIRCLE_COLOR = "#ffffff";
// const circleRad = 40;
// const circleGap = 30;

interface CanvasComponentProps {
  circleRad: number;
  circleGap: number;
  angle: number;
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({ circleGap, circleRad, angle }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraRef = useRef<{ u: number; v: number }>({ u: 0, v: 0 });
  const startCameraRef = useRef<{ u: number; v: number }>({ u: 0, v: 0 });
  const startMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const calculateMouseOffset = (event: PointerEvent) => {
    const screenDx = event.pageX - startMouseRef.current.x;
    const screenDy = event.pageY - startMouseRef.current.y;
    
    const angleRad = (angle * Math.PI) / 180;
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);
    
    const worldDx = screenDx * cosA + screenDy * sinA;
    const worldDy = -screenDx * sinA + screenDy * cosA;
    
    const circleDiam = circleRad * 2;
    const circleExt = circleDiam + circleGap;
    if (Math.abs(circleExt) < 5) return;
    const step = Math.abs(circleExt);

    cameraRef.current = {
      u: startCameraRef.current.u + worldDx / step,
      v: startCameraRef.current.v + worldDy / step,
    };

    requestAnimationFrame(draw);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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
    const cols = Math.floor(diagonal / step);
    const rows = Math.floor(diagonal / step);

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
  };

  const onPointerDown = (event: PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.setPointerCapture(event.pointerId);

    startMouseRef.current = { x: event.pageX, y: event.pageY };
    startCameraRef.current = { u: cameraRef.current.u, v: cameraRef.current.v };
    
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp); // Catch edge cases where the browser forcibly stops the drag
  };

  const onPointerMove = (event: PointerEvent) => {
    calculateMouseOffset(event);
  };

  const onPointerUp = (event: PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.releasePointerCapture(event.pointerId);

    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointercancel", onPointerUp);

    calculateMouseOffset(event);
  };

  useEffect(() => {
    draw();
    window.addEventListener("resize", draw);

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("pointerdown", onPointerDown);
    }

    return () => {
      window.removeEventListener("resize", draw);
      if (canvas) {
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointermove", onPointerMove);
        canvas.removeEventListener("pointerup", onPointerUp);
        canvas.removeEventListener("pointercancel", onPointerUp);
      }
    };
  }, [circleRad, circleGap, angle]);

  return <canvas ref={canvasRef} className={clsx("h-full w-full touch-none")} />;
};

export default CanvasComponent;
