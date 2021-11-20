import React, { useState } from 'react';
import seedrandom from 'seedrandom';
import Canvas from './Canvas';
import World from './World';

const seed = (1594013991704 || Date.now()).toString();
console.log('seed:', seed);
seedrandom(seed, { global: true });

const world = new World(20, 2, seedrandom(seed));

function App() {
  const canvasSize = 600;

  const [frame, setFrame] = useState(0);

  const onDraw = (ctx: CanvasRenderingContext2D) => {
    world.draw(ctx);
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
