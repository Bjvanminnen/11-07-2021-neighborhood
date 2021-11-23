import React, { useState } from 'react';
import seedrandom from 'seedrandom';
import Canvas from './Canvas';
import World from './World';
import useInterval from './useInterval';

// TODO: account for torroidal nature
// might actually want to no have it be torroidal

const seed = '1637647485846' ?? Date.now().toString();
console.log('seed:', seed);
seedrandom(seed, { global: true });

const width = 600;
const height = 600;
const world = new World(width, height);

function App() {
  const canvasSize = 600;

  const [frame, setFrame] = useState(0);

  useInterval(() => {
    world.update();
    setFrame(x => x + 1);
  }, 20);

  const onDraw = (ctx: CanvasRenderingContext2D) => {
    // console.log(`draw ${frame}`);
    if (frame === 0) {
      ctx.clearRect(0, 0, width, height);
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
