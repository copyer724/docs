# Taro 邂逅

taro 是京东的`凹凸实验室`开发的，在 2018 年 6 月 17 日进行开源的，一个跨平台，跨端的框架。

[taro 文档教程](https://taro-docs.jd.com/docs/)

## 跨平台发展历史

- 2015 年， react native 出现，基于 react
- 2016 年，weex 出现，基于 vue
- 2017 年，flutter，微信小程序，uniapp 出现
- 2018 年，taro 出现

## taro 的阶段

`编译阶段`：将 taro 代码通过 babel 进行转化，比如说 wxml 等。

`运行阶段`：注册数据和事件，保证和宿主平台的一致性。

<img src="/images/frames/taro/taro_01.png" style="zoom:30%;" />

## 项目创建

方式一：全局安装（推荐）

```bash
npm i -g @tarojs/cli

taro init myApp
```

方式二：利用 npx 安装

```bash
npx @tarojs/cli init myApp
```

## 目录结构

[官网：目录结构](https://taro-docs.jd.com/docs/folder)

<img src="/images/frames/taro/taro_02.png" style="zoom:50%;" />

## 生命周期

- 组件生命周期 useEffect (执行顺序发生在 useReady 之前)
- 应用生命周期 `useLoad` > `useReady` > `useDidShow` (useReady 和 useDidShow 与小程序中的执行顺序不一样)

::: danger 注意
小程序: onLoad > onShow > onReady

taro: useLoad > useReady > useDidShow
:::

## 全局数据

- taroGlobalData
- 全局样式
