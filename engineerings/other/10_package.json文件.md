# 理解 package.json 文件属性

```json
{
  // 生产依赖
  "dependencies": {},
  // 开发依赖
  "devDependencies": {},
  // 三方库的依赖项，以实际项目为准，里面的依赖项放在 devDependencies 中，因为在安装三方库时，就不需要使用继续安装
  "peerDependencies": {},
  // 依赖项版本确定
  "resolutions": {},
  // 指定哪些文件，上传到 npm 仓库
  "files": [],
  /** ESM 格式编写入口文件 */
  "modules": "",
  /** 其他格式编写入口文件 */
  "main": "",
  /** 旧版指定类型 */
  "typings": "",
  /** 新版指定类型 */
  "types": ""
}
```
