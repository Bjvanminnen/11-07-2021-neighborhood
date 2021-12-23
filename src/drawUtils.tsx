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
  // ctx.strokeRect(point[0], point[1], 1, 1);
  ctx.beginPath();
  ctx.arc(point[0], point[1], radius, 0, 2 * Math.PI);
  ctx.stroke();
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

export const drawYarn = (
  ctx: CanvasRenderingContext2D,
  pv: Pick<Agent, 'point' | 'color'>,
  background: string,
  radius: number,
) => {
  const point: Point = [pv.point[0], pv.point[1]];
  // TODO: less alpha based on speed?
  ctx.strokeStyle = background + '88';
  drawPoint(ctx, point, radius * 1.5);
  ctx.strokeStyle = (pv.color ?? '#000000') + 'ff';
  drawPoint(ctx, point, radius);
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

export const fillCircle = (
  ctx: CanvasRenderingContext2D,
  center: Point,
  radius = 1,
) => {
  ctx.beginPath();
  ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
  ctx.fill();
};

export const strokeCircle = (
  ctx: CanvasRenderingContext2D,
  center: Point,
  radius = 1,
) => {
  ctx.beginPath();
  ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
  ctx.stroke();
};

export function drawSquare(
  ctx: CanvasRenderingContext2D,
  center: Point,
  outer: Point,
) {
  const dx = outer[0] - center[0];
  const dy = outer[1] - center[1];
  const magnitude = Math.abs(dx) + Math.abs(dy);
  ctx.beginPath();
  ctx.moveTo(center[0] + 0, center[1] + magnitude);
  ctx.lineTo(center[0] + magnitude, center[1] + 0);
  ctx.lineTo(center[0] + 0, center[1] + -magnitude);
  ctx.lineTo(center[0] + -magnitude, center[1] + 0);
  ctx.lineTo(center[0] + 0, center[1] + magnitude);
  ctx.stroke();
}
