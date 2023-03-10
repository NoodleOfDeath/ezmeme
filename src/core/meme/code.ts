import hljs from 'highlight.js';
import { registerFont } from 'canvas';
import { Font } from '@/core/components';
import { TitledMeme } from '@/core/meme/titled';
import { DOMMetric } from '@/core/components/title';

registerFont('DMMono-Regular.ttf', { family: 'DM Mono' });

function removeHTMLChars(str: string): string {
  const HTML_CHAR_MAP = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&apos;': "'",
    '&#x27;': "'",
  };
  return str.replace(new RegExp(Object.keys(HTML_CHAR_MAP).join('|'), 'g'), (matched) => HTML_CHAR_MAP[matched]);
}

const MIME_TYPES: Record<string, string> = {
  bf: 'brainfuck',
  cpp: 'cpp',
  h: 'c',
  hpp: 'cpp',
  hs: 'haskell',
  f90: 'fortran',
  jl: 'julia',
  js: 'javascript',
  kt: 'kotlin',
  m: 'c',
  nb: 'mathematica',
  mlx: 'matlab',
  pl: 'perl',
  py: 'python',
  rb: 'ruby',
  rs: 'rust',
  sh: 'bash',
  tex: 'latex',
  ts: 'typescript',
  'objc.m': 'objc',
  'ui.swift': 'swift',
};

const MIME_TYPE_ALIASES: Record<string, string> = {
  nb: 'wolfram/mathematica',
  ts: 'javascript/typescript',
  'objc.m': 'objective-c',
  'ui.swift': 'swift-ui',
};

type TokenStyle = {
  fillStyle?: string;
  font?: Font | ((fontSize: DOMMetric, name: string) => Font);
};

const TOKEN_STYLES: Record<string, TokenStyle> = {
  built_in: {
    fillStyle: 'lime',
  },
  class: {
    fillStyle: 'cyan',
  },
  comment: {
    fillStyle: '#999',
    font: (fontSize, font) => `italic ${fontSize} ${font}`,
  },
  doctag: {
    fillStyle: '#cc88cc',
  },
  function: {
    fillStyle: 'yellow',
  },
  keyword: {
    fillStyle: '#ff8888',
  },
  literal: {
    fillStyle: '#0086b3',
  },
  meta: {
    fillStyle: '#bbbbbb',
  },
  name: {
    fillStyle: '#ff8888',
  },
  number: {
    fillStyle: '#aaaaff',
  },
  operator: {
    font: (fontSize, font) => `bold ${fontSize} ${font}`,
  },
  params: {
    fillStyle: '#aaaaff',
  },
  punctuation: {
    font: (fontSize, font) => `bold ${fontSize} ${font}`,
  },
  string: {
    fillStyle: '#88ff88',
  },
  subst: {
    fillStyle: '#88ff88',
  },
  title: {
    fillStyle: 'yellow',
  },
  'title class_': {
    fillStyle: 'cyan',
  },
  'title function_': {
    fillStyle: 'yellow',
  },
  'title function_ invoke__': {
    fillStyle: 'yellow',
  },
  type: {
    fillStyle: 'cyan',
  },
  variable: {
    fillStyle: '#8888ff',
  },
  'variable language_': {
    fillStyle: '#777777',
  },
};

export class CodingMeme<T = any> extends TitledMeme {
  code: string;
  language: string;
  alias: string;
  wrapText: boolean;
  wrapColumn: number;
  hangingIndent: number;

  props?: T;

  constructor({
    code = '',
    language,
    alias,
    wrapText = true,
    wrapColumn = 48,
    hangingIndent = 2,
    props,
    ...other
  }: CodingMeme.ConstructorOptions) {
    super(other);
    this.code = code.replace(/\n+$/, '');
    this.language = MIME_TYPES[language] || language;
    this.alias = alias
      ? MIME_TYPE_ALIASES[alias] || MIME_TYPES[alias] || alias
      : MIME_TYPE_ALIASES[language] || MIME_TYPES[language] || language;
    this.wrapText = wrapText;
    this.wrapColumn = wrapColumn;
    this.hangingIndent = hangingIndent;
    this.props = props;
  }

