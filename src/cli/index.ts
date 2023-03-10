import { ArgumentParser } from 'argparse';
import * as fs from 'fs';
import p from 'path';
import { rimrafSync } from 'rimraf';

import { CodingMeme } from '@/core';
import { TitleLike } from '@/core/components/title';

const SRC_ROOT = './code';
const IGNORE = [
  'class',
]

const parser = new ArgumentParser();
const subparsers = parser.add_subparsers();

function addChoices(parser: ArgumentParser, type: string) {
  const SRC = p.join(SRC_ROOT, type);
  const choices = fs.readdirSync(SRC).map((c) => p.basename(c));
  parser.set_defaults({ type });
  parser.add_argument('group', {
    nargs: '*',
    default: choices,
  });
}

const witoSubparser = subparsers.add_parser('wito');
addChoices(witoSubparser, 'wito');

const fteSubparser = subparsers.add_parser('fte');
addChoices(fteSubparser, 'fte');

const snippetSubparser = subparsers.add_parser('snippets', { aliases: ['snip'] });
addChoices(snippetSubparser, 'snippets');

const args = parser.parse_args();

type MemeType<T = any> = {
  parser: any;
  title?: TitleLike<CodingMeme>;
  subtitle?: TitleLike<CodingMeme>;
  background?: string;
  props?: T;
};

const TYPES: Record<string, MemeType> = {
  wito: {
    parser: witoSubparser,
    title: {
      text: (meme) => `what is the output?`,
      font: '80% dm mono',
    },
    subtitle: {
      text: (meme) => `WITO\nLVL1\n${meme.alias.toUpperCase()}`,
      align: 'right',
      font: 'normal 40px dm mono',
    },
    background: '#212121',
  },
  fte: {
    parser: fteSubparser,
    title: {
      text: (meme) => `find the errors\n(hint: there are ${meme.props.count})`,
      font: '70% dm mono',
    },
    subtitle: {
      text: (meme) => `FTE\nLVL1\n${meme.alias.toUpperCase()}`,
      align: 'right',
      font: 'normal 40px dm mono',
    },
    background: '#111144',
    props: { count: 3 },
  },
  snippets: {
    parser: snippetSubparser,
    title: {
      text: (meme) => {
        return `${meme.alias.toUpperCase()}`
      },
      font: 'normal 60px dm mono',
    },
    background: '#441111',
  },
};

const TYPE = TYPES[args.type];

const groups = args.group && args.group.length > 0 ? args.group : TYPE.parser.choices;

async function main() {
  for (const group of groups) {
    const src = p.join(SRC_ROOT, args.type, group);
    const dst = p.join('./out', args.type, group);

    if (fs.existsSync(dst)) rimrafSync(dst);

    const files = fs.readdirSync(src);

    fs.mkdirSync(dst, { recursive: true });

    for (const file of files) {
      const [_, language] = file.match(/\.(.+)$/);
      
      if (IGNORE.includes(language)) {
        console.log(`Skipping ${file}`);
        continue;
      }
      const code = fs.readFileSync(p.join(src, file), 'utf-8');

      const meme = new CodingMeme({
        width: 1200,
        height: 1200,
        title: TYPE.title,
        subtitle: TYPE.subtitle,
        padding: 0.075,
        code,
        language,
        background: TYPE.background,
        props: TYPE.props,
      });

      console.log('-----', file);
      console.log(meme.alias);

      await meme.write(p.join(dst, `${file}.png`)).catch(console.error);
    }
  }
}

main();
