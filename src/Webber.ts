import WebMWriter from 'webm-writer';

type WebMWriter = any;

export default class Giffer {
  encoder?: WebMWriter;
  enabled?: boolean;

  constructor() {
    this.encoder = undefined;
    this.enabled = true;
  }

  addFrame(ctx: CanvasRenderingContext2D) {
    if (!this.enabled) {
      return;
    }

    if (!this.encoder) {
      this.encoder = new WebMWriter({
        frameDuration: 20,
      });
    }
    this.encoder.addFrame(ctx.canvas);
  }

  async finish(open = true) {
    if (!this.enabled) {
      return;
    }
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
