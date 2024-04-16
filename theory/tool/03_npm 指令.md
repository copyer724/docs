# npm 指令

源查看及设置

```bash
npm config get registry # 查看源
npm config set registry https://registry.npmjs.org # 设置 npm 官方源
npm config set registry https://registry.npmmirror.com/ # 设置 淘宝源
```

package.json version 变动

```bash
npm version patch  # 补丁版本,最后一位数加1
npm version minor  # 增加了新功能 中间的数字加1
npm version major # 大改动,不向下兼容 第一位数字加1
```
