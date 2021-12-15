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

const seed = '123' || Date.now().toString();
console.log('seed:', seed);

const width = 800;
const height = 800;
const world = new World(width, height, seed);
const world2 = new World(width, height, seed);
world2.change();

function App() {
  const canvasSize = Math.min(width, height);

  const [frame, setFrame] = useState(0);
  const [giffer] = useState(() => new Giffer());

  useInterval(() => {
    world.update();
    world2.update();
    setFrame(x => x + 1);
    if (frame % 100 === 0) {
      console.log(frame);
    }
  }, 100);

  const onDraw = (ctx: CanvasRenderingContext2D) => {
    // if (frame > 0) {
    //   return;
    // }
    // console.log(`draw ${frame}`);
    if (frame === 0) {
      // ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = world.background ?? 'black';
      ctx.fillRect(0, 0, width, height);
    }

    if (frame > 0) {
      // ctx.fillStyle = world.background + '01';
      // ctx.fillRect(0, 0, width, height);
    }

    world.draw(ctx);
    // world2.draw(ctx);

    giffer.addFrame(ctx);
    if (frame === 500) {
      giffer.finish(true);
    }
  };

  const handleClick = () => {
    world.update();
    world2.update();
    setFrame(x => x + 1);
  };

  return (
    <div style={{ margin: 10 }} onClick={handleClick}>
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
