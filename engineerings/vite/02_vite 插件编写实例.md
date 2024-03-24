# vite 插件编写实例

## 小图片转化 base64 插件

vite 在开发环境中，使用 esbuild 做编译，读取文件。无论图片的大小，都是一个图片地址，不会做转化。

vite 在生产环境中，是使用 rollup 进行打包的，就会对小图片进行处理，转化为 base64，这是默认的配置。

```ts
export default defineConfig({
  plugins: [vue()],
  build: {
    assetsInlineLimit: 4090, // 4kb， 大于 4kb 不转化，小于 4kb 转化
  },
});
```

那么就会发现两种环境中，就会存在差别。那么机会存在一种情况：就是我们的代码逻辑中，就是对 url 的处理，如果两种环境路径不一样，就会造成不同的现象。肯定行不通。

解决方案：

- 关闭优化配置，设置为 0，无论图片大小都不会进行转化。（不推荐，打包优化是必须的）
- 开发环境，也对小图片进行转化，与生产环境保持一致。（实现这个功能，就需要实现 vite 插件）

```ts
import fs from 'node:fs'
const vitePluginBase64 = (limit = 4096) => {
  return {
    title: 'vite-plugin-base64',
    transform: async (code, id) { // id 就是文件路径
      // 生产环境跳过，走自己的优化
      if(process.env.NODE_ENV === 'production') {
        return
      }
      // 过滤掉其他文件，只处理 png 格式
      if(!id.endsWith('.png')) {
        return
      }
      // 拿取文件信息
      const fileInfo = await fs.promises.stat(id)
      // 大图片不做转化
      if(fileInfo.size > limit) {
        return
      }
      // 读取文件内容
      const buffer = await fs.promises.readFile(id)
      const base64 = buffer.toString('base64')
      const dataurl = `data:image/png;base64,${base}`
      // 返回是一个文件标准格式
      return {
        code: `export default ${JSON.stringify(dataurl)}`
      }
    }
  }
};

export default defineConfig({
  plugins: [vue()],
  build: {
    assetsInlineLimit: 4090, // 4kb， 大于 4kb 不转化，小于 4kb 转化
  },
});
```

> 注重 transform hook 执行时机： 每个传入模块请求时被调用

## alias 别名插件实现原理

```ts
const fs = require("fs");
const path = require("path");
const vitePluginAlias = (options) => {
  const { prefix = "@" } = options || {};
  return {
    name: "vite-plugin-alias",
    async config(config, { command, mode }) {
      // 1. 拿到 src 下的文件夹和文件
      const src = path.resolve(__dirname, "../src");
      const aliasMap = {
        [prefix]: src,
      };
      const dirArr = await fs.promises.readdir(src, { withFileTypes: true });
      dirArr.forEach((v) => {
        // 判断是不是文件夹
        if (v.isDirectory()) {
          aliasMap[`${prefix}/${v.name}`] = `${src}/${v.name}`; // 读取实际路径 // [!code error]
        }
      });
      return {
        resolve: {
          alias: aliasMap,
        },
      };
    },
  };
};

export default vitePluginAlias;
```

> config hook 执行时机： 在解析 Vite 配置前调用
