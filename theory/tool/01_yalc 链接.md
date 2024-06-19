# yalc 链接

[【一库】yalc: 可能是最好的前端 link 调试方案（已经非常谦虚了）](https://juejin.cn/post/7033400734746066957)

### 全局安装

```bash
npm install yalc -g
```

### 调试包

在调试包项目里面执行命令

```bash
# 第一次发布
yalc publish

# 第二次更改
yalc publish --push # 简写 yalc push
```

## 使用方

```bash
# 添加
yalc add copyer_deploy

# 如果调试包涉及到第三方包，还是需要 npm install

# 移除
yalc remove copyer_deploy

# 更新
yalc update copyer_deploy
```
