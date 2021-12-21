import React, { useState } from 'react';
import useInterval from './useInterval';
import Instance from './Instance';

const seed = '' || Date.now().toString();
console.log('seed:', seed);

function App() {
  const size = 600;

  const [frame, setFrame] = useState(0);

  useInterval(() => {
    setFrame(x => x + 1);
  }, 20);

  return (
    <div style={{ display: 'flex' }}>
      <Instance
        width={size}
        height={size}
        frame={frame}
        overlay
        options={{
          seed: seed + '',
          paletteIndex: 137,
          vectorLerp: 1,
          optionB: true,
        }}
      />
      {/*<Instance
        width={size}
        height={size}
        frame={frame}
        options={{
          seed: seed + '',
          paletteIndex: 137,
          optionB: true,
        }}
        overlay
      />*/}
      {/*<Instance
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
      />*/}
    </div>
  );
}

export default App;
