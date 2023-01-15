import { ArgumentParser } from 'argparse';
import * as fs from 'fs';
import p from 'path';
import { rimrafSync } from 'rimraf';
import { CodingMeme } from '@/core';

const parser = new ArgumentParser();
const subparsers = parser.add_subparsers();

parser.set_defaults({ command: 'gen' });

const genSubparser = subparsers.add_parser('gen');

genSubparser.add_argument('type', { choices: ['meme'] });

const args = parser.parse_args();
console.log(args);

const src = './snippets/hello';
const dst = `./out/${p.basename(src)}`;

rimrafSync('./out');

async function main() {
  
  const files = fs.readdirSync(src);

  fs.mkdirSync(dst, { recursive: true });
  
  for (const file of files) {
  
    console.log('-----', file);
    const code = fs.readFileSync(`${src}/${file}`, 'utf-8');
    const ext = file.match(/\.(.+)$/)[1];
    
    const meme = new CodingMeme({
      width: 1200,
      title: { 
        text: (meme) => `${meme.langAlias.toUpperCase()}`,
        font: '80% Menlo',
      },
      padding: 0.1,
      code,
      language: ext,
    });
    
    await meme
      .write(`${dst}/${file}.png`)
      .catch(console.error);
  
  }

}

main();