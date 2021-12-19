import React, { useState } from 'react';
import useInterval from './useInterval';
import Instance from './Instance';

const seed = '1639872519803' || Date.now().toString();
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
      <Instance
        width={width}
        height={height}
        frame={frame}
        options={{
          seed: seed + '',
          // paletteIndex: 299,
        }}
      />
      <Instance
        width={width}
        height={height}
        frame={frame}
        options={{
          seed: seed + '1',
          // paletteIndex: 299,
          vectorLerp: 1,
        }}
      />
      <Instance
        width={width}
        height={height}
        frame={frame}
        options={{
          seed: seed + '2',
          // paletteIndex: 299,
          vectorLerp: 1,
        }}
      />
    </div>
  );
}

export default App;
