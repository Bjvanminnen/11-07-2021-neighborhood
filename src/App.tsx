import React, { useState } from 'react';
import seedrandom from 'seedrandom';
import Canvas from './Canvas';

const seed = (1594013991704 || Date.now()).toString();
console.log('seed:', seed);
seedrandom(seed, { global: true });

function App() {
  const canvasSize = 600;

  const [frame, setFrame] = useState(0);

  const onDraw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillRect(10, 10, canvasSize - 20, canvasSize - 20);
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
