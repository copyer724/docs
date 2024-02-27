# 理解 redux 的中间件

## 篇前疑问

- 说说你对中间件的理解是什么样的？
- redux 中，你使用了哪些中间件？

## redux 中间件的理解

简单的来说，redux 中间件就是对 dispatch 的功能做拓展。通过第三方插件，拦截 action 动作。

这种机制可以让我们改变数据流，实现如异步 action ，action 过滤，日志输出，异常报告等功能。

<img src="/images/frames/react/redux_02.png" />

## redux 应用中间件

```ts
import { applyMiddleware, createStore } from "redux";
import thunk from "react-thunk";
// 调用
const store = createStore(reducer, applyMiddleware(thunk));
// 如果存在多个中间件，就依次作为参数传递进去
```

`applyMiddleware` 函数就是用来依次调用中间函数的，调用的过程中，传递两个参数进去（getState, dispatch）。

其源码：

```ts
export default function applyMiddleware(...middlewares) {
  return (createStore) =>
    (...args) => {
      const store = createStore(...args);
      let dispatch = () => {
        throw new Error(
          "Dispatching while constructing your middleware is not allowed. " +
            "Other middleware would not be applied to this dispatch."
        );
      };

      // 对象作为参数，传递给中间件函数（getState, dispatch）
      const middlewareAPI = {
        getState: store.getState,
        dispatch: (...args) => dispatch(...args), // 普通版的dispatch
      };
      // 依次调用中间件，每个中间件返回一个新的函数，用来接受dispatch
      const chain = middlewares.map((middleware) => middleware(middlewareAPI));
      // 增强dispatch
      dispatch = compose(...chain)(store.dispatch);

      return {
        ...store,
        dispatch, // 加强版的dispatch
      };
    };
}
```

两次 dispatch 都是作为参数：

1. middlewareAPI 中的 dispatch 是用来处理当 action 是函数时，函数调用，继续作为参数传递进去，可以在函数体中使用 dispatch 功能（简单理解，不是一个加强版的 dispatch，最初版的 ）
2. 组合函数（compose）依次调用中间件返回的函数，传递的 dispatch 就是 redux 最初提供的，在此基础上加强，返回一个新的 dispatch （加强版的 dispatch）

## redux-thunk 源码分析

正常的 dispatch 接受的一个对象，加强之后，可以接受一个函数，该函数就是用用来处理异步事件的。

```ts
// 正常的 dispatch 使用
dispatch({
  type: "add",
  payload: {}, // 传递的数据
});

// 改造后的dispatch: 接受一个函数
dispatch(function () {});
```

源码:

```ts
function createThunkMiddleware(extraArgument) {
  // 接受 redux 的 applyMiddleware 传递进来的参数（getState, dispatch）
  // 柯里化函数
  return ({ dispatch, getState }) =>
    (next) =>
    (action) => {
      // 如果 action 是一个函数，就执行，继续把 getState，dispatch 作为参数传递进去
      if (typeof action === "function") {
        // dispatch 是作为第一个参数，常用的参数，用于继续触发普通的action
        return action(dispatch, getState, extraArgument);
      }
      return next(action);
    };
}
const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;
export default thunk;
```
