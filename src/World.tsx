import seedrandom from 'seedrandom';

import {
  normalizedAngle,
  randRange as utilRandRange,
  sample as utilSample,
  Point,
  Vector,
} from './utils';
import { drawAgent, drawPoint, drawTriangle } from './drawUtils';
import { loadPalette } from './palettes';

export interface Agent {
  id?: string;
  iter?: number;
  point: Point;
  vector: Vector;
  color?: string;
}

export default class World {
  private rng: () => number;
  agents: Agent[];
  public readonly background: string;
  constructor(width: number, height: number, seed: string) {
    const { randRange, sample } = this;

    this.rng = seedrandom(seed);

    let palette = loadPalette(940);

    this.background = palette[0];
    palette = palette.slice(1);

    const BUFF = Math.min(width, height) * 0.2;
    const gap = 50;

    const centerX = width / 2;
    const centerY = height / 2;

    const mag = 2;
    this.agents = [];
    for (let x = centerX - BUFF; x <= centerX + BUFF; x += gap) {
      for (let y = centerY - BUFF; y <= centerY + BUFF; y += gap) {
        this.agents.push({
          id: [x, y].join(','),
          point: [x, y],
          vector: [randRange(-mag, mag), randRange(-mag, mag)],
          color: sample(palette),
        });
      }
    }
  }

  change() {
    this.agents.forEach(agent => {
      agent.vector[0] *= 2;
      agent.vector[1] *= 2;
    });
  }

  private randRange = (min: number, max: number): number =>
    utilRandRange(this.rng, min, max);

  private sample = <T extends unknown>(rg: T[]): T => utilSample(this.rng, rg);

  private updateSingle(current: Agent, anchor: Point): Agent {
    // the x and y of the line from anchor to point
    const dx = current.point[0] - anchor[0];
    const dy = current.point[1] - anchor[1];
    const radius = Math.sqrt(dx ** 2 + dy ** 2);

    const magnitude = Math.sqrt(
      current.vector[0] ** 2 + current.vector[1] ** 2,
    );

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

    const nextPoint: Point = [
      anchor[0] + Math.cos(nextAngle) * radius,
      anchor[1] + Math.sin(nextAngle) * radius,
    ];

    const nextVector: Point = [
      Math.cos(nextAngle + (Math.PI / 2) * sign) * magnitude,
      Math.sin(nextAngle + (Math.PI / 2) * sign) * magnitude,
    ];

    return {
      ...current,
      iter: (current.iter ?? 0) + 1,
      point: nextPoint,
      vector: nextVector,
    };
  }

  update() {
    const { agents } = this;

    // TODO: should shuffle

    const output: Agent[] = [];
    for (let i = 0; i < agents.length; i++) {
      const next = this.updateSingle(
        agents[i],
        this.findNearest(agents, agents[i]).point,
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

  draw(ctx: CanvasRenderingContext2D) {
    const { agents } = this;

    ctx.strokeStyle = 'gray';
    agents.forEach(agent => drawPoint(ctx, agent.point, 1, agent.color + 'ff'));
  }
}
