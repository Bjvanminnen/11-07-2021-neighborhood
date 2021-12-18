import WebMWriter from 'webm-writer';

type WebMWriter = any;

export default class Giffer {
  encoder?: WebMWriter;

  constructor() {
    this.encoder = undefined;
  }

  addFrame(ctx: CanvasRenderingContext2D) {
    if (!this.encoder) {
      this.encoder = new WebMWriter({
        frameDuration: 20,
      });
    }
    this.encoder.addFrame(ctx.canvas);
  }

  async finish(open = true) {
    const { encoder } = this;
    if (!encoder) {
      throw new Error('no encoder');
    }
    const blob = await encoder.complete();
    console.log(blob);
    const obj = URL.createObjectURL(blob);
    if (open) {
      window.open(obj);
    }
    return obj;
  }
}
