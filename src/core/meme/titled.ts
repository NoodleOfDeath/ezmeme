import { Font, Title, TitleLike } from '@/core/components';
import { BaseMeme, Meme } from '@/core/meme/base';

export class TitledMeme extends BaseMeme {
  title?: Title<TitledMeme>;
  subtitle?: Title<TitledMeme>;
  padding?: number;

  set font(font: Font) {
    super.font = font;
    if (this.title) this.title.font = font;
    if (this.subtitle) this.subtitle.font = font;
  }

  constructor({ title, subtitle, padding = 0.05, ...other }: TitledMeme.ConstructorOptions<TitledMeme>) {
    super({ ...other });
    if (title) {
      this.title = typeof title === 'string' ? { text: title, ...other } : { ...other, ...title };
    }
    if (subtitle) {
      this.subtitle = typeof subtitle === 'string' ? { text: subtitle, ...other } : { ...other, ...subtitle };
    }
    this.padding = padding;
  }

  render(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      await super.render().catch(reject);
      if (this.title) {
        this.ctx.fillStyle = this.title.stroke ?? this.stroke;
        this.ctx.font = this.title.font ?? `${this.height / 10}px sans-serif`;
        this.ctx.textAlign = this.title.align ?? 'center';
        this.ctx.textBaseline = this.title.baseline ?? 'top';
        const x =
          this.ctx.textAlign === 'center'
            ? this.width / 2
            : this.ctx.textAlign === 'left'
            ? this.width * this.padding
            : this.width * (1 - this.padding);
        const y = this.height * this.padding;
        this.ctx.fillText(
          this.title.text instanceof Function ? this.title.text(this) : this.title.text,
          x + (this.title.xOffset ?? 0),
          y + (this.title.yOffset ?? 0),
          this.width * (1 - 2 * this.padding),
        );
      }
      if (this.subtitle) {
        this.ctx.fillStyle = this.subtitle.stroke ?? this.stroke;
        this.ctx.font = this.subtitle.font ?? `${this.height / 10}px sans-serif`;
        this.ctx.textAlign = this.subtitle.align ?? 'center';
        this.ctx.textBaseline = this.subtitle.baseline ?? 'top';
        let metrics = this.ctx.measureText(
          this.subtitle.text instanceof Function ? this.subtitle.text(this) : this.subtitle.text,
        );
        //let fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
        let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        const x =
          this.ctx.textAlign === 'center'
            ? this.width / 2
            : this.ctx.textAlign === 'left'
            ? this.width * this.padding
            : this.width * (1 - this.padding);
        const y = this.height * (1 - this.padding) - actualHeight;
        this.ctx.fillText(
          this.subtitle.text instanceof Function ? this.subtitle.text(this) : this.subtitle.text,
          x + (this.subtitle.xOffset ?? 0),
          y + (this.subtitle.yOffset ?? 0),
          this.width * (1 - 2 * this.padding),
        );
      }
      resolve();
    });
  }
}

export namespace TitledMeme {
  export type ConstructorOptions<T extends TitledMeme> = Meme.ConstructorOptions & {
    title?: TitleLike<T>;
    subtitle?: TitleLike<T>;
    padding?: number;
  };
}
