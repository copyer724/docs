# infer

## infer 封装通用类型工具

前提是：理解类型的三目运算

**推断函数的返回类型**

```ts
type Fn = (a: number, b: number) => number;

/**
 * 判断 T 是否是函数 (...args: any[]) 无论函数的参数为多少个，推到返回值（infer R ）
 * 如果不是函数直接返回 T
 * 如果是函数则推断函数的返回值, 定义类型为 R（infer R ）
 */
type MockReturnType<T> = T extends (...args: any[]) => infer R ? R : T;

type B = MockReturnType<Fn>; // number
```

**推断函数的第一个参数**

```ts
type Callback = (a: string, b: number) => number;

/**
 * 推断第一个参数的类型（first: infer R） 推断 R
 */
type FirstParams<T> = T extends (first: infer R, ...args: any[]) => void
  ? R
  : never;

type First = FirstParams<Callback>; // string
```

**推断 Promise 的类型**

```ts
/**
 * 推断 promise 的类型
 */
type PromiseType<T> = T extends Promise<infer R> ? R : never;

type C = PromiseType<Promise<number>>; // number
```

**推断数组的类型**

```ts
type ArrayType<T> = T extends Array<infer R> ? R : never;
type D = ArrayType<number[]>; // number
type E = ArrayType<[string, number]>; // string | number
```
