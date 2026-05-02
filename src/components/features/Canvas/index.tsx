import clsx from "clsx";
import { useRef, useEffect } from "react";

const CANVAS_COLOR_BG = "#2c2c2c";
const CIRCLE_COLOR = "#ffffff";
const CIRCLE_RAD = 40;
const CIRCLE_GAP = 30;

const CanvasComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const defCanvasCoordsRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const defMouseCoordsRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouseOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const setMouseCoords = (event: MouseEvent) => {
    const x = event?.pageX;
    const y = event?.pageY;

    defMouseCoordsRef.current = { x, y };
  };

  const calculateMouseOffset = (event: MouseEvent) => {
    const currX = event?.pageX;
    const currY = event?.pageY;

    const x = defMouseCoordsRef?.current?.x - currX;
    const y = defMouseCoordsRef?.current?.y - currY;
    mouseOffsetRef.current = { x, y };

    requestAnimationFrame(draw);
  };

  const resetMouseOffset = () => {
    mouseOffsetRef.current = { x: 0, y: 0 };
  };

  const setCanvasCoords = () => {
    const x = defCanvasCoordsRef?.current?.x + mouseOffsetRef?.current?.x;
    const y = defCanvasCoordsRef?.current?.y + mouseOffsetRef?.current?.y;

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

    const x = mouseOffsetRef?.current?.x + defCanvasCoordsRef?.current?.x;
    const y = mouseOffsetRef?.current?.y + defCanvasCoordsRef?.current?.y;

    ctx.translate(x, y);

    ctx.fillStyle = CANVAS_COLOR_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const circleDiam = CIRCLE_RAD * 2;
    const circleExt = circleDiam + CIRCLE_GAP;

    const cols = Math.floor((canvas.width + CIRCLE_GAP) / circleExt);
    const rows = Math.floor((canvas.height + CIRCLE_GAP) / circleExt);

    for (let rowNum = 0; rowNum <= rows; rowNum += 1) {
      for (let colNum = 0; colNum <= cols; colNum += 1) {
        ctx.fillStyle = CIRCLE_COLOR;
        ctx.beginPath();
        ctx.arc(circleExt * colNum + CIRCLE_RAD, circleExt * rowNum + CIRCLE_RAD, CIRCLE_RAD, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  };

  const onMouseDown = (event: MouseEvent) => {
    setMouseCoords(event);
    canvasRef?.current?.addEventListener("mousemove", onMouseMove);
  };

  const onMouseMove = (event: MouseEvent) => {
    calculateMouseOffset(event);
  };

  const onMouseUp = (event: MouseEvent) => {
    canvasRef?.current?.removeEventListener("mousemove", onMouseMove);
    calculateMouseOffset(event);
    setCanvasCoords();
  };

  useEffect(() => {
    draw();
    window.addEventListener("resize", draw);
    canvasRef?.current?.addEventListener("mousedown", onMouseDown);
    canvasRef?.current?.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("resize", draw);
      canvasRef?.current?.removeEventListener("mousedown", onMouseDown);
      canvasRef?.current?.removeEventListener("mousemove", onMouseMove);
      canvasRef?.current?.removeEventListener("mouseup", onMouseUp);
    };
  }, [draw]);

  return <canvas ref={canvasRef} className={clsx("h-full w-full")} />;
};

export default CanvasComponent;
