/** 将 URL 中的 github.com 替换为镜像地址（域名或域名/路径） */
export interface MirrorPreset {
  name: string;
  host: string;
  description: string;
}

export const MIRROR_PRESETS: readonly MirrorPreset[] = [
  {
    name: 'kgithub',
    host: 'kgithub.com',
    description: 'KGitHub 镜像（域名替换）',
  },
  {
    name: 'moeyy',
    host: 'github.moeyy.xyz',
    description: 'Moeyy 镜像（域名替换）',
  },
  {
    name: 'gitclone',
    host: 'gitclone.com/github.com',
    description: 'GitClone 缓存（路径前缀）',
  },
] as const;

/** 用于 mirror test 的探测仓库路径（GitHub 官方示例仓库，长期稳定） */
export const MIRROR_PROBE_REPO = 'octocat/Hello-World';
