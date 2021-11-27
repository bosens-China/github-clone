# GitHub-clone

![mlt](https://img.shields.io/badge/License-MIT-brightgreen) ![mlt](https://img.shields.io/badge/npm-1.1.1-brightgreen)

为了解决国内 GitHub clone 速度慢较慢的工具

> 注意以下文档书写形式遵循下述规范：
>
> `[]`代表这个字段必填，`<>`则为选填，而`name?:string`，表示这个参数为非必填为`string`类型。

## 执行流程

- 首先将输入的 `github.com`替换成设置的镜像网站地址，默认为（github.com.cnpmjs.org）
- 执行 `git clone [url]` 的操作
- 拉取镜像完成之后，重写 git 的远程仓库推送地址，将镜像推送地址重置为 github 的镜像地址

## CLI 使用方式

### 安装

```sh
yarn global add @boses/github-clone
```

之后通过`g clone <path>`形式来使用，更多`API`和`clone`的使用方法可以调用`g ---help`查看。

### API

#### Clone

**clone <path> [dir] <--branch [branchName]>**

- `<path>`

  - type:`stirng`
  - require:`true`

  拉取 GitHub 仓库 对应的地址，可以拉取以下三种类型地址

  | 类型                                             | 说明                          |
  | ------------------------------------------------ | ----------------------------- |
  | https://github.com/bosens-China/github-clone     | 默认浏览器导航栏的地址        |
  | https://github.com/bosens-China/github-clone.git | Github 右侧 Code HTTPS 的地址 |
  | git@github.com:bosens-China/breeze-clone.git     | Github 右侧 Code SSH 的地址   |

- `[dir]`

  - type:`stirng`
  - require:`false`

  clone 到本地的目录名称

- `--branch [branchName]`

  - type:`stirng`
  - require:`false`

  指定拉取的分支名称，可以以`--branch`长形式使用也可以以`-b`的短形式使用，例如：

  ```sh
  g clone https://github.com/bosens-China/github-clone.git -b dev
  ```

#### set [url]

- `[url]`

  - type:`stirng`
  - require:`true`

  用于配置镜像网站

#### get

返回用户配置的`set [url]`地址，默认为`github.com.cnpmjs.org`

## Node

### 安装

```sh
yarn add @boses/github-clone
```

```js
const clone = require('@boses/github-clone');
// 也可以通过es模块引用
// import clone from '@boses/github-clone/gitClone.esm'
clone('https://github.com/SunshowerC/blog');
```

> clone 会以同步的形式运行，记得使用 `try` 包裹住可能的错误

### API

`clone: (url: string, options: Partial<Options>) => void`

#### url

- type:`string`
- require: `true`

拉取的 GitHub 仓库地址

#### options

| 名称          | 类型      | 是否必填 | 描述                                       |
| ------------- | --------- | -------- | ------------------------------------------ |
| dirName       | `string`  | `false`  | 拉取的目录名称                             |
| branch        | `string`  | `false`  | 拉取的分支名称                             |
| mirrorAddress | `string`  | `false`  | 镜像网站，如果你需要使用镜像可以填写此网站 |
| silence       | `boolean` | `false`  | 是否静默模式执行 clone                     |
| cwd           | `string`  | `false`  | 执行 clone 所执行的目录路径                |

## 其他

目前版本更新导致对`1.0.9`之前的`g get`不支持，请重新执行`g set [url]`的操作

如果发现错误或者需要有更好的建议欢迎在 [issues](https://github.com/bosens-China/github-clone) 中提出

## 参考

- [知乎 git clone 一个 github 上的仓库，太慢，经常连接失败...](https://www.zhihu.com/question/27159393/answer/1117219745)

## 协议

[MIT License](/License)
