import React, { useState } from 'react';
import Canvas from './Canvas';
import { strokeCircle, drawCircle, drawSquare, fillCircle } from './drawUtils';
import { Point, vectorRadians } from './utils';
import World, { Agent } from './World';

const seed = '1639978019454' || Date.now().toString();
console.log('seed:', seed);

function drawLine(ctx: CanvasRenderingContext2D, a: Point, b: Point) {
  ctx.beginPath();
  ctx.moveTo(...a);
  ctx.lineTo(...b);
  ctx.stroke();
}

function drawVector(
  ctx: CanvasRenderingContext2D,
  point: Point,
  vector: Point,
  magnitude = 1,
) {
  drawLine(
    ctx,
    [point[0] - vector[0] * magnitude, point[1] - vector[1] * magnitude],
    point,
  );
}

function App() {
  const size = 800;

  const [frame, setFrame] = useState(0);

  const baseAnchor: Point = [200, 300];
  let baseAgent: Agent = {
    point: [baseAnchor[0] + 120, baseAnchor[1] - 100],
    vector: [1, -1.7],
  };

  const onDraw = (ctx: CanvasRenderingContext2D) => {
    // onDrawCircle(ctx);
    onDrawSquare(ctx);
  };

  const onDrawCircle = (ctx: CanvasRenderingContext2D) => {
    const world = new World(size, size, { seed: '123' });
    const anchor: Point = [...baseAnchor] as Point;
    let agent: Agent = {
      point: [...baseAgent.point] as Point,
      vector: [...baseAgent.vector] as Point,
    };

    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    fillCircle(ctx, anchor, 5);
    drawCircle(ctx, anchor, agent.point);
    drawLine(ctx, anchor, agent.point);
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
    const anchor: Point = [...baseAnchor] as Point;
    let agent: Agent = {
      point: [...baseAgent.point] as Point,
      vector: [...baseAgent.vector] as Point,
    };

    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    fillCircle(ctx, anchor, 5);
    drawSquare(ctx, anchor, agent.point);
    fillCircle(ctx, agent.point, 5);
    drawVector(ctx, agent.point, agent.vector, 40);

    ctx.fillStyle = 'blue';
    ctx.strokeStyle = 'blue';
    for (let i = 0; i < 1; i++) {
      agent = (world as any).updateSingleSquare(agent, anchor);
      strokeCircle(ctx, agent.point, 5);
      drawVector(ctx, agent.point, agent.vector, 40);
    }
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
