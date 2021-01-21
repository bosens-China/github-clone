#!/usr/bin/env node

import { Command } from 'commander';
import { version } from '../package.json';
import { isGithubLink, error, existenceGit, cloneGie, githubReplace, gitDir, setGitSource } from './utils';
import { getConfig, DEFAULTPATH, setConfig } from './config';
import { Iconfig } from '../typings/typings';

const program = new Command();
program.version(version, '-v, --version', '输出当前版本号');
// git clone 支持多个命令，但是这里只让他支持-b也就是拉取指定分支，非必填
program
  .command('clone <url> [warehouse]')
  .description('根据url拉取指定仓库')
  .option('-b, --branch <value>', '拉取指定分支')
  .action(async (url, warehouse, { branch } = {}) => {
    if (!isGithubLink(url)) {
      return error(`${url} 不是一个有效的链接，目前只支持github的shh和https仓库链接!`);
    }
    if (!(await existenceGit())) {
      return error(`git不存在，请安装git之后在进行操作: https://git-scm.com/`);
    }
    // 读取配置文件
    const config = await getConfig<Iconfig>();
    const replaceStr = githubReplace(url, config.path);
    // 拉取
    const str = `git clone ${replaceStr}${warehouse ? ` ${warehouse}` : ''}${branch ? ` --branch ${branch}` : ''}`;
    try {
      await cloneGie(str);
    } catch (e) {
      return error();
    }
    // 拉取成功之后，进入拉取目录修改推送源地址，结束
    const dir = warehouse || gitDir(replaceStr);
    await setGitSource(dir, url);
    process.exit(0);
  });

program
  .command('set [path]')
  .description(`修改github的镜像仓库地址,<path>可选，如果省略，默认为: ${DEFAULTPATH}`)
  .action(async (pathUrl = DEFAULTPATH) => {
    try {
      await setConfig<Iconfig>({ path: pathUrl });
      process.exit(0);
    } catch (e) {
      error('set path失败');
    }
  });
program
  .command('get [path]')
  .description(`读取当前的默认镜像地址`)
  .action(async () => {
    const config = await getConfig<Iconfig>();
    console.log(`当前镜像地址为：${config.path}`);
    process.exit(0);
  });
program.parse(process.argv);
