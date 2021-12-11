import seedrandom from 'seedrandom';
const palettes = require('nice-color-palettes/1000');

type Point = [number, number];
type Vector = [number, number];

const radToDeg = (radians: number) => (radians * 360) / (2 * Math.PI);

const normalizedAngle = (radians: number) =>
  radians < 0 ? radians + 2 * Math.PI : radians;

const lerp = (start: number, end: number, amt: number) =>
  start + (end - start) * amt;

const diffPoint = (start: Point, end: Point): Point => [
  end[0] - start[0],
  end[1] - start[1],
];

const lerpPoint = (start: Point, end: Point, amt: number): Point => [
  lerp(start[0], end[0], amt),
  lerp(start[1], end[1], amt),
];

const normalize = (v: Vector): Vector => {
  const mag = Math.sqrt(v[0] ** 2 + v[1] ** 2);
  return [v[0] / mag, v[1] / mag];
};

interface PointVector {
  id?: string;
  iter?: number;
  point: Point;
  vector: Vector;
  attract?: boolean;
  color?: string;
  threshhold?: {
    near: number;
    far: number;
  };
}

export default class World {
  private rng: () => number;
  agents: PointVector[];
  public readonly background: string;
  constructor(width: number, height: number, seed: string) {
    const { randRange, sample } = this;

    this.rng = seedrandom(seed);

    // const paletteIndex = ~~randRange(0, palettes.length);
    // console.log(paletteIndex);
    const paletteIndex = 940;
    let palette = [...palettes[paletteIndex]];

    // const palette = [
    //   '613F75',
    //   'c1ff9b',
    //   '266dd3',
    //   '00c2d1',
    //   'f9e900',
    //   'ff6542',
    //   'ed33b9',
    // ].map(x => '#' + x);
    this.background = 'black';
    palette = palette.slice(1);

    const BUFF = Math.min(width, height) * 0.2;
    const gap = 20;

    const centerX = width / 2;
    const centerY = height / 2;

    const mag = 2;
    this.agents = [];
    for (let x = centerX - BUFF; x <= centerX + BUFF; x += gap) {
      for (let y = centerY - BUFF; y <= centerY + BUFF; y += gap) {
        this.agents.push({
          id: [x, y].join(','),
          point: [x + randRange(-1, 1), y + randRange(-1, 1)],
          vector: [randRange(-mag, mag), randRange(-mag, mag)],
          color: sample(palette),
          attract: this.rng() < 0.5,
          threshhold: {
            near: randRange(10, 30),
            far: randRange(40, 50),
          },
        });
      }
    }

    // this.agents = [];
    // this.agents.push({
    //   point: [100, 100],
    //   vector: [1, 1],
    //   color: '#FF0000',
    // });
    //
    // this.agents.push({
    //   point: [200, 100],
    //   vector: [1, 1],
    //   color: '#00FF00',
    // });
    //
    // this.agents.push({
    //   point: [150, 200],
    //   vector: [1, 1],
    //   color: '#0000FF',
    // });
  }

  change() {
    this.agents.forEach(agent => {
      agent.vector[0] *= 2;
      agent.vector[1] *= 2;
    });
  }

  private randRange = (min: number, max: number): number =>
    this.rng() * (max - min) + min;
  private sample = <T extends unknown>(rg: T[]): T =>
    rg[~~this.randRange(0, rg.length)];

  private updateSingle2(
    current: PointVector,
    nearest: PointVector[],
  ): PointVector {
    const [repel, attract] = nearest;

    const repelDiff = diffPoint(current.point, repel.point);
    const attractDiff = diffPoint(attract.point, current.point);

    const average: Vector = normalize([
      repelDiff[0] + attractDiff[0],
      repelDiff[1] + attractDiff[1],
    ]);

    const mag = 2;

    const nextVector: Vector = lerpPoint(current.vector, average, 1);
    const nextPoint: Point = [
      current.point[0] + mag * nextVector[0],
      current.point[1] + mag * nextVector[1],
    ];

    return {
      ...current,
      iter: (current.iter ?? 0) + 1,
      point: nextPoint,
      vector: nextVector,
    };
  }

