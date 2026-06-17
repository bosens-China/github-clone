#!/usr/bin/env node

import process from 'node:process';
import { Command } from 'commander';
import pc from 'picocolors';
import { ZodError } from 'zod';
import { version } from '../../package.json';
import { defaultConfigStore } from '../config/mirror-store';
import { runCloneCommand } from './commands/clone-command';
import {
  printMirror,
  resolveMirrorHostInput,
  runMirrorList,
  runMirrorSet,
  runMirrorTest,
  runMirrorUnset,
} from './commands/mirror-command';

function formatCliError(error: unknown): string {
  if (error instanceof ZodError) {
    return error.errors.map((item) => item.message).join('；');
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

const program = new Command();

program
  .name('g')
  .description('加速国内 GitHub clone：通过镜像拉取代码，完成后自动将 origin 恢复为 GitHub 官方地址')
  .version(version, '-v, --version', '输出版本号');

program
  .command('clone <url> [dir]')
  .description(
    '克隆 GitHub 仓库。若已通过 g mirror set 配置镜像，将经镜像加速下载；' +
      '克隆结束后将 origin 改回 github.com，便于后续 push。',
  )
  .option(
    '-b, --branch <name>',
    '只检出指定分支（传给 git clone --branch）。例如 -b dev 表示克隆 dev 分支的工作区',
  )
  .option(
    '--depth <n>',
    '浅克隆：只拉取最近 n 次提交（传给 git clone --depth）。' +
      '如 --depth 1 表示只要最新版本，体积更小、速度更快，但本地没有完整 git 历史',
    (value: string) => Number.parseInt(value, 10),
  )
  .option(
    '--single-branch',
    '只克隆单个分支，不下载其它远程分支（传给 git clone --single-branch）。' +
      '常与 -b 联用；单独使用时默认只拉远程默认分支（通常是 main）',
  )
  .option(
    '--no-mirror',
    '忽略 ~/.g.config 中的镜像配置，强制直连 github.com 克隆',
  )
  .option(
    '--verbose',
    '输出克隆前的详细信息：镜像/直连模式、实际 clone 地址、分支与 git 参数等（不改变 git 本身的输出）',
  )
  .addHelpText(
    'after',
    `
示例:
  $ g clone https://github.com/owner/repo
  $ g clone https://github.com/owner/repo my-dir -b dev
  $ g clone https://github.com/owner/repo -b main --single-branch --depth 1
  $ g clone https://github.com/owner/repo --no-mirror --verbose
`,
  )
  .action((url: string, dir: string | undefined, options) => {
    runCloneCommand(url, dir, options);
  });

const mirror = program
  .command('mirror')
  .description('管理 GitHub 镜像配置（保存在 ~/.g.config，值为镜像域名，如 kgithub.com）');

mirror
  .command('set <host>')
  .description('设置镜像域名，或传入预设名（kgithub / moeyy）。执行 g mirror list 查看预设')
  .action((host: string) => {
    runMirrorSet(resolveMirrorHostInput(host));
  });

mirror
  .command('get')
  .description('查看 ~/.g.config 中保存的镜像；未配置时 clone 将直连 GitHub')
  .action(() => {
    printMirror(defaultConfigStore.getMirrorHost());
  });

mirror
  .command('list')
  .alias('ls')
  .description('列出内置镜像预设及说明，并标注当前正在使用的镜像')
  .action(() => {
    runMirrorList();
  });

mirror
  .command('unset')
  .description('删除 ~/.g.config，清除镜像配置（clone 将直连 GitHub）')
  .action(() => {
    runMirrorUnset();
  });

mirror
  .command('test [host]')
  .description(
    '探测镜像是否可达：对镜像站发起 HTTP HEAD 请求。' +
      '省略 host 时测试当前配置；可传域名或预设名',
  )
  .action(async (host?: string) => {
    await runMirrorTest(host ? resolveMirrorHostInput(host) : undefined);
  });

void program.parseAsync(process.argv).catch((error: unknown) => {
  console.error(pc.red(`错误：${formatCliError(error)}`));
  process.exit(1);
});
