# forwardRef 与 ts 配合使用

### 篇前疑问 ❓

1. 何时使用 `forwardRef`? 使用的目的是什么？
2. 为什么要使用 `useImperativeHandle` 这个 hook？其语法是怎么样的？

### 完整代码

::: code-group

```tsx [Child.tsx]
// 子组件使用
import { forwardRef, useImperativeHandle } from "react"
import type { Ref } from 'react'

interface IProps {}

type refType = Ref<{getList: () => string[]}>

const Child = (props, ref) = > {
  // ...
  useImperativeHandle(ref, () => ({
    getList() {
      return ['1','2','3']
    }
  }))
  // ...
}

export default forwardRef(Child)
```

```tsx [Father.tsx]
// 父组件使用
import Child from "./Child";
import React, { useRef } from "react";
import type { ElementRef } from "react";

const Father: React.FC = () => {
  // 这里初始值 null，写一下，不然类型不匹配
  // ElementRef 是 react 内置的
  const childRef = useRef<ElementRef<typeof Child>>(null);
  return <Child ref={childRef} />;
};

export default Father;
```

:::

### forwardRef 的注意事项

上面子组件的类型定义，是直接对应赋值。如果使用了 forwardRef 的泛型，泛型里面的类型，与函数组件的接受值是相反的。

```tsx
const Child = forwardRef<IRef, IProps>((props, ref) => {});
// 相反的
```

### forwardRef 的使用事项

```tsx
const App = forwardRef<Ref, Props>((props, ref) => {
  return <div></div>;
});

export default App;
```

这里 eslint 不会通过，为什么呢？

还会报出警告：**Component definition is missing display name react/display-name**

原因是：直接导出箭头函数不会给组件一个 displayName ，但如果你导出一个常规函数，函数名称将被用作 displayName 。

#### 解决方案

方案一

```tsx
const App = forwardRef<Ref, Props>((props, ref) => {
  return <div></div>;
});
// 手动赋值
App.displayName = "App";
export default App;
```

方案二

```tsx
const App = (props: Props, ref: Ref) => {
  return <div></div>;
};

export default forwardRef(App);
```
