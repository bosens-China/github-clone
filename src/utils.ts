import path from 'path';

import { execSync } from 'child_process';

/**
 * 替换git的远程推送源地址，这里暂定origin名称为固定的
 *
 * @export
 * @param {string} dir
 * @param {string} url
 * @return {*}
 */
export const setGitSource = (dir: string, url: string) => {
  // 仓库所在文件地址
  const dirPath = path.join(process.cwd(), dir);
  // 先删除在执行
  const shellStr = `git remote set-url origin ${url}`;
  execSync(shellStr, { cwd: dirPath });
};
