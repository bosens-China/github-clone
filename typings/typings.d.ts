export interface Iconfig {
  path: string;
}

export interface Iobj<T = any> {
  [k: string]: T;
}
