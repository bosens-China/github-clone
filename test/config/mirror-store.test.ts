import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { ConfigStore } from '../../src/config/mirror-store';

describe('ConfigStore', () => {
  const tempPaths: string[] = [];

  afterEach(() => {
    for (const configPath of tempPaths) {
      if (fs.existsSync(configPath)) {
        fs.unlinkSync(configPath);
      }
    }
    tempPaths.length = 0;
  });

  function createStore(): ConfigStore {
    const configPath = path.join(os.tmpdir(), `g-config-test-${Date.now()}-${Math.random()}`);
    tempPaths.push(configPath);
    return new ConfigStore(configPath);
  }

  it('未配置时返回 undefined', () => {
    const store = createStore();
    expect(store.getMirrorHost()).toBeUndefined();
  });

  it('读写镜像配置', () => {
    const store = createStore();
    store.setMirrorHost('kgithub.com');
    expect(store.getMirrorHost()).toBe('kgithub.com');
  });

  it('自动 trim 输入', () => {
    const store = createStore();
    store.setMirrorHost('  kgithub.com  ');
    expect(store.getMirrorHost()).toBe('kgithub.com');
  });

  it('拒绝非法镜像地址', () => {
    const store = createStore();
    expect(() => store.setMirrorHost('not a host')).toThrow();
  });

  it('unset 会删除配置文件', () => {
    const store = createStore();
    store.setMirrorHost('kgithub.com');
    store.unsetMirrorHost();
    expect(store.getMirrorHost()).toBeUndefined();
    expect(fs.existsSync(store.getConfigPath())).toBe(false);
  });
});
