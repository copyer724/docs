# 响应式 api

## ref

### ts 类型标注

```ts
import { ref } from 'vue
import type { Ref } from 'vue'

// 自动推断
const msg = ref('copyer') // Ref<string>

// 手动指定类型
const msg: Ref<string | number> = ref('copyer')

// 泛型
const msg = ref<string | number>('copyer') // Ref<string | number>
const msg = ref<string>() // Ref<string | undefined>
```

### ref 的基本使用

接受一个值，返回一个响应式，可变的对象。使用其对象的 value 属性来改变内部的值。

简单理解，就是监听对 value 属性的操作，触发一系列的响应操作。

```ts
import { ref } from "vue";

const msg = ref("copyer");

msg.value = "james";
```

### ref 的解包

::: tip 何为解包？

- 调用 ref 函数，返回的是一个对象，其 value 属性是响应式的，那么解包就是直接拿取到 value 值的操作。
  :::

- 在模板渲染时，会自动解包。
  - 注意的是，对于模版渲染上下文来说，ref 是顶层属性才会解包。
  - 简单来说，在 template 使用的变量，必须是 ref 对象，才会进行解包，反之则是不会的。
- ref 在响应式对象中，也会自动解包（是深层次的响应式对象才会解包，浅层次的响应式对象不会解包）。
  - 无论是获取还是设置操作，都会自动解包。
- 当**数组**或则**Map**的时候，也不会自动解包。

### 为什么需要 ref ?

在官网提及到，就是在 JavaScript 中，没有一种引用机制代表所有值类型，而 reactive 是通过 proxy 代理来实现的，而 proxy 只能是引用类型，所以针对基本数据类型就会无效。

所以 vue 提供了一个响应式 api: ref，可以创建任何类型的值。

## reactive

返回一个响应式对象，简单的理解就是 vue2 中 data 返回的对象（vue2 data 属性就是基于 reactive 实现的）。

- 深层次的响应对象
- 修改必须保持同一引用地址，不然会失去响应式。

### ts 写法

不推荐写泛型，因为会存在其中的某个属性的值是 ref 对象，那么这时候类型对应不上。

```ts
import { reactive } from "vue";

interface IInfo {
  name: string;
  age: number;
}

const info: IInfo = reactive({
  name: "copyer",
  age: 18,
});
```

### 基本使用

```ts
import { reactive } from "vue";

interface IInfo {
  name: string;
  age: number;
}

const info: IInfo = reactive({
  name: "copyer",
  age: 18,
});

// 修改，触发 proxy 的 set 拦截器
info.name = "james";

// 获取，触发 proxy 的 get 拦截器
console.log(info.name);
```

### ref 和 reactive 的注意事项

当 ref 或则 reactive 的参数是数组时，需要小心谨慎，因为会容易直接修改掉引用地址，那么就会不具备响应式的特性了。

```ts
import { reactive } from "vue";

const arr = reactive([1, 2, 3, 4]);

arr = [1, 2, 3]; // 那么这时候，arr就已经失去了响应式了
```

所以说，针对数组：

- 使用响应式 api : push pop 等
- 如果是想清空，在完全增加。

```ts
arr.length = 0; // 清空数组
arr.push([...newArr]); // 完全替换，地址也不会发生变化
```

其实在这里就已经发现了 React 和 Vue 的差别对比：

- react 更新就是需要改变引用地址，监听到变化，更新。
- vue 就是不能改变引用地址，不然就失去了响应式，无法更新。

## computed

接受一个函数，返回一个只读的 ref 对象。通过 value 的来获取其中的值。

也会存在自动解包。

### ts 类型

```ts
import { ref, computed } from "vue";

const msg = ref("copyer");

// 自动推断: ComputedRef<string>
const computedMsg = computed(() => {
  return `my name is ${msg.value}`;
});

// 显示指定：泛型 ComputedRef<string>
const computedMsg = computed<string>(() => {
  return `my name is ${msg.value}`;
});

// 采用另外一种形式的话：WritableComputedRef<string>
```

### 两种书写方法

第一种方式：直接传递 getter 函数，返回一个只读的 ref 对象。

```ts
const computedMsg = computed<string>(() => {
  return `my name is ${msg.value}`;
});
```

这种方式是只读的属性，当你打算修改的时候，就会报一个警告。需要采用另外的一种方式。

第二种方式：传递一个对象，写入 getter 函数 和 setter 函数，返回一个可写计算属性

```ts
const computedMsg = computed<string>({
  get() {
    return `my name is ${msg.value}`;
  },
  set(newValue) {
    msg.value = newValue;
  },
});
```

注意：不要在 setter 中做副作用的操作。比如：网络请求/修改 dom 等操作

### 更新解释

vue 的计算属性会自动追踪响应式依赖，当响应式依赖发生变化时，使用到计算属性的地方都会同时更新。

## readonly

接受一个对象（无论是普通对象，还是响应式对象）还是一个 ref，返回一个只读的代理对象。

- 是深层次的只读代理对象
- 解包类似于 reactive 的解包（其内部都是调用了 createReactiveObject 函数）

