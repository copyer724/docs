# vue 指令集合

vue 指令多重要，不用多说。

## v-once

- 元素和组件只会渲染一次，之后会跳过更新
- 更新阶段，会被当作静态内容，跳过渲染，用于性能优化

## v-text

更新元素的文本内容，其结果跟 `{{}}` 语法一样，但是不会解析 dom 标签。

其中与 `{{}}` 的区别：

- v-text 没有闪烁效果，`{{}}` 有闪烁效果
- v-text 全部替换标签内容，`{{}}` 部分替换（类似占位符）

## v-html

更新元素的 innerHTML

:::danger
注入 html 代码，容易造成 XSS 攻击
:::

## v-pre

跳过对该元素以及子元素的编译

```vue
<div v-pre>{{ msg }}</div>
<!-- 渲染{{ msg }} -->
```

## v-cloak

用于隐藏尚未编译完的 dom 模板，解决网速慢，直接显示 `{{}}` 字符串。

v-cloak 指令通常与 CSS 配合使用，用于在 Vue 实例加载和编译之前隐藏元素。

::: tip
简单理解，就是添加一个标识，根据这个标识做样式处理（隐藏操作），当实例加载完成之后，就会删除掉标识。
:::

::: code-group

```html
<div v-cloak>{{ msg }}</div>
```

```css
[v-cloak]: {
  display: none;
}
```

:::

## v-memo

vue 3.2 新增的内置指令，用于性能优化。

与 v-once 的区别：

- v-once: 全部会跳过更新
- v-memo: 依赖不变，则不会更新，依赖变了，就会更新。（v-memo = [] 等价于 v-once）

```vue
<div v-memo="[valueA, valueB]"></div>
```

## v-if

`v-if`, `v-else-if`, `v-else`

当 v-if 元素被触发，元素及其所包含的指令/组件都会销毁和重构。

::: tip

- v-if 和 v-for 的优先级
- v-if 和 v-show 的区别
  :::

## v-show

设置 dom 的 display 属性，仅只改变 css 属性。

v-if 和 v-show 的选择：

1. 频繁切换使用 v-show
2. v-if 的真实渲染，如果初始值为 false，则不会渲染

## v-bind

动态绑定元素的 attribute 或者组件的 prop

语法糖：`:`

新用法：变量直接绑定

```vue
<div v-bind="data"></div>
```

## v-on

用于给元素节点绑定触发事件

语法糖：`@`。

### `()` 添加？

```vue
<script setup lang="ts">
import { ref, reactive } from "vue";
const title = ref("blue");
const btn = () => {
  title.value = "red";
};
</script>

<template>
  <div class="home">
    <!-- 写法一 -->
    <button @click="btn">点击</button>
    <!-- 写法二 -->
    <button @click="btn()">点击</button>
  </div>
</template>
```

v-on 绑定的事件，就算加上 （）不会立即执行，而是触发事件了才会执行。

### 多事件绑定

```vue
<script setup lang="ts">
import { ref } from "vue";
const title = ref("blue");
const focus = () => {
  console.log("聚焦");
};
const blur = () => {
  console.log("失焦");
};
</script>

<template>
  <div class="home">
    <!--  写法一: 直接写多个v-on    -->
    <input type="text" @focus="focus" @blur="blur" />
    <!--  写法二：v-on绑定一个对象  -->
    <input type="text" v-on="{ focus: focus, blur: blur }" />
  </div>
</template>
```

写法二就不能直接加上（）了，因为是一个对象的 value 值，会被执行的。

### 参数解析

::: tip 结论

本应该传递，但是没有传递，那么第一个值是 MouseEvent，其他的是 undefined；

如果想要传递 MouseEvent，调用时就使用 `$event`。
:::

::: code-group

```vue [不传递参数]
<script setup lang="ts">
import { ref, reactive } from "vue";
const btn = (e: MouseEvent) => {
  console.log(e);
};
</script>

<template>
  <div class="home">
    <button @click="btn">点击</button>
  </div>
</template>
```

```vue [传递一个参数]
<script setup lang="ts">
import { ref, reactive } from "vue";
const btn = (e: number) => {
  console.log(e); // 123
};
</script>

<template>
  <div class="home">
    <button @click="btn(123)">点击</button>
  </div>
</template>
```

```vue [传递两个参数]
<script setup lang="ts">
import { ref, reactive } from "vue";
const title = ref("blue");
// 接受两个参数
const btn = (a: number, e: MouseEvent) => {
  console.log(a, e);
};
</script>

<template>
  <div class="home">
    <button @click="btn(1213, $event)">点击</button>
  </div>
</template>
```

:::

## v-for

循环渲染元素或者模板块。

```html
<!-- 数组 -->
<div v-for="(item, index) in list" :key="index"></div>

<!-- 对象 -->
<div v-for="(value, key, index) in obj" :key="index"></div>

<!-- 遍历模板 -->
<template v-for=""></template>

<!-- 组件遍历 ：每个组件已有自己的作用域，所以遍历的内容需要自己传递下去-->
<Child
  v-for="(value, key, index) in obj"
  :name="value"
  :age="key"
  :key="index"
/>
```

## v-modal

