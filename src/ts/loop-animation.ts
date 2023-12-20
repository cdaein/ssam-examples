/**
 * loop animation with `props.playhead`
 */

import type { Sketch, SketchProps, SketchSettings } from "ssam";
import { ssam } from "ssam";

const sketch = ({ wrap, context: ctx }: SketchProps) => {
  // hot reloading
  if (import.meta.hot) {
    import.meta.hot.dispose(() => wrap.dispose());
    import.meta.hot.accept(() => wrap.hotReload());
  }

  const { PI, sin, cos } = Math;

  const numCircles = 4;

  wrap.render = ({ width, height, playhead }) => {
    ctx.fillStyle = `#222`;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < numCircles; i++) {
      // playhead goes from [0..1) over duration.
      // polar coordinate cycle goes from 0..2pi
      // "i" adds initial position offset for each circle
      const x = cos((i / numCircles + playhead) * PI * 2) * 200;
      const y = sin((i / numCircles + playhead) * PI * 2) * 200;

      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.beginPath();
      ctx.arc(x, y, 100, 0, PI * 2);
      ctx.fillStyle = `hsl(${(i / numCircles) * 360}, 100%, 50%)`;
      ctx.fill();
      ctx.restore();
    }
  };
};

const settings: SketchSettings = {
  dimensions: [800, 800],
  // pixelRatio: window.devicePixelRatio,
  pixelRatio: 1,
  animate: true,
  duration: 4000,
  // you can have different fps for browser playing and exported file
  playFps: 60,
  exportFps: 30,
  framesFormat: "gif",
  filename: import.meta.url?.split("/").pop()?.split(".")[0] || undefined,
};

ssam(sketch as Sketch, settings);
