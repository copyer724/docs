# mini-vue effect 函数实现

`effect` 函数是响应式系统的核心，它被称作**副作用函数**，用于跟踪和响应数据的变化，从而实现响应式更新。

它的 ts 类型

```ts
export interface ReactiveEffectOptions extends DebuggerOptions {
  scheduler?: EffectScheduler;
  allowRecurse?: boolean;
  onStop?: () => void;
}

// 接受一个函数，和配置对象
export declare function effect<T = any>(
  fn: () => T,
  options?: ReactiveEffectOptions
): ReactiveEffectRunner<T>;
```
