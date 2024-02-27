# ref 使用原理理解

## 篇前疑问

useLatest 为什么需要这样写?

```ts
const ref = useRef(value);
ref.current = value;
```

## useLatest 源码

```ts
import { useRef } from "react";

function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;

  return ref;
}

export default useLatest;
```

## 解答

useRef 创建的是一个普通 Javascript 对象，而且会在每次渲染时返回同一个 ref 对象，当我们变化它的 current 属性的时候，对象的引用都是同一个，所以读取的值都是最新的。

**但是当 useRef 存在初始值的之后，如果不重新设置 ref.current，它在 `ReRender` 过程中是不会对引用重新赋值的**。

从源码层面：**初始化是调用的 `mountRef`，ReRender 都是调用 `updateRef`**

```ts
const ref = useRef(value);
// ref.current = value;  当 value 更新之后，ref.current 还是初始值
```

## 案例演示

```tsx
function App() {
  const [count1, setCount1] = React.useState<number>(1);
  const btn = () => {
    setCount1(2);
  };
  return (
    <React.Fragment>
      <button onClick={btn}>点击</button>
      <Test count={count1} />
    </React.Fragment>
  );
}

function Test(props) {
  const { count } = props;
  console.log(count); // 这里是最新的值
  const valueRef = useRef(count);
  console.log(valueRef.current); // 不是最新的值
  return <div>test</div>;
}
```

点击之后，count 发生变化，`valueRef.current` 拿不到最新值
