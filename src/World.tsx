const palettes = require('nice-color-palettes/1000');

type Point = [number, number];
type Vector = [number, number];

const radToDeg = (radians: number) => (radians * 360) / (2 * Math.PI);

const randRange = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

const normalizedAngle = (radians: number) =>
  radians < 0 ? radians + 2 * Math.PI : radians;

interface PointVector {
  id?: string;
  iter?: number;
  point: Point;
  vector: Vector;
  color?: string;
}

export default class World {
  agents: PointVector[];
  constructor(width: number, height: number) {
    const palette = [
      // ...palettes[4],
      // ...palettes[5],
      ...palettes[6],
      ...palettes[7],
    ];

    const BUFF = 300;
    const centerX = width / 2;
    const centerY = height / 2;

    const mag = 2;
    this.agents = [];
    // this.agents = [
    //   {
    //     id: 'a',
    //     point: [centerX, centerY],
    //     vector: [randRange(-mag, mag), randRange(-mag, mag)],
    //     color: 'red',
    //   },
    //   {
    //     id: 'c',
    //     point: [centerX - 20, centerY],
    //     vector: [randRange(-mag, mag), randRange(-mag, mag)],
    //     color: 'green',
    //   },
    //   {
    //     id: 'b',
    //     point: [centerX + 100, centerY],
    //     vector: [randRange(-mag, mag), randRange(-mag, mag)],
    //     color: 'blue',
    //   },
    // ];
    for (let x = centerX - BUFF; x <= centerX + BUFF; x += 50) {
      for (let y = centerY - BUFF; y <= centerY + BUFF; y += 50) {
        this.agents.push({
          id: [x, y].join(','),
          point: [x, y],
          vector: [randRange(-1, 1), randRange(-1, 1)],
          color: palette[~~randRange(0, palette.length)],
        });
      }
    }
    // for (let i = 0; i < 6; i++) {
    //   const dx = randRange(-BUFF, BUFF);
    //   const dy = randRange(-BUFF, BUFF);
    //
    //   this.agents.push({
    //     id: i.toString(),
    //     point: [centerX + dx, centerY + dy],
    //     // vector: [randRange(-5, 5), randRange(-5, 5)],
    //     vector: [-dx / 20, -dy / 20],
    //     color: palette[i % palette.length],
    //   });
    // }
  }

  private updateSingle(current: PointVector, anchor: Point): PointVector {
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

    const output: PointVector[] = [];
    for (let i = 0; i < agents.length; i++) {
      const next = this.updateSingle(
        agents[i],
        this.findNearest(agents, agents[i]).point,
      );
      output.push(next);
    }

    this.agents = output;
  }

  private findNearest(
    agents: PointVector[],
    current: PointVector,
  ): PointVector {
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
    const CIRCLE_RADIUS = 1;
    const VECTOR_MAG_MULT = 0;

    const drawPoint = (point: Point, radius: number) => {
      // ctx.beginPath();
      // ctx.arc(point[0], point[1], radius, 0, 2 * Math.PI);
      // ctx.fill();
      ctx.fillRect(point[0], point[1], 1, 1);
    };

    const drawPointVector = (pv: PointVector) => {
      ctx.fillStyle = (pv.color ?? '#000000') + 'FF';
      // ctx.fillStyle = '#00000044';
      drawPoint(pv.point, CIRCLE_RADIUS);

      if (VECTOR_MAG_MULT) {
        ctx.beginPath();
        ctx.moveTo(...pv.point);
        ctx.lineTo(
          pv.point[0] + pv.vector[0] * VECTOR_MAG_MULT,
          pv.point[1] + pv.vector[1] * VECTOR_MAG_MULT,
        );
        ctx.stroke();
      }
    };

    ctx.strokeStyle = 'gray';
    agents.forEach(agent => drawPointVector(agent));
  }
}