  private updateSingle(
    current: PointVector,
    nearest: PointVector[],
  ): PointVector {
    if (!current.threshhold) {
      throw new Error('missing threshhold');
    }
    const anchor = nearest[0].point;
    const dx = current.point[0] - anchor[0];
    const dy = current.point[1] - anchor[1];
    const dist = Math.sqrt(dx ** 2 + dy ** 2);
    let { attract } = current;
    if (attract && dist < current.threshhold.near) {
      attract = false;
    } else if (!attract && dist > current.threshhold.far) {
      attract = true;
    }

    const unit: Vector = [
      (dx / dist) * (attract ? -1 : 1),
      (dy / dist) * (attract ? -1 : 1),
    ];

    const nextVector: Vector = [
      lerp(current.vector[0], unit[0], 0.05),
      lerp(current.vector[1], unit[1], 0.05),
    ];
    const mag = 2;
    const nextPoint: Point = [
      current.point[0] + mag * nextVector[0],
      current.point[1] + mag * nextVector[1],
    ];

    return {
      ...current,
      attract,
      iter: (current.iter ?? 0) + 1,
      point: nextPoint,
      vector: nextVector,
    };
  }

  update() {
    const { agents } = this;

    // TODO: should shuffle

    const output: PointVector[] = [];
    for (let i = 0; i < agents.length; i++) {
      const next = this.updateSingle2(
        agents[i],
        this.findNearestN(agents, agents[i], 2),
      );
      output.push(next);
    }

    this.agents = output;
  }

  private findNearestN(
    agents: PointVector[],
    current: PointVector,
    n = 1,
  ): PointVector[] {
    // closest at element 0 and so on
    let closest: { d2: number; agent: PointVector }[] = [];

    agents.forEach(other => {
      if (other === current) {
        return;
      }
      const dx = other.point[0] - current.point[0];
      const dy = other.point[1] - current.point[1];
      const d2 = dx ** 2 + dy ** 2;
      let insertAt = Math.min(n, closest.length);
      for (let i = 0; i < insertAt; i++) {
        if (d2 < closest[i].d2) {
          insertAt = i;
          break;
        }
      }
      if (insertAt < n) {
        closest.splice(insertAt, 0, { d2, agent: other });
      }
      closest = closest.slice(0, n);
    });
    return closest.map(x => x.agent);
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { agents } = this;

    const drawPoint = (point: Point, radius: number) => {
      // ctx.fillRect(point[0], point[1], 1, 1);
      ctx.beginPath();
      ctx.arc(point[0], point[1], radius, 0, 2 * Math.PI);
      ctx.stroke();
    };

    const drawTriangle = (pv: PointVector, radius: number) => {
      const angle = Math.atan2(pv.vector[1], pv.vector[0]);
      const da = 0.8;

      ctx.beginPath();
      ctx.moveTo(
        pv.point[0] + Math.cos(angle + Math.PI * da) * radius,
        pv.point[1] + Math.sin(angle + Math.PI * da) * radius,
      );
      ctx.lineTo(
        pv.point[0] + Math.cos(angle) * radius,
        pv.point[1] + Math.sin(angle) * radius,
      );
      ctx.lineTo(
        pv.point[0] + Math.cos(angle - Math.PI * da) * radius,
        pv.point[1] + Math.sin(angle - Math.PI * da) * radius,
      );

      ctx.stroke();
    };

    const drawDoublePoint = (pv: PointVector, radius: number) => {
      const angle = Math.atan2(pv.vector[1], pv.vector[0]);
      const da = 0.5;

      drawPoint(
        [
          pv.point[0] + Math.cos(angle + Math.PI * da) * radius,
          pv.point[1] + Math.sin(angle + Math.PI * da) * radius,
        ],
        1,
      );
      drawPoint(
        [
          pv.point[0] + Math.cos(angle - Math.PI * da) * radius,
          pv.point[1] + Math.sin(angle - Math.PI * da) * radius,
        ],
        1,
      );
    };

    const drawPointVector = (pv: PointVector) => {
      ctx.fillStyle = 'black';
      // drawDoublePoint(pv, 3);
      ctx.fillStyle = (pv.color ?? '#000000') + 'ff';
      ctx.strokeStyle = (pv.color ?? '#000000') + 'ff';
      // drawDoublePoint(pv, 2.5);

      // ctx.fillStyle = '#00000044';

      const point: Point = [pv.point[0], pv.point[1]];
      // ctx.strokeStyle = this.background;
      drawPoint(point, 3);
      // ctx.strokeStyle = (pv.color ?? '#000000') + 'ff';
      // drawPoint(point, 3);
      // drawTriangle(pv, 5);

      // ctx.strokeStyle = 'black';
      // drawTriangle(pv, 4);
      // ctx.fillStyle = '#00000044';
      // drawPoint(pv.point, 2);
    };

    ctx.strokeStyle = 'gray';
    agents.forEach(agent => drawPointVector(agent));
  }
}
