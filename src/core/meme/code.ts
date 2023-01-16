import { Font } from '@/core/components';
import { SquareMeme } from '@/core/meme/square';
import { DOMMetric } from '@/core/components/title';
import hljs from 'highlight.js';

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
  number: {
    fillStyle: '#aaaaff',
  },
  params: {
    fillStyle: '#aaaaff',
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

export class CodingMeme extends SquareMeme {
  code: string;
  language: string;
  alias: string;

  constructor({ code = '', language, alias, ...other }: CodingMeme.ConstructorOptions) {
    super(other);
    this.code = code;
    this.language = MIME_TYPES[language] || language;
    this.alias = alias ? 
      (MIME_TYPE_ALIASES[alias] || MIME_TYPES[alias] || alias) : 
      (MIME_TYPE_ALIASES[language] || MIME_TYPES[language] || language);
  }

  render(): Promise<void> {
    const expr = /(?:<span class="hljs-(.+?)">)|(<\/span>)|(.*?)(?=<\/?span|\Z|$)/gi;
    return new Promise(async (resolve, reject) => {
      await super.render().catch(reject);
      let longest = 0;
      this.code.split('\n').forEach((line, i) => {
        if (line.length > longest) {
          longest = line.length;
        }
      });
      longest += 4;
      const lines = removeHTMLChars(hljs.highlight(this.code, { language: this.language }).value).split('\n');
      const charSize = Math.min(50, Math.floor((this.width * (1 - 2 * this.padding)) / (longest * 0.6)));
      const fontSize: DOMMetric = `${charSize}px`;
      const font = 'menlo';
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
        let xOffset = this.width * this.padding;
        const yOffset = this.height * this.padding + 200 + i * (charSize + this.lineSpacing);
        this.ctx.fillStyle = this.stroke;
        this.ctx.font = defaultFont;
        this.ctx.fillText(lineNumber, xOffset, yOffset);
        xOffset += this.ctx.measureText(lineNumber).width;
        if (!matches) return;
        for (const match of matches) {
          const [_, type, closingTag, value] = match;
          if (type) {
            const tokenStyle = TOKEN_STYLES[type ?? ''];
            if (!tokenStyle) {
              console.log(type);
            }
            styleStack.push(tokenStyle ?? defaultStyle);
          } else
          if (closingTag) {
            styleStack.pop();
          } else
          if (value) {
            const currentStyle = styleStack.length > 0 ? styleStack[styleStack.length - 1] : defaultStyle;
            if (currentStyle.fillStyle)
              this.ctx.fillStyle = currentStyle.fillStyle;
            if (currentStyle.font instanceof Function) {
              this.ctx.font = currentStyle.font(fontSize, font);
            } else {
              this.ctx.font = currentStyle.font;
            }
            this.ctx.fillText(value, xOffset, yOffset);
            xOffset += this.ctx.measureText(value).width;
          }
        }
      });
      resolve();
    });
  }
}

export namespace CodingMeme {
  export type ConstructorOptions = SquareMeme.ConstructorOptions<CodingMeme> & {
    code?: string;
    language?: string;
    alias?: string;
  };
}
