#!/usr/bin/env node

import { Command } from 'commander';
import { version } from '../package.json';
import { getAddress, setAddress, DEFAULTPATH } from './config';
import GitClone from './gitClone';
import { setGitSource, getDir, replaceMirror } from './utils';

const program = new Command();
program.version(version, '-v, --version', '输出当前版本号');
// git clone 支持多个命令，但是这里只让他支持-b也就是拉取指定分支，非必填
program
  .command('clone <url> [warehouse]')
  .description('根据url拉取指定仓库')
  .option('-b, --branch <value>', '拉取指定分支')
  .action((url, dirName, { branch } = {}) => {
    try {
      // 开始拉取
      GitClone(url, { dirName, branch, mirrorAddress: getAddress() });
      // 拉取成功之后，进入拉取目录修改推送源地址
      const directory = dirName || getDir(getAddress() ? replaceMirror(url, getAddress()) : url);
      setGitSource(directory, url);
    } catch (e) {
      console.error(`${e instanceof Error ? e.message : e}`);
    }
  });

program
  .command('set [path]')
  .description(`修改github的镜像仓库地址,<path>可选，如果省略，默认为: ${DEFAULTPATH}`)
  .action((pathUrl = DEFAULTPATH) => {
    try {
      setAddress(pathUrl);
      console.log(`set ${pathUrl}成功`);
    } catch {
      console.error(`set path error`);
    }
  });
program
  .command('get [path]')
  .description(`读取当前的默认镜像地址`)
  .action(() => {
    const path = getAddress();
    console.log(`当前镜像地址为：${path}`);
  });
program.parse(process.argv);
