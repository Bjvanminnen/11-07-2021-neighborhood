import React, { useState, useEffect } from 'react';
// import seedrandom from 'seedrandom';
import Canvas from './Canvas';
import World, { WorldOptions } from './World';
import Giffer from './Giffer';

// TODO: account for torroidal nature
// might actually want to no have it be torroidal

// TODO: store all points, but then unroll at some moment

// TODO: react n time steps after update
// not sure how well that works with current approach. could try that
// with attract-repel branch

// TODO: build gifs?

// TODO: rotate around a unit square defined by abs(x) + abs(y) = c

function Instance({
  width,
  height,
  frame,
  options,
  flipped,
}: {
  width: number;
  height: number;
  frame: number;
  options: WorldOptions;
  flipped?: boolean;
}) {
  const canvasSize = Math.min(width, height);

  const [world] = useState(() => new World(width, height, options));
  const [giffer] = useState(() => new Giffer());

  useEffect(() => {
    world.update();
  }, [world, frame]);

  const onDraw = (ctx: CanvasRenderingContext2D) => {
    // if (frame === 0) {
    //   ctx.fillStyle = world.background ?? 'black';
    //   ctx.fillRect(0, 0, width, height);
    // }

    world.draw(ctx, '02');

    giffer.addFrame(ctx);
    if (frame === 1500) {
      giffer.finish(true);
    }
  };

  const onDrawOverlay = (ctx: CanvasRenderingContext2D) => {
    world.drawOverlay(ctx);
  };

  const drawers = [onDrawOverlay, onDraw];
  if (flipped) {
    drawers.reverse();
  }

  return (
    <div style={{ margin: 10, position: 'relative', width, height }}>
      {drawers.map((drawer, i) => (
        <Canvas
          key={i}
          style={{
            background: i == 0 ? world.background : 'transparent',
            border: '1px solid black',
            position: 'absolute',
            left: 0,
          }}
          width={canvasSize}
          height={canvasSize}
          onDraw={drawer}
          frame={frame}
        />
      ))}
    </div>
  );
}

export default Instance;