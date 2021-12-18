import React, { useState, useEffect } from 'react';
// import seedrandom from 'seedrandom';
import Canvas from './Canvas';
import World from './World';
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
  seed,
  width,
  height,
  frame,
  paletteIndex,
}: {
  seed: string;
  width: number;
  height: number;
  frame: number;
  paletteIndex?: number;
}) {
  const canvasSize = Math.min(width, height);

  const [world] = useState(
    () => new World(width, height, { seed, paletteIndex }),
  );
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

  return (
    <div style={{ margin: 10, position: 'relative', width, height }}>
      <Canvas
        style={{
          background: world.background,
          border: '1px solid black',
          position: 'absolute',
          left: 0,
        }}
        width={canvasSize}
        height={canvasSize}
        onDraw={onDrawOverlay}
        frame={frame}
      />
      <Canvas
        style={{
          background: 'transparent',
          border: '1px solid black',
          position: 'absolute',
          left: 0,
        }}
        width={canvasSize}
        height={canvasSize}
        onDraw={onDraw}
        frame={frame}
      />
    </div>
  );
}

export default Instance;