在表单输入元素或组件上创建双向绑定

### 基础的表单标签

::: code-group

```html [input]
<script setup lang="ts">
  import { ref } from "vue";
  const msg = ref("");
</script>

<template>
  <div class="home">
    <input type="text" v-model="msg" />
    <div>{{ msg }}</div>
  </div>
</template>
```

```html [select]
<script setup lang="ts">
  import { ref } from "vue";
  const selected = ref("1");
</script>

<template>
  <div class="home">
    <select v-model="selected">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </select>
    <div>{{ selected }}</div>
  </div>
</template>
```

```html [radio]
<!-- 这里的 v-model 绑定的是 value 属性，不是name属性。-->
<!-- id 属性是用于给 label标签 的 for 属性对应的 -->
<script setup lang="ts">
  import { ref, reactive } from "vue";
  const radioFlag = ref("a");
</script>

<template>
  <div class="home">
    <input type="radio" value="a" v-model="radioFlag" />
    <input type="radio" value="b" v-model="radioFlag" />
    <div>{{ radioFlag }}</div>
  </div>
</template>
```

```html [checkbox]
<!-- 注意，还是跟 value 配合。 -->
<!-- 值得注意的是，绑定的值是一个数组。 -->
<script setup lang="ts">
  import { ref, reactive } from "vue";
  const radioFlag = ref(["a"]);
</script>

<template>
  <div class="home">
    <input type="checkbox" value="a" v-model="radioFlag" />
    <input type="checkbox" value="b" v-model="radioFlag" />
    <div>{{ radioFlag }}</div>
  </div>
</template>
```

:::

### 表单组件 v-model 的原理

其实 v-model 的原理就是 `值绑定` 和 `事件触发` 的实现。

- 针对 input 和 texteara，就是动态绑定 value 属性 和 input 事件。
- 针对 radio 和 checkbox 来说，就是动态绑定 checked 属性 和 change 事件
- 针对 select 来说，就是动态绑定 value 属性和 change 事件

::: warning
注意：当在这些标签上使用了 v-model 之后，将忽略该标签上的 value，checked 等属性。
:::

### 组件上使用 v-model

基本使用

::: code-group

```html [App.vue]
<script setup lang="ts">
  import Child from "./components/Child.vue";
  import { ref } from "vue";
  const msg = ref("23321");
  const changeValue = (newValue: string) => {
    msg.value = newValue;
  };
</script>

<template>
  <div class="home">
    <!-- v-model 写法 -->
    <Child v-model="msg" />
    <!--  动态值绑定 modelValue 与 update:modelValue 事件 实现     -->
    <Child :modelValue="msg" @update:modelValue="changeValue" />
  </div>
</template>
```

```html [Child.vue]
<script setup lang="ts">
  import { defineProps, defineEmits } from "vue";
  const props = defineProps<{ modelValue: string }>();
  const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
  }>();

  const btn = () => {
    // 触发父组件的事件，并传递值
    emit("update:modelValue", "copyer");
  };
</script>

<template>
  <div class="child">
    <h1>{{ props.modelValue }}</h1>
    <button @click="btn">点击</button>
  </div>
</template>
```

:::

多次使用

::: code-group

```html [App.vue]
<script setup lang="ts">
import Child from './components/Child.vue'
import { ref, reactive } from 'vue'
const msg = ref('23321')
const title = ref('james')
const changeValue = (newValue: string) => {
  msg.value = newValue
}
</script>

<template>
    <Child v-model:title="title" v-model:msg="msg" />
    <h1>msg: {{ msg }}</h1>
    <h1>title: {{ title }}</h1>
  </div>
</template>

```

```html [Child.vue 写法一]
<script setup lang="ts">
  import { defineProps, defineEmits } from "vue";
  const props = defineProps<{ title: string; msg: string }>();
  const emit = defineEmits<{
    (e: "update:title", value: string): void;
    (e: "update:msg", value: string): void;
  }>();

  const changeMsg = (e: Event) => {
    emit("update:msg", (e.target as any).value);
  };
</script>

<template>
  <div class="child">
    <input
      type="text"
      :value="title"
      @input="$emit('update:title', ($event.target as any).value)"
    />
    <input type="text" :value="msg" @input="changeMsg" />
  </div>
</template>
```

```html [Child.vue 写法二]
<script setup lang="ts">
  import { defineProps, defineEmits, computed } from "vue";
  const props = defineProps<{ title: string; msg: string }>();
  const emit = defineEmits<{
    (e: "update:title", value: string): void;
    (e: "update:msg", value: string): void;
  }>();

  const newTitle = computed({
    get() {
      return props.title;
    },
    set(value) {
      emit("update:title", value);
    },
  });
</script>

<template>
  <div class="child">
    <input type="text" v-model="newTitle" />
  </div>
</template>
```

:::

## v-slot

插槽

语法糖: `#`

- 只能使用在 template 模块上
- `v-slot: [插槽名称] = "子组件传递过来的内容"`

## 自定义指令

- 选项式（option apis）：需要在 directives 注册，跟 components 一样
- 组合式 （composition apis）：在 setup 中，只要以 v 开头的，都可以看成自定义指令
