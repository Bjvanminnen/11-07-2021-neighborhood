import GIFEncoder from 'gif-encoder-2';

type GIFEncoder = any;

export default class Giffer {
  encoder?: GIFEncoder;

  constructor(private readonly delay = 0) {
    this.encoder = undefined;
  }

  addFrame(ctx: CanvasRenderingContext2D) {
    if (!this.encoder) {
      const { width, height } = ctx.canvas;
      this.encoder = new GIFEncoder(width, height, 'octree', true);
      this.encoder.start();
      // this.encoder.setDelay(this.delay);
      this.encoder.setFrameRate(60);
    }
    this.encoder.addFrame(ctx);
  }

  finish(open = true) {
    const { encoder } = this;
    if (!encoder) {
      throw new Error('no encoder');
    }
    encoder.finish();
    const buffer = encoder.out.getData();
    const blob = new Blob([buffer.buffer], { type: 'image/gif' });
    const obj = URL.createObjectURL(blob);
    if (open) {
      window.open(obj);
    }
    return obj;
  }
}