```ts
import { ref, readonly } from "vue";

const msg = ref("copyer");
/*
===========================
接受 ref
===========================
*/
const readonlyMsg = readonly(msg); // Readonly<Ref<string>>
// 使用：readonlyMsg.value 来使用

const obj = reactive({
  name: "copyer",
  age: 12,
});
/*
===========================
接受 reactive 对象
===========================
*/
const readonlyObj = readonly(obj); // {readonly name: string; readonly age: number}
```

## watchEffect

当数据源发生变化，执行一些副作用的函数。比如：修改 dom，发送请求等操作。

特点：

- 自动收集依赖
- 会默认执行一次，目的就是为了收集依赖，在后面依赖改变的时候，会重新触发。
- 针对同步代码会直接收集所有依赖，针对异步代码，只有收集在第一个 await 之前的响应式

```ts
/*
===============================
基本使用，默认会自动执行一次，收集 msg.vlue 和 obj.name 到 deps 依赖中
当 deps 发生变化的时候，就会再次触发
===============================
*/

import { ref, reactive, watchEffect } from "vue";

const msg = ref("copyer");
const obj = reactive({
  name: "copyer",
  age: 12,
});

watchEffect(async () => {
  console.log(msg.value);
  console.log(obj.name);
});

const changeMsg = () => {
  msg.value = "kobe";
};

const changeObj = () => {
  obj.name = "james";
};
```

::: tip 犯错提示
犯错：监听的时候，是针对具体的值而收集的，比如 msg.value 和 obj.name。是不能直接收集 msg 和 obj 的（猜测原因，地址没有发生变化，是比较不出来差异的）
:::

```ts
/*
===============================
在同步代码中，会收集所有的依赖
在异步代码中，只会收集在第一个await之前的响应式
===============================
*/

import { ref, reactive, watchEffect } from "vue";

const msg = ref("copyer");
const obj = reactive({
  name: "copyer",
  age: 12,
});

const delay = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1231);
    });
  });
};

// 这里只会收集 msg.value
watchEffect(async () => {
  console.log(msg.value);
  const res = await delay();
  console.log(obj.name);
});

const changeMsg = () => {
  msg.value = "kobe";
};

const changeObj = () => {
  obj.name = "james";
};
```

### 高级特性

- 触发时机
- 停止监听
- 清理副作用

```html
<!--
==========================
触发时机：当变量更新，同时会触发vue组件更新和侦听器回调；
在侦听器回调的过程中，拿到的 dom 是组件更新之前的 dom。
那么想要拿到最新的 dom 该怎么办法呢？
==========================
-->

<script setup lang="ts">
  import { ref, reactive, watchEffect } from "vue";
  const title = ref(null);

  // 会执行两次
  // 第一次为 null
  // 第二次为 dom节点。当组件挂载成功之后，title.value 就被重新赋值了
  watchEffect(async () => {
    console.log(title.value);
  });

  // 先收集响应式，当节点更新之后（post），才会触发
  watchEffect(
    async () => {
      console.log(title.value);
    },
    {
      flush: "post", // pre 默认值： 会立即执行； post: 节点更新会执行
    }
  );
</script>

<template>
  <div class="home">
    <h1 ref="title">copyer</h1>
  </div>
</template>
```

```ts
/*
  ==========================
  停止监听：调用 watchEffect 函数时，会返回一个停止侦听的函数。
  ==========================
*/
import { ref, reactive, watchEffect } from "vue";
const title = ref(null);

const stop = watchEffect(async () => {
  console.log(title.value);
});

stop(); // 调用stop就停止侦听了
```

停止侦听：

- 在 setup 中，使用 watchEffect 函数，会自动挂载到组件实例上，当组件实例卸载的时候，就会停止侦听。
- 同步注册，实例组件卸载时会自动卸载。但是如果是异步注册，组件卸载不会卸载，需要手动卸载。
- 当满足一些条件的时候，也不需要侦听了，也可以手动实现卸载。

```ts
/*
  ==========================
  清除副作用
  ==========================
*/
import { ref, reactive, watchEffect } from "vue";
const title = ref(null);

watchEffect(async (onCleanup) => {
  onCleanup(() => {
    // 如果请求还没返回，变量又改变了，那么就取消请求，重新发送请求
    axsio.cancel();
  });
  axios.get(msg.value); // 发送请求
});

stop(); // 调用stop就停止侦听了
```

## watch

特点：

- 惰性执行（简单理解：就是第一次不会执行）
- 仅当数据源发生了变化，才会执行。
- 可以获取旧的 value 属性

```ts
/*
  ==========================
  watch 的基本使用
  ==========================
*/
import { ref, watchEffect, watch } from "vue";

const msg = ref("copyer");
const num = ref(0);

const unWatch = watch(
  [msg, num],
  (newValue, oldValue, onClearup) => {
    console.log(newValue, oldValue);
  },
  {
    immediate: true, // 立即执行，默认为false
    deep: true, // 深度侦听，性能差，默认为false
    flush: "pre", // pre/post/sync
  }
);

const btn = () => {
  msg.value = "321";
  num.value++;
  if (num.value > 5) {
    // 当大于5的时候，停止侦听
    unWatch();
  }
};
```
