import * as fs from 'fs';
import { Canvas, CanvasRenderingContext2D } from 'canvas';
import { Font } from '@/core/components';

export type Size = {
  width: number;
  height: number;
};

export type RangedSize = {
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
}

export type ContextStyles = {
  stroke: string;
  font: Font;
  lineSpacing: number;
  background: string;
}

export type BasicMemeAttributes = Size & RangedSize & ContextStyles;

export type CanvasDelegate = {
  canvas: Canvas;
};

export type Meme = BasicMemeAttributes & CanvasDelegate;

export namespace Meme {
  export type ConstructorOptions =
    | (Size & Partial<BasicMemeAttributes> & Partial<CanvasDelegate>)
    | (Partial<Size> & Partial<BasicMemeAttributes> & CanvasDelegate);
}

export class BaseMeme implements Meme {
  canvas: Canvas;

  get width(): number {
    return this.canvas.width;
  }

  get height(): number {
    return this.canvas.height;
  }
  
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;

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
    minWidth = width,
    minHeight = height,
    maxWidth = width,
    maxHeight = height,
    stroke = '#ffffff',
    font,
    lineSpacing = 4,
    background = '#000000',
  }: Meme.ConstructorOptions) {
    this.canvas = canvas ?? new Canvas(width, height);
    this.minWidth = minWidth;
    this.minHeight = minHeight;
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
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
