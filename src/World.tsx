type Point = [number, number];
type Vector = [number, number];

const radToDeg = (radians: number) => (radians * 360) / (2 * Math.PI);

const normalizedAngle = (radians: number) =>
  radians < 0 ? radians + 2 * Math.PI : radians;

interface PointVector {
  id?: string;
  iter?: number;
  point: Point;
  vector: Vector;
}

export default class World {
  agents: PointVector[];
  constructor(width: number, height: number) {
    this.agents = [
      {
        id: 'a',
        point: [width / 2, height / 2],
        vector: [5, 0],
      },
      {
        id: 'b',
        point: [width / 2 + 50, height / 2],
        vector: [5, 5],
      },

      // {
      //   id: 'c',
      //   point: [225 + offset, 105 + offset],
      //   vector: [3, 1],
      // },
    ];
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

    if (current.id === 'a' && sign === -1) {
      // console.log(sign);
      // console.log(anchor);
      // console.log(current.point);
      // console.log(current.vector);
      console.log(dx, dy);
      console.log(
        current.point[0] + current.vector[0] - anchor[0],
        current.point[1] + current.vector[1] - anchor[1],
      );
      console.log(radToDeg(angle), radToDeg(vectorAngle));
      console.log(radToDeg(normAngle), radToDeg(normVector));
      console.log(current);
    }

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
      id: current.id,
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

    return nearest;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { agents } = this;
    const CIRCLE_RADIUS = 1;
    const VECTOR_MAG_MULT = 5;

    const drawPoint = (point: Point, radius: number) => {
      ctx.beginPath();
      ctx.arc(point[0], point[1], radius, 0, 2 * Math.PI);
      ctx.fill();
    };

    const drawPointVector = (pv: PointVector) => {
      ctx.fillStyle = pv.id === 'a' ? 'red' : 'black';
      drawPoint(pv.point, CIRCLE_RADIUS);

      if (pv.id === 'a' && pv.iter === 14) {
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
