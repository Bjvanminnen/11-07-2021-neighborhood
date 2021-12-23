import React, { useRef, useEffect } from 'react';

const Canvas = ({
  width,
  height,
  id,
  frame = 0,
  style,
  onDraw,
  onClick,
}: {
  width: number;
  height: number;
  id?: string;
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
      id={id}
      width={width}
      height={height}
      style={style}
      onClick={onClick}
    />
  );
};
export default Canvas;
