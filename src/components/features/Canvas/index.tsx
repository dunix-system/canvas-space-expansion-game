import clsx from "clsx";
import { useRef, useEffect } from "react";

const CANVAS_COLOR_BG = "#000";
const CIRCLE_COLOR = "#ffffff";
const CIRCLE_RAD = 40;
const CIRCLE_GAP = 30;

const CanvasComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const defCanvasCoordsRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const defMouseCoordsRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouseOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const setMouseCoords = (event: PointerEvent) => {
    defMouseCoordsRef.current = { x: event.pageX, y: event.pageY };
  };

  const calculateMouseOffset = (event: PointerEvent) => {
    const x = defMouseCoordsRef.current.x - event.pageX;
    const y = defMouseCoordsRef.current.y - event.pageY;
    mouseOffsetRef.current = { x, y };

    requestAnimationFrame(draw);
  };

  const resetMouseOffset = () => {
    mouseOffsetRef.current = { x: 0, y: 0 };
  };

  const setCanvasCoords = () => {
    const x = defCanvasCoordsRef.current.x + mouseOffsetRef.current.x;
    const y = defCanvasCoordsRef.current.y + mouseOffsetRef.current.y;

    defCanvasCoordsRef.current = { x, y };
    resetMouseOffset();
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const x = mouseOffsetRef.current.x + defCanvasCoordsRef.current.x;
    const y = mouseOffsetRef.current.y + defCanvasCoordsRef.current.y;

    ctx.fillStyle = CANVAS_COLOR_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.translate(x, y);

    const circleDiam = CIRCLE_RAD * 2;
    const circleExt = circleDiam + CIRCLE_GAP;

    const cols = Math.floor((canvas.width + CIRCLE_GAP) / circleExt);
    const rows = Math.floor((canvas.height + CIRCLE_GAP) / circleExt);

    const startCol = Math.floor(-x / circleExt) - 1;
    const startRow = Math.floor(-y / circleExt) - 1;
    const endCol = startCol + cols + 2;
    const endRow = startRow + rows + 2;

    for (let rowNum = startRow; rowNum <= endRow; rowNum += 1) {
      for (let colNum = startCol; colNum <= endCol; colNum += 1) {
        ctx.fillStyle = CIRCLE_COLOR;
        ctx.beginPath();
        ctx.arc(circleExt * colNum + CIRCLE_RAD, circleExt * rowNum + CIRCLE_RAD, CIRCLE_RAD, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  };

  const onPointerDown = (event: PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.setPointerCapture(event.pointerId);

    setMouseCoords(event);
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
    setCanvasCoords();
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
  }, []);

  return <canvas ref={canvasRef} className={clsx("h-full w-full touch-none")} />;
};

export default CanvasComponent;
