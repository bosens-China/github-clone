import path from 'path';
import { cwd } from 'process';

const config = [
  {
    src: path.join(cwd(), './src/main.ts'),
    format: 'cjs',
    ignore: [path.join(cwd(), './src/gitClone.ts')],
  },
  {
    src: path.join(cwd(), './src/gitClone.ts'),
    format: 'cjs',
  },
  {
    src: path.join(cwd(), './src/gitClone.ts'),
    format: 'esm',
  },
];

export default config;
