import path from 'path';
import { execSync } from 'child_process';

/**
 * 替换git的远程推送源地址，这里暂定origin名称为固定的
 */
export const setGitSource = (dir: string, url: string) => {
  // 仓库所在文件地址
  const dirPath = path.join(process.cwd(), dir);
  // 先删除在执行
  const shellStr = `git remote set-url origin ${url}`;
  execSync(shellStr, { cwd: dirPath });
};

/**
 * 根据github的url返回对应的文件夹名称
 * https://github.com.cnpmjs.org/bosens-China/github-clone会返回github-clone
 *
 */
export const getDir = (url: string) => {
  const str = url;
  const dir = str.split('/').pop() || '';
  return dir.includes('.git') ? dir.slice(0, dir.indexOf('.git')) : dir;
};

/* 是否为支持的git clone拉取格式
 * https://github.com/bosens-China/breeze-cli
 * https://github.com/bosens-China/breeze-cli.git
 * git@github.com:bosens-China/breeze-cli.git
 */
export const isGithubLink = (url: string) => {
  const reg = /^(https:\/\/github\.com\/|git@github\.com:)[\s\S]+\/[\s\S]+(\.git)?$/;
  return !!reg.exec(url);
};

/**
 * 将当前的网站替换成镜像网站，例如
 * https://github.com/bosens-China/github-clone会被替换成
 * https://github.com.cnpmjs.org/bosens-China/github-clone
 */

export const replaceMirror = (currentWebsite: string, replaceWebsite: string) => {
  let s = currentWebsite;
  // 这里处理一下以git@开头的情况，如果git@开头，把用户名和仓库提取出来，用https的形式拉取
  // https://github.com/bosens-China/breeze-cli.git
  // git@github.com:bosens-China/breeze-cli.git
  if (s.startsWith('git@')) {
    const [, name, warehouse] = s.match(/^git@github\.com:([\s\S]+)\/([\s\S]+)\.git$/) || [];
    s = `https://github.com/${name}/${warehouse}.git`;
  }
  if (!s.endsWith('.git')) {
    s += '.git';
  }
  s = s.replace('github.com', replaceWebsite);
  return s;
};
