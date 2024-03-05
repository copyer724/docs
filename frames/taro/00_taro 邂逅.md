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

## CSS 单位

**在 taro 中写尺寸按照 1:1 关系来写，1px 转化为 1rpx**。

CSS 单位推荐使用 px,

- 在小程序编译时，1px 转化为 1rpx。（看配置文件比例即可）
- 在 h5 中转化为 rem

针对行列样式，单位是不会被转化的。但是如果想单位被转化：`Taro.pxTransform()`

**针对 react 开发，无论是页面中的样式，还是组件中的样式都是全局样式，那么需要通过命名进行隔离，那么 css module 是最好的推荐，taro 也是一样。**

在 taro 中，css module 的支持是默认没有开启的，当需要使用时，需要去 `config/index.js` 中开启。

css 编译时忽略:

1. 单个属性：px 单位使用**大写字母**
2. 忽略整个样式文件: 头部包含注释 `/*postcss-pxtransform disable*/` 的文件，插件不予转换处理

## 背景图片和字体图标

针对 css 中引入背景图片：

- 相对路径： 小程序、h5 支持
- 绝对路径： h5 支持，小程序支持（绝对路径的写法 `~@/assets/images/bg.png`）

::: tip 注意小程序中的背景图片
小程序中的背景图片，只支持 base64 图片。针对体积较大的图片，使用网络图片。（引用本地资源是引用 `postcss-url` 转化为 `base64` 格式 ）
:::

配置小程序图片多大会被转化成 base64, 而超出的，就不会转化，从而展示不出来

```js
// config/index.ts
export const config = {
  mini: {
    url: {
      enable: true, // 默认会进行转化
      config: {
        limit: 1024, // 设定转换尺寸上限 1M 转化为base64, 超出就不会被转化
      },
    },
  },
};
```

::: danger 注意
`limit` 好像无效，要使用 `maxSize` 属性，待验证
:::

字体图标，正常引入 iconfont 中的 css 即可（在全局样式中引入）

```css
/* app.less */
@import ("./assets/iconfont/index.css");
```

## 页面间的通信

### 正向：url

**方式一**： url 的方式 `?name=james&age=12`

获取参数:

1. `onLoad` 或者 `useLoad` 中的 options 拿取信息
2. `Taro.getCurrentInstance().router.params` 拿取路由信息

### 正向：eventChannel （仅支持小程序）

```ts
// Home Page
Taro.navigateTo({
  url: "/detail",
  success: function (res) {
    // 通过eventChannel向被打开页面传送数据
    res.eventChannel.emit("homeData", { data: "传递给detail的数据" });
  },
});
```

```ts
// Detail Page
onLoad: function(option){
  const $intance = Taro.getCurrentInstance()
  const eventChannel = $intance.page.getOpenerEventChannel()
  // 监听 homeData 事件，获取上一页面通过eventChannel传送到当前页面的数据
  eventChannel.on('homeData', function(data) {
    console.log(data) // 获取到数据
  })
}
```

### 方向

```ts
// 反向传递
eventChannel.emit("acceptDataFromOpenedPage", { data: "test" });
eventChannel.emit("someEvent", { data: "test" });
```
