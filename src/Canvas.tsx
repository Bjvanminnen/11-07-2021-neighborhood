import React, { useRef, useEffect } from 'react';

const Canvas = ({
  width,
  height,
  frame = 0,
  style,
  onDraw,
  onClick,
}: {
  width: number;
  height: number;
  frame?: number;
  style?: object;
  onDraw: (ctx: CanvasRenderingContext2D) => void;
  onClick?: (event: React.MouseEvent<HTMLCanvasElement>) => void;
}) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const ctx = ref.current.getContext('2d');
    onDraw(ctx!);
  }, [onDraw, frame]);

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      style={style}
      onClick={onClick}
    />
  );
};
export default Canvas;
