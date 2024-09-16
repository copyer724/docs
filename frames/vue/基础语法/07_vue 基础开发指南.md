# vue 基础开发指南

## 开发规范

**代码命名技巧**

- 针对 String 类型，直接直接使用名名词，组合就使用驼峰式命名。
- 针对 Number 类型，`名词 + 后缀(Number, Count, Size, ...)`
- 针对 boolean 类型，`前缀(is, has) + 名称`
- 针对 Array 类型，`名词 + 后缀（s, List）`
- 函数命名，`前缀(get, query, read, save, update, delete, open, show, hide) + 名称`；
  - `get` 用于获取，不涉及接口；`query` 用于获取，但是涉及到接口，`read` 读取静态资源时，使用；
  - 数据存储可以统一使用 `save`
  - 如果要区分新建或者更新操作，可以对新建操作使用 `create` ，对更新操作使用 `update`
  - 删除使用 `delete` 或 `remove`
  - 如果是 Node.js 程序需要对文件写入内容，使用 `write`
  - 表单验证合法性等场景，可以使用 `verify` 或 `check`
  - 切换可见性可以用 `show` 和 `hide` ，如果是写在一个函数里，可以使用 `toggle`
  - 发送验证码、发送邮件等等可以使用 `send`
  - 打开路由、打开外部 URL 可以使用 `open`

## vue 指令

## composition api

- `ref`
- `reactive`
- `computed`
- `watch` | `watchEffect`
- `shallowReactive`
- `shallowRef`
- `readonly`
- `shallowReadonly`
- `toRaw`
- `markRaw`
- `customRef`
- `provide`
- `inject`

## vue 事件

## 绑定 ref

- 获取原生 dom 节点

::: details 代码演示

```vue
<script setup lang="ts">
import { ref } from "vue";
const btnRef = ref();

const getBtn = () => {
  console.log(btnRef.value.$el);
};
</script>

<template>
  <div class="home">
    <!-- 犯错： :ref="btnRef" 错误写法 -->
    <!-- 疑惑：ref="btnRef" 这样写绑定的不是一个字符串吗？不是的，vue 内部在解析 ref 的时候，会单独处理 -->
    <!-- 跟 react 内部机制是一样的，会单独拧出 ref props 来进行处理 -->
    <button ref="btnRef" @click="getBtn">按钮</button>
  </div>
</template>
```

:::

- 获取组件节点

::: details 代码演示

::: code-group

```vue 子组件
<script setup lang="ts">
import { ref } from "vue";

const a = ref(1);

defineExpose({
  a,
});
</script>
```

```vue 父组件
<script setup lang="ts">
import { ref } from "vue";
import About from "../about/about.vue";
const aboutRef = ref(null);

const getBtn = () => {
  /** $el：获取 dom 元素节点 */
  /** a 就是 defineExpose 暴露出来变量 */
  console.log(aboutRef.value?.$el);
};
</script>

<template>
  <div class="home">
    <button @click="getBtn">按钮</button>
    <About ref="aboutRef" />
  </div>
</template>
```

:::

## setupContext

在 setup 函数中，第一个参数是 props，第二个参数是 context 对象，对象里面包含三个属性：

- attrs：所有的非 prop 的 attribute
- slots：插槽
- emit：触发事件

在 template 模板中使用，可以使用 `$attrs` `$slots` `$emit` 来使用。

在 `<script setup>` 使用 slots 和 attrs 的情况应该是相对来说较为罕见的，但是也可以使用：

```vue
<script setup>
import { useSlots, useAttrs } from "vue";
const slots = useSlots();
const attrs = useAttrs();
</script>
```

## css 样式处理

在 vue 中，在 style 标签上，没有添加 scoped，就是全局样式。反之，就是局部样式，会加上唯一 hash 值。

- 样式穿透: `:deep`

```css
.my-input :deep(.el-input__inner) {
  background-color: red;
}
```

- 动态绑定: `v-bind`

```css
.content {
  height: 30px;
  /* 动态绑定 width 属性 */
  width: v-bind(width + "px");
  background-color: red;
}
```
