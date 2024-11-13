# Tailwind CSS

## 响应式

Tailwind 提供五个默认的断点：

- `sm` 640px
- `md` 768px
- `lg`1024px
- `xl` 1280px
- `2xl` 1536px

## 特殊值

```html
<div class="w-[139px] h-[77px] bg-[#165DFF]"></div>
```

## 基础样式与组件库样式有冲突

```js
// corePlugins: {
//   preflight: false,
// },
然后自己写;
```

## tailwind.config.js 颜色设置

自定义颜色

- 直接使用 colors 属性，就没有继承原来的颜色，就根据自己的定义走
- 使用 extends 中的 textColor，就继承了原来的颜色，可以使用自定义的，也可以使用 tailwind 自带的

```js
module.exports = {
  theme: {
    // 继承（推荐）
    extend: {
      textColor: {
        primary: "var(--copyer-active-color)",
      },
    },
    // 不继承
    colors: {
      primary: "var(--copyer-active-color)",
    },
  },
};
```

## 内置三部分

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- base 部分：样式重置，保证样式每端一致
- components 部分：内置组件样式
- utilities 部分：核心原子化样式类
