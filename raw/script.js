let seed = 123;
function random() {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
}

const randRange = (min, max) => random() * (max - min) + min;

const normalizedAngle = radians =>
  radians < 0 ? radians + 2 * Math.PI : radians;

function initialize(width, height) {
  const palette = [
    '613F75',
    'c1ff9b',
    '266dd3',
    '00c2d1',
    'f9e900',
    'ff6542',
    'ed33b9',
  ].map(x => '#' + x);

  const BUFF = Math.min(width, height) * 0.3;
  const centerX = width / 2;
  const centerY = height / 2;

  const agents = [];
  const gap = 20;

  for (let x = centerX - BUFF; x <= centerX + BUFF; x += gap) {
    for (let y = centerY - BUFF; y <= centerY + BUFF; y += gap) {
      agents.push({
        id: [x, y].join(','),
        point: [x, y],
        vector: [randRange(-1, 1), randRange(-1, 1)],
        color: palette[~~randRange(0, palette.length)],
      });
    }
  }
  return agents;
}

function draw(ctx, agents) {
  const CIRCLE_RADIUS = 1;

  const drawPoint = (point, radius) => {
    ctx.fillRect(point[0], point[1], 1, 1);
  };

  const drawPointVector = pv => {
    ctx.fillStyle = pv.color;
    drawPoint(pv.point, CIRCLE_RADIUS);
  };

  const { width, height } = ctx.canvas;
  ctx.fillStyle = '#00000005';
  ctx.fillRect(0, 0, width, height);

  agents.forEach(agent => drawPointVector(agent));
}

function findNearest(agents, current) {
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

function updateSingle(current, anchor) {
  // the x and y of the line from anchor to point
  const dx = current.point[0] - anchor[0];
  const dy = current.point[1] - anchor[1];
  const radius = Math.sqrt(dx ** 2 + dy ** 2);

  const magnitude = Math.sqrt(current.vector[0] ** 2 + current.vector[1] ** 2);

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

  const nextPoint = [
    anchor[0] + Math.cos(nextAngle) * radius,
    anchor[1] + Math.sin(nextAngle) * radius,
  ];

  const nextVector = [
    Math.cos(nextAngle + (Math.PI / 2) * sign) * magnitude,
    Math.sin(nextAngle + (Math.PI / 2) * sign) * magnitude,
  ];

  return {
    ...current,
    point: nextPoint,
    vector: nextVector,
  };
}

function update(agents) {
  const output = [];
  for (let i = 0; i < agents.length; i++) {
    const next = updateSingle(agents[i], findNearest(agents, agents[i]).point);
    output.push(next);
  }

  return output;
}

function main() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const { width, height } = canvas;
  let agents = initialize(width, height);

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  setInterval(() => {
    agents = update(agents);
    draw(ctx, agents);
  }, 40);
}

main();
