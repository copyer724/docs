# mini-vue reactive 函数实现

`reactive` 函数接收一个对象作为参数，返回一个代理对象，代理对象可以拦截对对象的访问和修改，实现对对象的响应式。

```ts
import { reactive } from "vue";

const obj = { name: "actor" };

const state1 = reactive(obj); // Proxy() {name: 'actor'} 返回代理对象

const state2 = reactive(obj); // 针对同一个对象代理，应该是返回同一个代理对象，也就是  state1 === state2

const state3 = reactive(state1); // 针对直接传递代理对象，返回代理对象本身，不需要重新代理
```

`effect` 是一个副作用的函数，可以接受一个函数作为参数，当函数内部有数据发生变化时，会触发对应的回调函数。

```vue
<template>
  <div id="app"></div>
</template>
<script>
import { reactive, effect } from "vue";
const state = reactive({ name: "actor" });

// effect 函数初始化会执行，后续当 state 发生变化后，也会执行
effect(() => {
  app.innerHTML = state.name;
});
</script>
```

该两个函数都在 `@vue/reactivity` 包里。来简单的实现一下。

## reactive 函数实现

创建 `packages/reactivity/src/reactive.ts` 文件

接受一个对象，返回一个代理对象，使用 Proxy 进行代理

```ts
export function reactive(target: object) {
  return new Proxy(obj, {});
}
```

在代理之前，肯定需要对对象进行验证，只有对象才能进行代理，在这里单独抽离一个 `createReactiveObject` 函数, 在 reactive 中直接调用即可

```ts{3-6}
function createReactiveObject(target: object) {
  // 判断是否是一个对象 // [!code focus]
  if (!isObject(target)) { // [!code focus]
    console.warn("target must be an object"); // [!code focus]
    return target; // [!code focus]
  } // [!code focus]
  return new Proxy(target, {});
}

export function reactive(target: object) {
  return createReactiveObject(target);
}
```

情况一：当针对同一对象代理时，应该是返回同一个代理对象

```ts
const obj = { name: "actor" };

const state1 = reactive(obj);
const state2 = reactive(obj);

console.log(state1 === state2); // true
```

为了处理上面这种情况，就需要对代理的对象进行缓存，后续发现同样的就直接返回缓存对象，而不是重新代理。

```ts{2,11-12}
// 用于保存缓存 // [!code focus]
const targetMap = new WeakMap(); // [!code focus]

function createReactiveObject(target: object) {
  // 判断是否是一个对象
  if (!isObject(target)) {
    console.warn("target must be an object");
    return target;
  }
  // 如果存在缓存，直接返回 // [!code focus]
  const existingProxy = targetMap.get(target); // [!code focus]
  if (existingProxy) return existingProxy; // [!code focus]
  return new Proxy(target, {});
}
```

情况二，如果 reactive 接受的对象是一个代理对象，应该返回代理对象本身，不需要重新代理。

```ts
const obj = { name: "actor" };

const state1 = reactive(obj);
const state2 = reactive(state1);

console.log(state1 === state2); // true
```

那么针对这种请求，就需要判断该对象是已经被代理过的，那么如何判断该对象是已经被代理的过呢？

::: tip 如何判断是否是代理对像
代理过后的对象，访问其中的属性一定会经过 get 拦截器，只判断是否进入 get 拦截器即可
:::

可以定义一个内置变量，简单模拟**获取属性**，以及在 **get 拦截器中拦截到该属性**，就说明是代理对象

<img src="/public/images/frames/vue/05_mini-vue_04.png" />

在 `packages/reactivity/src/constants.ts` 定义内置变量

```ts
export enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive", // 内置属性
}
```

在 `packages/reactivity/src/reactive.ts` 模拟获取内置属性

```ts{8-11}
export function createReactiveObject(target: object) {
  // 目标必须是一个对象
  if (!isObject(target)) {
    console.warn(`value cannot be made reactive: ${String(target)}`);
    return target;
  }

  // 判断 target 是否被代理过
  if (target[ReactiveFlags.IS_REACTIVE] === true) {
    return target; // 直接返回代理对象
  }

  // 如果对象已经被代理过，直接返回
  const existingProxy = targetMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }

  // 返回一个代理对象
  return new Proxy(target, mutableHandlers);
}
```

