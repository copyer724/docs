# webpack 占位符

## 篇前疑问

- 为什么需要占位符？有哪些呢？
- hash, contentHash, chunkHash 之间的区别？

## 为什么

webpack 在分包的时候，为了便于区分打包文件，这时就会使用占位符（placeholder）进行区分。

使用占位符有两大优点：

- 对整体的打包目录结构清晰
- 文件缓存（webpack 对打包文件进行了缓存，只要文件名称不会变，就会去缓存中读取资源）

::: tip

上面这个文件缓存是针对使用了 hash 的占位符，只要文件内容发生了变化，hash 值就会发生变化。文件内容没有发生变化，hash 值就不会改变，那么对再次获取资源的时候，就是从缓存中读取值。
:::

## 占位符有哪些呢

- [id]
- [name]
- [hash]
- [ext]
- [chunkhash]
- [contenthash]
- [ext]
- ...
  枚举出来的都是几个常用的占位符。

`[id]` 和 `[name]` 默认情况下是一样的。
但是 `[id]` 是可以根据配置改变的，比如说：

```ts
// id 是根据这个改变的
// 告知 webpack 当选择模块 id 时需要使用哪种算法, 默认值是 false
optimization: {
  chunkIds: "deterministic",
    // named: id 和 name 一样
    // natural: 按顺序递增的数据
    // deterministic: 生成的数据id，用于缓存的 webpack5 新增的
},
```

## hash、chunkhash、contenthash 之间的区别

**hash**: 整个项目的 hash 值是一样，所有文件的 hash 值是一样的。只要任何文件改动，所有文件的 hash 会跟着变化。

<img src="/images/engineerings/webpack/01_webpack_hash.png" />

**chunkhash**: 存在两种情况：

- 针对主包和直接导入的分包的 hash 值是一个（主包 和 css 的 hash 值一样）。假设 hash1
- 针对动态导入，hash 值是另外一个。假设 hash2

这两个 hash 值是互不影响的（比如说，动态导入的内容发生变化，hash2 的值会发生变化，但是 hash1 不会发生变动；主包或者 css 的内容发生变化，hash1 值发生变化，但是 hash2 不会发生变化 ）

<img src="/images/engineerings/webpack/02_webpack_hash.png" />

::: danger 问题所在

- css 变化，主包没有修改，那么主包的 hash 需要变化吗？显然是不需要的，只需要改变 css hash 值即可

- 主包变化，css 没有修改，那么 css 的 hash 需要变化吗？显然是不需要的，只需要改变 主包 hash 值即可

:::

**contentHash** 就是用来解决上面的问题。每个 hash 各不相同。
