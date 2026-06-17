import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { z } from 'zod';

const mirrorHostSchema = z
  .string()
  .trim()
  .min(1, '镜像地址不能为空')
  .regex(/^[a-zA-Z0-9][-a-zA-Z0-9.]*[a-zA-Z0-9]$/, '镜像地址格式无效，请输入域名，例如 kgithub.com');

const defaultConfigPath = path.join(os.homedir(), '.g.config');

export class ConfigStore {
  constructor(private readonly configPath = defaultConfigPath) {}

  getMirrorHost(): string | undefined {
    if (!fs.existsSync(this.configPath)) {
      return undefined;
    }
    const raw = fs.readFileSync(this.configPath, 'utf-8').trim();
    return raw || undefined;
  }

  setMirrorHost(host: string): void {
    const parsed = mirrorHostSchema.parse(host);
    fs.writeFileSync(this.configPath, parsed, 'utf-8');
  }

  unsetMirrorHost(): void {
    if (fs.existsSync(this.configPath)) {
      fs.unlinkSync(this.configPath);
    }
  }

  getConfigPath(): string {
    return this.configPath;
  }
}

export const defaultConfigStore = new ConfigStore();
