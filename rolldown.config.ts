import { defineConfig } from 'rolldown';

/** Node 内置模块，保持 external 由运行时解析 */
const nodeExternal = [/^node:/];

/** npm 依赖，不打进 bundle，由 node_modules 提供 */
const dependencyExternal = ['commander', 'execa', 'picocolors', 'zod'];

const external = [...nodeExternal, ...dependencyExternal];

export default defineConfig([
  {
    input: 'src/cli/index.ts',
    platform: 'node',
    external,
    output: {
      file: 'dist/main.js',
      format: 'cjs',
      sourcemap: true,
    },
  },
  {
    input: 'src/index.ts',
    platform: 'node',
    external,
    output: [
      {
        file: 'dist/gitClone.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'auto',
      },
      {
        file: 'dist/gitClone.esm.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
  },
]);
