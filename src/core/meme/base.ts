import * as fs from 'fs';
import { Canvas, CanvasRenderingContext2D } from 'canvas';
import { Font } from '@/core/components';

export type Size = {
  width: number;
  height: number;
};

export type CanvasLike = {
  canvas: Canvas;
  ctx: CanvasRenderingContext2D;
};

export type BasicMemeAttributes = Size & {
  stroke: string;
  font: Font;
  lineSpacing: number;
  background: string;
};

export type Meme = BasicMemeAttributes & CanvasLike;

export namespace Meme {
  export type ConstructorOptions =
    | (Size & Partial<BasicMemeAttributes> & { canvas?: Canvas })
    | (Partial<Size> & Partial<BasicMemeAttributes> & { canvas: Canvas });
}

export class BaseMeme implements Meme {
  canvas: Canvas;

  get width(): number {
    return this.canvas.width;
  }

  get height(): number {
    return this.canvas.height;
  }

  stroke: string;

  _font: Font;
  get font(): Font {
    return this._font;
  }
  set font(font: Font) {
    this._font = font;
  }

  lineSpacing: number;
  background: string;

  get ctx(): CanvasRenderingContext2D {
    return this.canvas.getContext('2d');
  }

  constructor({
    canvas,
    width = canvas?.width,
    height = canvas?.height,
    stroke = '#ffffff',
    font,
    lineSpacing = 4,
    background = '#212121',
  }: Meme.ConstructorOptions) {
    this.canvas = canvas ?? new Canvas(width, height);
    this.stroke = stroke;
    this.font = font;
    this.lineSpacing = lineSpacing;
    this.background = background;
  }

  render(): Promise<void> {
    this.ctx.fillStyle = this.background;
    this.ctx.fillRect(0, 0, this.width, this.height);
    return Promise.resolve();
  }

  async write(file: string) {
    await this.render();
    const buffer = this.canvas.toBuffer('image/png');
    fs.writeFileSync(file, buffer);
  }
}
