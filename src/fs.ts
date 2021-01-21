/*
  对config配置文件封装的一些fs操作
*/

import fs from 'fs';
import { Iobj } from '../typings/typings';

/**
 * 文件是否存在
 *
 * @export
 * @param {string} file
 * @return {*}
 */
export function access(file: string): Promise<boolean> {
  return new Promise((resolve) => {
    fs.access(file, fs.constants.R_OK | fs.constants.W_OK, (err) => {
      if (err) {
        return resolve(false);
      }
      return resolve(true);
    });
  });
}

/**
 * 读取文本文件
 *
 * @export
 * @param {string} file
 * @return {*}  {Promise<string>}
 */
export function readFile(file: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}

/**
 * 写入文件
 *
 * @export
 * @param {string} file
 * @param {string} content
 * @return {*}  {Promise<string>}
 */
export function writeFile(file: string, content: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, content, 'utf-8', (err) => {
      if (err) {
        return reject(err);
      }
      return resolve(content);
    });
  });
}

/**
 * 输出json
 *
 * @export
 * @param {string} file
 * @param {Iobj} data
 * @return {*}
 */
export function setJsonFile(file: string, data: Iobj, indent = 2) {
  const obj = JSON.stringify(data, null, indent);
  return writeFile(file, obj);
}
/**
 * 读取json文件
 *
 * @export
 * @param {string} file
 * @return {*}
 */
export async function getJsonFile(file: string): Promise<undefined | Iobj> {
  if (!(await access(file))) {
    return undefined;
  }
  const obj = await readFile(file);
  try {
    return JSON.parse(obj);
  } catch (e) {
    return undefined;
  }
}
