# Rollup 基本配置

### 基本认知

Rollup 是基于 ES Module 打包的，默认也只会打包 ES Module 的代码。

::: info 犯错记录
针对 commonjs 的导出，当进行导入时，也需要采用 ES Module 的形式，而不能使用 commonjs 的形式。rollup 不认识 `require` 函数。
:::

:::code-group

```ts [导出]
// a.js
module.exports = {
  name: "copyer",
};
```

```ts [导入]
// b.js
const info = require("./a.js"); // 错误方式 // [!code --]
import info from "./a.js"; // 正确方式 // [!code ++]
```

:::

### Rollup 打包

_形式_：

- 默认打包格式为 `ES Module` 形式。
- 在 node 环境下，是需要 commonjs 格式的，那么打包就需要打包成 `cjs` 的格式
- 在浏览器环境下，是需要被打包成一个`全局变量`形式的；比如类似 JQuery 的 $ 全局变量。
- 甚至说，还可能打包成 AMD 格式的（只是这种情况，使用的很少）
- 更夸张的说，打出的包可以适用各种场景。

_命令_：

其具体格式为：`npx rollup 源文件路径 -o 打包路径`

- `-o`: output 输出
- `-f`: format 格式
- `--name`: iife 格式取名（类似 jquery 的 $）
- `-c`: config 读取配置文件 rollup.config.js

_举例_：

```bash
npx rollup ./src/index.js -o ./build/dist.js  # 默认为 ES Module

npx rollup ./src/index.js -f cjs -o ./build/dist.js  # 格式为 commonjs

 #格式为浏览器变量
npx rollup ./src/index.js -f iife --name copyer -o ./build/dist.js

 # 通用格式
npx rollup ./src/index.js -f umd --name copyer -o ./build/dist.js
```

注意：当其中格式为浏览器变量时, `--name` 是需要写的，不然 window 对象上没法添加属性

### Rollup 配置文件

rollup 终端命令，是助于其理解。对于开发者而言，真正要掌握的是**配置文件 rollup.config.js**。

通过 `npx rollup -c` 来执行配置文件

```ts
import { defineConfig } from "rollup";

export default defineConfig({
  // 源码文件路径 // [!code error]
  input: "./src/index.ts",
  // 输出文件路径（单文件） // [!code error]
  output: {
    format: "esm",
    file: "dist/build.esm.js",
  },
  // 输出文件路径（多文件） // [!code error]
  output: [
    {
      format: "esm",
      file: "dist/build.esm.js",
    },
    {
      format: "cjs",
      file: "dist/build.cjs.js",
    },
    {
      format: "umd",
      name: "copyer", // 对应 --name
      file: "dist/build.js",
      // 解决打包警告⚠，需要一个全局变量 _，提示很友好，一看就懂
      globals: {
        lodash: "_",
      },
    },
  ],
});
```

### Rollup 基本配置插件

#### 兼容 commonjs

rollup 打包只会处理 ES Module 规范的。但是实际情况，还有很多写法，或者很多库都是采用的 commonjs 规范，那么这时候就需要对 commonjs 打包，才能正常的跑项目。

- `@rollup/plugin-commonjs`: 针对自己的 commonjs 语法进行处理，进行打包，但是处理不了 node_modules 中的 commonjs 语法。
- `@rollup/plugin-node-resolve`: 处理 node_modules 中的 commonjs 语法进行打包。

```ts {3,4,7}
import { defineConfig } from "rollup";

const commonjs = require("@rollup/plugin-commonjs");
const nodeResolve = require("@rollup/plugin-node-resolve");

export default defineConfig({
  plugins: [commonjs(), nodeResolve()],
});
```

#### 排除插件打包

打包排除一些三方库（因为不需要被打包，在使用的项目中已经被安装了，或者采用了 CDN 的形式）

```ts {8}
import { defineConfig } from "rollup";

const commonjs = require("@rollup/plugin-commonjs");
const nodeResolve = require("@rollup/plugin-node-resolve");

export default defineConfig({
  plugins: [commonjs(), nodeResolve()],
  external: ["lodash"],
});
```

#### babel 转化

