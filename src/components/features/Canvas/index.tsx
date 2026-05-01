import clsx from "clsx";
import { useRef, useEffect, useCallback } from "react";

const CANVAS_COLOR_BG = "#2c2c2c";
const CIRCLE_COLOR = "#ffffff";
const CIRCLE_RAD = 40;
const CIRCLE_GAP = 30;

const CanvasComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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
  }, []);

  useEffect(() => {
    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [draw]);

  return <canvas ref={canvasRef} className={clsx("h-full w-full")} />;
};

export default CanvasComponent;
