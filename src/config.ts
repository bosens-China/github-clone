import os from 'os';
import path from 'path';
import fs from 'fs';

const dir = os.homedir();
const configPath = path.join(dir, '.g.config');

// 默认github镜像网站
export const DEFAULTPATH = 'github.com.cnpmjs.org';

/**
 * 读取配置
 *
 */
export const getAddress = () => {
  if (!fs.existsSync(configPath)) {
    return DEFAULTPATH;
  }
  return fs.readFileSync(configPath, 'utf-8') || DEFAULTPATH;
};

/**
 * 设置配置
 *
 */
export const setAddress = (address: string) => {
  fs.writeFileSync(configPath, address);
};
