import { execSync, spawnSync } from 'child_process';
import process from 'process';

export interface Option {
  url: string;
  dir?: string;
  branch?: string;
}

class GitClone {
  public option: Option;

  public constructor(option: Option) {
    this.option = {
      ...option,
    };
  }

  /**
   * 判断git是否存在
   *
   * @memberof GitClone
   */
  public gitExist() {
    try {
      execSync(`git --version`);
      return true;
    } catch {
      return false;
    }
  }

  public clone(cwd = process.cwd()) {
    const { url, dir, branch } = this.option;
    if (!this.isGithubLink(url)) {
      throw new Error(
        `${url} 不是有效链接，目前支持三种格式：\nhttps://github.com/bosens-China/github-clone\nhttps://github.com/bosens-China/github-clone.git\ngit@github.com:bosens-China/breeze-clone.git`,
      );
    }
    if (!this.gitExist()) {
      throw new Error(`git在当前环境不存在，请安装后继续 https://git-scm.com/`);
    }
    const shell = `git clone ${url}${dir ? ` ${dir}` : ''}${branch ? ` --branch ${branch}` : ''}`;
    this.pull(shell, cwd);
  }

  /* 是否为支持的git clone拉取格式
   * https://github.com/bosens-China/breeze-cli
   * https://github.com/bosens-China/breeze-cli.git
   * git@github.com:bosens-China/breeze-cli.git
   */
  public isGithubLink(url: string) {
    const reg = /^(https:\/\/github\.com\/|git@github\.com:)[\s\S]+\/[\s\S]+(\.git)?$/;
    return !!reg.exec(url);
  }

  /**
   * 将当前的网站替换成镜像网站，例如
   * https://github.com/bosens-China/github-clone会被替换成
   * https://github.com.cnpmjs.org/bosens-China/github-clone
   * @param {string} currentWebsite
   * @param {string} replaceWebsite
   * @memberof GitClone
   */
  public replaceMirror(currentWebsite: string, replaceWebsite: string) {
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
  }

  /**
   * 根据github的url返回对应的文件夹名称
   * https://github.com.cnpmjs.org/bosens-China/github-clone会返回github-clone
   *
   * @param {string} url
   * @memberof GitClone
   */
  public getDir(url?: string) {
    const str = url || this.option.url;
    const dir = str.split('/').pop() || '';
    return dir.includes('.git') ? dir.slice(0, dir.indexOf('.git')) : dir;
  }

  /**
   * 执行git clone拉取
   *
   * @private
   * @param {string} shellStr
   * @memberof GitClone
   */
  private pull(shellStr: string, cwd?: string) {
    const args = shellStr.split(' ');
    const name = args.shift() || '';
    // 关键 { stdio: 'inherit' }
    const info = spawnSync(name, args, { stdio: 'inherit', cwd });
    if (info.error) {
      throw info.error;
    }
    return info;
  }
}

export default GitClone;
