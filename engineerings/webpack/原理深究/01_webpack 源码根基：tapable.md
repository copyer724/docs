# webpack 源码根基：tapable

想要理解 webpack 源码，就必须先了解 `tapable` 库的基本使用（这是**硬性条件**）。因为 webpack 最核心的东西就是利用 tapable 库，在内部注册了各种 hook 进行调度。

## tapable 库

tapable 库也是 webpack 官方维护的库。

```bash
pnpm add tapable
```

[仓库地址](https://github.com/webpack/tapable)

在这个库里面，提供了比较多 Hook，每种 Hook 的用法都是存在差异的。理解每种 hook 的用法，还是有着一定的困难。

```ts
const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesLoopHook,
  AsyncSeriesWaterfallHook,
} = require("tapable");
```

当细着拆分这些 hooks 时，其实也就很好理解了，也能很快的上手。

<img src="/images/engineerings/webpack/sources/01_tapable01.png" />

::: tip 理解
**实线**表示常用的 hook, **虚线**表示不常用的 hook（可以组合，利用各自的特点）
:::

_第一列_

- `Sync`: 同步执行，不能写异步函数。
- `Async`: 异步执行

_第二列_

- `Paralle`: 并行执行，触发事件会一起执行
- `Series`: 串行执行，等待上个事件触发完成之后，才会开始执行

_第三列_

- `Bail`: 当返回值为 `undefined` 时，执行后续的触发事件
- `Loop`: 当返回值为 `true` 时，就会一直触发该 Hook 事件；返回值为 undefined 时，则退出该事件
- `Waterfall`: 把上一个触发事件的`返回值`，传递给下一个触发事件，并作为第一个参数。

_第四列_

- `Hook`: 不用多说

tapable 中提供的 hooks 都是利用上面各自的特性，来进行组合的形成的，达到不同的特性 hook。

## 执行和触发

1. 注册事件 （同步使用 tap，异步使用 tapAsync）
2. 触发事件 （同步使用 call，异步使用 callAsync）

## 案例演示

### SyncHook

```ts
const { SyncHook } = require("tapable");
/**
 * 创建 hook 实例
 * 构造函数参数只是提示作用，提示 注册事件接受哪些参数，触发事件传递哪些参数
 */
const hook = new SyncHook(["name", "age"]);
// 注册事件
hook.tap("event1", (name, age) => {
  console.log("event1 事件触发:", name, age);
});
hook.tap("event2", (name, age) => {
  console.log("event2 事件触发:", name, age);
});
// 触发事件
setTimeout(() => {
  hook.call("copyer", 18);
}, 1000);

/**
 * 打印结果：
 * event1 事件触发: copyer 18
 * event2 事件触发: copyer 18
 */
```

### SyncBailHook

```ts
const { SyncBailHook } = require("tapable");
const hook = new SyncBailHook(["name", "age"]);
hook.tap("event1", (name, age) => {
  console.log("event1 事件触发:", name, age);
  // 有返回值，就不会执行下面的事件
  return 123;
});
hook.tap("event2", (name, age) => {
  console.log("event2 事件触发:", name, age);
});
setTimeout(() => {
  hook.call("copyer", 18);
}, 1000);

/**
 * 打印结果：
 * event1 事件触发: copyer 18
 */
```

利用 Bail 特性，返回值不为 undefined 时，就不会执行后续的触发事件。

### SyncLoopHook

```ts
const { SyncLoopHook } = require("tapable");
const hook = new SyncLoopHook(["name", "age"]);
hook.tap("event1", (name, age) => {
  console.log("event1 事件触发:", name, age);
  // 返回为 true, 就会一直触发事件；返回 undefined，则退出循环
  return 123;
});
hook.tap("event2", (name, age) => {
  console.log("event2 事件触发:", name, age);
});
setTimeout(() => {
  hook.call("copyer", 18);
}, 1000);

/**
 * 打印结果：
 * event1 事件触发: copyer 18
 * event1 事件触发: copyer 18
 * ...
 */
```

利用 Loop 的特性，返回值为 true 时，就会一直触发该 Hook 事件；返回值为 undefined 时，则退出该事件。

### SyncWaterfallHook

```ts
const { SyncWaterfallHook } = require("tapable");
const hook = new SyncWaterfallHook(["name", "age"]);
hook.tap("event1", (name, age) => {
  console.log("event1 事件触发:", name, age);
  // 有返回值，就作为下个触发事件的第一个参数
  return 123;
});
hook.tap("event2", (name, age) => {
  // 接受的参数直接替换第一个参数（也就是说传递的第一个参数没有任何作用），后面的按部就班
  console.log("event2 事件触发:", name, age);
});
setTimeout(() => {
  hook.call("copyer", 18);
}, 1000);

/**
 * 打印结果：
 * event1 事件触发: copyer 18
 * event2 事件触发: 123 18(返回值 123 代替了 copyer)
 */
```

利用 Waterfall 特性，把上一个触发事件的`返回值`，传递给下一个触发事件，并作为第一个参数。

### AsyncParallelHook

上面的同步 Hook 没有并行和串行的概念，都是一步一步的执行。但是针对异步的 hook, 则就体现出来了。

```ts
const { AsyncParallelHook } = require("tapable");
const hook = new AsyncParallelHook(["name", "age"]);
hook.tapAsync("event1", (name, age) => {
  console.log("event1 事件触发:", name, age);
  setTimeout(() => {
    console.log("2s 过后的event1 事件");
  }, 2000);
});
hook.tapAsync("event2", (name, age) => {
  console.log("event2 事件触发:", name, age);
  setTimeout(() => {
    console.log("2s 过后的event2 事件");
  }, 2000);
});
setTimeout(() => {
  hook.callAsync("copyer", 18);
}, 1000);

/**
 * 打印结果：
 * event1 事件触发: copyer 18
 * event2 事件触发: copyer 18
 * 2s 过后的event1 事件
 * 2s 过后的event2 事件
 */
```

利用 Parallel 并行特性，事件会一起执行。

### AsyncSeriesHook

该 hook 有点稍微的区别，因为是串行的，是一个一个执行的，那么就需要知道什么时候该事件执行完毕。

那么就会在注册的时候，规定最后一个参数是一个*函数*，用于回调，当执行该函数时，就说明了该事件已经执行完毕。当所有事件都触发完成之后，才会去执行真正完成的回调函数（也就是触发时的 callback）。

```ts
const { AsyncSeriesHook } = require("tapable");
const hook = new AsyncSeriesHook(["name", "age"]);
hook.tapAsync("event1", (name, age, callback) => {
  setTimeout(() => {
    console.log("event1 事件触发:", name, age);
    callback();
  }, 2000);
});
hook.tapAsync("event2", (name, age, callback) => {
  setTimeout(() => {
    console.log("event2 事件触发:", name, age);
    callback();
  }, 1000);
});
setTimeout(() => {
  hook.callAsync("copyer", 18, () => {
    console.log("所有触发事件都执行完成");
  });
}, 1000);

/**
 * 打印结果：
 * event1 事件触发: copyer 18
 * event2 事件触发: copyer 18
 * 所有触发事件都执行完成
 */
```

利用 Series 的串行特性，事件一个一个执行，并且最后一个事件执行完之后，才会去执行真正完成的回调函数。

上面演示了一遍常用的 hooks ，但是还有其他的 hooks，比如 AsyncSeriesBailHook、AsyncSeriesWaterfallHook、AsyncSeriesLoopHook 等等，理解了各自的特性之后，也就很清楚了它们的作用。（实际场景，实际分析，实际采用）

还是来看一个不常用的 hooks 吧。

```ts
const { AsyncSeriesBailHook } = require("tapable");
const hook = new AsyncSeriesBailHook(["name", "age"]);
hook.tapAsync("event1", (name, age, callback) => {
  setTimeout(() => {
    console.log("event1 事件触发:", name, age);
    callback();
    return true; // 这里存在 return， 也存在 callback
  }, 2000);
});
hook.tapAsync("event2", (name, age, callback) => {
  setTimeout(() => {
    console.log("event2 事件触发:", name, age);
    callback();
  }, 1000);
});
setTimeout(() => {
  hook.callAsync("copyer", 18, () => {
    console.log("所有触发事件都执行完成");
  });
}, 1000);
```

如果先 return ，就会采用 Bail 特性，就会退出该事件；如果先执行 callback, 就会采用 Series 特性，表示当前事件已经执行完成，触发了下一个事件。

## 模拟 webpack 中的 compiler 对象

首先得知道 compiler 对象是干什么的？

**compiler 对象是 webpack 配置的入口，它里面包含了很多配置，比如 entry、output、module、plugins、resolve、devServer 等等**。

不过多分析。

<img src="/images/engineerings/webpack/sources/02_tapable.png" />

webpack 暴露了 `this.hooks` 对象中的属性方法。那么我们就可以根据属性，继续扩展注册事件，做一些我们想要实现的功能。当 hooks 的属性方法内部被触发时，我们自定义的事件也就被触发了。

::: tip 毫无疑问，这是理解 webpack 插件（plugins）原理的必备知识
:::
