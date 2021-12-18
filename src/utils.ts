type Rng = () => number;
export type Point = [number, number];
export type Vector = [number, number];

export const radToDeg = (radians: number) => (radians * 360) / (2 * Math.PI);

export const normalizedAngle = (radians: number) =>
  radians < 0 ? radians + 2 * Math.PI : radians;

export const randRange = (rng: Rng, min: number, max: number): number =>
  rng() * (max - min) + min;

export const sample = <T extends unknown>(rng: Rng, array: T[]): T =>
  array[~~randRange(rng, 0, array.length)];

export const lerp = (start: number, end: number, amt: number) =>
  start + (end - start) * amt;

export const diffPoint = (start: Point, end: Point): Point => [
  end[0] - start[0],
  end[1] - start[1],
];

export const lerpPoint = (start: Point, end: Point, amt: number): Point => [
  lerp(start[0], end[0], amt),
  lerp(start[1], end[1], amt),
];

export const normalize = (v: Vector): Vector => {
  const mag = Math.sqrt(v[0] ** 2 + v[1] ** 2);
  return [v[0] / mag, v[1] / mag];
};

export function shuffle(array: any[], rng = Math.random) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(rng() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
