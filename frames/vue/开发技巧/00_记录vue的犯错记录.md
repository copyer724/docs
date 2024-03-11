# 记录 vue 犯错记录

## element-plus 图标全局注册

```ts
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const app = createApp(App);

// 先：注册图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 后
app.use(router).use(ElementPlus).mount("#app");
```

如果当顺序写反了，App 挂载时，图标没有注册，显示不出来。
