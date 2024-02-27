# dva-core 基本使用

## 篇前疑问

- dva-core 的优点是什么？说说其中的思想？
- redux-saga 了解吗？其中有几个辅助函数，能说说看吗？

## 辅助函数

- `take`: 监听 action 动作，会阻塞后面的代码执行。action 被触发后，后面的代码才能执行。（阻塞函数） take(pattern)
- `put`: 相当于 redux 的 dispatch，用来触发 action 的 effect，然后再 reducer 中接受。 （阻塞函数） put(action)
- `call`: 调用其他的函数，相当于 js 中的 call 方法，其实用法也是差不多的。注意： fn 函数可以是一个 Generator 函数，也可以是一个返回 Promise 的普通函数 （阻塞函数） call(fn, ...args)
- `fork`: 跟 call 函数基本相似，都是调用其他函数（不是阻塞函数） fork(fn， args)
- `select`: 获取整个 store 中的 state，相当于 store.getState()
- `cancel`: 一旦任务被 fork，可以使用 yield cancel(task) 来中止任务执行。（只是针对 fork，没有阻塞性）

```js
// take
// 监听type为ADD的action执行，直到这个action被触发了，才会执行下面的代码
yield take('ADD');
console.log(12323)

// put
// 触发reducer中的type为ADD，然后返回新的state
yield put({
  type: 'ADD',
  ...payload
})

// call
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
yield call(delay, 500)
//等待上面的delay函数执行完，才调用下面的代码
console.log(123)

// fork
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
yield fork(delay, 500)
//不用等待上面的delay函数执行完，直接会调用下面的代码
console.log(123)

//selecct
let tempList = yield select(state => state.getTodoList.list)  // state就是store的整体的state

```

## 基本使用

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
