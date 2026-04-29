import clsx from "clsx";
import { useRef, useEffect } from "react";

const CANVAS_COLOR_BG = "#2c2c2c";
const CIRCLE_COLOR = "#ffffff";

const CIRCLE_RADIUS = 50;
const CIRCLE_GAP = 100;

const CanvasComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = CANVAS_COLOR_BG;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const circleSpace = CIRCLE_RADIUS + CIRCLE_GAP;

      const cols = Math.floor((canvas.width - CIRCLE_GAP) / circleSpace);
      const rows = Math.floor((canvas.height - CIRCLE_GAP) / circleSpace);

      console.log(cols);
      console.log(rows);
      for (let currRow = 1; currRow <= rows + 1; currRow += 1) {
        for (let currCol = 1; currCol <= cols + 1; currCol += 1) {
          ctx.fillStyle = CIRCLE_COLOR;
          ctx.beginPath();
          ctx.arc(
            circleSpace * currCol - CIRCLE_GAP,
            circleSpace * currRow - CIRCLE_GAP,
            CIRCLE_RADIUS,
            0,
            2 * Math.PI,
          );
          ctx.fill();
        }
      }
    };

    draw();

    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [CIRCLE_GAP, CIRCLE_RADIUS, CIRCLE_COLOR, CANVAS_COLOR_BG]);

  return <canvas ref={canvasRef} className={clsx("h-full w-full")} />;
};

export default CanvasComponent;
