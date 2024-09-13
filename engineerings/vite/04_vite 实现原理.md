# vite 实现原理

学习文章：https://juejin.cn/post/7350936959059722280

术语

- 启动服务器，请求的时候根据 url 找到对应的文件，编译（让浏览器认识）之后进行返回

- vite 是 no bundle 方案，它只是基于浏览器的 module import，在请求的时候对模块做下编译

- 浏览器支持 es module 的 import，那如果 node_modules 下的依赖有用 commonjs 模块规范的代码，需要提前做一些转换，把 commonjs 转成 esm，这就是 vite 的 预构建功能 `pre bundle`

- vite 会在这些预打包的模块后加一个 query 字符串带上 hash，然后用 max-age 强缓存，不用每次都请求。
