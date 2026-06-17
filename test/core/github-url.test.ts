import { describe, expect, it } from 'vitest';
import {
  buildMirrorProbeUrl,
  getRepoDirName,
  isGithubLink,
  parseGithubUrl,
  replaceMirrorHost,
} from '../../src/core/github-url';

describe('isGithubLink', () => {
  it('接受 HTTPS 与 SSH 格式', () => {
    expect(isGithubLink('https://github.com/bosens-China/breeze-cli')).toBe(true);
    expect(isGithubLink('https://github.com/bosens-China/breeze-cli.git')).toBe(true);
    expect(isGithubLink('git@github.com:bosens-China/breeze-cli.git')).toBe(true);
    expect(isGithubLink('git@github.com:bosens-China/breeze-cli')).toBe(true);
  });

  it('拒绝非法地址', () => {
    expect(isGithubLink('agit@github.com:bosens-China/breeze-cli.git')).toBe(false);
    expect(isGithubLink('https://gitlab.com/foo/bar')).toBe(false);
  });
});

describe('parseGithubUrl', () => {
  it('规范化 HTTPS 地址', () => {
    expect(parseGithubUrl('https://github.com/bosens-China/breeze-cli')).toEqual({
      owner: 'bosens-China',
      repo: 'breeze-cli',
      normalizedHttps: 'https://github.com/bosens-China/breeze-cli.git',
    });
  });

  it('将 SSH 转为 HTTPS', () => {
    expect(parseGithubUrl('git@github.com:bosens-China/breeze-cli.git').normalizedHttps).toBe(
      'https://github.com/bosens-China/breeze-cli.git',
    );
  });
});

describe('replaceMirrorHost', () => {
  it('替换镜像域名', () => {
    expect(replaceMirrorHost('https://github.com/bosens-China/breeze-cli', 'kgithub.com')).toBe(
      'https://kgithub.com/bosens-China/breeze-cli.git',
    );
    expect(replaceMirrorHost('git@github.com:bosens-China/breeze-cli.git', 'kgithub.com')).toBe(
      'https://kgithub.com/bosens-China/breeze-cli.git',
    );
  });
});

describe('getRepoDirName', () => {
  it('提取仓库目录名', () => {
    expect(getRepoDirName('https://github.com/bosens-China/breeze-cli.git')).toBe('breeze-cli');
    expect(getRepoDirName('https://github.com/bosens-China/breeze-cli')).toBe('breeze-cli');
  });
});

describe('buildMirrorProbeUrl', () => {
  it('生成探测 URL', () => {
    expect(buildMirrorProbeUrl('kgithub.com', 'bosens-China/github-clone')).toBe(
      'https://kgithub.com/bosens-China/github-clone',
    );
  });
});
