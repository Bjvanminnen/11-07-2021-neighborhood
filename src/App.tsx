import React, { useState } from 'react';
import useInterval from './useInterval';
import Instance from './Instance';

const seed = '1640072864886' || Date.now().toString();
console.log('seed:', seed);

function App() {
  const MAX_FRAME = 1000;

  const [frame, setFrame] = useState(0);

  useInterval(() => {
    if (frame + 1 > MAX_FRAME) {
      return;
    }
    setFrame(x => x + 1);
  }, 20);

  return (
    <div style={{ display: 'default' }}>
      {Array.from({ length: 1 }).map((_, i) => (
        <Instance
          key={i}
          width={500}
          height={500}
          frame={frame}
          maxFrame={MAX_FRAME}
          overlay
          options={{
            seed: seed + (i === 0 ? '' : i),
            paletteIndex: 137,
            vectorLerp: 1,
            optionB: true,
          }}
        />
      ))}
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
