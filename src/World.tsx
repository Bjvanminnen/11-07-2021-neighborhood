import seedrandom from 'seedrandom';

import {
  normalizedAngle,
  randRange as utilRandRange,
  sample as utilSample,
  Point,
  Vector,
  lerpPoint,
  shuffle,
  vectorRadians,
} from './utils';
import * as draw from './drawUtils';
import { coolorPalette } from './palettes';

const TAU = 2 * Math.PI;

export interface Agent {
  id?: string;
  iter?: number;
  point: Point;
  vector: Vector;
  color?: string;
}

export interface WorldOptions {
  seed: string;
  palette?: string[];
  vectorLerp?: number;
  optionB?: boolean;
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
      palette: coolorPalette('333745-e63462-fe5f55-c7efcf-eef5db'),
      vectorLerp: 1,
      optionB: false,
      ...options,
    };

    const [background, ...foreground] = this.options.palette;
    this.background = background;

    this.agents = [];
    this.initializeAgentsGrid(width, height, foreground);
    // this.initializeAgentsQuadrants(width, height, foreground);
  }

  private initializeAgentsGrid(
    width: number,
    height: number,
    palette: string[],
  ) {
    const { randRange, sample } = this;
    const centerX = width / 2;
    const centerY = height / 2;
    // const BUFF = Math.min(width, height) * 0.08;
    const BUFF = 300;
    const gap = 80;
    const mag = 1;

    const jitter = (p: Point, amt = 1): Point => [
      p[0] + randRange(-amt, amt),
      p[1] + randRange(-amt, amt),
    ];

    this.agents = [];
    for (let x = centerX - BUFF; x <= centerX + BUFF; x += gap) {
      for (let y = centerY - BUFF; y <= centerY + BUFF; y += gap) {
        this.agents.push({
          id: [x, y].join(','),
          point: jitter([x, y], 10),
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

    const BUFF = 100;
    const quadrants: Point[] = [
      [width / 2 - BUFF, height / 2],
      [width / 2 + BUFF, height / 2],
      // [width * 0.35, height * 0.5],
      // [width * 0.65, height * 0.5],
      // [(width * 2) / 4, height * 0.6],
    ];

    const mag = 1;
    this.agents = [];

    quadrants.forEach(quad => {
      const jitterAmt = 20;
      this.agents.push({
        point: jitter(quad, jitterAmt),
        vector: [randRange(-mag, mag), randRange(-mag, mag)],
        color: palette[0],
      });

      this.agents.push({
        point: jitter([quad[0] + 5, quad[1]], jitterAmt),
        vector: [randRange(-mag, mag), randRange(-mag, mag)],
        color: palette[1],
      });

      this.agents.push({
        point: jitter([quad[0] + 1, quad[1] - 2], jitterAmt),
        vector: [randRange(-mag, mag), randRange(-mag, mag)],
        color: palette[2],
      });

      this.agents.push({
        point: jitter([quad[0] - 4, quad[1] + 2], jitterAmt),
        vector: [randRange(-mag, mag), randRange(-mag, mag)],
        color: palette[3],
      });
    });
  }

  private randRange = (min: number, max: number): number =>
    utilRandRange(this.rng, min, max);

  private sample = <T extends unknown>(rg: T[]): T => utilSample(this.rng, rg);

  /**
   * Given an anchor point and an agent, determine whether the agent should
   * rotate clockwise (1)  or counter-clockwise (-1)
   */
  static getDirection(anchor: Point, agent: Agent): number {
    const dx = agent.point[0] - anchor[0];
    const dy = agent.point[1] - anchor[1];

    // the angle of the line from anchor to point, where a line straight
    // to the right is 0 and we increase CW
    const angle = Math.atan2(dy, dx);

    // angle of the line from anchor to point with vector applied
    const vectorAngle = Math.atan2(
      agent.point[1] + agent.vector[1] - anchor[1],
      agent.point[0] + agent.vector[0] - anchor[0],
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

    return sign;
  }

  private updateSingle(current: Agent, anchor: Point): Agent {
    if (this.options.optionB) {
      return this.updateSingleSquare(current, anchor);
    }
    // the x and y of the line from point to anchor
    const dx = current.point[0] - anchor[0];
    const dy = current.point[1] - anchor[1];
    const radius = Math.sqrt(dx ** 2 + dy ** 2);

    const magnitude = Math.sqrt(
      current.vector[0] ** 2 + current.vector[1] ** 2,
    );

    // how far around the circle to move
    const radians = magnitude / radius;

    // 1 for clockwise, -1 for counter clockwise
    const sign = World.getDirection(anchor, current);

    // the angle of the line from anchor to point, where a line straight
    // to the right is 0 and we increase CW
    const angle = Math.atan2(dy, dx);
    const nextAngle = angle + radians * sign;

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

  private updateSingleSquare(current: Agent, anchor: Point): Agent {
    const root2 = Math.sqrt(2) / 2;
    const northeast: Vector = [root2, -root2];
    const southeast: Vector = [root2, root2];
    const northwest: Vector = [-root2, -root2];
    const southwest: Vector = [-root2, root2];

    const dx = current.point[0] - anchor[0];
    const dy = current.point[1] - anchor[1];

    const magnitude = Math.sqrt(
      current.vector[0] ** 2 + current.vector[1] ** 2,
    );

    const angle = vectorRadians([dx, dy]);
    const vectorAngle = vectorRadians([-current.vector[0], -current.vector[1]]);

    let nextVector: Vector;
    const quadrant = ~~((angle / TAU) * 4);

    const norm = (quadrant / 4 + 1 / 8) * TAU;

    // TODO lt vs lte
    if (quadrant === 0) {
      // SE quadrant
      const clockwise = vectorAngle < norm || vectorAngle > norm + Math.PI;
      nextVector = clockwise ? southwest : northeast;
    } else if (quadrant === 1) {
      // SW quadrant
      const clockwise = vectorAngle < norm || vectorAngle > norm + Math.PI;
      nextVector = clockwise ? northwest : southeast;
    } else if (quadrant === 2) {
      // NW quadrant
      const clockwise = vectorAngle < norm && vectorAngle > norm - Math.PI;
      nextVector = clockwise ? northeast : southwest;
    } else {
      // NE quadrant
      const clockwise = vectorAngle < norm && vectorAngle > norm - Math.PI;
      nextVector = clockwise ? southeast : northwest;
    }

    // TODO: really i want to lerp the angle, not the vector
    nextVector = lerpPoint(
      current.vector,
      [nextVector[0] * magnitude, nextVector[1] * magnitude],
      this.options.vectorLerp,
    );
    const nextPoint: Point = [
      current.point[0] + nextVector[0],
      current.point[1] + nextVector[1],
    ];

    return {
      ...current,
      iter: (current.iter ?? 0) + 1,
      vector: nextVector,
      point: nextPoint,
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

    // ctx.globalCompositeOperation = 'source-over';
    // ctx.strokeStyle = 'gray';
    agents.forEach(agent => {
      // draw.drawPoint(ctx, agent.point, 1, agent.color + '80'),
      ctx.strokeStyle = agent.color!;
      // draw.drawDoublePoint(ctx, agent, 3);
      draw.drawYarn(ctx, agent, this.background);
    });
  }

  drawOverlay(ctx: CanvasRenderingContext2D) {
    const rng = seedrandom((this.iter + 1).toString());
    const shuffled = shuffle(this.agents.slice(), rng);

    // ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < shuffled.length; i++) {
      const neighbor = this.findNearest(shuffled, shuffled[i]);
      ctx.strokeStyle = neighbor.color + '02';
      if (this.options.optionB) {
        draw.drawCircle(ctx, shuffled[i].point, neighbor.point);
      } else {
        draw.drawSquare(ctx, shuffled[i].point, neighbor.point);
      }
    }
  }
}
