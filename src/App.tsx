import React, { useEffect, useState } from 'react';
import useInterval from './useInterval';
import Instance from './Instance';
import { loadPalette, coolorPalette } from './palettes';
import generateFeatures from './features';

declare global {
  interface Window {
    fxrand: () => number;
    fxhash: string;
    $fxhashFeatures: ReturnType<typeof generateFeatures>;
  }
}

const DISABLE_FX = true;
let seed = window.fxhash;

if (DISABLE_FX) {
  seed = '1234' ?? new Date().toString();
  window.fxrand = Math.random;
}

console.log('seed:', seed);

const features = generateFeatures(window.fxrand);
console.log(features);
window.$fxhashFeatures = features;

function App() {
  const MAX_FRAME = Infinity;

  const palettes = {
    autumn: coolorPalette('5a372c-8b8b70-16302b-f0f0d8-c94b0c'),
    spring: coolorPalette('ecfadb-bc3908-474843-1b9aaa-138a36'),
    winter: coolorPalette('333745-e63462-fe5f55-c7efcf-eef5db'),
  };

  const [frame, setFrame] = useState(0);
  const [width, setWidth] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [palette, setPalette] = useState<string[] | null>(
    // palettes[$fxhashFeatures.season],
    ['#eeeeee', ...loadPalette(6), ...loadPalette(7)],
  );

  useEffect(() => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
    if (!palette) {
      const palette = loadPalette(~~(Math.random() * 1000));
      console.log(
        palette
          .map(x =>
            x
              .split('')
              .slice(1)
              .join(''),
          )
          .join('-'),
      );
      setPalette(palette);
    }
  }, [palette]);

  useInterval(() => {
    if (frame + 1 > MAX_FRAME) {
      return;
    }
    setFrame(x => x + 1);
  }, 20);

  if (width === null || height === null || !palette) {
    return null;
  }

  return (
    <div style={{ display: 'default' }}>
      {Array.from({ length: 1 }).map((_, i) => (
        <Instance
          key={i}
          width={width}
          height={height}
          frame={frame}
          maxFrame={MAX_FRAME}
          fadeFrame={60}
          overlay={true}
          options={{
            seed: seed + (i === 0 ? '' : i),
            vectorLerp: 1,
            optionB: false,
            palette,
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
