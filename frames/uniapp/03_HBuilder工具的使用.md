# HBuilder 工具的使用

:::danger 该软件不合适团队适用的软件
:::

### 格式化代码

需要安装插件：

- eslint-js
- eslint-vue

然后配置格式的 .eslintrc 规则

当然也有可能和 prettier 的规格有冲突，就需要在 prettier.config.js 中进行配置，改成对应的规则。

::: info 以上操作都是针对软件内置的文件，而不是项目新增文件
:::

### template 始终飘红

针对 vue2 必须存在一个 name 属性

### name 属性检查编写形式

为了区分原生标签，要求以驼峰的形式写组件名，可以开关：

在 eslint-vue 的配置文件中，加上

```js
//关闭组件命名规则
'vue/multi-word-component-names':'off',
```

就不会进行检查了
