# postcss 的前世今生

## 整体流程认识

认识 全屋净水系统 的流程

<img src="/images/basics/css/postcss_01.png" />

为什么要先了解全屋净水系统呢？因为它跟 postcss 的工作流程很相似。

全屋净水系统的目的：就是为了使人们喝上干净的纯净水。

postcss 的目的：就是为了使所有浏览器都是能够正常的运行 css 代码。

::: warning 温馨提升
什么能正常运行：

- css 新的语法，老的浏览器不支持，需要降级
- less / sass 等写法，浏览器不认识，需要编译
- 不同浏览器支持度不一样，需要添加独自的前缀
  :::
  <img src="/images/basics/css/postcss_02.png" />

## 说法认识

说法一：

postcss 和 less / sass 是一个级别的。（根据上面的流程图，明显不对，postcss 也是包含 less 等功能的）

说法二：
**postcss 是一个后处理器**。

postcss 已经停止维护对 less/ sass 等代码进行转化了，只需要拿到 less 和 sass 编译后的代码，进行下一步处理，因为是拿到 less 编译后的代码，所以称为后处理器。
