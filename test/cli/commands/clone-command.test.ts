import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getMirrorHostMock, cloneGithubRepoMock } = vi.hoisted(() => ({
  getMirrorHostMock: vi.fn<() => string | undefined>(),
  cloneGithubRepoMock: vi.fn(),
}));

vi.mock('../../../src/config/mirror-store', () => ({
  defaultConfigStore: {
    getMirrorHost: getMirrorHostMock,
  },
}));

vi.mock('../../../src/core/clone-repo', () => ({
  cloneGithubRepo: cloneGithubRepoMock,
}));

import { runCloneCommand } from '../../../src/cli/commands/clone-command';

describe('runCloneCommand', () => {
  let logSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    getMirrorHostMock.mockReset();
    cloneGithubRepoMock.mockReset();
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  function joinedLog(): string {
    return logSpy.mock.calls.map((c) => String(c[0])).join('\n');
  }

  function joinedError(): string {
    return errorSpy.mock.calls.map((c) => String(c[0])).join('\n');
  }

  it('未传 --no-mirror 时使用配置的镜像', () => {
    getMirrorHostMock.mockReturnValue('kgithub.com');

    runCloneCommand('https://github.com/foo/bar', undefined, {});

    expect(cloneGithubRepoMock).toHaveBeenCalledWith(
      'https://github.com/foo/bar',
      expect.objectContaining({ mirrorHost: 'kgithub.com' }),
    );
  });

  it('显式传 mirror: true 时仍使用配置的镜像（commander 默认值）', () => {
    getMirrorHostMock.mockReturnValue('kgithub.com');

    runCloneCommand('https://github.com/foo/bar', undefined, { mirror: true });

    expect(cloneGithubRepoMock).toHaveBeenCalledWith(
      'https://github.com/foo/bar',
      expect.objectContaining({ mirrorHost: 'kgithub.com' }),
    );
  });

  it('--no-mirror（mirror: false）忽略配置的镜像，强制直连', () => {
    getMirrorHostMock.mockReturnValue('kgithub.com');

    runCloneCommand('https://github.com/foo/bar', undefined, { mirror: false });

    expect(cloneGithubRepoMock).toHaveBeenCalledWith(
      'https://github.com/foo/bar',
      expect.objectContaining({ mirrorHost: undefined }),
    );
    // 不应触发不必要的配置读取以外的行为
    expect(getMirrorHostMock).not.toHaveBeenCalled();
  });

  it('未配置镜像时即使未传 --no-mirror 也是直连', () => {
    getMirrorHostMock.mockReturnValue(undefined);

    runCloneCommand('https://github.com/foo/bar', undefined, {});

    expect(cloneGithubRepoMock).toHaveBeenCalledWith(
      'https://github.com/foo/bar',
      expect.objectContaining({ mirrorHost: undefined }),
    );
  });

  it('空字符串目录名被规范化为 undefined（避免 origin 路径错误）', () => {
    getMirrorHostMock.mockReturnValue(undefined);

    runCloneCommand('https://github.com/foo/bar', '   ', {});

    expect(cloneGithubRepoMock).toHaveBeenCalledWith(
      'https://github.com/foo/bar',
      expect.objectContaining({ dirName: undefined }),
    );
  });

  it('正常目录名被透传', () => {
    getMirrorHostMock.mockReturnValue(undefined);

    runCloneCommand('https://github.com/foo/bar', 'my-dir', {});

    expect(cloneGithubRepoMock).toHaveBeenCalledWith(
      'https://github.com/foo/bar',
      expect.objectContaining({ dirName: 'my-dir' }),
    );
  });

  it('默认输出当前模式（镜像）', () => {
    getMirrorHostMock.mockReturnValue('kgithub.com');
    runCloneCommand('https://github.com/foo/bar', undefined, {});
    expect(joinedLog()).toContain('→ 使用镜像 kgithub.com');
  });

  it('默认输出当前模式（直连）', () => {
    getMirrorHostMock.mockReturnValue(undefined);
    runCloneCommand('https://github.com/foo/bar', undefined, {});
    expect(joinedLog()).toContain('→ 直连 github.com');
  });

  it('verbose 时不输出简短模式行（详细计划已包含）', () => {
    getMirrorHostMock.mockReturnValue('kgithub.com');
    runCloneCommand('https://github.com/foo/bar', undefined, { verbose: true });
    expect(joinedLog()).not.toContain('→ 使用镜像');
  });

  it('镜像模式下克隆失败时给出排障提示', () => {
    getMirrorHostMock.mockReturnValue('kgithub.com');
    cloneGithubRepoMock.mockImplementation(() => {
      throw new Error('fatal: unable to access');
    });

    expect(() => runCloneCommand('https://github.com/foo/bar', undefined, {})).toThrow(
      'fatal: unable to access',
    );
    expect(joinedError()).toMatch(/镜像 kgithub\.com 可能不可用.*--no-mirror/);
  });

  it('直连失败时不输出镜像相关提示', () => {
    getMirrorHostMock.mockReturnValue(undefined);
    cloneGithubRepoMock.mockImplementation(() => {
      throw new Error('boom');
    });

    expect(() => runCloneCommand('https://github.com/foo/bar', undefined, {})).toThrow('boom');
    expect(errorSpy).not.toHaveBeenCalled();
  });
});
