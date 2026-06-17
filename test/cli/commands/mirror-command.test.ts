import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { getMirrorHostMock, setMirrorHostMock, unsetMirrorHostMock } = vi.hoisted(() => ({
  getMirrorHostMock: vi.fn<() => string | undefined>(),
  setMirrorHostMock: vi.fn<(host: string) => void>(),
  unsetMirrorHostMock: vi.fn<() => void>(),
}));

vi.mock('../../../src/config/mirror-store', () => ({
  defaultConfigStore: {
    getMirrorHost: getMirrorHostMock,
    setMirrorHost: setMirrorHostMock,
    unsetMirrorHost: unsetMirrorHostMock,
  },
}));

import {
  printMirror,
  resolveMirrorHostInput,
  runMirrorList,
  runMirrorSet,
  runMirrorTest,
  runMirrorUnset,
} from '../../../src/cli/commands/mirror-command';

describe('resolveMirrorHostInput', () => {
  it('预设名转换为 host', () => {
    expect(resolveMirrorHostInput('kgithub')).toBe('kgithub.com');
    expect(resolveMirrorHostInput('moeyy')).toBe('github.moeyy.xyz');
  });

  it('传入已知 host 时原样返回', () => {
    expect(resolveMirrorHostInput('kgithub.com')).toBe('kgithub.com');
  });

  it('未知输入原样返回（交给后续校验）', () => {
    expect(resolveMirrorHostInput('foo.bar.example')).toBe('foo.bar.example');
  });
});

describe('printMirror', () => {
  let logSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    logSpy.mockRestore();
  });

  it('有 host 时显示当前镜像', () => {
    printMirror('kgithub.com');
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('kgithub.com'));
  });

  it('无 host 时提示未配置', () => {
    printMirror(undefined);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('未配置镜像'));
  });
});

describe('runMirrorSet / runMirrorUnset', () => {
  let logSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    setMirrorHostMock.mockReset();
    unsetMirrorHostMock.mockReset();
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    logSpy.mockRestore();
  });

  it('set 调用 store 并输出 test 引导', () => {
    runMirrorSet('kgithub.com');
    expect(setMirrorHostMock).toHaveBeenCalledWith('kgithub.com');
    const messages = logSpy.mock.calls.map((c) => String(c[0]));
    expect(messages.some((m) => m.includes('已设置'))).toBe(true);
    expect(messages.some((m) => m.includes('g mirror test'))).toBe(true);
  });

  it('unset 调用 store', () => {
    runMirrorUnset();
    expect(unsetMirrorHostMock).toHaveBeenCalled();
  });
});

describe('runMirrorList', () => {
  let logSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    getMirrorHostMock.mockReset();
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    logSpy.mockRestore();
  });

  function joinedOutput(): string {
    return logSpy.mock.calls.map((c) => String(c[0])).join('\n');
  }

  it('当前镜像匹配预设时标注 (当前)', () => {
    getMirrorHostMock.mockReturnValue('kgithub.com');
    runMirrorList();
    expect(joinedOutput()).toMatch(/kgithub\.com.*\(当前\)/);
  });

  it('当前镜像是自定义域名时单独显示', () => {
    getMirrorHostMock.mockReturnValue('my-custom.example.com');
    runMirrorList();
    const out = joinedOutput();
    expect(out).toContain('my-custom.example.com');
    expect(out).toContain('自定义镜像');
  });

  it('未配置时提示如何配置', () => {
    getMirrorHostMock.mockReturnValue(undefined);
    runMirrorList();
    expect(joinedOutput()).toContain('g mirror set');
  });
});

describe('runMirrorTest', () => {
  const fetchMock = vi.fn();
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    getMirrorHostMock.mockReset();
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    logSpy.mockRestore();
  });

  it('未配置且未传 host 时抛错', async () => {
    getMirrorHostMock.mockReturnValue(undefined);
    await expect(runMirrorTest()).rejects.toThrow('未配置镜像');
  });

  it('HTTP 200 时显示可用', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200 });
    await runMirrorTest('kgithub.com');
    expect(logSpy.mock.calls.some((c) => String(c[0]).includes('可用'))).toBe(true);
  });

  it('HTTP 非 2xx 时抛带状态码的错误', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 503 });
    await expect(runMirrorTest('kgithub.com')).rejects.toThrow(/HTTP 503/);
  });

  it('AbortSignal.timeout 触发 TimeoutError 时给出友好提示', async () => {
    const err = new Error('timed out');
    err.name = 'TimeoutError';
    fetchMock.mockRejectedValue(err);
    await expect(runMirrorTest('kgithub.com')).rejects.toThrow(/超时/);
  });

  it('DNS 失败时给出友好提示', async () => {
    const err = new Error('fetch failed');
    (err as Error & { cause: { code: string } }).cause = { code: 'ENOTFOUND' };
    fetchMock.mockRejectedValue(err);
    await expect(runMirrorTest('no-such.example')).rejects.toThrow(/无法解析域名/);
  });

  it('连接拒绝时给出友好提示', async () => {
    const err = new Error('fetch failed');
    (err as Error & { cause: { code: string } }).cause = { code: 'ECONNREFUSED' };
    fetchMock.mockRejectedValue(err);
    await expect(runMirrorTest('kgithub.com')).rejects.toThrow(/被拒绝或重置/);
  });
});
