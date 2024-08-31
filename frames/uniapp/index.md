# uni-app

## 原生 VS 跨平台

### 原生

优点：性能稳定，使用流畅，功能齐全，兼容性好，方便使用硬件接口

缺点：维护成本高，多个平台多次开发

### 跨平台

优点：一套代码多端使用，开发时间短。

缺点：性能较差，不合适做高性能的应用程序。兼容性适配比较麻烦。

## 安装

- 可视化界面: `HBuilder X` 进行项目创建
- vue-cli

```bash
npm install -g @vue/cli

vue create -p dcloudio/uni-preset-vue my-project-name

# 或者 (环境有要求： Vue3/Vite版要求 node 版本 18+、20+)
# vite + vue3 版本
npx degit dcloudio/uni-preset-vue#vite my-vue3-project
# vite + vue3 + ts 版本
npx degit dcloudio/uni-preset-vue#vite-ts my-vue3-project

```

> vue3 + vite 没有创建成功

## 开发工具

`HBuilderX`， 专门为 uniapp 开发的开发工具（开发体验极好），也完全支持 vue3 的写法。

[安装工具](https://www.dcloud.io/hbuilderx.html)

## 学习笔记

### pages.json

- pages: 页面配置
- globalStyle: 窗口配置
- tabBar: 底部导航栏配置

### css

- 默认支持 scss
- 全局 css 变量名配置：uni-scss。在该文件下定义的变量，就不需要导入，在组件中直接使用。
- 支持 `@import '@/common/css/reset.css';` 分号不能少。
- 针对全局样式写在 App.vue 中的 style 标签中，不能写 scoped，否则样式没有效果。
- 针对页面样式写在 Page.vue 中的 style 标签中，也不需要写 scoped，内部已经开启。
- 想要针对根容器样式编写，直接在 App.vue 中，直接对 page 样式编写。
- 默认支持 scss, style 标签中还是需要开启 lang='scss'。
- 背景图片：支持 base64, 支持网络图片；而小程序不支持在 css 中使用本地文件，需要使用 base64。小于 40kb 的图片，可以使用 base64，而大于 40kb 的图片，需要使用网络地址；背景图片也支持使用 `~@/`绝对路径。（小程序的图片转化成 base64,必须放在 static 文件夹下，不能在二级目录下，就不能转化）

### 单位

- 标准设计稿以 750px 进行设计
- 在样式编写中，推荐使用响应式像素：`rpx`。
- 转化规则：`750 * 元素在设计稿中的宽度 / 设计稿的基准宽度`。

### main.js

- 条件编译判断：是 vue2 还是 vue3
- vue3 调用的是 `createSSRApp` 函数

### App.vue

- 应用的生命周期
- 编写全局样式
- 全局数据
- App.vue 本身不是页面，不是视图元素，不能编写 template 元素。
- 应用的生命周期只能在 App.vue 中使用，在页面中监听无效。

```ts
export default {
  onLanch(options) {
    console.log(options); // 拿取配置对象数据
  },
};
```

### uniapp 提供方法

> 都兼容 H5 小程序 app

- getApp(): 用于获取全局数据，改全局数据在 App.vue 中进行定义（globalData）。
- getCurrentPages(): 用于获取当前页面栈。返回的是: 数组。其中的 route 是路由信息。

### 内置组件

- `view` (div 支持，但是不推荐)
- `text`
- `button`: _主题颜色在 H5 和小程序中表现出不一致的行为_，button 组件最好二次封装使用。
- `image`: **默认宽度为 320px, 高度为 240px**（所以针对自己的图片，宽度和高度都是自己要写好）。支持方式：相对路径，绝对路径，base64, 导入。
- `scroll-view`: 设置纵向和横向的滚动，必须设置高度和宽度，才能有效果；针对上拉加载和下拉刷新，就不推荐使用了，而使用页面的滚动，性能好，页面不卡。
- `swiper`: 轮播图。

::: tip 组件提升，采用 `u + 组件首字母字母` 就有提示
:::

### 字体图标

- 支持 iconfont 图标，下载下拉，在 App.vue 中导入其中的 css 和 ttf 文件即可。

### 扩展组件

推荐使用 uni-ui，性能中的标杆。安装方式：

- 组件单独安装
- uni_modules 引入全部组件
- npm 方式
- 主题色定制
- 样式覆盖 important

### 开发注意事项

- 修改配置文件后，需要重启才能生效。
