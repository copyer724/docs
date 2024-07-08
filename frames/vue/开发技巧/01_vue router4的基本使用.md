# vue-router4 的基本使用

[vue-router4 中文官网](https://router.vuejs.org/zh/guide/)

## 基本使用

安装

```bash
pnpm add vue-router # 默认 4.x
```

vue-router 暴露常用函数：

- `createRouter` 创建一个 router 对象
- `createWebHistory` 创建 history 对象
- `createWebHashHistory` 创建 hash 对象

<hr />

分析 createRouter 函数，核心函数，创建一个实例 router 对象

```ts
import { createRouter } from "vue-router";

// ts 类型分析
export declare function createRouter(options: RouterOptions): Router;

// RouterOptions 配置对象常用属性
interface RouterOptions {
  history: RouterHistory;
  routes: Readonly<RouteRecordRaw[]>;
  sensitive?: boolean; // 默认 false
  strict?: boolean; // 默认 false
}

// Router
interface Router {
  readonly currentRoute: Ref<RouteLocationNormalizedLoaded>;
  readonly options: RouterOptions;
  listening: boolean; // 针对微前端
  addRoute(parentName: RouteRecordName, route: RouteRecordRaw): () => void;
  addRoute(route: RouteRecordRaw): () => void;
  removeRoute(name: RouteRecordName): void;
  hasRoute(name: RouteRecordName): boolean;
  push(to: RouteLocationRaw): Promise<NavigationFailure | void | undefined>;
  replace(to: RouteLocationRaw): Promise<NavigationFailure | void | undefined>;
  getRoutes(): RouteRecord[];
  back(): ReturnType<Router["go"]>;
  forward(): ReturnType<Router["go"]>;
  go(delta: number): void;
  beforeEach(guard: NavigationGuardWithThis<undefined>): () => void;
  beforeResolve(guard: NavigationGuardWithThis<undefined>): () => void;
  afterEach(guard: NavigationHookAfter): () => void;
  onError(handler: _ErrorListener): () => void;
  install(app: App): void;
}
```

<hr />

创建路由映射

```ts
import List from "../packages/List.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/list", // 一级重定向
  },
  {
    path: "/list",
    name: "list",
    component: List,
    // 路由嵌套
    children: [
      // 二级路由重定向
      {
        path: "",
        rederict: "/list/item", // 这里重定向的路径是一个完整的路径
      },
      {
        // 如果是直接 / 开头，就是根路径
        path: ":id",
        name: "listDetail",
        component: () => import("../packages/ListDetail.vue"),
      },
      {
        path: "item",
        name: "listItem",
        component: () => import("../packages/ListItem.vue"),
      },
    ],
  },
  {
    path: "/user",
    name: "user",
    component: () => import("../packages/User.vue"),
  },
  {
    path: "/day",
    name: "day",
    component: () => import("../packages/User.vue"),
  },
  {
    path: "/:pathMatch(.*)*", // 404匹配，固定写法
    name: "NotFound",
    component: () => import("../packages/NotFound.vue"),
  },
];
```

## 路由跳转

_跳转形式_：

- 普通路径
- query 形式 `?id=xxx`
- params 形式 `/:id`

_跳转方式_:

- 组件形式 `<router-link :to="'/day/123'"></router-link>`
- 函数形式
  - options apis: `this.$router`
  - compositions apis: `useRouter`

_函数写法_

```ts
import { useRouter } from "vue";
const router = useRouter();

// params 方式
const btn = () => {
  // 根据 name 跳转 （params 的推荐方式）
  router.push({ name: "day", params: { id: 123 } });
  // 根据 path 跳转
  router.push({ path: "/day/123" });
  // 根据 path 跳转会报警告，并且组件中不能获取 params（不推荐写法，也是错误的写法）
  router.push({ path: "/day/", params: { id: 1 } });
};

// query 方式
const btn = () => {
  // 根据 name 跳转
  router.push({ name: "day", query: { id: 123 } });
  // 根据 path 跳转
  router.push({ path: "/day?id=123" });
};
```

:::warning params 方式只能通过 name 形式跳转，不能通过 path 形式跳转
:::

_获取方式_

- options apis: `this.$route`
- compositions apis: `useRoute`

```ts
import { useRoute } from "vue";
const route = useRoute();

// params 方式
route.params.id;

// query 方式
route.query.id;
```

## 路由守卫

- 全局路由守卫：`beforeEach` 和 `afterEach`
- 局部路由守卫：`beforeEnter`

_守卫用法_：

- return false: 不进行导航
- return undefined | 不写： 默认进行调转。
- 字符串： 跳转对应的路径。
- 对象：类似于 router.push({path: '/login', query: ...})

## 路由面试题

**router-link 和 a 标签的区别**：

- router-link 底层就是 a 标签
- router-link 跳转不刷新页面，a 标签页面
- router-link 就是对 a 标签的默认事件拦截，然后使用对应的 html5 方式跳转

**router-link 和 router-view 为什么能直接使用？**

在对使用 app.use 注册 router 插件的时候，里面的 install 方法里面实现了全局注册组件的逻辑。

```ts
app.component("RouterLink", RouterLink);
app.component("RouterView", RouterView);
```

## 路由彻底看透现象

- _二级路由不等于嵌套路由（children）_：二级路由是使用上级路由的 `router-view`;而嵌套路由，可能是跟上级路由共用一个 `router-view`（就类似于列表和详情的关系）
- 针对一级路由，不需要写是否是菜单栏的判断；针对 `children` 的路由对象才需要判断。到底是二级路由，才是嵌套路由（总不能把详情页也渲染在菜单栏上吧）
- 针对面包屑，第一个路由可能点的动，也可能点击不动。但是针对路由嵌套有可能是菜单，也有可能是详情页，也有可能是二级菜单。（最终解决办法：面包屑只有最后一个不能点击，其他的都是点击，针对没有页面的，就来个重定向即可）
