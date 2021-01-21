/*
  读取配置文件相关
*/

import os from 'os';
import path from 'path';
import { getJsonFile, setJsonFile } from '../src/fs';
import { Iobj } from '../typings/typings';

// 默认github镜像网站
export const DEFAULTPATH = 'github.com.cnpmjs.org';
const dir = os.homedir();
const configPath = path.join(dir, '.g.config.json');

/**
 * 设置配置文件
 *
 * @export
 * @param {{ [k: string]: any }} config
 * @return {*}
 */
export async function setConfig<T = Iobj>(config: T) {
  return setJsonFile(configPath, config);
}

/**
 * 获取配置文件
 *
 * @export
 * @return {*}  {Promise<Iobj>}
 */
export async function getConfig<T = Iobj>(): Promise<T> {
  const config = await getJsonFile(configPath);
  return (config || { path: DEFAULTPATH }) as T;
}
