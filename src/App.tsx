import React, { useState } from 'react';
// import seedrandom from 'seedrandom';
import Canvas from './Canvas';
import World from './World';
import Giffer from './Giffer';
import useInterval from './useInterval';

// TODO: account for torroidal nature
// might actually want to no have it be torroidal

// TODO: store all points, but then unroll at some moment

// TODO: react n time steps after update
// not sure how well that works with current approach. could try that
// with attract-repel branch

// TODO: build gifs?

// TODO: rotate around a unit square defined by abs(x) + abs(y) = c

const seed = '' || Date.now().toString();
console.log('seed:', seed);

const width = 800;
const height = 800;
const world = new World(width, height, seed);

function App() {
  const canvasSize = Math.min(width, height);

  const [frame, setFrame] = useState(0);
  const [giffer] = useState(() => new Giffer());

  useInterval(() => {
    world.update();
    setFrame(x => x + 1);
    if (frame % 100 === 0) {
      console.log(frame);
    }
  }, 20);

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

  const handleClick = () => {
    world.update();
    setFrame(x => x + 1);
  };

  return (
    <div style={{ margin: 10 }} onClick={handleClick}>
      <Canvas
        style={{
          background: world.background,
          border: '1px solid black',
          position: 'absolute',
          left: 18,
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
          left: 18,
        }}
        width={canvasSize}
        height={canvasSize}
        onDraw={onDraw}
        frame={frame}
      />
    </div>
  );
}

export default App;
