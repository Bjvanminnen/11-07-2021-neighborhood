type Point = [number, number];
type Vector = [number, number];

interface PointVector {
  point: Point;
  vector: Vector;
}

export default class World {
  agents: PointVector[];
  constructor(width: number, height: number) {
    this.agents = [
      {
        point: [125, 125],
        vector: [5, -3],
      },
      {
        point: [100, 100],
        vector: [1, 1],
      },
    ];
  }

  private updateSingle(current: PointVector, anchor: Point): PointVector {
    const dx = current.point[0] - anchor[0];
    const dy = current.point[1] - anchor[1];
    const radius = Math.sqrt(dx ** 2 + dy ** 2);

    const magnitude = Math.sqrt(
      current.vector[0] ** 2 + current.vector[1] ** 2,
    );

    const radians = magnitude / radius;
    const angle = Math.atan2(dy, dx);

    const vectorAngle = Math.atan2(
      current.point[1] + current.vector[1] - anchor[1],
      current.point[0] + current.vector[0] - anchor[0],
    );
    const sign = vectorAngle > angle ? 1 : -1;

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
        agents[(i + 1) % agents.length].point,
      );
      output.push(next);
    }

    this.agents = output;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { agents } = this;
    const CIRCLE_RADIUS = 1;
    const VECTOR_MAG_MULT = 0;

    const drawPoint = (point: Point, radius: number) => {
      ctx.beginPath();
      ctx.arc(point[0], point[1], radius, 0, 2 * Math.PI);
      ctx.fill();
    };

    const drawPointVector = (pv: PointVector) => {
      drawPoint(pv.point, CIRCLE_RADIUS);
      ctx.beginPath();
      ctx.moveTo(...pv.point);
      ctx.lineTo(
        pv.point[0] + pv.vector[0] * VECTOR_MAG_MULT,
        pv.point[1] + pv.vector[1] * VECTOR_MAG_MULT,
      );
      ctx.stroke();
    };

    agents.forEach(agent => drawPointVector(agent));
  }
}
