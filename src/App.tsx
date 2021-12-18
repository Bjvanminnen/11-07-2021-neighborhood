import React, { useState } from 'react';
import useInterval from './useInterval';
import Instance from './Instance';

const seed = '' || Date.now().toString();
console.log('seed:', seed);

function App() {
  const width = 500;
  const height = 500;

  const [frame, setFrame] = useState(0);

  useInterval(() => {
    setFrame(x => x + 1);
  }, 20);

  return (
    <div style={{ display: 'flex' }}>
      <Instance seed={seed} width={width} height={height} frame={frame} />
      <Instance
        seed={seed}
        width={width}
        height={height}
        frame={frame}
        paletteIndex={299}
      />
    </div>
  );
}

export default App;
