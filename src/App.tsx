import React, { useEffect, useState } from 'react';
import useInterval from './useInterval';
import Instance from './Instance';
import { loadPalette, coolorPalette, toCoolor } from './palettes';
import generateFeatures from './features';

declare global {
  interface Window {
    fxrand: () => number;
    fxhash: string;
    $fxhashFeatures: ReturnType<typeof generateFeatures>;
  }
}

const DISABLE_FX = false;
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

  const palettes: { [k: string]: string[] } = {
    // browns: coolorPalette(
    //   '281a1a-6c3e37-70454e-ae736f-dda8b0-807070-9a8fc8-8dbdeb-a5e6c8-d9f5b5',
    // ),
    retro: coolorPalette(
      '1f1e1f-e84b2c-e6d839-7cd164-2eb8ac-fa3419-ffc43d-7cbc9a-23998e-1d5e69',
    ),
    earthworm: coolorPalette(
      '745e50-ff948b-fdaf8a-fcd487-f79585-27191c-2d3839-114d4d-6e9987-e0e4ce',
    ),
    mint: coolorPalette('eaf2ef-b97375-2d2d34-4a7856-498c8a'),
  };

  const [frame, setFrame] = useState(0);
  const [width, setWidth] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);

  // initialPalette = palettes.browns;
  const [palette, setPalette] = useState<string[] | null>(
    palettes[features.theme],
  );

  useEffect(() => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);

    // if (!palette) {
    //   const i1 = ~~(window.fxrand() * 1000);
    //   const i2 = ~~(window.fxrand() * 1000);
    //
    //   let result = [...loadPalette(i1), ...loadPalette(i2)];
    //   // result = coolorPalette(
    //   //   'e3e8cd-bcd8bf-d3b9a3-ee9c92-fe857e-f0d8a8-3d1c00-86b8b1-f2d694-fa2a00',
    //   // );
    //   console.log(i1, i2, toCoolor(result));
    //   setPalette(result);
    // } else {
    //   console.log(toCoolor(palette));
    // }
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
          fadeFrame={0}
          overlay={true}
          options={{
            seed: seed + (i === 0 ? '' : i),
            vectorLerp: 1,
            optionB: false,
            palette,
            features,
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
