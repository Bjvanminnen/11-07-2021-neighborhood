import seedrandom from 'seedrandom';

import {
  normalizedAngle,
  randRange as utilRandRange,
  sample as utilSample,
  Point,
  Vector,
  lerpPoint,
  shuffle,
} from './utils';
import { drawAgent, drawPoint, drawTriangle, drawCircle } from './drawUtils';
import { loadPalette } from './palettes';

export interface Agent {
  id?: string;
  iter?: number;
  point: Point;
  vector: Vector;
  color?: string;
}

export interface WorldOptions {
  seed: string;
  paletteIndex?: number;
  vectorLerp?: number;
}

export default class World {
  private rng: () => number;
  agents: Agent[];
  private iter = 0;
  private options: Required<WorldOptions>;

  public readonly background: string;
  constructor(width: number, height: number, options: WorldOptions) {
    const { randRange } = this;

    this.rng = seedrandom(options.seed);

    this.options = {
      paletteIndex: ~~randRange(0, 1000),
      vectorLerp: 1,
      ...options,
    };

    const { paletteIndex } = this.options;
    if (!options.paletteIndex) {
      console.log('palette: ', paletteIndex);
    }

    // let palette = loadPalette(paletteIndex);
    // console.log(JSON.stringify(palette));
    const palette = 'e4ded0-5cada5-181619-e43225'
      // const palette = 'e4ded0-cc4928-8b728e-181619-3f6634'
      .split('-')
      .map(x => '#' + x);

    this.background = palette[0];
    palette.shift();

    this.agents = [];
    // this.initializeAgentsGrid(width, height, palette);
    this.initializeAgentsQuadrants(width, height, palette);
    console.log(this.agents);
  }

  private initializeAgentsGrid(
    width: number,
    height: number,
    palette: string[],
  ) {
    const { randRange, sample } = this;
    const centerX = width / 2;
    const centerY = height / 2;
    const BUFF = Math.min(width, height) * 0.2;
    const gap = 50;
    const mag = 1;

    this.agents = [];
    for (let x = centerX - BUFF; x <= centerX + BUFF; x += gap) {
      for (let y = centerY - BUFF; y <= centerY + BUFF; y += gap) {
        this.agents.push({
          id: [x, y].join(','),
          point: [x, y],
          vector: [randRange(-mag, mag), randRange(-mag, mag)],
          // color: this.rng() < 0.2 ? this.background : sample(palette),
          color: sample(palette),
        });
      }
    }
  }

  private initializeAgentsQuadrants(
    width: number,
    height: number,
    palette: string[],
  ) {
    const { randRange } = this;

    const jitter = (p: Point, amt = 1): Point => [
      p[0] + randRange(-amt, amt),
      p[1] + randRange(-amt, amt),
    ];

    const quadrants: Point[] = [
      [width * 0.35, height * 0.3],
      [width * 0.65, height * 0.3],
      [(width * 2) / 4, height * 0.7],
    ];

    const mag = 1;
    this.agents = [];

    quadrants.forEach(quad => {
      const jitterAmt = 40;
      this.agents.push({
        point: jitter(quad, jitterAmt),
        vector: [randRange(-mag, mag), randRange(-mag, mag)],
        color: palette[1],
      });

      this.agents.push({
        point: jitter([quad[0] + 50, quad[1]], jitterAmt),
        vector: [randRange(-mag, mag), randRange(-mag, mag)],
        color: palette[2],
      });

      this.agents.push({
        point: jitter([quad[0] + 10, quad[1] - 20], jitterAmt),
        vector: [randRange(-mag, mag), randRange(-mag, mag)],
        color: palette[0],
      });
    });
  }

  private randRange = (min: number, max: number): number =>
    utilRandRange(this.rng, min, max);

  private sample = <T extends unknown>(rg: T[]): T => utilSample(this.rng, rg);

