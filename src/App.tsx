import React, { useState } from 'react';
// import seedrandom from 'seedrandom';
import Canvas from './Canvas';
import World from './World';
import useInterval from './useInterval';

// TODO: account for torroidal nature
// might actually want to no have it be torroidal

// TODO: store all points, but then unroll at some moment

// TODO: react n time steps after update

const seed = '' || Date.now().toString();
console.log('seed:', seed);

const width = 800;
const height = 800;
const world = new World(width, height, seed);
const world2 = new World(width, height, seed);
world2.change();

function App() {
  const canvasSize = Math.min(width, height);

  const [frame, setFrame] = useState(0);

  useInterval(() => {
    world.update();
    world2.update();
    setFrame(x => x + 1);
  }, 20);

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
