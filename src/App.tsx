import React, { useState } from 'react';
import seedrandom from 'seedrandom';
import Canvas from './Canvas';
// import World from './World';

const seed = (1594013991704 || Date.now()).toString();
console.log('seed:', seed);
seedrandom(seed, { global: true });

// const world = new World(20, 2, seedrandom(seed));

type Point = [number, number];
type Vector = [number, number];

interface PointVector {
  point: Point;
  vector: Vector;
}

/**
 The magnitude of the vector will be translated into angular motion around the
 anchor.
 So if we have a vector that is ([1,-3]) the momentum is sqrt(10)
 We then calculate the radius of the circle by getting the distance between
 point and anchor
 From that we get the circumference
 We divide that by mag(vector) to get how many rad/degrees we want to move
 Not 100% how to figure out the direction
 */
function update(current: PointVector, anchor: Point): PointVector {
  const dx = current.point[0] - anchor[0];
  const dy = current.point[1] - anchor[1];
  const radius = Math.sqrt(dx ** 2 + dy ** 2);

  const magnitude = Math.sqrt(current.vector[0] ** 2 + current.vector[1] ** 2);

  const radians = magnitude / radius;
  const angle = Math.atan2(dy, dx);

  const vectorAngle = Math.atan2(
    current.point[1] + current.vector[1] - anchor[1],
    current.point[0] + current.vector[0] - anchor[0],
  );
  const sign = vectorAngle > angle ? 1 : -1;

  const nextAngle = angle + radians * sign;

  const nextPoint: Point = [
    anchor[0] + Math.cos(nextAngle) * radius,
    anchor[1] + Math.sin(nextAngle) * radius,
  ];

  const nextVector: Point = [
    Math.cos(nextAngle + (Math.PI / 2) * sign) * magnitude,
    Math.sin(nextAngle + (Math.PI / 2) * sign) * magnitude,
  ];

  return {
    point: nextPoint,
    vector: nextVector,
  };
}

function App() {
  const canvasSize = 600;

  const [frame, setFrame] = useState(0);

  const onDraw = (ctx: CanvasRenderingContext2D) => {
    const { width, height } = ctx.canvas;

    if (frame === 0) {
      ctx.clearRect(0, 0, width, height);
    }

    const drawPoint = (point: Point, radius: number) => {
      ctx.beginPath();
      ctx.arc(point[0], point[1], radius, 0, 2 * Math.PI);
      ctx.fill();
    };

    const drawPointVector = (pv: PointVector) => {
      const magMult = 10;
      drawPoint(pv.point, 3);
      ctx.beginPath();
      ctx.moveTo(...pv.point);
      ctx.lineTo(
        pv.point[0] + pv.vector[0] * magMult,
        pv.point[1] + pv.vector[1] * magMult,
      );
      ctx.stroke();
    };

    const anchor: Point = [100, 100];

    drawPoint(anchor, 3);

    let agent: PointVector = {
      point: [125, 125],
      vector: [5, -3],
    };

    ctx.fillStyle = 'red';

    drawPointVector(agent);
    ctx.fillStyle = 'blue';
    ctx.strokeStyle = 'gray';
    for (let i = 0; i < 10; i++) {
      agent = update(agent, anchor);

      drawPointVector(agent);
    }
  };

  return (
    <div style={{ margin: 10 }}>
      <Canvas
        style={{ background: '#fff', border: '1px solid black' }}
        width={canvasSize}
        height={canvasSize}
        onDraw={onDraw}
        frame={frame}
      />
    </div>
  );
}

export default App;
