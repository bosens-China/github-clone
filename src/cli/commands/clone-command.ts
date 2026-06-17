import pc from 'picocolors';
import { defaultConfigStore } from '../../config/mirror-store';
import { cloneGithubRepo } from '../../core/clone-repo';
import { getRepoDirName, parseGithubUrl, replaceMirrorHost } from '../../core/github-url';

export interface CloneCommandOptions {
  branch?: string;
  depth?: number;
  singleBranch?: boolean;
  /** commander 由 --no-mirror 写入 false；未传时为 true 或 undefined */
  mirror?: boolean;
  verbose?: boolean;
}

function normalizeDirName(dir: string | undefined): string | undefined {
  const trimmed = dir?.trim();
  return trimmed ? trimmed : undefined;
}

function printVerboseClonePlan(
  url: string,
  dirName: string | undefined,
  options: CloneCommandOptions,
  mirrorHost: string | undefined,
): void {
  const { normalizedHttps } = parseGithubUrl(url);
  const cloneUrl = mirrorHost ? replaceMirrorHost(url, mirrorHost) : normalizedHttps;
  const targetDir = normalizeDirName(dirName) ?? getRepoDirName(url);

  console.log(pc.bold('克隆计划'));
  console.log(pc.dim(`  模式      : ${mirrorHost ? `镜像（${mirrorHost}）` : '直连 GitHub'}`));
  console.log(pc.dim(`  克隆地址  : ${cloneUrl}`));
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
    console.log(pc.dim(`  Git 参数  : ${gitFlags.join(' ')}`));
  } else {
    console.log(pc.dim('  Git 参数  : （无额外参数，完整克隆）'));
  }
  console.log('');
}

export function runCloneCommand(
  url: string,
  dirName: string | undefined,
  options: CloneCommandOptions,
): void {
  const useMirror = options.mirror !== false;
  const mirrorHost = useMirror ? defaultConfigStore.getMirrorHost() : undefined;
  const requestedDir = normalizeDirName(dirName);

  if (options.verbose) {
    printVerboseClonePlan(url, requestedDir, options, mirrorHost);
  } else {
    console.log(pc.dim(mirrorHost ? `→ 使用镜像 ${mirrorHost}` : '→ 直连 github.com'));
  }

  try {
    cloneGithubRepo(url, {
      dirName: requestedDir,
      branch: options.branch,
      mirrorHost,
      depth: options.depth,
      singleBranch: options.singleBranch,
    });
  } catch (error) {
    if (mirrorHost) {
      console.error(
        pc.yellow(`提示：镜像 ${mirrorHost} 可能不可用，可执行 g mirror test 验证，或加 --no-mirror 直连`),
      );
    }
    throw error;
  }

  const repoDir = requestedDir ?? getRepoDirName(url);
  const branchInfo = options.branch ? `，分支 ${options.branch}` : '';
  console.log(pc.green(`✓ 克隆完成：${repoDir}${branchInfo}`));
  if (mirrorHost && !options.verbose) {
    console.log(pc.dim(`  已恢复 origin 为 GitHub 官方地址`));
  }
}
