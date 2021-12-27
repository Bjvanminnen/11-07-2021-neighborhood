import React, { useEffect, useState } from 'react';
import useInterval from './useInterval';
import Instance from './Instance';
import { loadPalette, coolorPalette, toCoolor } from './palettes';
import generateFeatures from './features';
import useDimensions from './core/useDimensions';

declare global {
  interface Window {
    fxrand: () => number;
    fxhash: string;
    $fxhashFeatures: ReturnType<typeof generateFeatures>;
  }
}

const DISABLE_FX = false;
let seed = window.fxhash;

const PREVIEW_TIME = 0; //1000 * 25;

if (DISABLE_FX) {
  seed = '1234' ?? new Date().toString();
  window.fxrand = Math.random;
}

// console.log('seed:', seed);

const features = generateFeatures(window.fxrand);
// console.log(features);

window.$fxhashFeatures = features;

function App() {
  const MAX_FRAME = Infinity;

  const palettes: { [k: string]: string[] } = {
    synthwave: coolorPalette(
      '1f1e1f-e84b2c-e6d839-7cd164-2eb8ac-fa3419-ffc43d-7cbc9a-23998e-1d5e69',
    ),
    earthworm: coolorPalette(
      '745e50-ff948b-fdaf8a-fcd487-f79585-27191c-2d3839-114d4d-6e9987-e0e4ce',
    ),
    toothpaste: coolorPalette('eaf2ef-b97375-2d2d34-4a7856-498c8a'),
    compostable: coolorPalette('241811-d4a979-e3c88f-c2c995-a8bd95'),
  };

  const [frame, setFrame] = useState(0);
  const [startTime] = useState(new Date());

  const [palette] = useState<string[] | null>(palettes[features.theme]);
  // const [palette, setPalette] = useState<string[] | null>(null);

  const { width, height } = useDimensions();

  // useEffect(() => {
  //   if (!palette) {
  //     const i1 = ~~(window.fxrand() * 1000);
  //     const i2 = ~~(window.fxrand() * 1000);
  //
  //     let result = [...loadPalette(i1)];
  //     // result = coolorPalette(
  //     //   'e3e8cd-bcd8bf-d3b9a3-ee9c92-fe857e-f0d8a8-3d1c00-86b8b1-f2d694-fa2a00',
  //     // );
  //     console.log(i1, i2, toCoolor(result));
  //     setPalette(coolorPalette('241811-d4a979-e3c88f-c2c995-a8bd95'));
  //   } else {
  //     console.log(toCoolor(palette));
  //   }
  // }, [palette]);

  useInterval(() => {
    const d = new Date();

    if (PREVIEW_TIME && d.getTime() - startTime.getTime() > PREVIEW_TIME) {
      return;
    }
    if (frame + 1 > MAX_FRAME) {
      return;
    }
    setFrame(x => x + 1);
  }, 20);

  if (!width || !height || !palette) {
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
            type: 'double-square',
            palette,
            features: {
              ...features,
              density: 'clustered',
            },
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
