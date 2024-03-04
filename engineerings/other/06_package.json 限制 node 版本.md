# 06_package.json 限制 node 版本

## 原文

[工作 5 年，还不知道团队如何巧妙统一 Node 版本？](https://mp.weixin.qq.com/s/G-n5sTsMObt4ko2gFZbysA)

## 总结

`Node.js` 作为构建工具和服务端运行环境的基石，版本不一致可能导致各种问题，如依赖库兼容性问题、开发环境与生产环境不匹配等。

通过情况下，都会通过 `n` 和 `nvm` 来切换 node 版本。

### engines 固定 node 版本

`package.json` 中 `engines` 可以用于指定 node 版本。

```json
// 指定特定版本号
"engines": {
  "node": "14.17.0"
}

// 范围符号：表示项目需要Node版本大于等于12.0.0且小于16.0.0。
"engines": {
  "node": ">=12.0.0 <16.0.0"
}

// 波浪线符号：表示项目需要Node版本为14.17.x
"engines": { "node": "~14.17.0" }

// 插入符号：表示项目需要Node版本为14.x.x
"engines": { "node": "^14.17.0" }
```

测试结果：`npm install` 没有效果（亲自测试：`pnpm install` 也没有效果），但是 `yarn install` 却有效果，这是为什么呢？

::: tip 原因
`engines` 只是建议，默认不开启严格版本校验，只会给出提示，需要手动开启严格模式
:::

```bash
# .npmrc
engine-strict = true
```

开启严格模式，`npm/pnpm install` 有效果了，可以成功限制 node 版本。

::: danger 不足之处
操作麻烦，每次安装不成功之后，就会去 package.json 中查看 node 版本，然后再使用 n 或者 nvm 来切换 node 版本，最后进行安装。
:::

### .nvmrc 快捷方式

`.nvmrc` 肯定是针对 nvm 功能的，所以 n 就还是老老实实的操作。

`.nvmrc` 文件是一个存放指定 Node 版本的配置文件，可以告诉项目的成员应该使用哪个 Node 版本来运行项目。

```bash
# .nvmrc
v16.14.0
```

只需要执行 `nvm use` 就可以切换 node 版本了。
