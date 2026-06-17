import path from 'node:path';
import { execaSync } from 'execa';

export interface GitCloneParams {
  url: string;
  dirName?: string;
  branch?: string;
  depth?: number;
  singleBranch?: boolean;
  cwd?: string;
  silence?: boolean;
}

function toExecaStdio(silence?: boolean): 'pipe' | 'inherit' {
  return silence ? 'pipe' : 'inherit';
}

function buildCloneArgs(params: GitCloneParams): string[] {
  const args = ['clone', params.url];
  if (params.branch) {
    args.push('--branch', params.branch);
  }
  if (params.depth !== undefined) {
    args.push('--depth', String(params.depth));
  }
  if (params.singleBranch) {
    args.push('--single-branch');
  }
  if (params.dirName) {
    args.push(params.dirName);
  }
  return args;
}

function assertGitSuccess(result: { failed: boolean; exitCode?: number; stderr?: string }): void {
  if (result.failed || (result.exitCode !== undefined && result.exitCode !== 0)) {
    const stderr = result.stderr?.trim();
    throw new Error(stderr || `git 命令执行失败，退出码 ${result.exitCode ?? 'unknown'}`);
  }
}

export function gitExists(): boolean {
  try {
    execaSync('git', ['--version']);
    return true;
  } catch {
    return false;
  }
}

export function runGitClone(params: GitCloneParams): void {
  const result = execaSync('git', buildCloneArgs(params), {
    cwd: params.cwd,
    stdio: toExecaStdio(params.silence),
    reject: false,
  });
  assertGitSuccess(result);
}

export function setRemoteOrigin(dir: string, url: string, cwd: string): void {
  const dirPath = path.join(cwd, dir);
  const result = execaSync('git', ['remote', 'set-url', 'origin', url], {
    cwd: dirPath,
    stdio: 'pipe',
    reject: false,
  });
  assertGitSuccess(result);
}
