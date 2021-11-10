import path from 'path';
import { cwd } from 'process';

// import typescript from 'rollup-plugin-typescript2';

const config = [
  {
    src: path.join(cwd(), './src/main.ts'),
    format: 'cjs',
    ignore: [path.join(cwd(), './src/gitClone.ts')],
    copy: ['./typings/gitClone.d.ts'],
  },
  {
    src: path.join(cwd(), './src/gitClone.ts'),
    format: 'cjs',
    // plugins: [
    //   typescript({
    //     // 覆盖默认配置，交给babel转译
    //     tsconfigOverride: {
    //       compilerOptions: {
    //         target: 'ESNext',
    //         module: 'ESNext',
    //         declaration: true,
    //       },
    //     },
    //   }),
    // ],
  },
  {
    src: path.join(cwd(), './src/gitClone.ts'),
    format: 'esm',
  },
];

export default config;
