import process from 'node:process';
import type { CloneOptions } from '../types';
import { gitExists, runGitClone, setRemoteOrigin } from './git-client';
import { getRepoDirName, parseGithubUrl, replaceMirrorHost } from './github-url';

export function cloneGithubRepo(url: string, options?: CloneOptions): void {
  if (!gitExists()) {
    throw new Error('未检测到 git，请先安装 Git 并确保其在 PATH 中可用');
  }

  const { normalizedHttps } = parseGithubUrl(url);
  const mirrorHost = options?.mirrorHost;
  const cloneUrl = mirrorHost ? replaceMirrorHost(url, mirrorHost) : normalizedHttps;

  const {
    dirName,
    branch,
    cwd = process.cwd(),
    silence,
    depth,
    singleBranch,
  } = options ?? {};

  const targetDir = dirName ?? getRepoDirName(url);

  runGitClone({
    url: cloneUrl,
    dirName: dirName || undefined,
    branch,
    depth,
    singleBranch,
    cwd,
    silence,
  });

  if (mirrorHost) {
    setRemoteOrigin(targetDir, normalizedHttps, cwd);
  }
}

export default cloneGithubRepo;
