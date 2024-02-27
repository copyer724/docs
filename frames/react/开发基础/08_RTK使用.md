# RTK 使用

## 篇前疑问

- redux 为什么要升级为 RTK？有哪些好处？

## @reduxjs/toolkit 优点

### redux 缺点

- 定义文件太多（actions、reducers、types），分散也广
- 需要手动安装多个中间件，是适配开发（redux-thunk 等等）
- state 返回的是全新的对象

### RTK 优点

解决了 redux 上面的问题。

- `configureStore`: 继承了合并 reducer，添加了 redux-thunk、redux-devtools 等中间件。
- `createSlice`：集成了 immer 库，针对每个 reducer 自动生成一个 actions 函数，基于 reducer 的 name 的生成 actions 的 type。对 ts 也更加的友好。

## RTK 的基本使用

1. 安装

```bash
pnpm install @reduxjs/toolkit react-redux
```

2. 创建 slice

```ts
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    username: "",
    token: "",
  },
  reducers: {
    changeUsername: (state, action) => {
      // actions: {payload: any; type: string;}
      state.username = action.payload.name;
    },
    changeToken: (state, action) => {
      // action.type = 'user/changeToken'
      state.token = action.payload.token;
    },
    clearUserInfo: (state) => {
      state.username = "";
      state.token = "";
    },
  },
});

export const { changeUsername, changeToken, clearUserInfo } = userSlice.actions; // 暴露 actions

export default userSlice.reducer; // 导入注册reducer
```

3. 统一注册 reducer

```ts
import { configureStore } from "@reduxjs/toolkit";

// reducers
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;
export default store;
```

4. 全局挂载 store

```tsx
import { Provider } from "react-redux";
import store from "@/store";

const App: React.FC = () => {
  return (
    <ConfigProvider prefixCls="react">
      // 挂载
      <Provider store={store}>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </Provider>
    </ConfigProvider>
  );
};
```

5. 组件内部使用和修改

​ 5.1 导入 `useSelector` 和 `useDispatch`

​ 5.2 导入 slice 的 `actions`

```tsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeToken, changeUsername, clearUserInfo } from "@/store/userSlice";
import { Button } from "antd";
import type { RootState, Dispatch } from "@/store";

const Content: React.FC = () => {
  const userStore = useSelector((state: RootState) => state.user);
  const dispatch: Dispatch = useDispatch();

  function getToken() {
    return (dispatch: Dispatch) => {
      setTimeout(() => {
        dispatch(changeToken({ token: "1231fsfgdfd56" }));
      }, 3000);
    };
  }

  const change = (flag: "name" | "token") => {
    if (flag === "name") {
      // 模拟同步
      dispatch(changeUsername({ name: "copyer" }));
    } else {
      // 模拟异步
      dispatch(getToken());
    }
  };
  const reset = () => {
    dispatch(clearUserInfo());
  };
  return (
    <div>
      <h1>主应用的内容</h1>
      <hr />
      <ul>
        <li>username: {userStore.username}</li>
        <li>token: {userStore.token}</li>
      </ul>
      <hr />
      <div>
        <Button onClick={() => change("name")}>修改name</Button>
        <Button onClick={() => change("token")}>修改token</Button>
        <Button onClick={reset}>还原store</Button>
      </div>
    </div>
  );
};

export default Content;
```

针对上面文件，会存在不足的地方：

- RootState, Dispatch 在多处使用，就会被多次导入
- 针对 useSelector, useDispatch 定义的时候，也会多次定义类型

```ts
// hooks/index.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

import type { RootState, Dispatch } from "@/store";

export const useNewSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useNewDispatch: () => Dispatch = useDispatch;
```

当然这两个 hook 的名称并不是很形象，根据自己的理解改。

后面就使用这两个 hooks，来代替 react-redux 中的 useDispatch, useSelector。

### dva-core 的基本使用

1. 安装

```bash
pnpm intall dva-core-ts react-redux redux
```

这里要安装 redux 就挺懵的，dva-core 强行依赖了一波。

2. 针对 ts 写法，专门定义一个 `type.d.ts` 文件

```ts
// store/type.d.ts

export { Model } from "dva-core-ts";

export interface Action {
  type: any;
}
export interface AnyAction extends Action {
  [extraProps: string]: any;
}
export type Reducer<S> = (state: S, action: AnyAction) => S;

export interface EffectsCommandMap {
  put: typeof put;
  call: typeof call;
  select: typeof select;
  take: typeof take;
  cancel: typeof cancel;
  [key: string]: any;
}

export type Effect = (action: AnyAction, effects: EffectsCommandMap) => void;
```

3. 创建 userModel

```ts
// store/models/userModel.ts
import type { Reducer, Effect, Model } from "../type";
interface IUser {
  username: string;
  token: string;
}

export interface IUserModel extends Model {
  namespace: "user";
  state: IUser;
  reducers: {
    changeUsername: Reducer<IUser>;
    changeToken: Reducer<IUser>;
  };
  effects: {
    changeTokenAsync: Effect;
  };
}

const initState = {
  username: "",
  token: "",
};

const userModel: IUserModel = {
  namespace: "user",
  state: initState,
  reducers: {
    changeUsername: (state: IUser, action) => {
      return { ...state, username: action.payload.username };
    },
    changeToken: (state: IUser, action) => {
      return { ...state, token: action.payload.token };
    },
  },
  effects: {
    *changeTokenAsync({ payload }, { put }) {
      yield put({
        type: "changeToken",
        payload,
      });
    },
  },
};

export default userModel;
```

4. 收集所有 model

```ts
// store/models
import userModel from "./models/userModel";

const models = [userModel];

export default models;
```

5. 遍历注册 model, 创建 store

```ts
// store/index.ts
import { create } from "dva-core-ts";
import models from "./model";

const app = create();

models.forEach((model) => {
  app.model(model);
});

app.start();

const store = app._store;

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;
export default store;
```

6. 挂载到根节点上

```tsx
import { Provider } from "react-redux";
import store from "./store";

const App: React.FC = () => {
  return (
    <div className={styles.react_child_app}>
      // 挂载 store
      <Provider store={store}>
        <BrowserRouter
          basename={(window as any).__POWERED_BY_QIANKUN__ ? "/react" : "/"}
        >
          <Top />
          <Content />
        </BrowserRouter>
      </Provider>
    </div>
  );
};

export default App;
```

7. 使用 store

```tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const Home: React.FC = () => {
  const userStore = useSelector((state) => {
    return state.user;
  });
  const dispatch = useDispatch();

  const btn = () => {
    dispatch({
      type: "user/changeTokenAsync",
      payload: { token: "6758945689486" },
    });
  };
  return (
    <React.Fragment>
      <h4>首页</h4>
      <hr />
      <div>
        <h3>username: {userStore.username}</h3>
        <h3>token: {userStore.token}</h3>
      </div>
      <button onClick={btn}>点击</button>
    </React.Fragment>
  );
};

export default Home;
```
