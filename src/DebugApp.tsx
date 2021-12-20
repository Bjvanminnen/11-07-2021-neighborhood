import React, { useState } from 'react';
import Canvas from './Canvas';
import { strokeCircle, drawCircle, fillCircle } from './drawUtils';
import { Point } from './utils';
import World, { Agent } from './World';

const seed = '1639978019454' || Date.now().toString();
console.log('seed:', seed);

function drawVector(
  ctx: CanvasRenderingContext2D,
  point: Point,
  vector: Point,
  magnitude = 1,
) {
  ctx.beginPath();
  ctx.moveTo(
    point[0] - vector[0] * magnitude,
    point[1] - vector[1] * magnitude,
  );
  ctx.lineTo(...point);
  ctx.stroke();
}

function drawSquare(
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

function App() {
  const size = 800;

  const [frame, setFrame] = useState(0);

  const onDraw = (ctx: CanvasRenderingContext2D) => {
    onDrawCircle(ctx);
    onDrawSquare(ctx);
  };

  const onDrawCircle = (ctx: CanvasRenderingContext2D) => {
    const world = new World(size, size, { seed: '123' });
    const anchor: Point = [100, 200];

    let agent: Agent = {
      point: [200, 240],
      vector: [-1, -1],
    };

    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    fillCircle(ctx, anchor, 5);
    drawCircle(ctx, anchor, agent.point);
    fillCircle(ctx, agent.point, 5);
    drawVector(ctx, agent.point, agent.vector, 40);

    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'red';
    for (let i = 0; i < 1; i++) {
      agent = (world as any).updateSingle(agent, anchor);
      strokeCircle(ctx, agent.point, 5);
      drawVector(ctx, agent.point, agent.vector, 40);
    }
  };

  const onDrawSquare = (ctx: CanvasRenderingContext2D) => {
    const world = new World(size, size, { seed: '123' });
    const anchor: Point = [100, 200];

    let agent: Agent = {
      point: [200, 240],
      vector: [-1, -1],
    };

    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    fillCircle(ctx, anchor, 5);
    drawSquare(ctx, anchor, agent.point);
    fillCircle(ctx, agent.point, 5);
    drawVector(ctx, agent.point, agent.vector, 40);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Canvas
        style={{
          border: '1px solid black',
        }}
        width={size}
        height={size}
        onDraw={onDraw}
        frame={frame}
      />
    </div>
  );
}

export default App;
