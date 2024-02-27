---
title: Blogging Like a Hacker
lang: en-US
---

[[toc]]

# vitepress markdown 语法升级

**markdown** 的基本语法本身已经很强大了，但是 `vitepress` 更是加强了 markdown 的语法，使写文档或者博客更加的强大，也更加的好看，美观。

[markdown 扩展](https://vitepress.dev/zh/guide/markdown)

上面是 vitepress 官网对 markdown 语法扩展的地址。但是也阻止不了亲自试一试。

## 标题瞄点{#copyer}

这里的写法是这样的：`标题瞄点{#copyer}`，给标题 dom 上新增了一个 id 属性，属性值为 copyer。

也可以新增一个类名，`标题瞄点{.copyer}`，这样就给标题 dom 新增了一个 class 属性，属性值为 copyer。

既然知道了可以给 dom 上新增属性，那么就可以设置样式，只需要在文档中添加：

(**注意：不是在代码块里面添加，而是直接写在 md 文档中**)

```html
<style>
  #copyer {
    color: red;
  }
</style>
```

<style>
#copyer { 
  color: red
}
</style>

这样标题的颜色就变成红色了。

## 链接

内部链接和外部链接都进行了特殊处理。

#### 内部链接

内部链接支持`绝对路径`和`相对路径`

```md
[Home](/) <!-- 将用户导航至根目录下的 index.html -->
[foo](/foo/) <!-- 将用户导航至目录 foo 下的 index.html -->
[foo heading](./#heading) <!-- 将用户锚定到 foo 索引文件中的一个标题上 -->
[bar - three](../bar/three) <!-- 可以省略扩展名 -->
[bar - three](../bar/three.md) <!-- 可以添加 .md -->
[bar - four](../bar/four.html) <!-- 或者可以添加 .html -->
```

::: tip
文件的后缀名： 可以省略、.md、.html 三种形式，最后都会转化为 .html 后缀名
:::

这里，我比较喜欢**绝对路径**，根据个人喜欢。

#### 外部链接

- 点击链接，打开新的标签页
- 支持文件下载

[百度一下(系统外链接)](https://www.baidu.com)：默认就是打开新的标签页

[工具首页(系统内链接)](./index.md){target="\_blank" rel="noreferrer"}：默认就是覆盖当前标签页。写法`[工具首页](./index.md){target="_blank" rel="noreferrer"}`

[下载 json 文件](./code/test.json){target="download" download}：默认就是覆盖当前标签页。写法`[下载 json 文件](./code/test.json){target="download" download}`

## frontmatter

YAML 格式的 frontmatter 开箱即用：

```yaml
---
title: Blogging Like a Hacker
lang: en-US
---
```

很强大，属性也很多，需要自己去研究

## 表格

github 的风格，但是更加方便的设置 text-align

```md
| Tables        |      Are      |  Cool |
| :------------ | :-----------: | ----: |
| col 3 is      | right-aligned | $1600 |
| col 2 is      |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |
```

| Tables        |      Are      |  Cool |
| :------------ | :-----------: | ----: |
| col 3 is      | right-aligned | $1600 |
| col 2 is      |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |

`:` 在左边，就是靠左对齐

`:` 两边对齐，就是居中对齐

`:` 在右边，就是靠右对齐

## 表情包

[emoji 列表](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.mjs)

使用方法(两边加 `:`)：`:100:` :100:

## 目录表（TOC）

使用方式: `[[toc]]`

一般直接在文章的最上面写即可（这个我感觉很少使用，因为有右侧导航了）

## 高亮自定义容器

```md
::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::
```

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::

如果针对上面的 `info、tip、warning、danger、details` 描述不满意的话，可以采取两种方式：

- 局部设置

```md
::: danger 你的名称
This is an info box.
:::
```

::: danger 你的名称
This is an info box.
:::

- 全局设置

```ts
export default defineConfig({
  // ...
  markdown: {
    container: {
      tipLabel: "提示",
      warningLabel: "警告",
      dangerLabel: "危险",
      infoLabel: "信息",
      detailsLabel: "详细信息",
    },
  },
  // ...
});
```

## 代码块高亮

基本语法就是使用 ` ```js ` 形式，这也是 markdown 语法自带的支持的。

### 一行代码高亮

第二行代码高亮 ` ```js{2} `

```js{2}
function foo() {
  let name = "copyer";
  console.log(name);
}
```

### 多行代码高亮

第二行代码高亮 ` ```js{2,4-5} `

```js{2,4-5}
function foo() {
  let name = "copyer";
  let age = 20;
  console.log(name);
  console.log(age);
}
```

- 多行：例如 `{5-8}、{3-10}、{10-17}`
- 多个单行：例如 `{4,7,9}`
- 多行与单行：例如 `{4,7-13,16,23-27,40}`

### 代码聚焦

独显一行 `// [!code focus]`，以注释的形式。

也可以指定多行：`// [!code focus:<lines>]`，注释的行号，开始向下数行数。

```js
function foo() {
  let name = "copyer";
  let age = 20;
  console.log(name); // [!code focus:2]
  console.log(age);
}
```

### 代码块新增和删除

都是以注释的形式

- `// [!code --]`
- `// [!code ++]`

```js
function foo() {
  let name = "copyer";
  let age = 20;
  console.log(name); // [!code --]
  console.log(age); // [!code ++]
}
```

### 代码高亮 ”警告“ ”错误“

都是以注释的形式

- `// [!code warning]`
- `// [!code error]`

```js
function foo() {
  let name = "copyer";
  let age = 20;
  console.log(name); // [!code warning]
  console.log(age); // [!code error]
}
```

## 导入代码片段

`<<< @/filepath` 通过该语法导入代码文件。`@/filepath` 是使用的绝对路径，根据你配置的 `srcDir` 有关。当然也可以直接使用相对路径。

会自动推断文件的后缀名

```md
<<< ./code/test.json
```

<<< ./code/test.json

代码高亮

```md
<<< ./code/test.json{2}
```

<<< ./code/test.json{2}

## 代码组

最期待的功能，以前每次写的代码很长，可以导入代码组，太安逸了。

````md
::: code-group

```js [config.js]
/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  // ...
};

export default config;
```

```ts [config.ts]
import type { UserConfig } from "vitepress";

const config: UserConfig = {
  // ...
};

export default config;
```

:::
````

::: warning

上面的写法，在写成代码块的形式，就需要 ` ````md ` 来表达了，因为里面已经存在三个反引号的。
:::

::: code-group

```js [config.js]
/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  // ...
};

export default config;
```

```ts [config.ts]
import type { UserConfig } from "vitepress";

const config: UserConfig = {
  // ...
};

export default config;
```

:::

```md
::: code-group

<<< ./code/copyer.html
<<< ./code/copyer.css
<<< ./code/copyer.js

:::
```

也支持导入文件，相当的 nice。

::: code-group

<<< ./code/copyer.html
<<< ./code/copyer.css
<<< ./code/copyer.js

:::

## 嵌套 md 文档

这种情况，一般适用于**存在相同的头部和尾部**，那么就可以使用嵌套的 md 形式来解决

```md
# Docs

## Basics

<!--@include: ./parts/basics.md-->
```

vitepress 对 markdown 扩展的语法还是比较多的，也非常的实用，继续加油，努力干。
