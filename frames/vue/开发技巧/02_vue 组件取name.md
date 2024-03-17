# vue 组件取 name 属性

vue3 升级为 setup 语法之后，给组件取名，就是一个问题。可以采用一下两种方式：

### 方式一：两个 script

```vue
<script lang="ts">
export default {
  name: "Test1Detail1",
};
</script>
<script lang="ts" setup></script>
```

写法麻烦

### 方式二：借用插件

安装

```bash
pnpm add vite-plugin-vue-setup-extend -D
```

配置

```ts
import VueSetupExtend from "vite-plugin-vue-setup-extend";
export default defineConfig({
  plugins: [VueSetupExtend()],
});
```

使用

```vue
<script lang="ts" setup name="demo"></script>
```

在使用 vite-plugin-vue-setup-extend 0.4.0 及以前版本时，会有个问题：如果 script 标签内没有内容，即使给 script 标签添加上 name 属性，其在 vue-devtools 内也不会生效。

解决方案：

```ts
<script lang="ts" setup name="demo">
  // test
</script>
```

### vite 创建项目

vite 会根据组件的文件名自动生成组件名。
