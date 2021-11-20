import React, { useState } from 'react';
import seedrandom from 'seedrandom';
import Canvas from './Canvas';
import World from './World';

const seed = (1594013991704 || Date.now()).toString();
console.log('seed:', seed);
seedrandom(seed, { global: true });

const width = 600;
const height = 600;
const world = new World(width, height);
// for (let i = 0; i < 20; i++) {
//   world.update();
// }

function App() {
  const canvasSize = 600;

  const [frame, setFrame] = useState(0);

  const onDraw = (ctx: CanvasRenderingContext2D) => {
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
