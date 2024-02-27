# JavaScript 运行环境

## 篇前疑问

- 说说浏览器内核呢？
- 说说 JavaScript 内核？

## 认识 JavaScript

JavaScript 是一门编程语法，简单的来说，是一门高级的编程语言。为啥说是**高级的编程语言**呢？

那么有高级编程语法，那么就有低级编程语法。

- 机器语言（低级）：所谓的机器指令（二进制编码 01010011111000）
- 高级语法：C、C++、Java、JavaScript 等

针对计算机而言，根本就不认识所谓的高级语言，写的代码完全看不懂。想要被计算机所认识，那么就需要高级语言就需要转换成机器指令。所以针对 JavaScript 来说，**JS 代码就会被转化成机器语言，被计算机的 CPU 所认识。**

<img src="/images/basics/js/js_运行原理_01.png" />

编译转化，大致就如上图所示。

这解析过程就是 **JS 引擎** 完成的。

## 浏览器工作原理

有没有深入的思考过： JavaScript 代码是如何在浏览器中被执行的？

比如： 浏览器中输入 <http://www.baidu.com>，其中做了什么？

<img src="/images/basics/js/js_运行原理_02.png" />

步骤解析：

1. 输入 <http://www.baidu.com>, 就会被浏览器解析成一个 ip 地址（假设: 111:222:333:444）,根据这个 ip 地址，就会找到一台服务器，服务器就会返回一个 `index.html` 文件，用来解析。（注意: 这里并不是把所有的静态资源到返回了，在框架时代，就应该是所谓的**分包**操作吧。打包成多个 chunk.js, 用到时再加载）。
2. 在解析 index.html 过程中，如果遇到 link 标签，就会去服务器中下载对应的 css 文件；如果遇到了 script 标签，就回去服务器中下载对应的 js 文件。

在上面的过程中，拿到 index.html 文件被解析，那么是被谁所解析的呢？

答案是： **浏览器内核**

## 认识浏览器内核

不同的浏览器有不同的内核组成。

常见的几种内核：

- `Gecko`: 早期被 Netscape 和 Mozilla Firefox 浏览器使用。
- `Trident`: 微软开发，被 IE4~IE11 浏览器使用，但是 Edge 浏览器已经转向 Blink。
- `Webkit`: 苹果基于 KHTML 开发，开源的，用于 Safari，Google Chrome 之前也在使用。
- `Blink`: 是 Webkit 的一个分支，Google 开发，目前应用于 Chrome、Edge，Opera 等。

事实上，浏览器的内核指的是**浏览器的排版引擎**

排版引擎：也称为浏览器引擎，页面渲染引擎。从字面量的大致意思： 浏览器内核就是处理页面布局的。

### 浏览器渲染流程

<img src="/images/basics/js/js_运行原理_03.png" />

根据上面的图解，可以得出以下信息：

- HTML 经过 HTML Parser 生成解析 DOMTree，Style 经过 CSS Parser 解析生成 StyleRules。
- DOMTree 和 StyleRules 结合，生成渲染树（RenderTree）
- 执行 layout 过程，确定每个节点在屏幕上的确切坐标。
- 渲染树 绘制（Painting），然后展示在屏幕上。

::: danger
**注意**：上面的步骤并不是严格顺序执行的。浏览器引擎会以最快的速度展示内容。简单的来说，就是一边解析 HTML 一边构建渲染树，构建一部分，就会把以后的元素渲染出来。如果样式没有加载出来，就会以浏览器默认的样式展示。

`正是由于浏览器引擎的尽快展示内容，就会造成样式还没加载就展示的问题。这就是经常发生的FOCU（flash of unstyled content）或者白屏问题。`
:::

### CSS 加载不会阻塞 DOM 树的解析

通过上面的图解可以看出，HTML 解析和 CSS 解析，是并行的。所以 CSS 加载不会阻塞 DOM 树的解析

### CSS 加载会阻塞 DOM 树的渲染

渲染树（RenderTree）是 DOMTree 和 StyleRules 的结合。所以，就算 DOMTree 加载完成，也要等到 CSS 加载完成并解析完成，才能生成渲染树。

### JS 执行会阻塞 DOM 树的解析

从渲染图可以知道 HTML 解析成 DOMTree， 如果遇到 JavaScript 代码， 就会停止解析 HTML，就会把控制权交给 **JS 引擎**， 去执行 JavaScript 代码。当 JavaScript 执行完成后，浏览器再从中断的地方继续解析生成 DOM。

