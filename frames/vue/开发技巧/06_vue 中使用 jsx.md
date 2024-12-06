# vue 中使用 jsx

## 项目配置

vue 存在两中脚手架

- create-vue：基于 vite 构建
- vue-cli：基于 webpack 构建

### vite-js

```bash
# 创建项目
pnpm create vite vue-vite-js --template vue

# 安装支持 jsx 的插件
pnpm install -D @vitejs/plugin-vue-jsx
```

```js [vite.config.js]
// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// 导入插件并使用
import vueJsx from "@vitejs/plugin-vue-jsx"; // [!code ++]

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(), // [!code ++]
  ],
});
```

### webpack-js

```bash
# 创建项目（这里就可以进行项目配置选项，先不勾选typescript）
npx @vue/cli create vue-cli-js

# 安装支持 jsx 的插件
pnpm install @vue/babel-plugin-jsx -D
```

```js
// babel.config.js
module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: ["@vue/babel-plugin-jsx"], // [!code ++]
};
```

### vite-ts

创建项目和 jsx 插件配置基本一致

```bash
pnpm create vite vue-vite-js --template vue-ts
```

tsconfig.json 需要配置，不然语法会标红

```json
{
  "compilerOptions": {
    // 保留 JSX 语法，不进行转换
    "jsx": "preserve",
    // 从 vue 中导入 jsx 函数，好像是 h 函数
    "jsxImportSource": "vue"
  }
}
```

### webpack-ts

webpack-ts 创建（在配置选项中，选择 ts 即可）和插件安装和 webpack-js 是一致的，ts 配置是 vite-ts 的配置是一样的

## jsx 文件形式

1. 以 `.vue` 结尾的文件，要特别指定 script 标签中 lang 属性是 `jsx | tsx`

```vue
<!-- demo1.vue -->
<script lang="tsx">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Demo1",
  props: {
    msg: String,
  },
  setup(props) {
    console.log(props);
    return () => <div>{props.msg}</div>;
  },
});
</script>
```

2. `.jsx` 或 `.tsx` 结尾的文件

```tsx
// demo2.tsx
import { defineComponent } from "vue";

export default defineComponent({
  name: "Demo2",
  props: {
    msg: String,
  },
  setup(props) {
    return () => <div>{props.msg}</div>;
  },
});
```

可以发现，都借用 `defineComponent` 的形式，需要去学习一下 defineComponent 的具体语法。

## defineComponent

在定义 Vue 组件时提供类型推导的辅助函数。

它并没有实现任何的逻辑，只是把接收的 Object 直接返回，它的存在是完全让传入的整个对象获得对应的类型，它的存在就是完全为了服务 TypeScript 而存在的。

setup 函数接受两个参数，第一个参数是 `props`，第二个参数是 `context`，context 中含有 emit, slots, attrs 属性。

## vue 中的 jsx 语法

官方文档：https://cn.vuejs.org/guide/extras/render-function.html#jsx-tsx

vue 中的 jsx 语法和 React 的 jsx 语法基本一致，但是还是存在几点注意事项：

1. 针对类名的定义，使用 `class` 或者 `className` 好像都行，推荐 `className`。
2. 变量`{}`
3. `v-for` 使用`三目运算`；`v-for` 使用 `map`；`v-on:xxx` 使用 `onXxx`；
4. 事件修饰符单独处理
5. 插槽使用

::: code-group

```vue [demo.vue]
<script lang="tsx">
import { defineComponent } from "vue";
import demoA from "./demo2";

export default defineComponent({
  name: "Demo1",
  props: {
    msg: String,
  },
  // tsx components 需要手动注册
  components: {
    demoA,
  },
  setup(props) {
    console.log(props);
    return () => (
      <div>
        <demo-a>
          {{
            // 默认插槽，作用域插槽
            default: (scope: { name: string }) => <div>{scope.name}</div>,
            // 具名插槽
            footer: () => <div>footer</div>,
          }}
        </demo-a>
      </div>
    );
  },
});
</script>
```

```tsx [demo2.tsx]
import { defineComponent } from "vue";

export default defineComponent({
  name: "Demo2",
  props: {
    msg: String,
  },
  // slots 包含了所有的插槽（插槽的本质是一个函数）
  setup(props, { slots }) {
    return () => (
      <div>
        {props.msg}
        {slots.default?.({ name: "插槽里面传递的值" })}
        <div>{slots.footer?.()}</div>
      </div>
    );
  },
});
```

:::

针对插槽默认值就需要判断函数是否存在，不存在，就显示其他的

6. 组件通信（父传递子），子组件中要定义 props 属性

```tsx
// error: 拿取不到 props，传递的 props 绑定到了 dom 节点上了
export default defineComponent({
  setup(props) {
    return () => {
      return <div>{props.msg}</div>;
    };
  },
});

// 正确
export default defineComponent({
  // 定义一下 props，相应的属性就不会绑定到 dom 节点上，而是被收集到 props 对象上
  props: ["name", "age"],
  // 没有定义 age，那么 age 就会绑定到 dom 节点上
  props: ["name"]
  setup(props) {
    return () => {
      return <div>{props.msg}</div>;
    };
  },
});
```

7. 组件通信（子传递父）：通过 emit 事件

::: code-group

```tsx [子组件 demo2.tsx]
import { defineComponent } from "vue";

export default defineComponent({
  name: "Demo2",
  // 注入 change 事件
  emits: ["change"],
  setup(props, { emit }) {
    const add = () => {
      // 触发 change 事件
      emit("change");
    };
    return () => (
      <div>
        <button onClick={add}>++++</button>
      </div>
    );
  },
});
```

```vue [父组件 demo1.vue]
<script lang="tsx">
import { defineComponent } from "vue";
import demo2 from "./demo2";

export default defineComponent({
  name: "Demo1",
  components: {
    demo2,
  },
  setup(props, { emit }) {
    const btn1 = () => {
      console.log("321321");
    };
    return () => (
      <div>
        {/* 传递 change 事件 */}
        <demo2 onChange={btn1}></demo2>
      </div>
    );
  },
});
</script>
```

:::

会发现，子组件触发的 change 事件，而父组件却是使用的 onChange 事件来接受。

- 针对 jsx，`on + 驼峰形式`来接收
- 针对 template, 是 `@事件名称` 来接收

> 针对 jsx，可以简单理解 v-on 使用 on 来进行代替，并采用驼峰式

## 函数组件

函数式组件是一种定义自身没有任何状态的组件，接受 props，返回 vnode。

跟 React16 之前的函数组件概念类型，没有状态，纯渲染。

```ts
const MyComponent = (props, ctx) => vnode;
```
