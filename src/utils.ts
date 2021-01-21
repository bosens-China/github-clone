import { exec, ProcessEnvOptions, spawn } from 'child_process';
import path from 'path';

export function isGithubLink(url: string) {
  /*
https://github.com/bosens-China/breeze-cli
https://github.com/bosens-China/breeze-cli.git
git@github.com:bosens-China/breeze-cli.git
^、.、[、$、(、)、|、*、+、?、{、\
*/
  const reg = /^(https:\/\/github\.com\/|git@github\.com:)[\s\S]+\/[\s\S]+(\.git)?$/;
  return !!reg.exec(url);
}

export function error(name?: string) {
  if (name) {
    console.error(name);
  }
  process.exit(1);
}

/**
 * 执行shell脚本
 *
 * @export
 * @param {string} shellStr
 * @param {ProcessEnvOptions} [option]
 * @return {*}
 */
export function shell(shellStr: string, option?: ProcessEnvOptions) {
  return new Promise((resolve, reject) => {
    exec(shellStr, option, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

/**
 * git是否存在
 *
 * @export
 * @return {*}
 */
export function existenceGit() {
  return shell('git --version')
    .then(() => true)
    .catch(() => false);
}

// 执行git clone命令
export function cloneGie(shellStr: string) {
  return new Promise((resolve, reject) => {
    const args = shellStr.split(' ');
    const name = args.shift() || '';
    // 关键 { stdio: 'inherit' }
    const git = spawn(name, args, { stdio: 'inherit' });

    git.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`code状态码为${code}`));
      }
      return resolve(code);
    });
    git.on('error', (err) => {
      return reject(err);
    });
  });
}

// 将github的链接替换成镜像
export function githubReplace(url: string, replaceStr: string) {
  let s = url;
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
  s = s.replace('github.com', replaceStr);
  return s;
}

/**
 * 获取github链接拉取的目录
 *
 * @export
 * @param {string} str
 * @return {*}
 */
export function gitDir(str: string) {
  const dir = str.split('/').pop() || '';
  return dir.includes('.git') ? dir.slice(0, dir.indexOf('.git')) : dir;
}

/**
 * 替换git的远程推送源地址，这里暂定origin名称为固定的
 *
 * @export
 * @param {string} dir
 * @param {string} url
 * @return {*}
 */
export function setGitSource(dir: string, url: string) {
  const originUrl = url.endsWith('.git') ? url : `${url}.git`;
  // 仓库所在文件地址
  const dirPath = path.join(process.cwd(), dir);
  // 先删除在执行
  const shellStr = `git remote set-url origin ${originUrl}`;
  return shell(shellStr, { cwd: dirPath });
}
