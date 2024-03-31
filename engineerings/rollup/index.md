# Rollup

## Rollup 的基本介绍

Rollup 是一个 JavaScript 模块打包工具，可以将多个小的代码片段编译为完整的库和应用。

- rollup 是一个模块化打包工具，webpack 也是一个模块化打包工具。但是 rollup 主要是针对 ES Module 进行打包的，而 webpack 可以兼容多种模块化规范（但是其实内部也都是转化为 commonjs 类似的形式）
- rollup 更加**专注对 JavaScript 进行处理**（当然配置后，也可以打包 CSS 等文件）；而 webpack 可以通过各种 loader 处理各种文件。
- 对于配置和理念而言，rollup 理解会更加的简单和容易理解。
- 对于体积而言，rollup 轻巧，webpack 繁重
- rollup 也支持 tree-shaking，webpack 的 tree-shaking 理念也是借鉴与 rollup 的。

## Rollup 使用场景

- 针对一些库，UI 框架进行使用。

## Rollup 插件列表

https://github.com/rollup/awesome?tab=readme-ov-file

## Rollup 学习手册

- [rollup 基本配置](./rollup%20基本配置.md)
