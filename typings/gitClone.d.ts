interface Option {
  url: string;
  dir?: string;
  branch?: string;
}
declare class GitClone {
  option: Option;
  constructor(option: Option);
  /**
   * 判断git是否存在
   *
   * @memberof GitClone
   */
  gitExist(): boolean;

  /**
   * 执行拉取操作
   *
   * @param {string} [cwd]
   * @memberof GitClone
   */
  clone(cwd?: string): void;

  /**
   * 是否为支持的git clone拉取格式，目前支持下面三种格式
   *
   * https://github.com/bosens-China/breeze-cli
   *
   * https://github.com/bosens-China/breeze-cli.git
   *
   * git@github.com:bosens-China/breeze-cli.git
   *
   * @param {string} url
   * @return {*}  {boolean}
   * @memberof GitClone
   */
  isGithubLink(url: string): boolean;

  /**
   * 将当前的网站替换成镜像网站，例如
   *
   * https://github.com/bosens-China/github-clone
   *
   * 替换成
   *
   * https://github.com.cnpmjs.org/bosens-China/github-clone
   *
   * @param {string} currentWebsite
   * @param {string} replaceWebsite
   * @memberof GitClone
   */

  replaceMirror(currentWebsite: string, replaceWebsite: string): string;
  /**
   * 根据github的url返回对应的文件夹名称
   *
   * 例如：https://github.com.cnpmjs.org/bosens-China/github-clone
   *
   * 返回 github-clone
   *
   * @param {string} url
   * @memberof GitClone
   */

  getDir(url?: string): string;
  /**
   * 执行git clone拉取
   *
   * @private
   * @param {string} shellStr
   * @memberof GitClone
   */
  private pull;
}

export = GitClone;
