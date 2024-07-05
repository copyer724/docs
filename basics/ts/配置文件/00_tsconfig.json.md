# tsconfig.json

https://wangdoc.com/typescript/tsconfig.json

`tsconfig.json` 是 TypeScript 项目的配置文件，放在项目的根目录。

也可以指定配置文件的路径（`-p` 或者 `--project`）

```bash
tsc -p ./dir
```

如果不指定配置文件的位置，tsc 就会在当前目录下搜索 tsconfig.json 文件，如果不存在，就到上一级目录搜索，直到找到为止。

tsconfig.json 文件主要供 tsc 编译器使用，**怎么编译，定义编译的规则，哪些文件需要被编译，编译的产物放在哪里等等**。

最简单的配置文件

```json
{
  "compilerOptions": {
    "outDir": "./build",
    "allowJs": true,
    "target": "es5"
  },
  "include": ["./src/**/*"]
}
```

- include：指定哪些文件需要编译。
- allowJs：指定源目录的 JavaScript 文件是否原样拷贝到编译后的目录。
- outDir：指定编译产物存放的目录。
- target：指定编译产物的 JS 版本。