  render(): Promise<void> {
    const expr = /(?:<span class="hljs-(.+?)">)|(<\/span>)|(.*?)(?=<\/?span|\Z|$)/gi;
    return new Promise(async (resolve, reject) => {
      await super.render().catch(reject);
      let longest = 0;
      this.code.split('\n').forEach((line) => {
        if (line.length > longest) longest = line.length;
      });
      longest = Math.min(longest, this.wrapText ? this.wrapColumn : longest);
      const lines = removeHTMLChars(hljs.highlight(this.code, { language: this.language }).value).split('\n');
      let yOffset = this.height * this.padding + 120;
      const xCharSize = Math.floor((this.width * (1 - 2 * this.padding)) / ((longest + 4) * 0.6));
      const yCharSize = Math.floor((this.height - yOffset) / (lines.length * 1.5));
      const charSize = Math.min(xCharSize, yCharSize);
      const initialXOffset = Math.max(
        this.width * this.padding,
        (this.width / 2) - ((charSize * 0.6 * (this.wrapColumn + Math.floor(Math.log10(lines.length)) + 1) / 2))
        );
      const fontSize: DOMMetric = `${charSize}px`;
      const font = 'DM Mono';
      const defaultFont: Font = `normal ${fontSize} ${font}`;
      const defaultStyle: TokenStyle = {
        fillStyle: this.stroke,
        font: defaultFont,
      };
      const styleStack: TokenStyle[] = [];
      this.ctx.textAlign = 'left';
      lines.forEach((line, i) => {
        const matches = line.matchAll(expr);
        const lineNumber = `${i + 1}| `.padStart(4, ' ');
        let xCount = 0;
        let xOffset = initialXOffset;
        this.ctx.fillStyle = this.stroke;
        this.ctx.font = defaultFont;
        this.ctx.fillText(lineNumber, xOffset, yOffset);
        xOffset += this.ctx.measureText(lineNumber).width;
        if (!matches) return;
        for (const match of matches) {
          let [_, type, closingTag, value] = match;
          if (type) {
            const tokenStyle = TOKEN_STYLES[type ?? ''];
            if (!tokenStyle) {
              console.log(type);
            }
            styleStack.push(tokenStyle ?? defaultStyle);
          } else if (closingTag) {
            styleStack.pop();
          } else if (value) {
            if (xCount + value.trim().length > longest) {
              const [indent] = line.match(/^\s*/);
              xOffset = initialXOffset;
              yOffset += charSize + this.lineSpacing;
              const hangingLineNumber = `| `.padStart(4, ' ') + ''.padStart(indent.length + this.hangingIndent, ' ');
              this.ctx.fillStyle = this.stroke;
              this.ctx.font = defaultFont;
              this.ctx.fillText(hangingLineNumber, xOffset, yOffset);
              xCount = indent.length + this.hangingIndent;
              xOffset += this.ctx.measureText(hangingLineNumber).width;
              value = value.trimStart();
            }
            const currentStyle = styleStack.length > 0 ? styleStack[styleStack.length - 1] : defaultStyle;
            if (currentStyle.fillStyle) this.ctx.fillStyle = currentStyle.fillStyle;
            if (currentStyle.font instanceof Function) {
              this.ctx.font = currentStyle.font(fontSize, font);
            } else {
              this.ctx.font = currentStyle.font;
            }
            this.ctx.fillText(value, xOffset, yOffset);
            xOffset += this.ctx.measureText(value).width;
            xCount += value.length;
          }
        }
        yOffset += charSize + this.lineSpacing;
      });
      resolve();
    });
  }
}

export namespace CodingMeme {
  export type ConstructorOptions<T = any> = TitledMeme.ConstructorOptions<CodingMeme<T>> & {
    code?: string;
    language?: string;
    alias?: string;
    wrapText?: boolean;
    wrapColumn?: number;
    hangingIndent?: number;
    props?: T;
  };
}
