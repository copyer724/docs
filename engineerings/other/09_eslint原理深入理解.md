# eslint 原理深入理解

`代码千万行，安全第一行；前端不规范，同事两行泪。`

## 资料推荐

- [【一听就懂】ESLint 机制浅析-整体机制与规范包](https://juejin.cn/post/7037426216671903780)
- [视频讲解](https://www.bilibili.com/video/BV1Eg411P7gr?p=1&vd_source=73b012c3730a25fea48281b3af665c0e)

## 新的认知

1. eslint 只能识别 `js` 和 `json`，其他的需要通过插件来识别。
2. 安装 eslint 插件，会存在：

- 生成 eslint 执行`脚本文件`；其内容去读取 eslint 中的代码，启动服务器。
- 生成 `@eslint包` 用来规范 eslint 配置文件
- eslint 开头的包是 eslint 运行包，包含 eslint 代码

3. eslint 检查 `npx eslint xxx` (xxx 可以是文件，也可以是文件夹)
4. eslint 加载的优先级是: `js > yaml > json`，所以我们最好选择 js 格式。
5. `env` 定义运行环境，可以直接使用环境中的全局变量
6. `globals` 定义全局变量，注意与 env 的区别
7. `extends` 继承插件。（内置的规则，或者第三方的插件）

```ts
{
  "extends": ["eslint:all", "eslint:recommended"] // 内置的规则
  "extends": ["standard"] // 三方插件：eslint-config-standard; 可以省略 eslint-config
}
```

8. rules 中的每个规则，都是一个 `create` 函数。

```ts
// node_modules/eslint/rules
下面写了 250 多个文件，每个文件里面都是函数，代表着 250 多个规则

// node_modules/eslint/conf
eslint-all.js 所有规则
eslint-recommended.js 推荐规则
```
