# memo

## 篇前疑问

- 为什么需要使用 memo ?

## 基本结构

```ts
React.memo(fn, compare);
// fn： 函数组件
// compare：比较是否更新，可选
```

默认是浅比较 。

何为浅比较？就是只会比较数组或者对象的第一层，因为是没有进行递归操作的。

## compare

是一个函数，返回值为 boolean

`return true` : 复用以前的组件，不用更新

`return false`: 不复用以前的组件，更新

```tsx
const Test = React.memo(
  (props: any) => {
    console.log("子组件更新了");
    const { count } = props;
    return <div>test</div>;
  },
  (prevProps, currentProps) => {
    console.log(prevProps, currentProps);
    return false;
  }
);
```

- prevProps： 上次的 props
- currentProps: 当前的 props