在 `packages/reactivity/src/mutableHandlers.ts` 拦截器中处理

```ts{5-8}
import { ReactiveFlags } from "./constants";

export const mutableHandlers = {
  // get 拦截器
  get(target: object, key: string | symbol, receiver: object) {
    // 用于判断 target 是否是代理对象
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }
    return Reflect.get(target, key, receiver);
  }
};
```

这样就是情况二的问题处理解决了，如果是代理对象，直接返回。

上面把特殊的情况都处理了，接下来就是一个正常的对象，就需要转变为代理对象

```ts
const proxy = new Proxy(target, {});
```

Proxy 一共有 13 中拦截器，单独抽离一个文件来编写 `packages/reactivity/src/mutableHandlers.ts`，
目前就模拟了 get 和 set 拦截器

```ts
import { ReactiveFlags } from "./constants";

export const mutableHandlers = {
  get(target: object, key: string | symbol, receiver: object) {
    // 用于判断 target 是否是代理对象
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }
    return Reflect.get(target, key, receiver);
  },
  set(target: object, key: string | symbol, value: any, receiver: object) {
    return Reflect.set(target, key, value, receiver);
  },
};
```

:::danger Reflect 的具体用于可以了解一下，其实就类似 Object 中的方法一样，只不过跟 Proxy 绑定关系很强烈
:::

针对为什么在 get 使用 `Reflect.get(target, key, receiver)`，而不是直接返回 `target[key]`，是因为在定义一个对象存在 getter 和 setter 的写法

```js
const obj = {
  name: "james",
  get nickName() {
    return this.name; // TIP: 这里的 this 是 obj
  },
};

const proxyObj = new Proxy(obj, {
  get(target, key) {
    return target[key]; // 决定 this 的指向
  },
});

proxyObj.nickName(); // 注意 this 的指向
```

当 this 指向 obj 的时候，`obj.name` 是不会进入 proxy 的 get 拦截器中，也就意味着收集不了 name 属性的获取，也就设置不了响应式属性。

那么解决方式就是改变 this 的指向

```ts
const proxyObj = new Proxy(obj, {
  // receiver 就是代理对象
  get(target, key, receiver) {
    // Reflect.get 的第三个参数就是该改变 this 的指向
    // 那么再次获取 nickName 时，里面的 this 就是指向代理对象，也就是收集到，可以设置为响应式了
    return Reflect.get(target, key, receiver);
  },
});
```

## 完整代码

::: code-group

```ts [reactive.ts]
import { isObject } from "@vue/shared";
import { mutableHandlers } from "./baseHandlers";
import { ReactiveFlags } from "./constants";

// 用来记录对象是否被代理过
const targetMap = new WeakMap();

export function reactive(target: object) {
  return createReactiveObject(target);
}

export function createReactiveObject(target: object) {
  // 目标必须是一个对象
  if (!isObject(target)) {
    console.warn(`value cannot be made reactive: ${String(target)}`);
    return target;
  }

  // 判断 target 是否被代理过
  // 如果对象中存在 get 方法，就代表被代理过，直接返回
  if ((target as any)[ReactiveFlags.IS_REACTIVE] === true) {
    return target;
  }
  // 如果对象已经被代理过，直接返回
  const existingProxy = targetMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }

  // 返回一个代理对象
  return new Proxy(target, mutableHandlers);
}
```

```ts [baseHandlers.ts]
import { ReactiveFlags } from "./constants";

export const mutableHandlers = {
  get(target: object, key: string | symbol, receiver: object) {
    // 用于判断 target 是否是代理对象
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }
    return Reflect.get(target, key, receiver);
  },
  set(target: object, key: string | symbol, value: any, receiver: object) {
    return Reflect.set(target, key, value, receiver);
  },
};
```

```ts [constants.ts]
export enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}
```

:::
