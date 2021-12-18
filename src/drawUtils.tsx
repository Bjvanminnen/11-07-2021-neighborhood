import { Agent } from './World';
import { Point } from './utils';

export const drawTriangle = (
  ctx: CanvasRenderingContext2D,
  pv: Agent,
  radius: number,
) => {
  const angle = Math.atan2(pv.vector[1], pv.vector[0]);
  const da = 0.8;

  ctx.beginPath();
  ctx.moveTo(
    pv.point[0] + Math.cos(angle + Math.PI * da) * radius,
    pv.point[1] + Math.sin(angle + Math.PI * da) * radius,
  );
  ctx.lineTo(
    pv.point[0] + Math.cos(angle) * radius,
    pv.point[1] + Math.sin(angle) * radius,
  );
  ctx.lineTo(
    pv.point[0] + Math.cos(angle - Math.PI * da) * radius,
    pv.point[1] + Math.sin(angle - Math.PI * da) * radius,
  );

  ctx.stroke();
};

export const drawPoint = (
  ctx: CanvasRenderingContext2D,
  point: Point,
  radius: number,
  color?: string,
) => {
  if (color) {
    ctx.strokeStyle = color;
  }
  ctx.strokeRect(point[0], point[1], 1, 1);
  // ctx.beginPath();
  // ctx.arc(point[0], point[1], radius, 0, 2 * Math.PI);
  // ctx.stroke();
};

export const drawDoublePoint = (
  ctx: CanvasRenderingContext2D,
  pv: Agent,
  radius: number,
) => {
  const angle = Math.atan2(pv.vector[1], pv.vector[0]);
  const da = 0.5;

  drawPoint(
    ctx,
    [
      pv.point[0] + Math.cos(angle + Math.PI * da) * radius,
      pv.point[1] + Math.sin(angle + Math.PI * da) * radius,
    ],
    1,
  );
  drawPoint(
    ctx,
    [
      pv.point[0] + Math.cos(angle - Math.PI * da) * radius,
      pv.point[1] + Math.sin(angle - Math.PI * da) * radius,
    ],
    1,
  );
};

export const drawAgent = (
  ctx: CanvasRenderingContext2D,
  pv: Agent,
  background: string,
) => {
  ctx.fillStyle = 'black';
  // drawDoublePoint(pv, 3);
  ctx.fillStyle = (pv.color ?? '#000000') + 'ff';
  ctx.strokeStyle = (pv.color ?? '#000000') + '66';
  // drawDoublePoint(pv, 2.5);

  // ctx.fillStyle = '#00000044';
  const point: Point = [pv.point[0], pv.point[1]];
  ctx.strokeStyle = background;
  drawPoint(ctx, point, 4.5);
  ctx.strokeStyle = (pv.color ?? '#000000') + 'ff';
  drawPoint(ctx, point, 3);
};

export const drawCircle = (
  ctx: CanvasRenderingContext2D,
  center: Point,
  outer: Point,
) => {
  const dx = outer[0] - center[0];
  const dy = outer[1] - center[1];
  const radius = Math.sqrt(dx ** 2 + dy ** 2);
  ctx.beginPath();
  ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
  ctx.stroke();
};
