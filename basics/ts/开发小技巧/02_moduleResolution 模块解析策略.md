# moduleResolution 模块解析策略

## 默认值

```json
{
  "compilerOptions": {
    "moduleResolution": "node" // 模块解析策略，ts默认用node的解析策略，即相对的方式导入
  }
}
```

## 何为模块解析策略？

就是在使用相对路径，或者第三方包的时候，规定 ts 的查找规则。

```js
//  路径形式
import A from "./moduleA";
import A from "../moduleA";
import A from "/moduleA";

// 三方库形式
import A from "moduleA";
```

其属性值包含：

- `classic` 就是相对父级一层一层的查找
- `node` 就是相对 node_modules 一层一层的查找
- `node16/nodenext`
- `bundler（ts5）`

## 属性值设置

设置属性 moduleResolution 指定哪种解析策略，或者 -- moduleResolution 指定；
如果没有指定，就根据 module 属性来设置默认值

- module 为 amd、system、es2015 时，moduleResolution 为 classic
- 其他情况为 node

## classic 的查找

### 相对路径形式

```js
// /root/src/folder/A.ts
import B from "./moduleB";
```

查找顺序：

1. /root/src/folder/moduleB.ts
2. /root/src/folder/moduleB.d.ts

### 三方库

```js
// /root/src/folder/A.ts
import B from "moduleB";
```

查找顺序：

1. /root/src/folder/moduleB.ts
2. /root/src/folder/moduleB.d.ts
3. /root/src/moduleB.ts
4. /root/src/module.d.ts
5. /root/moduleB.ts
6. /root/moduleB.d.ts
7. /moduleB.ts
8. /moduleB.d.ts

## node 查找

::: info
下面是 js 的形式;
如果是 ts 的形式，那么在解析的路上 `.ts` 、`.tsx`、`.d.ts`
:::

### 相对路径形式

```js
// /root/src/folder/A.ts
import B from "./moduleB";
```

查找顺序：

1. /root/src/folder/moduleB.js
2. /root/src/folder/moduleB 文件夹下是否存在 package.json 文件，其文件里面是否有 main 属性（如果有 main 属性，其值为 'abc/index.js'）, 那么就会解析成 /root/src/folder/moduleB/abc/index.js
3. /root/src/folder/moduleB/index.js

### 三方库

```js
// /root/src/folder/A.ts
import B from "moduleB";
```

其查找顺序：

1. /root/src/folder/node_modules/moduleB.js
2. /root/src/folder/node_modules/package.json(如果指定了 main 属性)
3. /root/src/folder/node_modules/index.js
4. /root/src/node_modules/moduleB.js
5. /root/src/node_modules/package.json(如果指定了 main 属性)
6. /root/src/node_modules/index.js
7. /root/node_modules/moduleB.js
8. /root/node_modules/package.json(如果指定了 main 属性)
9. /root/node_modules/index.js
10. /node_modules/moduleB.js
11. /node_modules/package.json(如果指定了 main 属性)
12. /node_modules/index.js

::: warning
其规则就是一级一级的找 node_modules 文件夹，然后按照：

- 具体文件名
- package.json
- index.js
  :::

## node16/nodenext 查找

nodenext 模块解析策略严格按照最新的 nodejs 模块解析算法，来进行判断一个 ts 文件是 commonjs 模块还是 esm 模块。

导入时，必须是文件扩展名。

node16/nodenext 几乎没有使用，用的最多的，还是 node。

## bundler 查找

`bundler` 是 TypeScript5.0 新增的一个模块解析策略。

最理想最标准的模块解析策略其实是 node16 / nodenext：严格遵循 ESM 标准并且支持 exports，并需要写导入的扩展名。

但是 vite 是基于 ESM 的，但是声明相对路径，确实不需要写扩展名的。

ts5.0 新增了个新的模块解析策略：bundler。它的出现解决的最大痛点就是：可以让你使用 exports 声明类型的同时，使用相对路径模块可以不写扩展名。
