# Changelog

## [1.2.1](https://github.com/bosens-China/github-clone/compare/v1.2.0...v1.2.1) (2026-06-17)


### Continuous Integration

* 在 publish 前升级 npm 以支持 trusted publishing OIDC ([26a6dd3](https://github.com/bosens-China/github-clone/commit/26a6dd34dcbc95c4f6d13e9c68eb754d54d7240a))

## [1.2.0](https://github.com/bosens-China/github-clone/compare/v1.1.6...v1.2.0) (2026-06-17)


### Features

* 优化 mirror 命令体验与严格度 ([4067f57](https://github.com/bosens-China/github-clone/commit/4067f574a6f7012abcdc5bcdbf66a231e54285f6))
* 对node使用方式变更，对文档错别字和描述更改，对build方式进行更改 ([0a42bb4](https://github.com/bosens-China/github-clone/commit/0a42bb417f061c647e7347780d24008ebe25d780))
* 新增cwd选项，对options字段描述修改 ([556f735](https://github.com/bosens-China/github-clone/commit/556f735e8880096032c8520d8e5f4ce2690e18f5))
* 新增node使用方式，跟cli部分分离开来 ([092f5e1](https://github.com/bosens-China/github-clone/commit/092f5e110e96d47f8b13ad25669190e2c9a2ef0a))


### Bug Fixes

* 修复 --no-mirror 失效、空目录名、同步抛错漏网三个 bug ([63be74c](https://github.com/bosens-China/github-clone/commit/63be74cad4e0c2657bf563d909eac0ea73527634))
* 修改cli执行镜像修改，clone报错通不过问题 ([f6b6439](https://github.com/bosens-China/github-clone/commit/f6b64398be764296e9118f3531a8839e9cb1196c))
* 修改options必填的错误 ([98a473b](https://github.com/bosens-China/github-clone/commit/98a473b6a8705776015553d58770f4fa480dd550))
* 修改描述 ([59c569e](https://github.com/bosens-China/github-clone/commit/59c569ecf3d40efc276884cf0503953fa26381b4))
* 修改文档描述错误，对cli新增set提示，修改tsconfig导致无类型错误 ([4fd5e04](https://github.com/bosens-China/github-clone/commit/4fd5e0425bdc3260642710386dfe3ae90b8d5d3f))


### Refactor

* 重构 src 为模块化 CLI 与核心库 ([69dbb15](https://github.com/bosens-China/github-clone/commit/69dbb15ae5e0c17671a3e8079839b6eecff51736))


### Documentation

* 优化文案 ([f96c8d7](https://github.com/bosens-China/github-clone/commit/f96c8d7015fd81606b17b574d09736460085bba2))
* 修改types填写错误 ([ae50403](https://github.com/bosens-China/github-clone/commit/ae504039e0cc4bf98919a6cccec5f87243d57459))
* 更新 README 与 AGENTS 说明 ([c7c5e0a](https://github.com/bosens-China/github-clone/commit/c7c5e0a332edc32b9cfc08ec008bea14e4a5da6a))
* 更新 README 示例与项目结构 ([ceb9c3b](https://github.com/bosens-China/github-clone/commit/ceb9c3b5bda4322c3cdea9a0750a50eb8dd72411))


### Tests

* 新增 vitest 测试并迁移至 test 目录 ([edf6d38](https://github.com/bosens-China/github-clone/commit/edf6d3870ca093818b986344089c0a305ce1f2f5))


### Continuous Integration

* 引入 release-please 自动化发布流程 ([3a851f7](https://github.com/bosens-China/github-clone/commit/3a851f7952ae4df5ca7c1291dfb44aa582b889bc))
