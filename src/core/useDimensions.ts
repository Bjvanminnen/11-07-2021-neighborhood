import { useEffect, useState } from 'react';

const useDimensions = (width?: number, height?: number) => {
  // if only given one value, treat it as both height and width
  const [dim, setDim] = useState<{ width?: number; height?: number }>({
    width,
    height: height ?? width,
  });

  useEffect(() => {
    setDim({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  return dim;
};

export default useDimensions;
