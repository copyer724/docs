# redux + react-redux 的基本使用

## 目录结构

<img src="/images/frames/react/redux_01.png" />

## 技术栈

1. react: 18.2.0
2. redux: 4.2.0
3. react-redux: 8.0.2
4. typescript: 4.7.4

## 具体使用

### 全局 store（index.ts）

```tsx
import { legacy_createStore as createStore } from "redux";
import { rootReducer } from "./reducer";

const store = createStore(rootReducer);

export default store;
export type IRootState = ReturnType<typeof store.getState>;
```

**解析**：

1. rootReducer： 合并的 reducer
2. store: 全局的 store 对象
3. IRootState： store 对象的类型

**注意**：

createStore 已经被废弃了，代替的是 legacy_createStore，意味抛弃的 createStore。官网推荐使用 @reduxjs/toolkit 库。

### 全局 store（reducer.ts）

```ts
import { combineReducers } from "redux";

// count模块
import { reducer as countReducer } from "../pages/count/store";

// 合并所有的reducer
export const rootReducer = combineReducers({
  countReducer,
});
```

### 局部的 store（count 模块）

::: code-group

```ts [constants.ts]
/**
 * @file 定义常量
 */
export const ADD = "ADD";
export const SUB = "SUB";
```

```ts [action.ts]
/**
 * @file 定义组件使用的 action 动作
 */
import { IAction } from "./reducer";
import { ADD, SUB } from "./constants";

export function addAction(count: number): IAction {
  return {
    type: ADD,
    count,
  };
}

export function subAction(count: number): IAction {
  return {
    type: SUB,
    count,
  };
}
```

```ts [reducer.ts]
/**
 * @file 编写reducer, 监听action动作，改变store中的state
 * 这里省略 type.ts，感觉没有必要，内容不是很多。
 */
import { ADD, SUB } from "./constants";
import produce from "immer";

type aa = typeof ADD | typeof SUB;

export interface IInitState {
  count: number;
}

export interface IAction {
  type: aa;
  count: number;
}

const initState: IInitState = {
  count: 0,
};

export const reducer = (state = initState, action: IAction) => {
  switch (action.type) {
    case ADD:
      return { ...state, count: state.count + action.count };
    case SUB:
      return { ...state, count: state.count - action.count };
    default:
      return state;
  }
};
```

```ts [index.ts]
/**
 * @file 统一导出，供外界使用
 */
export { addAction, subAction } from "./action";

export { reducer } from "./reducer";
export type { IInitState } from "./reducer";
```

:::

### 注入项目

```tsx
import React from "react";
import Count from "./pages/count";
// Provider 也就是 Context.Provider
import { Provider } from "react-redux";
import store from "./store";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div>App</div>
      <Count />
    </Provider>
  );
};

export default App;
```

### 组件中使用

```tsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { IRootState } from "../../store";
import { IInitState } from "./store";
import { addAction, subAction } from "./store";

const Count: React.FC = () => {
  // useSelector<IStore, IState>
  const countStore = useSelector<IRootState, IInitState>((state) => {
    return state.countReducer;
  });
  const dispatch = useDispatch();
  const add = () => {
    dispatch(addAction(10));
  };
  const sub = () => {
    dispatch(subAction(5));
  };
  return (
    <React.Fragment>
      <h1>Count组件</h1>
      <h2>{countStore.count}</h2>
      <div>
        <button onClick={add}>add</button>
        <button onClick={sub}>sub</button>
      </div>
    </React.Fragment>
  );
};

export default Count;
```

解析：
`useSelectot<T, U>`

- T：整体的 store 类型
- U：选中的 state 类型
