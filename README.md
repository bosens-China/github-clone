# github-clone

![mlt](https://img.shields.io/badge/License-MIT-brightgreen) ![mlt](https://img.shields.io/badge/npm-1.0.0-brightgreen)

解决国内 Github clone 速度慢的工具

## 工作流程

首先根据镜像网站替换掉输入的`github.com`，之后拉取完成后执行`git remote set-url origin [url]`的操作

## 安装

```sh
npm i -g @boses/breeze-clone
# or
npm i -g @boses/breeze-clone
```

之后可以通过`g clone <path>`来使用，更多详细输出可以使用`g ---help`来查看

## 用法

### clone <path> [dir] <--branch [branchName]>

#### path

- type:`stirng`
- require: `true`

拉取 Github 仓库 对应的地址，可以拉取以下三种类型地址

1. https://github.com/bosens-China/github-clone

   默认浏览器导航栏的地址

2. https://github.com/bosens-China/github-clone.git

   Github 右侧 Code HTTPS 的地址

3. git@github.com:bosens-China/breeze-clone.git

   Github 右侧 Code SSH 的地址

#### dir

- type:`stirng`
- require: `false`
- default: `undefined`

重命名 clone 拉取到本地目录名称

#### branch

- type:`stirng`
- require: `false`
- default: `undefined`

指定拉取的分支名称，可以以`--branch`长形式使用也可以以`-b`的短形式使用，例如

```sh
g clone https://github.com/bosens-China/github-clone.git -b dev
```

### set [url]

#### url

- type:`stirng`
- require: `false`
- default: `github.com.cnpmjs.org`

用于配置`cloe`替换地址的 url

### get

返回用户配置的`set [url]`地址

## 其他

如果发现错误或者需要有更好的建议欢迎在 [issues](https://github.com/bosens-China/github-clone) 中提出

## 参考
- [知乎 git clone一个github上的仓库，太慢，经常连接失败...](https://www.zhihu.com/question/27159393/answer/1117219745)
## 协议

[MIT License](/License)
