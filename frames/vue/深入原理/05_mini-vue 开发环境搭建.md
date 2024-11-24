# mini-vue 开发环境搭建

vue 源码的目录接口

<img src="/images/frames/vue/05_mini-vue_01.png" style="zoom:50%">

不难看出，vue 的源码是一个 monorepo 的结构。

我们也需要动手搭建。

## 搭建 monorepo 环境

`npm init -y` 不用多说

创建 `packages` 文件夹 和 `pnpm-workspace.yaml` 文件

```yaml
packages:
  - "packages/*"
```

monorepo 环境搭建好了，只需要在 packages 下创建对应的包。

先创建 `reactivity` 和 `shared` 包

<img src="/images/frames/vue/05_mini-vue_02.png" style="zoom:50%">

创建了`入口文件(src/index.ts)`和 `package.json` 文件

```json
{
  // 包名
  "name": "@vue/reactivity",
  // 版本号
  "version": "1.0.0",
  // esm 打包文件
  "module": "dist/reactivity.esm-bundler.js",
  // iife 打包文件
  "unpkg": "dist/reactivity.global.js",
  // 打包信息，在打包时有用
  "buildOptions": {
    "name": "VueReactivity",
    "formats": ["esm-bundler", "global", "cjs", "esm-browser"]
  },
  // 依赖 monorepo 的其他包
  "dependencies": {
    "@vue/shared": "workspace:^"
  }
}
```

在 `@vue/reactivity`包安装其他的包依赖，比如 `@vue/shared`

```bash
pnpm install @vue/shared --workspace --filter @vue/reactivity
```

`--workspace` 的作用就是安装自己 monorepo 下的包，而不是去 npm 上的拉包。

## 配置 ts 环境

安装 typescript 就不用多说

```bash
npx tsc -init # 去 node_modules/.bin/tsc 找指令
```

生成 tsconfig.json 文件

```json
{
  "compilerOptions": {
    "outDir": "dist", // 输出目录
    "sourceMap": true, // 是否生成 source map 文件
    "target": "ES2016", // 目标语法
    "module": "ESNext", // 模块格式
    "lib": ["ESNext", "DOM"], // 支持的库 dom 和 ESNext
    "moduleResolution": "node", // 模块解析策略
    "strict": true, // 严格模式
    "resolveJsonModule": true, // 解析JSON模块
    "esModuleInterop": true, // 允许通过 es6 语法引入 commonjs 模块
    "jsx": "preserve", // jsx 语法处理, 不转义
    "baseUrl": ".", // 以当前目录为根目录
    // 目录映射
    "paths": {
      "@vue/*": ["packages/*/src"]
    }
  }
}
```

上面都是采用自定义的，毕竟配置文件还是比较的多。

这里着重的就是要配置一下**目录映射（baseUrl 和 paths）**，目的是为了 monorepo 下的其他包能找到对应的包，能相互引用。

## 配置打包命令

在最外层的 package.json 中添加打包命令

```json
{
  "scripts": {
    "dev": "node scripts/dev.js reactivity -f esm" // -f: format
  }
}
```

- 使用 node 去执行 scripts/dev.js 文件
- 传入 reactivity 作为包名
- 传入 -f esm 作为打包格式

解析命令行参数，使用 minimist 包来进行解析

```bash
pnpm install minimist -D -w
```

在 `scripts/dev.ts` 文件中编写

```js
// 在 node 环境中, es6 模块中是没有 __filename, __dirname, require
import { createRequire } from "module";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import minimist from "minimist";

// 创建 require 函数
const require = createRequire(import.meta.url);

// import.meta.url 是 file:// 协议的
// 需要转化成 path 的正常路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(__filename, __dirname);

// 命令行参数都在 process.argv 中
// 模块名称 -f 输出格式
const args = minimist(process.argv.slice(2));
const target = args._[0] || "reactivity";
const format = args.f || "esm";

// 入口文件
const entry = resolve(__dirname, `../packages/${target}/src/index.ts`);

console.log(entry);
```

- dev.js 不能使用 import 形式导入，需要在 package.json 中添加 type: module
- esm 模块在 node 环境下，没有 `__dirname, __filename, require` 等全局变量，需要自行定义创建
- minimist 是一个命令行参数解析库，解析命令行参数，返回一个对象，方便我们取参数

```ts
console.log(process.argv);

/**
 * 打印结果，只需要取后面的参数，从第二个开始
    [
      '/usr/local/bin/node',
      'xxx/project/actor/mini-vue/scripts/dev.js',
      'reactivity',
      '-f',
      'esm'
    ]
 */
```

```ts
const args = minimist(process.argv.slice(2));
console.log(args);

/**
 * 打印结果： { _: [ 'reactivity' ], f: 'esm' }
 */
```

能拿到解析参数之后，就可以组装打包入口文件了。

## 开始打包

使用 esbuild 进行开发环境打包

```ts
import esbuild from "esbuild";

// iife 获取 globalName 对象， 在 package.json 中获取，因为是 json 对象，使用 require 进行获取
const buildOptions = require(`../packages/${target}/package.json`).buildOptions;

esbuild
  .context({
    entryPoints: [entry], //入口目录，支持多入口,
    outfile: resolve(__dirname, `../packages/${target}/dist/${target}.js`),
    platform: "browser", // 运行环境
    bundle: true, // 把依赖打包到一起
    format, // 打包格式
    globalName: buildOptions?.name, // 如果是 iife，需要指定一个全局变量名
  })
  .then((ctx) => {
    console.log("start dev");
    ctx.watch(); // 监听文件变化
  })
  .catch(() => {
    process.exit(1);
  });
```

再次执行 `pnpm dev`，就可以打包成功了

<img src="/images/frames/vue/05_mini-vue_03.png" style="zoom:50%">

## 完整打包文件代码

```ts
// 在 node 环境中, es6 模块中是没有 __filename, __dirname, require
import { createRequire } from "module";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import minimist from "minimist";
import esbuild from "esbuild";

// 创建 require 函数
const require = createRequire(import.meta.url);

// import.meta.url 是 file:// 协议的
// 需要转化成 path 的正常路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(__filename, __dirname);

console.log(process.argv);

// 命令行参数都在 process.argv 中
// node scripts/dev.js reactivity - f esm 解析出来是一个数组，只需要从第二开始取参数即可
// 模块名称 -f 输出格式
const args = minimist(process.argv.slice(2));

console.log(args);
const target = args._[0] || "reactivity";
const format = args.f || "esm";

// 入口文件
const entry = resolve(__dirname, `../packages/${target}/src/index.ts`);
// iife 获取 globalName 对象， 在 package.json 中获取，因为是 json 对象，使用 require 进行获取
const buildOptions = require(`../packages/${target}/package.json`).buildOptions;

console.log(entry);

// 使用 esbuild 开始打包

esbuild
  .context({
    entryPoints: [entry], //入口目录，支持多入口,
    outfile: resolve(__dirname, `../packages/${target}/dist/${target}.js`),
    platform: "browser", // 运行环境
    bundle: true, // 把依赖打包到一起
    format,
    globalName: buildOptions?.name,
  })
  .then((ctx) => {
    console.log("start dev");
    ctx.watch(); // 监听文件变化
  })
  .catch(() => {
    process.exit(1);
  });
```
