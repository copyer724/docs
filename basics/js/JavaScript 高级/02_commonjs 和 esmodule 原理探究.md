# commonjs 和 es module 的原理探究

## 篇前疑问

- 说说 commonjs 和 es module 的区别？说出几点？
- 说说 cjs 中的 `require` 加载大致过程？（从多方面思考，文件的查找，文件的缓存等等）

## 基本使用

[commonjs 和 es module 基本使用](../JavaScript%20开发小知识/02_模块化的基本使用.md)

很简单的，不用多说。

## commonjs

### 值的变化

不管是导出修改，还是在导入修改，只需要记住一句话： **`require()` 就是一个`浅拷贝`，对基本数据类型的修改不会存在相互影响；但是如果是引用类型，则就会产生相互的影响，因为共享一个内存地址**。

::: danger 痛苦
以前自己总是在这里纠结，写各种代码，画各种图，总是用于来加深理解。
:::

### require 函数内部实现原理

```js
const fs = require("fs");

function require(xxx) {
  // 读取文件
  fs.readFileAsyn(xxx);
  // 找到文件的module.exports, 并返回
  return module.exports;
}
```

就是读取文件的 `module.exports` 代码，进行返回（那么这里就是指向内存的同一个地址）

### module.exports 与 exports 的区别

在上面的 require 函数原理中，返回的是文件中的 module.exports 内容。那么 exports 是干什么的呢？

```js
// node 源码
exports = module.exports; // 这里内存指向同一个地址
```

代码说话，判断内容是否被导出

```js
// 都是往内存的同一个地址添加，所以导入是可以获取的（指向的是module.exports）
exports.name = "copyer";
exports.age = 123;

// 开辟了一个地址，跟module.exports的地址是不同的，所以不能被导出
exports = {
  name: "copyer",
  age: 123,
};
```

### require 的查找规则

导入使用：`require(xxx)`，这里的 xxx 是一个字符串，这里要分为三种情况：

**情况一：xxx 是 node 的核心模块**

比如说：path(路径模块) 、fs(文件模块) 等等。

那么针对这种情况，就是直接返回。

**情况二：以 `./` `..` `/` 开头的**

这种看看，就知道是相对路径或者绝对路径，那么就会有一套文件的查找规则。

- 先看成文件，在对应的在对应的目录下查找。
  1. 如果存在后缀名，按照后缀名的格式查找对应的文件
  2. 如果不存在后缀名，会按照下面的顺序查找：
     ::: tip 文件查找规则
     1. 直接查找 xxx 文件
     2. 查找 xxx.js 文件
     3. 查找 xxx.json 文件
     4. 查找 xxx.node 文件
        :::
- 没有找到对应的文件，就会看成一个文件夹

  1. 查找文件夹下的 index 文件
     ::: tip 文件夹查找规则
     1. 查找 xxx/index.js 文件
     1. 查找 xxx/index.json 文件
     1. 查找 xxx/index.node 文件
        :::

- 如果还是没有找到：`not found`

**情况三：三方包**

三方包，也就是去 `node_modules` 下面寻找资源。

每个 js 文件都是一个模块，那么每个文件夹下都会存在一个 module 对象。

::: tip
如果清楚 webpack 的打包原理，会很清晰的知道 module 对象是怎么来的
:::

```js
console.log(module.path); // 查看文件的模块资源路径对应路径
```

就会发现有类似的结构：

<img src="/images/basics/js/commonjs_01.png" />

就会先查找当前路径下的 node_modules 文件，找到返回；没找到，继续上一层去找，直到找到为止。找不到就报错：`not found`

### 模块加载

模块的加载是串行的。如果寻找多个 `require`, 就会先加载一个，完成之后再加载一个（就类似代码一行一行的执行）。

模块的加载就是文件中代码的执行。如果一个文件被多次嵌套，但是文件中的代码只会执行一次，进行缓存；后面文件被加载时，就从缓存中读取。

```js
// module对象下，存在一个loaded属性，就是用来判断是否已经被加载了
console.log(module.loaded); // false

// 默认是false，模块被执行一次之后，就变为true了。就标志第二次引入之后，就不用在执行了。
```

## ES Module

### 静态分析

`静态分析` 理解 es module 的关键。**所谓静态分析，就是在代码没有执行之前，就开始分析代码（寻找 `import` 和 `export` 关键词），理清其中的依赖关系（如果找不到模块，就会直接抛出异常）**。

```js
// 错误的代码
if (false) {
  import { name } from "./foo.js";
}
```

那么针对像上面的代码，就会直接错误异常（静态分析和 js 是分开解析的）

### 代码是否阻塞？

```js
// 同步
import { name } from "./foo.js";
console.log("上面的导入完成之后，才会执行下面的代码");

// 异步，采用 import() 函数
import("./foo.js").then((res) => {
  console.log(res);
});
console.log("这里会先执行");
```

### 解析原理

文章推荐：[ES modules: A cartoon deep-dive](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/)

其中原理解释的非常清楚，分为三个阶段走：

**第一个阶段：构建**

入口文件开始分析（例如： main.js）。根据地址查找 js 文件，并且下载，将其解析成模块记录（Module Record）。

就比如下面（三个文件之间的依赖关系）

<img src="/images/basics/js/es_module_01.png" />

针对依赖进行分析

<img src="/images/basics/js/es_module_02.png" />

从 `script` 标签中，找到 `main.js` 的真实路径，fetch 获取文件内容（代码），形成 Module Record。然后继续递归的进行分析，形成多个 Module Record。

**第二个阶段：实例化**

何为实例化？简单的来说，就是对 Module Record 进行内存空间分配，解析 import 和 export 语句，指向对应的内存地址。

::: warning
指向内存地址，并不代表赋值哈。只是占据了内存空间，其中里面的内容都是空的（undefined）
:::

**第三个阶段：运行**

运行代码，计算值，然后填充在相应的内存中。

<img src="/images/basics/js/es_module_03.png" />

::: warning
只允许导出能修改，导入不能修改。
:::

## 符号绑定
