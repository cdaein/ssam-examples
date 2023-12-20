/**
 * basic drawing with the vanilla 2D Canvas API
 */

import type { Sketch, SketchProps, SketchSettings } from "ssam";
import { ssam } from "ssam";

const sketch = ({ wrap, context: ctx }: SketchProps) => {
  // hot reloading
  if (import.meta.hot) {
    import.meta.hot.dispose(() => wrap.dispose());
    import.meta.hot.accept(() => wrap.hotReload());
  }

  const { PI } = Math;

  wrap.render = ({ width, height }) => {
    ctx.fillStyle = `#222`;
    ctx.fillRect(0, 0, width, height);

    // draw a circle
    ctx.beginPath();
    ctx.arc(300, 300, 200, 0, PI * 2);
    ctx.fillStyle = `white`;
    ctx.fill();

    // draw a rect
    ctx.beginPath();
    ctx.rect(200, 400, 500, 200);
    ctx.lineWidth = 12;
    ctx.strokeStyle = `blue`;
    ctx.stroke();

    // draw a path
    ctx.beginPath();
    ctx.moveTo(700, 150);
    ctx.lineTo(500, 500);
    ctx.lineTo(200, 700);
    ctx.strokeStyle = `pink`;
    ctx.stroke();
  };
};

const settings: SketchSettings = {
  dimensions: [800, 800],
  pixelRatio: window.devicePixelRatio,
  animate: false,
  filename: import.meta.url?.split("/").pop()?.split(".")[0] || undefined,
};

ssam(sketch as Sketch, settings);
