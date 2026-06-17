import { beforeEach, describe, expect, it, vi } from 'vitest';

const { gitExistsMock, runGitCloneMock, setRemoteOriginMock } = vi.hoisted(() => ({
  gitExistsMock: vi.fn(),
  runGitCloneMock: vi.fn(),
  setRemoteOriginMock: vi.fn(),
}));

vi.mock('../../src/core/git-client', () => ({
  gitExists: gitExistsMock,
  runGitClone: runGitCloneMock,
  setRemoteOrigin: setRemoteOriginMock,
}));

import { cloneGithubRepo } from '../../src/core/clone-repo';

describe('cloneGithubRepo', () => {
  beforeEach(() => {
    gitExistsMock.mockReset();
    runGitCloneMock.mockReset();
    setRemoteOriginMock.mockReset();
    gitExistsMock.mockReturnValue(true);
  });

  it('未安装 git 时抛错', () => {
    gitExistsMock.mockReturnValue(false);
    expect(() => cloneGithubRepo('https://github.com/foo/bar')).toThrow('未检测到 git');
  });

  it('无镜像时直连 GitHub', () => {
    cloneGithubRepo('https://github.com/foo/bar');
    expect(runGitCloneMock).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://github.com/foo/bar.git',
      }),
    );
    expect(setRemoteOriginMock).not.toHaveBeenCalled();
  });

  it('有镜像时克隆后恢复 origin', () => {
    cloneGithubRepo('https://github.com/foo/bar', { mirrorHost: 'kgithub.com' });
    expect(runGitCloneMock).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://kgithub.com/foo/bar.git',
      }),
    );
    expect(setRemoteOriginMock).toHaveBeenCalledWith(
      'bar',
      'https://github.com/foo/bar.git',
      expect.any(String),
    );
  });
});
