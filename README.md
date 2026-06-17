# GitHub-clone

![License](https://img.shields.io/badge/License-MIT-brightgreen)

解决国内 GitHub `clone` 速度慢、连接不稳定问题的 CLI 工具。

安装后使用 `g` 命令。配置镜像后，工具会**通过镜像加速下载**，克隆完成后**自动将 `origin` 恢复为 GitHub 官方地址**，便于后续 `push`。

## 快速开始

```sh
g mirror set kgithub          # 配置镜像（首次使用建议执行）
g mirror test                 # 可选：探测镜像是否可用
g clone https://github.com/owner/repo
```

未配置镜像时，`g clone` 将直连 `github.com`。

## 工作原理

```text
输入 URL →（若已配置镜像）替换为镜像域名 → git clone → git remote set-url origin（恢复官方地址）
```

1. 若已通过 `g mirror set` 配置镜像，将 URL 中的 `github.com` 替换为镜像域名
2. 执行 `git clone`
3. 使用镜像时，克隆完成后将 `origin` 改回 `https://github.com/<owner>/<repo>.git`

镜像配置保存在 `~/.g.config`（纯文本，内容为镜像域名，如 `kgithub.com`）。

## 安装

```sh
pnpm add -g @boses/github-clone
# 或
npm i -g @boses/github-clone
```

```sh
g mirror set kgithub
g clone https://github.com/bosens-China/github-clone
g --help
```

## CLI 命令

### `g clone` — 克隆仓库

```sh
g clone <url> [dir] [options]
```

| 参数 / 选项 | 说明 |
|-------------|------|
| `url` | GitHub 仓库地址（必填） |
| `dir` | 本地目录名；省略则使用仓库名 |
| `-b, --branch <name>` | 只检出指定分支（等价于 `git clone --branch`） |
| `--depth <n>` | 浅克隆：只拉取最近 `n` 次提交。`--depth 1` 表示只要最新版本，更快更省空间，但本地没有完整 Git 历史 |
| `--single-branch` | 只克隆单个分支，不下载其他远程分支。常与 `-b` 联用；单独使用时默认只拉远程默认分支（通常是 `main`） |
| `--no-mirror` | 忽略已配置的镜像，强制直连 `github.com` |
| `--verbose` | 克隆前输出详细计划：镜像/直连模式、实际克隆地址、origin 恢复地址、本地目录、Git 参数 |

**支持的 URL 格式：**

| 类型 | 示例 |
|------|------|
| HTTPS | `https://github.com/owner/repo` |
| HTTPS + `.git` | `https://github.com/owner/repo.git` |
| SSH | `git@github.com:owner/repo` 或 `git@github.com:owner/repo.git` |

**示例：**

```sh
# 配置镜像后克隆
g mirror set kgithub
g clone https://github.com/bosens-China/github-clone

# 指定目录与分支
g clone https://github.com/bosens-China/github-clone.git my-dir -b dev

# 最小体积：只要 main 分支最近一次提交
g clone https://github.com/bosens-China/github-clone -b main --single-branch --depth 1

# 已配置镜像但本次强制直连
g clone https://github.com/bosens-China/github-clone --no-mirror --verbose

# SSH 地址同样支持
g clone git@github.com:bosens-China/github-clone.git
```

**默认输出示例：**

```text
→ 使用镜像 kgithub.com
... git clone 进度 ...
✓ 克隆完成：repo
  已恢复 origin 为 GitHub 官方地址
```

**`--verbose` 输出示例：**

```text
克隆计划
  模式      : 镜像（kgithub.com）
  克隆地址  : https://kgithub.com/owner/repo.git
  恢复 origin: https://github.com/owner/repo.git
  本地目录  : repo
  Git 参数  : --branch dev --depth 1 --single-branch

... git clone 进度 ...
✓ 克隆完成：repo，分支 dev
```

### `g mirror` — 镜像管理

| 命令 | 说明 |
|------|------|
| `g mirror list`（`ls`） | 列出内置镜像预设，标注当前使用的镜像 |
| `g mirror set <host\|preset>` | 设置镜像域名或预设名（`kgithub` / `moeyy`） |
| `g mirror get` | 查看 `~/.g.config` 中的自定义镜像 |
| `g mirror test [host]` | 对镜像发起 HTTP HEAD 探测是否可达（超时 10 秒） |
| `g mirror unset` | 删除 `~/.g.config` |

**内置预设：**

| 预设名 | 域名 | 说明 |
|--------|------|------|
| `kgithub` | `kgithub.com` | KGitHub 镜像（域名替换） |
| `moeyy` | `github.moeyy.xyz` | Moeyy 镜像（域名替换） |

**镜像与克隆的关系：**

| 场景 | `g mirror get` | `g clone` 行为 |
|------|----------------|----------------|
| 未配置镜像 | 提示未配置 | 直连 GitHub |
| 已 `mirror set` | 显示配置的域名 | 使用配置的镜像 |
| 已 `mirror unset` | 提示未配置 | 直连 GitHub |
| 已配置镜像 + `--no-mirror` | — | 强制直连 GitHub |

## 编程式 API

```sh
pnpm add @boses/github-clone
```

```ts
import clone from '@boses/github-clone';

try {
  clone('https://github.com/bosens-China/github-clone', {
    mirrorHost: 'kgithub.com',
    branch: 'main',
    depth: 1,
    singleBranch: true,
    silence: true,
  });
} catch (error) {
  console.error(error);
}
```

### `clone(url, options?)`

同步 API，请用 `try/catch` 处理错误。不会读取 `~/.g.config`，镜像需通过 `mirrorHost` 显式传入。

| 选项 | 类型 | 说明 |
|------|------|------|
| `dirName` | `string` | 本地目录名 |
| `branch` | `string` | 分支名 |
| `mirrorHost` | `string` | 镜像域名（API 不会读取 `~/.g.config`，需显式传入） |
| `cwd` | `string` | 执行目录，默认 `process.cwd()` |
| `silence` | `boolean` | 静默模式，不继承 Git 输出 |
| `depth` | `number` | 浅克隆深度 |
| `singleBranch` | `boolean` | 仅克隆指定分支 |

## 项目结构

```text
src/
├── index.ts                        # 库 API 入口
├── constants.ts
├── types.ts
├── cli/
│   ├── index.ts                    # CLI 入口
│   └── commands/
│       ├── clone-command.ts
│       └── mirror-command.ts
├── config/
│   └── mirror-store.ts
└── core/
    ├── clone-repo.ts
    ├── git-client.ts
    └── github-url.ts

test/                               # 测试目录（与 src 目录结构对应）
```

命名约定：多词文件名使用 **kebab-case**；`index.ts` 作为模块入口。

## 开发

要求：Node ≥ 22，pnpm，TypeScript strict。

```sh
pnpm install
pnpm dev            # 监听模式运行 CLI（src/cli/index.ts）
pnpm test           # 运行测试
pnpm test:coverage  # 测试 + 覆盖率
pnpm type-check     # TypeScript 类型检查
pnpm lint           # ESLint 检查
pnpm format         # ESLint 自动修复（与 pre-commit 钩子一致）
pnpm build          # Rolldown 打包 + 生成 .d.ts
```

`pnpm install` 会通过 `prepare` 脚本自动安装 Husky 钩子。提交时 `pre-commit` 会对暂存的 `*.{ts,mjs}` 文件执行 `eslint --fix`。

## 限制

- 仅支持 GitHub（`github.com`），不支持 GitLab / Gitee / GitHub Enterprise
- 镜像为**域名替换型**，不支持 `ghproxy.com/https://github.com/...` 前缀代理型
- 不支持 `git pull` / `git fetch` 加速
- `mirror test` 仅验证 HTTP 可达，不保证 `git clone` 一定成功

## 反馈

如有问题或建议，欢迎在 [Issues](https://github.com/bosens-China/github-clone) 反馈。

## 协议

[MIT License](/License)
