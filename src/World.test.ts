import World from './World';

describe('World', () => {
  const dy = 2;

  describe('slightly above horizon on right', () => {
    test('moving down', () => {
      const width = 600;
      const height = 600;
      const world = new World(width, height);
      world.agents = [
        {
          id: 'a',
          point: [width / 2, height / 2],
          vector: [5, 0],
        },
        {
          id: 'b',
          point: [width / 2 + 50, height / 2 - dy],
          vector: [5, 5],
        },
      ];

      const result = world['updateSingle'](
        world.agents[1],
        world.agents[0].point,
      );
      // should be moving clockwise
      expect(Math.sign(result.vector[1])).toEqual(1);
    });

    test('moving up', () => {
      const width = 600;
      const height = 600;
      const world = new World(width, height);
      world.agents = [
        {
          id: 'a',
          point: [width / 2, height / 2],
          vector: [5, 0],
        },
        {
          id: 'b',
          point: [width / 2 + 50, height / 2 - dy],
          vector: [5, -5],
        },
      ];

      const result = world['updateSingle'](
        world.agents[1],
        world.agents[0].point,
      );
      // should be moving counter-clockwise
      expect(Math.sign(result.vector[1])).toEqual(-1);
    });
  });

  describe('slightly below horizon on right', () => {
    test('moving down', () => {
      const width = 600;
      const height = 600;
      const world = new World(width, height);
      world.agents = [
        {
          id: 'a',
          point: [width / 2, height / 2],
          vector: [5, 0],
        },
        {
          id: 'b',
          point: [width / 2 + 50, height / 2 + dy],
          vector: [5, 5],
        },
      ];

      const result = world['updateSingle'](
        world.agents[1],
        world.agents[0].point,
      );
      // should be moving clockwise
      expect(Math.sign(result.vector[1])).toEqual(1);
    });

    test('moving up', () => {
      const width = 600;
      const height = 600;
      const world = new World(width, height);
      world.agents = [
        {
          id: 'a',
          point: [width / 2, height / 2],
          vector: [5, 0],
        },
        {
          id: 'b',
          point: [width / 2 + 50, height / 2 + dy],
          vector: [5, -5],
        },
      ];

      const result = world['updateSingle'](
        world.agents[1],
        world.agents[0].point,
      );
      // should be moving counter-clockwise
      expect(Math.sign(result.vector[1])).toEqual(-1);
    });
  });
});
