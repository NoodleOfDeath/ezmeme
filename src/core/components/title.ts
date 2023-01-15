import { Component } from '@/core/components/base';
import { Meme } from '@/core/meme';

export type DOMUnit = '%' | 'em' | 'pt' | 'px' | 'rem';
export type DOMMetric = `${number}${DOMUnit}`;

export type FontStyle = 'bold' | 'italic' | 'normal';

export type Font = `${DOMMetric} ${string}` | `${FontStyle} ${DOMMetric} ${string}`;

export type Title<T extends Meme> = Component & {
  text: string | ((meme: T) => string);
  stroke?: string;
  font?: Font;
  align?: CanvasTextAlign;
  baseline?: CanvasTextBaseline;
};

export type TitleLike<T extends Meme> = string | Title<T>;
