# vue 高级开发指南

## 理解 script-setup 模式

- 不需要 return
- 子组件不需要手动注册，直接导入即可

::: details 代码演示

::: code-group

```ts {4,8-10} [旧写法]
<script lang="ts">
import { defineComponent } from 'vue'
// 导入子组件
import Child from './Child.vue'

export default defineComponent({
  // 需要启用子组件作为模板
  components: {
    Child,
  },
  setup() {
  },
})
</script>
```

```vue {2} [新写法]
<script setup lang="ts">
import Child from "./Child.vue";
</script>
```

:::

## 宏编译

*宏*是一种批量处理的称谓，简单来说就是根据定义好的规则替换一定的文本，发生在程序编译阶段。

宏不能在子函数中使用，它必须直接放置在 `<script setup>` 的顶级作用域下。

常用的宏：

- `defineProps`：定义 props

::: details 代码演示

::: code-group

```vue [对象式 setup]
<script>
 export default {
   // 数组形式
   props: ["info", "count"],

   // 对象形式
   props: {
     info: {
       type: Object,
     },
     count: {
       type: Number,
       default: 7,
       required: true
     }
   }
   setup(props) {
     // setup 两个参数 props, context
     console.log(props);
   },
 };
</script>
```

```vue [函数 setup js 版本]
<script>
// 参数为数组
const props = defineProps(["info", "count"]);

// 参数为对象
const props = defineProps({
  info: {
    type: Object,
  },
  count: {
    type: Number,
    default: 7,
    required: true,
  },
});
</script>
```

```vue [函数 setup ts 版本]
<script>
const props = defineProps<{
  info?: object
  count: number
}>()
</script>
```

:::

- `withDefaults`：设置默认值

::: details 代码演示

::: code-group

```ts [3.5 以前]
const props = withDefaults(
  // 这是第一个参数，声明 props
  defineProps<{
    size?: number;
    labels?: string[];
  }>(),
  // 这是第二个参数，设置默认值
  {
    size: 3,
    labels: () => ["default label"],
  }
);
```

```ts [3.5 以前]
const { size = 3, labels = ["default label"] } = defineProps<{
  size?: number;
  labels?: string[];
}>();
```

:::

- `defineEmits`：声明触发的事件

::: details 代码演示

::: code-group

```vue [对象版]
<script>
export default {
  emits: ["inFocus", "submit"],
  setup(props, ctx) {
    ctx.emit("submit");
  },
};
</script>
```

```vue [函数版 js 版本]
<script>
// 获取 emit
const emit = defineEmits(["update-name"]);

// 调用 emit, 第二个为传递参数
emit("update-name", "Tom");
</script>
```

```vue [函数版 ts 版本]
<script setup lang="ts">
// 运行时
const emit = defineEmits(["change", "update"]);

// 基于选项
const emit = defineEmits({
  change: (id: number) => {
    // 返回 `true` 或 `false`
    // 表明验证通过或失败
  },
  update: (value: string) => {
    // 返回 `true` 或 `false`
    // 表明验证通过或失败
  },
});

// 基于类型
const emit = defineEmits<{
  (e: "change", id: number): void;
  (e: "update", value: string): void;
}>();

// 3.3+: 可选的、更简洁的语法
const emit = defineEmits<{
  change: [id: number];
  update: [value: string];
}>();
</script>
```

:::

- `defineExpose`: 暴露子组件方法，默认情况下，setup 关闭暴露实例，通过 ref 拿取实例也不行

::: details 代码演示

```vue
<script setup>
import {ref} from 'vue'
const a = 1
const b = ref(2)
defineExpose({(a, b)})
</script>
```

:::

- `defineModel`：子组件用于接受 v-model（其实内部就是封装了一层，不需要手动更新而已）

::: details 代码演示

::: code-group

```vue [父组件]
<template>
  <div class="home">
    <About v-model:a="a" v-model="b" />
  </div>
</template>
```

```vue [子组件]
<script setup lang="ts">
import { ref } from "vue";
const aa = defineModel("a");
console.log("aa======>", aa.value);
const default1 = defineModel();
console.log("default1======>", default1.value);
</script>
```

:::

## 属性透传

## 高阶组件

::: details 代码演示

```tsx
import { ref } from "vue";

export default function withHover(Component) {
  return {
    setup(props, { slots }) {
      const isHovered = ref(false);

      return () => (
        <div
          onMouseenter={() => (isHovered.value = true)}
          onMouseleave={() => (isHovered.value = false)}
        >
          <Component {...props} isHovered={isHovered.value} v-slots={slots} />
        </div>
      );
    },
  };
}
```

:::

## render 函数

在 vue3 编译时，会把 template 转变为 render 函数，render 函数后续就会生成虚拟 dom，最后生成真实 dom。

render 函数的工作原理，就是返回一个 vnode

```ts
import { h } from "vue";

export default {
  render() {
    return h("div", {}, "Hello, world!");
  },
};
```

## 插槽

- 基本使用，组件内嵌入 `<slot />`
- 插槽默认值
- 具名插槽 `<slot name="copyer"></slot>` 默认值是 default
- `v-slot` 指定插槽名，只能写在 template 标签上，简写为 `#`
- 动态插槽名

::: details 代码演示

::: code-group

```vue [父组件]
<script setup lang="ts">
import SlotSon from "./SlotSon.vue";
import { ref } from "vue";
// 插槽名称变量
const slotName = ref("title");
</script>
<template>
  <div class="father">
    <h3>我是父组件</h3>
       <!-- 传递给子组件 -->
       <SlotSon :slotName="slotName">
           <!-- 动态插槽名 -->
           <template #[slotName]>
        <p>插入指定的位置</p>
             </template
      >
       
    </SlotSon>
  </div>
</template>
```

```vue [子组件]
<script setup lang="ts">
const props = defineProps<{ slotName: string }>();
</script>

<template>
  <div class="son">
    <h3>我是子组件</h3>
    <!-- 定义插槽名称使用 props 中的变量 -->
    <slot :name="props.slotName"></slot>
  </div>
</template>
```

:::

- 渲染作用域：父组件模板中的表达式只能访问父组件的作用域；子组件模板中的表达式只能访问子组件的作用域。
- 作用域插槽：父组件访问子组件的变量

::: details 代码演示

::: code-group

```vue [子组件]
<script setup lang="ts">
import { ref } from "vue";
const message = ref("子组件的信息");
</script>

<template>
  <div class="son">
    <h3>我是子组件</h3>
    <!-- 传递 message 给父组件 -->
    <slot name="james" :message="message"></slot>
  </div>
</template>
```

```vue [父组件]
<script setup lang="ts">
import SlotSon from "./SlotSon.vue";
</script>

<template>
  <div class="father">
    <h3>我是父组件</h3>
    <SlotSon>
      <!-- slotProps 就是 slot 标签上的 props -->
      <template #james="slotProps">
        <p>{{ slotProps.message }}</p>
      </template>
    </SlotSon>
  </div>
</template>
```

:::
