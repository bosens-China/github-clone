import pc from 'picocolors';
import { defaultConfigStore } from '../../config/mirror-store';
import { cloneGithubRepo } from '../../core/clone-repo';
import { getRepoDirName, parseGithubUrl, replaceMirrorHost } from '../../core/github-url';

export interface CloneCommandOptions {
  branch?: string;
  depth?: number;
  singleBranch?: boolean;
  noMirror?: boolean;
  verbose?: boolean;
}

function printVerboseClonePlan(
  url: string,
  dirName: string | undefined,
  options: CloneCommandOptions,
  mirrorHost: string | undefined,
): void {
  const { normalizedHttps } = parseGithubUrl(url);
  const cloneUrl = mirrorHost ? replaceMirrorHost(url, mirrorHost) : normalizedHttps;
  const targetDir = dirName ?? getRepoDirName(url);

  console.log(pc.bold('克隆计划'));
  console.log(pc.dim(`  模式      : ${mirrorHost ? `镜像（${mirrorHost}）` : '直连 GitHub'}`));
  console.log(pc.dim(`  clone 地址: ${cloneUrl}`));
  if (mirrorHost) {
    console.log(pc.dim(`  恢复 origin: ${normalizedHttps}`));
  }
  console.log(pc.dim(`  本地目录  : ${targetDir}`));

  const gitFlags: string[] = [];
  if (options.branch) {
    gitFlags.push(`--branch ${options.branch}`);
  }
  if (options.depth !== undefined) {
    gitFlags.push(`--depth ${options.depth}`);
  }
  if (options.singleBranch) {
    gitFlags.push('--single-branch');
  }
  if (gitFlags.length > 0) {
    console.log(pc.dim(`  git 参数  : ${gitFlags.join(' ')}`));
  } else {
    console.log(pc.dim('  git 参数  : （无额外参数，完整克隆）'));
  }
  console.log('');
}

export function runCloneCommand(
  url: string,
  dirName: string | undefined,
  options: CloneCommandOptions,
): void {
  const mirrorHost = options.noMirror ? undefined : defaultConfigStore.getMirrorHost();

  if (options.verbose) {
    printVerboseClonePlan(url, dirName, options, mirrorHost);
  }

  cloneGithubRepo(url, {
    dirName,
    branch: options.branch,
    mirrorHost,
    depth: options.depth,
    singleBranch: options.singleBranch,
  });

  const repoDir = dirName ?? getRepoDirName(url);
  const branchInfo = options.branch ? `，分支 ${options.branch}` : '';
  console.log(pc.green(`✓ 克隆完成：${repoDir}${branchInfo}`));
  if (mirrorHost) {
    console.log(pc.dim(`  已恢复 origin 为 GitHub 官方地址`));
  }
}
