import seedrandom from 'seedrandom';
const palettes = require('nice-color-palettes/1000');

type Point = [number, number];
type Vector = [number, number];

const radToDeg = (radians: number) => (radians * 360) / (2 * Math.PI);

const normalizedAngle = (radians: number) =>
  radians < 0 ? radians + 2 * Math.PI : radians;

interface Agent {
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
    this.background = palette[0];
    palette = palette.slice(1);

    const BUFF = Math.min(width, height) * 0.1;
    const gap = 10;

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
    this.rng() * (max - min) + min;
  private sample = <T extends unknown>(rg: T[]): T =>
    rg[~~this.randRange(0, rg.length)];

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
      if (distSquared > nearestDistSquared) {
        nearestDistSquared = distSquared;
        nearest = other;
      }
    });

    return nearest;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { agents } = this;
    const VECTOR_MAG_MULT = 0;

    const drawPoint = (point: Point, radius: number) => {
      // ctx.fillRect(point[0], point[1], 1, 1);
      ctx.beginPath();
      ctx.arc(point[0], point[1], radius, 0, 2 * Math.PI);
      ctx.stroke();
    };

    const drawTriangle = (pv: Agent, radius: number) => {
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

    const drawDoublePoint = (pv: Agent, radius: number) => {
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

    const drawAgent = (pv: Agent) => {
      ctx.fillStyle = 'black';
      // drawDoublePoint(pv, 3);
      ctx.fillStyle = (pv.color ?? '#000000') + 'ff';
      ctx.strokeStyle = (pv.color ?? '#000000') + '66';
      // drawDoublePoint(pv, 2.5);

      // ctx.fillStyle = '#00000044';
      const point: Point = [pv.point[0] + 70, pv.point[1] + 70];
      ctx.strokeStyle = this.background;
      drawPoint(point, 4.5);
      ctx.strokeStyle = (pv.color ?? '#000000') + 'ff';
      drawPoint(point, 3);
      // drawTriangle(pv, 5);

      // ctx.strokeStyle = 'black';
      // drawTriangle(pv, 4);
      // ctx.fillStyle = '#00000044';
      // drawPoint(pv.point, 2);
    };

    ctx.strokeStyle = 'gray';
    agents.forEach(agent => drawAgent(agent));
  }
}
