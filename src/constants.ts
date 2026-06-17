/** 域名替换型镜像：将 URL 中的 github.com 替换为镜像主机 */
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
] as const;

/** 用于 mirror test 的探测仓库路径 */
export const MIRROR_PROBE_REPO = 'bosens-China/github-clone';
