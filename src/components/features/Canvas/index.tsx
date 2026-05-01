import clsx from "clsx";
import { useRef, useEffect, useCallback } from "react";

const CANVAS_COLOR_BG = "#2c2c2c";
const CIRCLE_COLOR = "#ffffff";
const CIRCLE_RAD = 40;
const CIRCLE_GAP = 30;

const CanvasComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const defCanvasCoordsRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const defMouseCoordsRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouseOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggableRef = useRef<boolean>(false);
  const rafRef = useRef<number>(0);

  const setMouseCoords = (event: MouseEvent) => {
    const x = event?.pageX;
    const y = event?.pageY;

    defMouseCoordsRef.current = { x, y };
  };

  const setCanvasCoords = () => {
    console.log({ "mouseOffsetRef?.current?.x": mouseOffsetRef?.current?.x });
    console.log({ "mouseOffsetRef?.current?.y": mouseOffsetRef?.current?.y });
    console.log({ "defCanvasCoordsRef?.current?.x": defCanvasCoordsRef?.current?.x });
    console.log({ "defCanvasCoordsRef?.current?.y": defCanvasCoordsRef?.current?.y });
    if (
      mouseOffsetRef?.current?.x === defCanvasCoordsRef?.current?.x &&
      mouseOffsetRef?.current?.y === defCanvasCoordsRef?.current?.y
    ) {
      return;
    }
    const x = mouseOffsetRef?.current?.x;
    const y = mouseOffsetRef?.current?.y;

    defCanvasCoordsRef.current = { x, y };
  };

  const onMouseMove = (event: MouseEvent) => {
    rafRef.current = requestAnimationFrame(() => {
      calculateMouseOffset(event);
    });
  };

  const calculateMouseOffset = (event: MouseEvent) => {
    const currX = event?.pageX;
    const currY = event?.pageY;

    const x = defMouseCoordsRef?.current?.x + defCanvasCoordsRef?.current?.x - currX;
    const y = defMouseCoordsRef?.current?.y + defCanvasCoordsRef?.current?.y - currY;
    mouseOffsetRef.current = { x, y };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(draw);
  };

  // const resetMouseOffset = () => {
  //   mouseOffsetRef.current = { x: 0, y: 0 };
  // };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    if (isDraggableRef?.current && mouseOffsetRef?.current) {
      const x = mouseOffsetRef?.current?.x;
      const y = mouseOffsetRef?.current?.y;

      ctx.resetTransform();
      ctx.translate(x, y);
    }

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
  }, [defCanvasCoordsRef?.current, defMouseCoordsRef?.current, mouseOffsetRef.current]);

  useEffect(() => {
    draw();
    window.addEventListener("resize", draw);
    window.addEventListener("mousedown", (event: MouseEvent) => {
      isDraggableRef.current = true;
      setMouseCoords(event);
      window.addEventListener("mousemove", onMouseMove);
    });
    window.addEventListener("mouseup", () => {
      // window.addEventListener("mouseup", (event: MouseEvent) => {
      isDraggableRef.current = false;
      setCanvasCoords();
      window.removeEventListener("mousemove", onMouseMove);
    });

    return () => window.removeEventListener("resize", draw);
  }, [draw]);

  return <canvas ref={canvasRef} className={clsx("h-full w-full")} />;
};

export default CanvasComponent;
