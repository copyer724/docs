# vue 开发技巧

- vue 文件中 tsx 中写插槽

```vue
<script lang="tsx" setup>
const Render = (props: Props) => {
  return <div>
    {{
      default: () => {
        return <div>{{ props.children }}</div>;
      },
      header: () => {
        return <div>{{ props.header }}</div>;
      }
    }}
  </div>;
};
</script>
```

- useSlots

获取 setup slots 对象

- defineProps<{ column: ColumnProps }>()

通过使用了 `defineProps` 并指定了类型，变量就可以直接在模板中使用

```vue
<template>
  <div>{{ name }}</div>
</template>

<script lang="ts" setup>
defineProps<{ name: ColumnProps }>();
</script>
```

当然在 script 中，还是需要使用 props.xxx 的方式

- 插槽遍历

```vue
<template #[item]="data" v-for="item in Object.keys($slots)">
  <slot :name="item" v-bind="data || {}"></slot>
</template>
```

- 动态插槽名
- 插槽传递数据

- PropType

在 Vue 3 中，PropType 是一个用于定义组件 props 类型的实用工具类型，它允许你指定 props 的类型，并在 TypeScript 环境中提供类型检查和自动补全功能。PropType 是从 vue 包中导入的，通常与 defineComponent 方法一起使用。

```ts
import { PropType } from "vue";

export default defineComponent({
  props: {
    message: String as PropType<string>,
    count: Number as PropType<number>,
    isDisabled: Boolean as PropType<boolean>,
    items: Array as PropType<{ id: number; name: string }[]>,
    handler: Function as PropType<() => void>,
    style: Object as PropType<{ [key: string]: string }>,
  },
});
```

PropType 指定 ts 的类型
