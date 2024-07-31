# 认识 monorepo 生态圈

单一仓库管理项目的所有代码。

### pnpm

#### workspace 协议

workspace 协议 是 pnpm 支持 Monorepo 的一个重要功能，它可以指定工作空间内的包依赖关系。

在一个包中依赖另外一个包，就可以使用 `workspace:*` 来进行定义，在 pnpm install 时，会自动将依赖包安装到当前工作空间中。

在发布正式版本包时，pnpm 官方也替我们处理了，通过 pnpm bulish 时，pnpm 会将这些 workspace 协议自动转化为当前包的正式版本号。

https://pnpm.io/zh/workspaces#%E5%8F%91%E5%B8%83-workspace-%E5%8C%85

例如：

```json
{
  "dependencies": {
    "foo": "workspace:*",
    "bar": "workspace:~",
    "qar": "workspace:^",
    "zoo": "workspace:^1.5.0"
  }
}
```

会被编译为：

```json
{
  "dependencies": {
    "foo": "1.5.0",
    "bar": "~1.5.0",
    "qar": "^1.5.0",
    "zoo": "^1.5.0"
  }
}
```

### Turborepo

Turborepo 是一个高性能的 JavaScript 和 TypeScript 项目构建系统，采用 GO 语言实现，所以在语言层面就具有一定的性能优势，可以大大的提高 monorepo 项目的构建速度。

#### 优势

- 增量构建： Turborepo 会记住你之前构建的结果并跳过已经计算过的内容。
- 感知内容 hash: Turborepo 通过文件的内容，而不是时间戳来确定需要构建的内容。
- 并行处理: 不浪费任何闲置 cpu 性能，以每个核心最大的并行度来执行构建。
- 远程缓存 : 与团队成员、CI/CD 共享远程构建缓存，以实现更快的构建。
- 零运行时开销: Turborepo 不会影响您的运行时代码或 sourcemap。
- 任务管道: 定义任务之间的关系，然后让 Turborepo 优化构建内容和时间。
- 渐进式设计：可以在几分钟内快速集成到项目中

### changesets

changesets 是 pnpm 官方推荐的一个管理版本以及变更日志的工具，专注于多包管理。

```bash
pnpm add -Dw @changesets/cli

pnpm changest init
```

就会生成

```json
{
  "$schema": "https://unpkg.com/@changesets/config@2.3.0/schema.json",
  //  类型为布尔值 | 字符串 | [字符串, unknow]，默认值为@changesets/cli/changelog。生成Changelog规则。
  "changelog": "@changesets/cli/changelog",
  // 类型为布尔值，默认值为false。当将此字段配置为true时，在执行change和bump命令时，将自动执行提交代码操作。
  "commit": false,
  // 类型为字符串数组数组，默认值为空数组。用于在monorepo中对包进行分组，相同分组中的包版本号将进行绑定，每次执行bump命令时，同一分组中的包只要有一个升级版本号，其他会一起升级。支持使用正则匹配包名称。
  "fixed": [],
  // 类型为字符串数组数组，默认值为空数组。与fixed类似，也是对monorepo中对包进行分组，但是每次执行bump命令时，只有和changeset声明的变更相关的包才会升级版本号，同一分组的变更包的版本号将保持一致。支持使用正则匹配包名称。
  "linked": [],
  // 类型为restricted | public，默认值为restricted。用于配置当前包的发布形式，如果配置为restricted，则作为私有包发布，如果为public，则发布公共范围包
  "access": "restricted",
  // 类型为字符串，默认值为main。仓库主分支。该配置用于计算当前分支的变更包并进行分类。
  "baseBranch": "main",
  // 类型为patch | minor，默认值为patch。用于声明更新内部依赖的版本号规则。当执行bump命令升级版本号时，默认会自动更新仓库中使用该包的依赖声明
  "updateInternalDependencies": "patch",
  // 类型为字符串数组，默认值为空数组。用于声明执行bump命令时忽略的包，与bump命令的–ignore参数用法一致，注意两者不能同时使用
  "ignore": []
}
```

一般来说，都不需要改动

### 参考文档

https://tech.uupt.com/?p=1185
