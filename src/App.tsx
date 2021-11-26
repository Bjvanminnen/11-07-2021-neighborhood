import React, { useState } from 'react';
import seedrandom from 'seedrandom';
import Canvas from './Canvas';
import World from './World';
import useInterval from './useInterval';

// TODO: account for torroidal nature
// might actually want to no have it be torroidal

// TODO: store all points, but then unroll at some moment

const seed = '' ?? Date.now().toString();
console.log('seed:', seed);
seedrandom(seed, { global: true });

const width = 900;
const height = 900;
const world = new World(width, height);

function App() {
  const canvasSize = Math.min(width, height);

  const [frame, setFrame] = useState(0);

  useInterval(() => {
    world.update();
    setFrame(x => x + 1);
  }, 20);

  const onDraw = (ctx: CanvasRenderingContext2D) => {
    // console.log(`draw ${frame}`);
    if (frame === 0) {
      // ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, width, height);
    }

    world.draw(ctx);
  };

  const handleClick = () => {
    world.update();
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
