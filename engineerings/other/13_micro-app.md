# micro-app

京东产品：微前端

## 基本使用

- [快速开始](https://micro-zoe.github.io/micro-app/0.x/docs.html#/zh-cn/start)
- [react](https://micro-zoe.github.io/micro-app/0.x/docs.html#/zh-cn/framework/react)
- [vue](https://micro-zoe.github.io/micro-app/0.x/docs.html#/zh-cn/framework/vue)
- [vite](https://micro-zoe.github.io/micro-app/0.x/docs.html#/zh-cn/framework/vite)

### vite + vue3 + 主应用

::: code-group

```ts{5,7} [main.ts]
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { router } from "./router";
import microApp from "@micro-zoe/micro-app";

microApp.start();

createApp(App).use(router).mount("#app");
```

```ts{16-20} [route.ts]
import { createWebHistory, RouteRecordRaw, createRouter } from "vue-router";
import Home from "../pages/home/home.vue";
import SubPro from "../pages/sub_pro/index.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../pages/about/about.vue"),
  },
  {
    path: "/sub-pro/:page*",
    name: "subPro",
    component: SubPro,
  },
  {
    path: "/:pathMatch(.*)*", // 404匹配，固定写法
    name: "NotFound",
    component: () => import("../pages/404/index.vue"),
  },
];

export const router = createRouter({ routes, history: createWebHistory() });
```

```vue{5,7} [App.vue]
<template>
  <div>
    <button @click="run()">首页</button>
    <button @click="run('about')">关于</button>
    <button @click="run('sub-pro')">子应用</button>
  </div>
  <RouterView />
</template>
```

```vue [sub-pro/index.vue]
<template>
  <div>
    <div>子应用</div>
    <micro-app
      name="subPro"
      url="http://localhost:5174/"
      baseroute="/sub-pro"
      iframe
    ></micro-app>
  </div>
</template>
```

```ts [vite.config.ts]
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith("micro-app"),
        },
      },
    }),
  ],
});
```

:::

### vite + vue3 + 子应用

基本上都处于正常编写，就路由 base 修改一下

```ts{18} [route/index.ts]
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../pages/home/index.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/:pathMatch(.*)*", // 404匹配，固定写法
    name: "NotFound",
    component: () => import("../pages/404/index.vue"),
  },
];

export const router = createRouter({
  history: createWebHistory((window as any).__MICRO_APP_BASE_ROUTE__ || "/"),
  routes,
});
```

## 注意点

- 每个子应用容器元素 id 的唯一性
- name 必须以字母开头，且不可以带有除中划线和下划线外的特殊符号

## 报错处理

#### 错误问题 1：

```bash
index.vue:5 [Vue warn]: Failed to resolve component: micro-app
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.
  at <Index onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< null > >
  at <RouterView>
  at <App>
```

_解决方案_：

**vue2.x**

在主应用的入口文件（如 main.js 或 main.ts）中，你可以添加以下配置来忽略特定元素：

```ts
import Vue from "vue";
Vue.config.ignoredElements = [/^micro-app$/];
```

**vue3.x**

在 Vue 3 中，你可以在 vite.config.js 或 webpack.config.js 中配置 isCustomElement 选项来避免这个警告

```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith("micro-app"),
        },
      },
    }),
  ],
});
```

这段配置告诉 Vue 编译器将所有以 micro-app 开头的标签视为自定义元素，从而避免组件解析失败的警告。

#### 错误问题 2

针对 vite 项目，子应用加载不成功，原因是配置了:

```ts
if (window.__MICRO_APP_ENVIRONMENT__) {
  /* @ts-ignore */
  __webpack_public_path__ = window.__MICRO_APP_PUBLIC_PATH__;
}
```

**解决方案**：vite 项目不需要配置，webpack 项目才需要配置
