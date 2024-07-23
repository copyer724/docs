# react router 原理和使用

## 篇前疑问

- 说说 hash 路由的原理？history 路由的原理？
- 能说说 history 对象吗？
- h5 新增 history 的两个方法是什么呢？
- react-router 升级到 v6，体现在哪些方面呢？
- 能说说 react-router-dom 提供的几个 hooks 吗？
- 嵌套路由，你知道怎么写吗？
- `*` 为什么代表 404？
- `<Outlet>` 组件实现的原理
- navigate 函数接收多种参数，内部如何解析？

## 个人博客

[react-router v6 的回忆](https://juejin.cn/post/7202207482193330232)

## 组件及 hooks

- `NavLink`
- `Link`
- `Routes`
- `Route`
- `Outlet`
- `useNavigate`
- `useParams`
- `useSearchParams`
- `useLocation`

## 项目搭建使用

#### 入口文件

`main.tsx`

```tsx{9-11}
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

::: details 知识点拓展

`react-router-dom` 中提供了两个常用的组件：`BrowserRouter` 和 `HashRouter`， 其实就是对应两种不同的路由模式（history 模式和 hash 模式）。

组件内部的实现，都是创建 history 对象(通过不同的方法，history V5 提供的两个该方法)，然后返回 `react-router` 提供的 `Router` 组件。

`Router` 组件其内部实现就是两个嵌套的 Context （`NavigationContext` 和 `LocationContext`），分别提供 `history对象（v6中，最好叫 navigator 对象）` 和 `location 对象`，供后续的嵌套组件使用。
:::

#### 页面跳转

方式一：`Route 组件嵌套`, 在子组件中使用组件 `Outlet` 占位。

::: code-group

```tsx{15-23} [App.tsx]
import Home from "@/pages/home";
import System from "@/pages/system";
import Account from "@/pages/system/account";
import Role from "@/pages/system/role";
import { NavLink, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <div>
        <NavLink to="/home">首页</NavLink>
        <NavLink to="/system">系统管理</NavLink>
      </div>
      <div>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/system" element={<System />}>
            {/* index 类似重定向, 与 path 属性互斥 */}
            <Route index element={<Account />} />
            <Route path="account" element={<Account />} />
            <Route path="role" element={<Role />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
```

```tsx{12} [System.tsx]
import { NavLink, Outlet } from "react-router-dom";

const System = () => {
  return (
    <div>
      <div>系统管理</div>
      <div>
        <NavLink to="account">账号管理</NavLink>
        <NavLink to="role">角色管理</NavLink>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default System;
```

:::

<hr />

方式二：`Route 组件`分别写在多个文件，跟 V5 版本相似

::: code-group

```tsx{13-16} [App.tsx]
import Home from "@/pages/home";
import System from "@/pages/system";
import { NavLink, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <div>
        <NavLink to="/home">首页</NavLink>
        <NavLink to="/system">系统管理</NavLink>
      </div>
      <div>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/system/*" element={<System />}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
```

```tsx{14-18} [System.tsx]
import { NavLink, Routes, Route } from "react-router-dom";
import Account from "./account";
import Role from "./role";

const System = () => {
  return (
    <div>
      <div>系统管理</div>
      <div>
        <NavLink to="account">账号管理</NavLink>
        <NavLink to="role">角色管理</NavLink>
      </div>
      <div>
        <Routes>
          <Route index element={<Account />} />
          <Route path="account" element={<Account />} />
          <Route path="role" element={<Role />} />
        </Routes>
      </div>
    </div>
  );
};

export default System;
```

:::

**注意点：**

- `Route` 组件一定要嵌套在 `Routes` 组件下，无论是外面的路由，还是里面的路由。
- 针对外面的路由，如果存在子路由，一定需要写 `/*`, 就比如上面的 `/system/*`。

<hr />

方式三：统一路由配置

:::code-group

```tsx [router/index.ts]
import { RouteObject } from "react-router-dom";
import React from "react";

import Home from "@/pages/home";
const System = React.lazy(() => import("@/pages/system"));
const Account = React.lazy(() => import("@/pages/system/account"));
const Role = React.lazy(() => import("@/pages/system/role"));

const routes: RouteObject[] = [
  // 路由重定向
  {
    path: "/",
    element: <Navigate to="/home" />,
  },
  {
    path: "/home",
    name: "首页",
    element: <Layout />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/system",
    element: <System />,
    children: [
      {
        index: true,
        element: <Account />,
      },
      {
        path: "account",
        element: <Account />,
      },
      {
        path: "role",
        element: <Role />,
      },
    ],
  },
];

export default routes;
```

```tsx{15} [App.tsx]
import { Suspense } from "react";
import "./App.css";
import routes from "./router";
import { NavLink, useRoutes } from "react-router-dom";

function App() {
  const elements = useRoutes(routes);
  return (
    <div>
      <div>
        <NavLink to="/home">首页</NavLink>
        <NavLink to="/system">系统管理</NavLink>
      </div>
      <div>
        <Suspense>{elements}</Suspense>
      </div>
    </div>
  );
}

export default App;
```

```tsx{12} [System.tsx]
import { NavLink, Outlet } from "react-router-dom";

const System = () => {
  return (
    <div>
      <div>系统管理</div>
      <div>
        <NavLink to="account">账号管理</NavLink>
        <NavLink to="role">角色管理</NavLink>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default System;
```

:::

**注意点**

- 如果使用 `React.lazy()`，就需要使用 `Suspense` 组件包裹
- `Outlet` 组件可以使用 `useOutlet` 代替，因为 Outlet 组件内部也是调用的 useOutlet。

针对统一处理路由的地方：

```ts
{
  path: '*',
  element: <NotFound />
}
```

`*` 代表找不到匹配路径，展示 404 页面。

::: details `*` 为什么代表 404 呢？

在 `useRoutes` 源码的解析过程中，会进行初始化 score 字段（有一个计算过程）, 然后进行排序，score 越大，越靠前，路由就越先被匹配，而 `*` 算出来的分数一定是最小的，那么当前面的都匹配不到，最后就会匹配上它。

```ts
const dynamicSrgmentValue = 3; // 动态路由 3 分
const indexRouteValue = 2; // index 路由 2 分
const emptySegementValue = 1; // 空字符串 1 分
const staticSegementValue = 10; // 静态路由 10 分
const splatPenalty = -2; // 包含 * 的路由 -2 分
```

拿到一个 path 路由，进行字符串分割，根据上面的分数进行计算，然后进行排序。

公式：`path分割长度 + 路由类型分数`

`*` 的分数一定是最低的： `1 + -2 = -1`

:::

## 语法细节

#### cd 操作

在 V6 版本中，无论是 Link 组件，还是 navigate 方法，表现的形式都是类似 cd 操作。

```ts
// 当前路径 /aa/bb
navigate("./"); // aa/bb/cc
navigate("cc"); // aa/bb/cc
navigate("../cc"); // aa/cc
navigate("/aa/bb/cc"); // /aa/bb/cc
```

当路径字符串以 `/` 开头，就会看成绝对路径，如果以 `./` 或者 `../` 就会看成相对路径，进行 cd 操作。如果没有上面两张情况的字符串，就是直接是字符串拼接。

#### matchPath 函数

在 react-router-dom 中，提供了 `matchPath` 函数，用于判断当前路径是否匹配某个路由。

```ts
/**
 * patten: 路由定义时的path属性
 * path: 当前 url 的 pathname
 */
matchPath(patten, path);
```

测试动态路由(params)

```ts
let a = "/aa/:id/detail";
let b = "/aa/12/detail";
const res = matchPath(a, b);
console.log(res);
```

结果

```json
{
  "params": {
    "id": "12"
  },
  "pathname": "/aa/12/detail",
  "pathnameBase": "/aa/12/detail",
  "pattern": {
    "path": "/aa/:id/detail",
    "caseSensitive": false,
    "end": true
  }
}
```

测试动态路由(query)

```ts
let a = "/aa";
let b = "/aa?nam=12";
const res = matchPath(a, b);
console.log(res); // null
```

针对这种方式匹配，还是需要去除问号

> 可以具体想一下 matchPath 函数的实现，还是挺有意思的
