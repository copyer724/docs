# 06_defineModal 使用和原理

在学习之前，你需要先了解宏的底层实现原理:

[vue3 宏原理](../深入原理/03_vue3%20宏.md)

了解之后，就可以看原文链接：

[一文搞懂 Vue3 defineModel 双向绑定：告别繁琐代码！](https://mp.weixin.qq.com/s/Psx7bYeoYxMgU0VXouqvow)

## v-model 基本使用

`defineModel` 是 `vue3.4` 发版的，简化 v-modal 使用。

### vue 3.4 前写法

::: code-group

```vue [父组件]
<template>
  <CommonInput v-model="inputValue" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const inputValue = ref();
</script>
```

```vue [子组件]
<template>
  <input
    :value="props.modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup lang="ts">
const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);
</script>
```

:::

**缺点**：

- 写法复杂
- 而 input 本身支持 v-model 的，却不能使用，而是使用了 v-model 的语法糖：`value` 和 `input 事件`，为什么呢？

::: warning 原因
因为是 vue 是单向数据流，子组件不能直接改变 props 的值，而 v-model 写法就直接改变 props 的值，不符合写法。
:::

### vue3.4 写法

::: code-group

```vue [父组件]
<template>
  <CommonInput v-model="inputValue" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const inputValue = ref();
</script>
```

```vue [子组件]
<template>
  <input v-model="model" />
</template>

<script setup lang="ts">
const model = defineModel();
model.value = "xxx";
</script>
```

:::

**优点**：

- 写法简单
- input 也可以直接使用 v-model, 语法更加简洁。

## defineModel 的原理

::: info 提出问题
input 中使用 v-model，难道没有直接改变 props 的值吗？难道 vue 不遵循单向数据流吗？
:::

`defineModel` 底层原理简单理解：

- 内部定义了一个 `customRef 变量`和一个 `modelValue 的 props`;
- 使用`watchSyncEffect`去监听 `customRef 变量`的变化，如果发生了变化，就会触发`update:modelValue`函数，改变父组件状态。
- 使用`watchSyncEffect`去监听 `modelValue`的变化，去更新 `customRef 变量`。

**使用 ref 和 watch 模拟内部的实现**：

```vue
<template>
  <input v-model="model" />
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

// modelValue
const props = defineProps(["modelValue"]);
// 触发更新 props 的方法
const emit = defineEmits(["update:modelValue"]);
// 变量
const model = ref();

// 两个 watch 互相监听，改变对方的状态
watch(
  () => props.modelValue,
  () => {
    model.value = props.modelValue;
  }
);
watch(model, () => {
  emit("update:modelValue", model.value);
});
</script>
```

::: tip 解答问题
input 中的 v-model 是改变子组件内部使用 ref 的变量，并没有直接改变 props, 所以并没有违背 vue 单向数据流的原则。

改变的方式，还是通过函数，触发 emit，去修改父组件的状态
:::

## defineModel 默认值和类型

```js
// 类型
const model = defineModel({ type: String });

// 默认值
const model = defineModel({ default·: 1 });

// 或者：声明带选项的 "count" prop
const count = defineModel("count", { type: Number, default: 0 });
```

- 修饰符和转换器
- ts

> 这里具体用到了，再补充；
