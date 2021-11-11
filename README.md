# GitHub-clone

![mlt](https://img.shields.io/badge/License-MIT-brightgreen) ![mlt](https://img.shields.io/badge/npm-1.1.1-brightgreen)

解决国内 GitHub clone 速度慢的工具

> 注意下面的书写形式遵循以下规范：
>
> `[]`代表这个字段必填，`<>`则为选填，而`name?:string`，表示这个参数为非必填。

## 工作流程

- 首先将输入的 `github.com`替换成设置的镜像网站地址，默认为（github.com.cnpmjs.org）
- 执行 `git clone [url]` 的操作
- 拉取镜像完成之后，重写 git 的远程仓库推送地址，将镜像推送地址重置为 github 的镜像地址

## 使用方式

目前支持 CLI 和 Node 两种方式

### CLI

```sh
yarn global add @boses/github-clone
```

之后可以简单通过`g clone <path>`形式来使用，更多详细输出可以使用`g ---help`来查看

#### 用法

**clone <path> [dir] <--branch [branchName]>**

`<path>`

- type:`stirng`
- require:`true`

拉取 GitHub 仓库 对应的地址，可以拉取以下三种类型地址

1. https://github.com/bosens-China/github-clone

   默认浏览器导航栏的地址

2. https://github.com/bosens-China/github-clone.git

   Github 右侧 Code HTTPS 的地址

3. git@github.com:bosens-China/breeze-clone.git

   Github 右侧 Code SSH 的地址

`[dir]`

- type:`stirng`
- require:`false`

clone 到本地的目录名称

#### --branch [branchName]

`[branchName]`

- type:`stirng`
- require:`false`

指定拉取的分支名称，可以以`--branch`长形式使用也可以以`-b`的短形式使用，例如：

```sh
g clone https://github.com/bosens-China/github-clone.git -b dev
```

#### set [url]

`[url]`

- type:`stirng`
- require:`true`

用于配置镜像网站

#### get

返回用户配置的`set [url]`地址，默认为`github.com.cnpmjs.org`

### Node

```sh
yarn add @boses/github-clone
```

使用方式

```js
const GithubClone = require('@boses/github-clone');
const github = new GithubClone({ url: 'https://github.com/SunshowerC/blog' });
github.clone();
```

> clone 会以同步的形式运行，记得使用 `try` 包裹住可能的错误

#### 选项

**url**

- type:`string`
- require: `true`

拉取的 GitHub 仓库地址

**dir**

- type:`string`
- require:`false`

拉取的目录名称

**branch**

- type:`string`
- require:`false`

拉取的分支名称

#### 方法

**gitExist(): boolean**

判断 git 是否存在

**clone(cwd?: string): void**

执行 git clone 拉取。

注意使用这个方法之前你应当判断一下环境和 url 是否有效，例如：

```js
if (!gitClone.isGithubLink(url)) {
  console.error(
    `${url} 不是有效链接，目前支持三种格式：\nhttps://github.com/bosens-China/github-clone\nhttps://github.com/bosens-China/github-clone.git\ngit@github.com:bosens-China/breeze-clone.git`,
  );
  return;
}
if (!gitClone.gitExist()) {
  console.error(`git在当前环境不存在，请安装后继续 https://git-scm.com/`);
  return;
}
```

**isGithubLink(url: string): boolean**

判断是否为支持的 GitHub 地址，目前只支持上面列举的三种

**replaceMirror(currentWebsite: string, replaceWebsite: string): string**

返回被替换的镜像网站地址

例如传递 https://github.com/bosens-China/github-clone 会被替换成 https://github.com.cnpmjs.org/bosens-China/github-clone

**getDir(url?: string): string**

根据 Github 地址返回默认的文件夹名称

例如 https://github.com.cnpmjs.org/bosens-China/github-clone 会返回 github-clone

## 其他

目前版本更新导致对`1.0.9`之前的`g get`不支持，请重新执行`g set [url]`的操作

如果发现错误或者需要有更好的建议欢迎在 [issues](https://github.com/bosens-China/github-clone) 中提出

## 参考

- [知乎 git clone 一个 github 上的仓库，太慢，经常连接失败...](https://www.zhihu.com/question/27159393/answer/1117219745)

## 协议

[MIT License](/License)
