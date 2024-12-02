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