::: info
这也是建议将 script 标签放在 body 标签底部的原因。
:::

**特殊情况：**

在上面也说过了，CSS 加载不会阻塞 DOM 树的解析。但是呢？如果在解析 DOM 的时候，里面加入 script 标签，引入了 JavaScript 代码（js 是万能的，也可以修改 DOM，也可以修改样式）。如果 JavaScript 代码，需要修改样式，那么就需要等待 CSS 加载完毕，才能操作 CSS。所以在这种特殊的情况下，**css 加载也是会阻塞 DOM 的解析**。

### 优化渲染过程

- 使用内联的 JS、CSS，减少 JS、CSS 文件的下载。
- webpack 等工具对 JS、CSS 文件压缩，减少文件的大小。
- 使用 async 或者 defer。
- 使用 CDN。

## 认识 JavaScript 引擎

在上面的浏览器渲染过程中，在解析 DOM 的时候，会遇到 JavaScript 代码，那么这下的控制权就会交给 JS 引擎来执行 JavaScript 代码。

**为什么需要 JavaScript 引擎？**

前面说过，JavaScript 是一门高级的编程语言，想要被计算机 CPU 认识，就需要转化成机器指令。JavaScript 引擎就是来做这一件事的，`把JS代码转化机器指令`。

**常见的 JavaScript 引擎**

- `SpiderMonkey`: 第一款 JavaScript 引擎，由 Brendan Eich 开始（也就是 JavaScript 的作者）。
- `Chakra`: 微软开发，用于 IE 浏览器。
- `JavaScriptCore`: Webkit 中的 JavaScript 引擎， Apple 公司开发。
- `V8`: Google 开发的强大 JavaScript 引擎。

## 浏览器内核和 JavaScript 引擎的关系

这里以 Webkit 内核为例：

Webkit 事实上有两部分组成：

- WebCore: 负责 HTML 解析、布局、渲染等等事情。
- JavaScriptCore: 解析、执行 JavaScript 代码。

> 跟微信小程序架构很相似。

可以看出关系： JavaScript 引擎是浏览器内核组成的一部分。

## 认识 V8 引擎（了解）

**定义**

V8 引擎是 C++编写的 Google 开源高性能的 JavaScript 引擎，用于 Chrome 和 Node.js 等。

**运行流程**

<img src="/images/basics/js/js_运行原理_04.png" />

JS 引擎就是把 JavaScript 代码转化成机器指令，在计算机的 CPU 中运行。

**Parse 模块**拿到 JavaScript 源码会进行解析生成 AST 树，AST 树简单来说，就是一个固定格式对象，经过一系列的处理，变成字节码（bytecode）,最后变成机器指令。

> AST 树应该不陌生吧。在现在的框架时代，react 的 jsx 解析，vue 的 template 解析，还是 ts 解析，babel 解析等等操作，都是离不开生成 AST 树进行转换的。

测试 AST 树结构的地址： <https://astexplorer.net>

**V8 执行的细节**

Parse 的 V8 官网地址： <https://v8.dev/blog/scanner>

JavaScript 源码如何被解析（Parse）的呢？

- Blink 将源码交给 v8, Stream 获取源码并进行编码转换。

- Scanner 会进行词法分析，词法分析会将代码转化成 tokens。

  ```js
  const name = "copyer"; // 解析成tokens

  tokens = [
    { type: "VariableDeclaration", value: "const" },
    { type: "Identifier", value: "name" },
    { type: "Literal", value: "copyer" },
  ];
  ```

  大致的形式就是这样的。

- 然后就是 tokens 转化为 AST 树，会经过两个步骤 Parser 和 PreParser.

  - Parser 就是直接将 tokens 转成 AST 树。
  - PreParser 称为预解析，处理一些最开始不需要执行的代码，不需要转成 AST 树，只需要在调用的时候，才解析。目的就是为了性能优化。

- 最后就是根据 AST 生成 bytecode，转化成机器指令。

总的来说，上面的一系列步骤，只需要有点印象即可。但是需要了解一个步骤：

> Parse 模块解析，这里会进行**词法分析**和**语法分析**。
>
> 在开发过程中，`变量的提升就是在语法分析`这一步完成的。
