# nest 中文文档阅读笔记

## 中文文档

[Nestjs 中文文档](http://nestjs.inode.club/)

## 安装

```bash
npm i -g @nestjs/cli
$ nest new project-name
```

## 核心基础知识

### 程序入口

使用 `@nestjs/core` 提供的一个类：`NestFactory`，其中暴露出了一些静态方法，`create` 就是其中一个，执行返回一个`INestApplication` 应用程序对象。

```ts
import { NestFactory } from "@nestjs/core";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

注意事项：

```ts
// 程序在启动的过程中发现错误，会直接终止程序；不想要终止程序，而是报错，需如下写法：
NestFactory.create(AppModule, { abortOnError: false });
```

Nest 默认支持两个 HTTP 平台：`express` 和 `fastify`。每个平台都会暴露自己的对应接口：`NestExpressApplication` 和 `NestFastifyApplication`。

```ts
// 指定 express 平台
const app = await NestFactory.create<NestExpressApplication>(AppModule);
// 指定 fastify 平台
const app = await NestFactory.create<NestFastifyApplication>(AppModule);
```

但是请注意，除非你确实想访问底层平台的 API，否则不需要指定类型。

### 控制器（Controller）

作用：处理接口请求和接口返回数据。

**官方概念**：

- 存在*多*个控制器
- 一个控制器存在*多*个路由（从上到下依次匹配）
- *路由机制*控制哪个控制器接收哪些请求。
- *路由路径*是*可选的控制器（controller）路径前缀*和*请求方法装饰器（get,post）中声明的任何路径字符串*的组合字符串