es6 转化为 es5, 处理 polyfill 等等，都是需要 babel 进行转化

```bash
pnpm add @rollup/plugin-babel @babel/core @babel/preset-env -D
```

```ts
// rollup.config.ts
const { babel } = require("@rollup/plugin-babel");
module.exports = {
  plugins: [
    // babelHelpers 类似 polyfill
    // exclude: 排除对某些文件的转化
    babel({ babelHelpers: "bundled", exclude: /node_modules/ }),
  ],
};
```

```ts
// babel.config.js
module.exports = {
  presets: ["@babel/preset-env"],
};
```

#### 丑化

代码压缩。采用最新的插件：`@rollup/plugin-terser` ( rollup 3.x 的)

```ts
const terser = require("@rollup/plugin-terser");
module.exports = {
  plugins: [terser()],
};
```

#### css

利用 postcss 工具来处理 css 是最佳的方案（无论是 webpack，还是 rollup，甚至后面的 vite 都是一样的）

```bash
pnpm add rollup-plugin-postcss postcss postcss-preset-env -D
```

```ts
// rollup.config.ts
const postcss = require("rollup-plugin-postcss");
module.exports = {
  plugins: [postcss()],
};
```

这样配置后，rollup 就能够正常的解析 css 代码了，使 CSS 效果生效。但是也会存在一些兼容性问题，那么这里不是安装插件，就是采用预设（postcss-preset-env）。显然采用预设是更好的。

```ts
// postcss.config.js
module.exports = {
  plugins: [require("postcss-preset-env")], // 注意写法 require // [!code warning]
};
```

#### typescript

```bash
pnpm add @rollup/plugin-typescript -D
```

```ts
// rollup.config.js
import typescript from "@rollup/plugin-typescript";

export default {
  plugins: [typescript()],
};
```

::: tip 节点
基于上面的一些列插件，一个第三方库的搭建可以基本 OK。
:::

#### 本地服务器搭建

- `rollup-plugin-serve`： 搭建服务器
- `rollup-plugin-livereload`： 自动刷新

```bash
pnpm add rollup-plugin-serve rollup-plugin-livereload -D
```

```ts
const serve = require("rollup-plugin-serve");
const livereload = require("rollup-plugin-livereload");
module.exports = {
  plugins: [
    serve({
      // 端口
      port: "8000",
      // 当前的工作路径
      contentBase: ".",
      // 自动打开浏览器
      open: true,
    }),
    livereload(),
  ],
};
```

package.json 设置执行命令

```json
{
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w" // -w watch 开启文件监听
  }
}
```

### Rollup 环境区分

```json
{
  "scripts": {
    "build": "rollup -c --environment NODE_ENV:production",
    "dev": "rollup -c --environment NODE_ENV:development -w"
  }
}
```

然后在 rollup.config.ts 中使用 `process.env.NODE_ENV` 来读取变量，进行相应的配置。

```ts{23-26}
const commonjs = require("@rollup/plugin-commonjs");
const nodeResolve = require("@rollup/plugin-node-resolve");
const { babel } = require("@rollup/plugin-babel");
const terser = require("@rollup/plugin-terser");
const postcss = require("rollup-plugin-postcss");
const replace = require("@rollup/plugin-replace");
const serve = require("rollup-plugin-serve");
const livereload = require("rollup-plugin-livereload");

// 是否生产环境
const isProduction = process.env.NODE_ENV === "production";

const plugins = [
  commonjs(),
  nodeResolve(),
  babel({
    babelHelpers: "bundled",
    exclude: /node_modules/,
  }),
  postcss(),
  vue(),
  // 用于代码逻辑替换
  replace({
    preventAssignment: true,
    "process.env.NODE_ENV": "`development`",
  }),
];

if (isProduction) {
  // 在开发环境，才需要丑化
  plugins.push(terser());
} else {
  // 开发环境，才需要本地服务器一些列插件
  const _plugins = [
    serve({
      port: "8000",
      contentBase: ".",
      open: true,
    }),
    livereload(),
  ];
  plugins.push(..._plugins);
}

module.exports = {
  plugins, // 使用插件 // [!code error]
};
```
