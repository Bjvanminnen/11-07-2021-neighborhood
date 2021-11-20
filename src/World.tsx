const colors = ['black', 'white'];

type Type = number;

// n states means n! preference lists
// for example if n is 3
// [0] 012
// [1] 021
// [2] 102
// [3] 120
// [4] 201
// [5] 210
// Goal is to make sure we have unique preference lists across types

type Scorer = { [type: number]: number };
const generateScorer = (plist: number[]): Scorer => {
  if (plist[0] === 0) {
    return {
      0: 1,
      1: 0,
    };
  } else {
    return {
      0: 0,
      1: 1,
    };
  }
  // const reversed = [...plist].reverse();
  // const result = {};
  // for (let i = 0; i < reversed.length; i++) {
  //   result[reversed[i]] = i / reversed.length;
  // }
  // return result;
};

const PreferenceLists: { [type: number]: Scorer } = {
  0: generateScorer([0, 1]),
  1: generateScorer([1, 0]),
};

export default class World {
  private grid: Uint8Array;

  constructor(
    public readonly size: number,
    public readonly numStates: number,
    private rng = Math.random,
  ) {
    this.grid = new Uint8Array(size * size);

    this.init();
  }

  private init() {
    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i] = ~~(this.rng() * this.numStates);
    }
  }

  private index(row: number, col: number) {
    row = (row + this.size) % this.size;
    col = (col + this.size) % this.size;
    return row * this.size + col;
  }

  private gridVal(row: number, col: number): Type {
    return this.grid[this.index(row, col)];
  }

  public score(row: number, col: number) {
    const type = this.gridVal(row, col);
    return this.potentialScore(row, col, type);
  }

  private potentialScore(row: number, col: number, type: Type) {
    const scorer = PreferenceLists[type];

    const north = this.gridVal(row - 1, col);
    const east = this.gridVal(row, col + 1);
    const south = this.gridVal(row + 1, col);
    const west = this.gridVal(row, col - 1);

    return scorer[north] + scorer[east] + scorer[south] + scorer[west];
  }

  public draw(ctx: CanvasRenderingContext2D) {
    const { width, height } = ctx.canvas;

    const cellSize = Math.min(width, height) / this.size;

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const type = this.gridVal(row, col);
        const color = colors[type];
        ctx.fillStyle = color;
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  }
}
