# path 模块方法

### `__filename` 和 `__dirname`

- file 文件
- dir 文件夹

::: tip
都是查找执行命令的路径，file 返回了具体的路径，dir 只是返回上一级的目录
:::

```ts
console.log(__filename); //  E:\tesrCode\webpack\webpack-package\test.js
console.log(__dirname); //  E:\tesrCode\webpack\webpack-package
```

### path.dirname()

去掉尾部的文件名。

测试：简单来说，就是去掉最后一个 `/` 后面的内容

```js
path.dirname("/foo/bar/baz/asdf/quux"); // '/foo/bar/baz/asdf'
```

### path.resolve()

- 顺序：从右至左的拼接
- 遇到绝对路径就停止拼接
- 具有 `cd` 性质操作

::: tip
遇到绝对路径就停止，如果遍历完了给定的 path，还没有生成绝对路径，则采用当前的工作路径
:::

```ts
path.resolve("/bar", "/foo"); // E:/foo  第一个就是绝对路径

// cd 操作命令符的表现形式
path.resolve("/foo/bar", "./baz"); //  E:/foo/bar/baz
path.resolve("/foo/bar", "../baz"); //  E:/foo/baz

// 当前的工作路径：E:/home/test
const str = path.resolve("foo", "./baz"); // E:/home/test/foo/baz
```

### path.join()

- 顺序：从左至右，依次拼接，生成规范化的路径
- 具有 `cd` 性质操作

```ts
const str1 = path.join("./foo", "/zar", "../rrrr", "../ggg"); // /foo/ggg
const str1 = path.join("./foo", "/zar", "../rrrr", "./ggg"); // /foo/rrrr/ggg
const str1 = path.join("./foo", "/zar", "./rrrr", "./ggg"); // /foo/zar/rrrr/ggg
```

### process.cwd()

命令执行的路径
