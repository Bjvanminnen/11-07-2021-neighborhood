import React, { useState, useEffect } from 'react';
// import seedrandom from 'seedrandom';
import Canvas from './Canvas';
import World, { WorldOptions } from './World';
import Giffer from './Webber';

// TODO: account for torroidal nature
// might actually want to no have it be torroidal

// TODO: store all points, but then unroll at some moment

// TODO: react n time steps after update
// not sure how well that works with current approach. could try that
// with attract-repel branch

// TODO: build gifs?

// TODO: rotate around a unit square defined by abs(x) + abs(y) = c

function Instance({
  width,
  height,
  frame,
  maxFrame,
  options,
  flipped,
  overlay,
  fadeFrame,
}: {
  width: number;
  height: number;
  frame: number;
  maxFrame?: number;
  options: WorldOptions;
  flipped?: boolean;
  overlay?: boolean;
  fadeFrame?: number;
}) {
  const [world] = useState(() => new World(width, height, options));
  const [giffer] = useState(() => new Giffer(false));

  useEffect(() => {
    world.update();
  }, [world, frame]);

  const onDraw = (ctx: CanvasRenderingContext2D) => {
    if (fadeFrame && frame % fadeFrame === 0) {
      ctx.fillStyle = world.background + '02';
      ctx.fillRect(0, 0, width, height);
      console.log('fade');
    }
    world.draw(ctx);
  };

  const onDrawOverlay = (ctx: CanvasRenderingContext2D) => {
    world.drawOverlay(ctx);
  };

  const onDrawCombined = (ctx: CanvasRenderingContext2D) => {
    const canvases = ctx?.canvas?.parentElement?.querySelectorAll('canvas');
    ctx.fillStyle = world.background;
    ctx.fillRect(0, 0, width, height);
    if (canvases?.[0]) {
      ctx.drawImage(canvases[0], 0, 0);
    }
    if (canvases?.[1]) {
      ctx.drawImage(canvases[1], 0, 0);
    }
    giffer.addFrame(ctx);
    if (frame === maxFrame) {
      console.log('finish');
      giffer.finish(true);
    }
  };

  const drawers = overlay ? [onDrawOverlay, onDraw, onDrawCombined] : [onDraw];
  if (flipped) {
    drawers.reverse();
  }

  const handleSave = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    const parent = event?.currentTarget?.parentElement?.parentElement;
    const canvases = parent?.querySelectorAll('canvas');
    // TODO: read from both, write to a new canvas, read from that, save as
    // image
    // const canvas = document.createElement('canvas');
    // canvas.setAttribute('width', width.toString());
    // canvas.setAttribute('height', height.toString());
    // const ctx = canvas.getContext('2d');
    // if (!ctx || !canvases) {
    //   return;
    // }

    console.log(`seed: ${options.seed} frame: ${frame}`);
    // ctx.fillStyle = world.background;
    // ctx.fillRect(0, 0, width, height);
    // Array.from(canvases).forEach(canvas => {
    //   ctx.drawImage(canvas, 0, 0);
    // });

    canvases?.[2]?.toBlob(blob => {
      const obj = URL.createObjectURL(blob);
      window.open(obj);
    });
  };

  return (
    <div style={{ position: 'relative' }}>
      {drawers.map((drawer, i) => (
        <Canvas
          key={i}
          style={{
            background: i === 0 ? world.background : 'transparent',
            // border: '1px solid black',
            // position: 'absolute',
            // left: 0,
            display: overlay && i < 2 ? 'none' : 'block',
            width: '100%',
            height: '100%',
          }}
          width={width}
          height={height}
          onDraw={drawer}
          frame={frame}
        />
      ))}
      {/*<div style={{ position: 'absolute', left: width + 10 }}>
        <button onClick={handleSave}>Save {~~(frame / 100) * 100}</button>
        <div>{options.seed}</div>
      </div>*/}
    </div>
  );
}

export default Instance;
