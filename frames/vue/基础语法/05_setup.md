# setup

## 注意要点

- 在 setup() 函数返回的对象，会暴露给模版和组件实例，其他的 options api 选项可以通过组件实例（this）来进行访问
- 其他 options api 选项可以通过 this 来进行访问，对于 ref 对象来说，也是不需要解包的。
- 在 setup() 函数中的 this 为 undefined，因为组件实例是在 created 钩子中才生成，而 setup 的执行时机是快于 created 钩子函数的
- setup 返回的对象一般来说，是同步的。但是针对 `<Suspense>` 来说，组件可以是异步的

## setup 的参数解析

第一个参数：props

- **不要解构**，那么 props 就变成了非响应式的了。通过 props.x 或者 toRef() / toRefs() 来转化成 ref 对象。

```ts
export default {
  props: {
    title: String,
  },
  setup(props) {
    console.log(props.title);
  },
};
```
