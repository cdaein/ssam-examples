/**
 * mouse position (adapt to canvas scaling)
 */
import { drawCircle, drawPath } from "@daeinc/draw";
import { ssam } from "ssam";
const sketch = ({ wrap, canvas, context: ctx }) => {
  if (import.meta.hot) {
    import.meta.hot.dispose(() => wrap.dispose());
    import.meta.hot.accept(() => wrap.hotReload());
  }
  let drawing = false;
  const mouse = [0, 0];
  const pmouse = [0, 0];
  const paths = [];
  const brushSize = 40;
  canvas.addEventListener("mousedown", (e) => {
    mouse[0] = e.offsetX;
    mouse[1] = e.offsetY;
    drawing = true;
    paths.push([]);
  });
  canvas.addEventListener("mousemove", (e) => {
    pmouse[0] = mouse[0];
    pmouse[1] = mouse[1];
    mouse[0] = e.offsetX;
    mouse[1] = e.offsetY;
    if (drawing) {
      console.log(e.offsetX, e.offsetY, mouse[0], mouse[1]);
      paths[paths.length - 1].push([...mouse]);
    }
  });
  canvas.addEventListener("mouseup", () => {
    drawing = false;
  });
  ctx.lineCap = `round`;
  wrap.render = ({ width, height }) => {
    ctx.fillStyle = `#000`;
    ctx.fillRect(0, 0, width, height);
    for (const path of paths) {
      if (path.length > 0) {
        drawPath(ctx, path);
        ctx.lineWidth = brushSize;
        ctx.strokeStyle = `red`;
        ctx.stroke();
      }
    }
    drawCircle(ctx, mouse, brushSize);
    ctx.lineWidth = 1;
    ctx.strokeStyle = `white`;
    ctx.stroke();
  };
};
const settings = {
  dimensions: [800, 800],
  pixelRatio: window.devicePixelRatio,
  animate: true,
  filename: import.meta.url?.split("/").pop()?.split(".")[0] || undefined,
};
ssam(sketch, settings);
