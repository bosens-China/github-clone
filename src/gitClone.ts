import { execSync, spawnSync, SpawnSyncOptionsWithBufferEncoding } from 'child_process';
import process from 'process';
import { isGithubLink, replaceMirror } from './utils';

/**
 * 判断git是否存在
 */
const gitExist = () => {
  try {
    execSync(`git --version`);
    return true;
  } catch {
    return false;
  }
};

const pull = (shellStr: string, option?: SpawnSyncOptionsWithBufferEncoding) => {
  const args = shellStr.split(' ');
  const name = args.shift() || '';
  const info = spawnSync(name, args, option);
  if (info.error) {
    throw info.error;
  }
  return info;
};
interface Options {
  dirName: string;
  branch: string;
  mirrorAddress: string;
  cwd: string;
  silence: boolean;
}

const clone = (url: string, options?: Partial<Options>) => {
  if (!gitExist()) {
    throw new Error(`Git does not exist!`);
  }
  if (!isGithubLink(url)) {
    throw new Error(`The current URL ${url} is not in a valid GitHub clone format!`);
  }
  const { dirName, branch, cwd = process.cwd(), mirrorAddress, silence } = options || {};
  // 如果存在镜像网站就替换一下格式
  const template = mirrorAddress ? replaceMirror(url, mirrorAddress) : url;
  const shellArr = ['git', 'clone', template, `${dirName || ''}`, branch ? `--branch ${branch}` : ''];
  const shell = shellArr.filter((f) => f).join(' ');
  pull(shell, { cwd, stdio: silence ? 'pipe' : 'inherit' });
};

export default clone;
