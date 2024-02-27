# pnpm + monorepo 配合使用

## package.json 的配置

```json
{
  "scripts": {
    "preinstall": "npx only-allow pnpm" // 安装之间检验，只允许 pnpm 安装
  },
  "private": true // 防止最外层的包被发出去
}
```

- preinstall： 在 install 之前首次执行
- postinstall：在 install 之后首次执行

## pnpm-workspace.yaml 添加

```yaml
ackages:
 # 所有在 packages/  子目录下的 package
	- 'packages/**'
  # 不包括在 test 文件夹下的 package
  - '!**/test/**'
```

在 packages 里面创建子包（比如说： utils），然后再 pnpm init，继续修改 package.json 文件

```json
{
  "name": "@copyer/utils",
  "publishConfig": {
    "access": "public"
  }
}

// 因为最外层已经被设置为私有包了，那么如果针对子包发版的话，也需要暴露出去，也就上面这个配置，允许发版
```

## 安装依赖

### 全局安装

```bash
pnpm add vite -w -D
```

::: danger 注意

是小写的 `w`(--workspace-root)， 如果写成大写的，为报错：`Unknown option: 'W'`

:::

### 局部安装

方式一： `cd packages/xxx`，然后进行安装 `pnpm add vue`。

方式二： `pnpm add express --filter @thinker/xxx` 利用 `filter` 来进行局部安装。

::: tip 注意

这里子包中的 packages.json 中的 name 属性命名规则需要注意，包名一般为 `命名空间+项目名`，不然 pnpm add --filter 的时候找不到添加包的项目目录

:::

## 子包与子包之间的依赖

```bash
pnpm -F @copyer/taro add @copyer/utils
# 子包taro 里面安装 子包utils
```

[workspace: 依赖解释](https://www.pnpm.cn/workspaces#publishing-workspace-packages)

## 发布视频

等待完善

https://www.bilibili.com/video/BV1Aj411h7F2/?vd_source=73b012c3730a25fea48281b3af665c0e