  private updateSingle(current: Agent, anchor: Point): Agent {
    // the x and y of the line from point to anchor
    const dx = current.point[0] - anchor[0];
    const dy = current.point[1] - anchor[1];
    const radius = Math.sqrt(dx ** 2 + dy ** 2);

    const magnitude = Math.sqrt(
      current.vector[0] ** 2 + current.vector[1] ** 2,
    );

    // how far around the circle to move
    const radians = magnitude / radius;

    // the angle of the line from anchor to point, where a line straight
    // to the right is 0 and we increase CW
    const angle = Math.atan2(dy, dx);

    const vectorAngle = Math.atan2(
      current.point[1] + current.vector[1] - anchor[1],
      current.point[0] + current.vector[0] - anchor[0],
    );

    let normAngle = normalizedAngle(angle);
    let normVector = normalizedAngle(vectorAngle);
    if (normAngle > Math.PI) {
      normAngle -= Math.PI;
      normVector = normalizedAngle(normVector - Math.PI);
    }
    // 1 for clockwise, -1 for counter clockwise
    const sign =
      normVector >= normAngle && normVector < normAngle + Math.PI ? 1 : -1;

    const nextAngle = angle + radians * sign;

    // TODO:
    // Right now we move around the circle an amount determined by the magnitude
    // of the vector.
    // I explored just updating the vector, and then adjusting the point by the
    // vectory, but ended up with a lot of tight cycles
    // Another option would be to

    const nextPoint: Point = [
      anchor[0] + Math.cos(nextAngle) * radius,
      anchor[1] + Math.sin(nextAngle) * radius,
    ];

    // next vector is just the tangent to the circle
    const nextVector: Point = [
      Math.cos(nextAngle + (Math.PI / 2) * sign) * magnitude,
      Math.sin(nextAngle + (Math.PI / 2) * sign) * magnitude,
    ];

    return {
      ...current,
      iter: (current.iter ?? 0) + 1,
      point: nextPoint,
      vector: lerpPoint(current.vector, nextVector, this.options.vectorLerp),
    };
  }

  update() {
    this.iter++;
    const rng = seedrandom(this.iter.toString());
    const shuffled = shuffle(this.agents.slice(), rng);

    const output: Agent[] = [];
    for (let i = 0; i < shuffled.length; i++) {
      const next = this.updateSingle(
        shuffled[i],
        this.findNearest(shuffled, shuffled[i]).point,
      );
      output.push(next);
    }

    this.agents = output;
  }

  private findNearest(agents: Agent[], current: Agent): Agent {
    let nearest = agents[0] === current ? agents[1] : agents[0];

    let nearestDistSquared = Infinity;
    agents.forEach(other => {
      if (other === current) {
        return;
      }
      const dx = other.point[0] - current.point[0];
      const dy = other.point[1] - current.point[1];
      const distSquared = dx ** 2 + dy ** 2;
      if (distSquared < nearestDistSquared) {
        nearestDistSquared = distSquared;
        nearest = other;
      }
    });

    return nearest;
  }

  draw(ctx: CanvasRenderingContext2D, alpha?: string) {
    const { agents } = this;

    // if (alpha) {
    //   ctx.globalCompositeOperation = 'luminosity';
    //   const { width, height } = ctx.canvas;
    //   ctx.fillStyle = this.background + alpha;
    //   ctx.fillRect(0, 0, width, height);
    // }

    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = 'gray';
    agents.forEach(agent => drawPoint(ctx, agent.point, 1, agent.color + '88'));
  }

  drawOverlay(ctx: CanvasRenderingContext2D) {
    const rng = seedrandom((this.iter + 1).toString());
    const shuffled = shuffle(this.agents.slice(), rng);

    // ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < shuffled.length; i++) {
      const neighbor = this.findNearest(shuffled, shuffled[i]);
      ctx.strokeStyle = neighbor.color + '05';
      drawCircle(ctx, shuffled[i].point, neighbor.point);
    }
  }
}
