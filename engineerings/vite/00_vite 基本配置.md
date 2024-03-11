# vite 基本配置

## 配置别名

`vite.config.ts` 配置

```ts
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
```

`tsconfig.json` 配置

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### 错误解决 path

在上面的 vite 配置中，使用了 `path` 和 `__dirname` 变量，会报错飘红。但是我们都知道，运行在 node 环境中，这就是默认存在，根本不需要导入。

造成的原因：**缺少类型申明**

```bash
pnpm i @types/node -D
```

在 `tsconfig.node.json` 配置

```json
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true
  }
}
```
