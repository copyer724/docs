# React18 新特性

## 篇前疑问

- 你能说说 react 18 更新了哪些特性吗？

## 前言

react18 的发布时间： 2022 年 3 月 29 日。

## react-dom 的 api 变动

::: code-group

```ts [createRoot]
// react17
import ReactDOM from "react-dom";
ReactDOM.render(<App />, document.getElementById("root"));

// react18
import ReactDOM from "react-dom/client";
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```

```ts [类型分析]
/**
 * createRoot函数
 * @param container: 容器，DOM节点（必选）
 * @param options：配置对象（可选）
 * @return 返回一个对象，Root类型
 */
export function createRoot(
  container: Element | DocumentFragment,
  options?: RootOptions
): Root;

export interface Root {
  render(children: React.ReactNode): void;
  unmount(): void; // unmount卸载组件
}

export interface RootOptions {
  /**
   * Prefix for `useId`.
   */
  identifierPrefix?: string; // 给useId增加前缀
  onRecoverableError?: (error: unknown) => void;
}
```

:::

## React.FC 变动

::: code-group

```ts [类型分析]
// react17: React.FC 类型的props包含children: PropsWithChildren<P>
type FC<P = {}> = FunctionComponent<P>;
interface FunctionComponent<P = {}> {
  (props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | null;
}

// react18: React.FC 类型的 props 不包含 children
type FC<P = {}> = FunctionComponent<P>;
interface FunctionComponent<P = {}> {
  (props: P, context?: any): ReactElement<any, any> | null;
}
```

```tsx [App.tsx]
// react17
interface IProps {
  title: string;
}
const App: React.FC<IProps> = () => {};

// react18
interface IProps {
  title: string;
  children?: React.ReactNode; // 需要手动申明
}
const App: React.FC<IProps> = () => {};
```

:::

## React 批量更新的变动

在 react17 中，在合成事件，生命周期中，useState 是批量更新的；在异步函数，DOM 事件等操作中，不是批量更新。

在 react18 中，useState 统一的都是批量更新了，不区分同步函数还是异步函数

```tsx
const [count1, setCount1] = React.useState<number>(1);
const [count2, setCount2] = React.useState<number>(2);
const add = () => {
  setCount1(count1 + 1);
  setCount2(count2 + 1);
};
// 调用add()，render方法触发一次

const asyncAdd = () => {
  setTimeout(() => {
    setCount1(count1 + 1);
    setCount2(count2 + 1);
  }, 0);
};
// 调用asyncAdd()，render方法也只触发一次
```

### 破坏批量更新

react-dom 提供了一个 api：`flushSync`

```tsx
import { flushSync, unstable_batchedUpdates } from "react-dom";
const add = () => {
  flushSync(() => {
    setCount1(count1 + 1);
  });
  flushSync(() => {
    setCount2(count2 + 1);
  });
};
// 调用add()，flushSync包裹，render方法触发两次
```

- `unstable_batchedUpdates`: 在 react17 中，用来批量更新的(react-dom 提供)。
- `flushSync`： 在 react18 中，用来破坏批量更新的(react-dom 提供)。

## Strict Mode

不在抑制控制台日志

当你使用严格模式的时候，React 会对每个组件进行两次渲染，以便你观察到一些不一样的效果。

为了解决社区对这个问题的困惑，在 react18 中，官方取消了这个限制。如果你安装了 React devtools，第二次渲染的日志是灰色的，显示在控制台上。

## Suspense 的变动

```tsx
// React17: 如果没有fallback,就会报错误
<React.Suspense></React.Suspense>

// React18: 不会保存，如果没有写，fallback就是null或者undefined
<React.Suspense></React.Suspense>
```
