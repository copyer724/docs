# zustand 基本使用

### 介绍

- `轻量级` ：Zustand 的整个代码库非常小巧，gzip 压缩后仅有 1KB，对项目性能影响极小。

- `简洁的 API` ：Zustand 提供了简洁明了的 API，能够快速上手并使用它来管理项目状态。 基于钩子: Zustand 使用 React 的钩子机制作为状态管理的基础。它通过创建自定义 Hook 来提供对状态的访问和更新。这种方式与函数式组件和钩子的编程模型紧密配合，使得状态管理变得非常自然和无缝。

- `易于集成` ：Zustand 可以轻松地与其他 React 库（如 Redux、MobX 等）共存，方便逐步迁移项目状态管理。

- `支持 TypeScript`：Zustand 支持 TypeScript，让项目更具健壮性。

- `灵活性`：Zustand 允许根据项目需求自由组织状态树，适应不同的项目结构。

- `可拓展性` : Zustand 提供了中间件 (middleware) 的概念，允许你通过插件的方式扩展其功能。中间件可以用于处理日志记录、持久化存储、异步操作等需求，使得状态管理更加灵活和可扩展。

- `性能优化`: Zustand 在设计时非常注重性能。它采用了高效的状态更新机制，避免了不必要的渲染。同时，Zustand 还支持分片状态和惰性初始化，以提高大型应用程序的性能。

- `无副作用`: Zustand 鼓励无副作用的状态更新方式。它倡导使用 immer 库来处理不可变性，使得状态更新更具可预测性，也更易于调试和维护。。

### 安装

```bash
pnpm add zustand
```

### 语法

#### set 方法

```ts
/**
 * 参数一：接受一个函数，用于修改 state
 * 参数二：接受一个 boolean 类型，默认为 false, 如果为 true, 返回的对象直接覆盖 state 对象
 */
set((state) => {}, replace?: boolean);
```

针对参数一：

```js
// 不需要解构后再组装
set((state) => ({ ...state, count: state.count + 1 }));

// set 方法会自动合并
set((state) => ({ count: state.count + 1 }));

// set 方法只针对第一层，如果存在深层次，还是需要解构
set((state) => ({
  // 深层次，还是需要手动解构
  info: { ...state.info, age: state.info.age + 1 },
})),
```

#### store 的编写形式

```ts
// 方式一：属性和方法放在一起，一起定义（常用写法）
export const useBoundStore = create((set) => ({
  count: 0,
  text: "hello",
  inc: () => set((state) => ({ count: state.count + 1 })),
  setText: (text) => set({ text }),
}));

// 方式二：属性和方法分开定义（有点丢丢优势）
export const useBoundStore = create(() => ({
  count: 0,
  text: "hello",
}));

export const inc = () =>
  useBoundStore.setState((state) => ({ count: state.count + 1 }));

export const setText = (text) => useBoundStore.setState({ text });
```

#### ts 写法

`create<T>`

```ts
interface BearState {
  bears: number;
  increase: (by: number) => void;
}

const useBearStore = create<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}));
```

#### 持久化

默认为 localStorage

```ts
import { persist } from "zustand/middleware";
```

```ts
// 没有指明 create 类型
export const useStore = create(
  persist(
    (set) => ({
      count: 0,
      name: "zustand",
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
      setName: (name: string) => set({ name }),
    }),
    { name: "copyer" }
  )
);

// 如果指明了类型
interface StoreState {
  count: number;
  name: string;
  increment: () => void;
  decrement: () => void;
  setName: (name: string) => void;
}

// create 函数先调用
export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      count: 0,
      name: "zustand",
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
      setName: (name: string) => set({ name }),
    }),
    { name: "copyer" }
  )
);
```

#### 异步操作

```ts
import create from "zustand";

const useStore = create((set) => ({
  items: [],
  fetchItems: async () => {
    const response = await fetch("/api/items");
    const items = await response.json();
    set({ items });
  },
}));
```

### 中间件原理

中间件并不是 zustand 自己实现的功能，跟 redux 一样。

create 方法接受一个函数作为参数，该函数也接受 set、get、store 的三个参数。

那么，我们也可以定义一个函数，然后传递给 create 方法，这样我们就可以自定义中间件了。

```ts
function middlewareFn(fn) {
  // 这里就类似 create 接受的函数
  return function (set, get, store) {
    const newSet = (...args) => {
      // 做一些中间件逻辑操作
      set(...args);
    };
    // 返回一个新的函数
    return fn(set, get, store);
  };
}
```
