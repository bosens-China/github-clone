export interface CloneOptions {
  /** 克隆到本地的目录名称 */
  dirName?: string;
  /** 指定分支 */
  branch?: string;
  /** 镜像主机，例如 kgithub.com */
  mirrorHost?: string;
  /** 工作目录 */
  cwd?: string;
  /** 静默模式，不继承 Git 输出 */
  silence?: boolean;
  /** 浅克隆深度 */
  depth?: number;
  /** 仅克隆指定分支 */
  singleBranch?: boolean;
}
