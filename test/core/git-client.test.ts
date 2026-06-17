import { beforeEach, describe, expect, it, vi } from 'vitest';

const { execaSyncMock } = vi.hoisted(() => ({
  execaSyncMock: vi.fn(),
}));

vi.mock('execa', () => ({
  execaSync: execaSyncMock,
}));

import { gitExists, runGitClone, setRemoteOrigin } from '../../src/core/git-client';

function mockSuccess(): void {
  execaSyncMock.mockReturnValue({
    failed: false,
    exitCode: 0,
    stderr: '',
  });
}

describe('gitExists', () => {
  beforeEach(() => {
    execaSyncMock.mockReset();
  });

  it('git 可用时返回 true', () => {
    mockSuccess();
    expect(gitExists()).toBe(true);
    expect(execaSyncMock).toHaveBeenCalledWith('git', ['--version']);
  });

  it('git 不可用时返回 false', () => {
    execaSyncMock.mockImplementation(() => {
      throw new Error('not found');
    });
    expect(gitExists()).toBe(false);
  });
});

describe('runGitClone', () => {
  beforeEach(() => {
    execaSyncMock.mockReset();
  });

  it('以参数数组调用 git clone', () => {
    mockSuccess();
    runGitClone({
      url: 'https://kgithub.com/foo/bar.git',
      branch: 'dev',
      depth: 1,
      singleBranch: true,
      dirName: 'bar',
      cwd: '/tmp',
    });

    expect(execaSyncMock).toHaveBeenCalledWith(
      'git',
      ['clone', 'https://kgithub.com/foo/bar.git', '--branch', 'dev', '--depth', '1', '--single-branch', 'bar'],
      expect.objectContaining({ cwd: '/tmp', reject: false }),
    );
  });

  it('git 失败时抛出错误', () => {
    execaSyncMock.mockReturnValue({
      failed: true,
      exitCode: 128,
      stderr: 'fatal: repository not found',
    });

    expect(() =>
      runGitClone({
        url: 'https://github.com/foo/bar.git',
      }),
    ).toThrow('fatal: repository not found');
  });
});

describe('setRemoteOrigin', () => {
  beforeEach(() => {
    execaSyncMock.mockReset();
  });

  it('在目标目录设置 origin', () => {
    mockSuccess();
    setRemoteOrigin('bar', 'https://github.com/foo/bar.git', '/workspace');

    expect(execaSyncMock).toHaveBeenCalledWith(
      'git',
      ['remote', 'set-url', 'origin', 'https://github.com/foo/bar.git'],
      expect.objectContaining({ cwd: '/workspace/bar' }),
    );
  });
});
