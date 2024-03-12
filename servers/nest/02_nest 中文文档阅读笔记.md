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

_响应处理_：

- 标准（推荐）：数组和对象转化为 JSON，针对基本数据类型，直接返回，不做处理。
- 特定库：如 express。则需要手动注入 `@Res` 等装饰器

_状态码_：

处理 Post 请求之外，都是 200，Post 是 201，可以通过 `HttpCode` 来指定

```ts
import { Controller, Post, HttpCode } from "@nestjs/common";

@Controller("/cats")
export default class CatsController {
  @Post()
  @HttpCode(200)
  findAll(): string[] {
    return ["cats"];
  }
}
```

_请求对象_：

处理程序通常需要访问客户端的请求详细信息。Nest 提供了对底层平台的请求对象（默认为 Express）的访问。

- `@Req()` 或者 `@Request()` 来获取所有信息
- `@Query()` `@Params()` `@Ip()` `@Body()` `@Next()` 来获取对应的部分信息。

> 针对 Req 或者 Request 需要安装类型：`@types/express`

```ts
import { Controller, Get, Post, HttpCode, Req, Query } from "@nestjs/common";
import { Request } from "express";

@Controller("/cats")
export default class CatsController {
  @Get()
  @HttpCode(200)
  findAll(@Req() res: Request, @Query() query: string): string[] {
    // res 请求对象  query：query 对象
    return ["cats"];
  }
}
```

_头部信息：_

自定义的响应头，你可以使用`@Header()`装饰器，或则特定库`res.header()`

```ts
@Post()
@Header('Cache-Control', 'none')
create() {
  return 'This action adds a new cat';
}
```

_重定向_：

可以使用`@Redirect()`装饰器，也可以使用特定库`res.redirect()`

```ts
@Controller("/cats")
export default class CatsController {
  @Get("create")
  create(): { name: string } {
    return { name: "thinker1" };
  }

  @Get()
  @Redirect("http://localhost:3000/cats/create", 301) // 重定向到另外一个接口
  findAll(@Req() res: Request, @Query() query: string): string[] {
    console.log("res, query======>", res, query);
    return ["cats"];
  }
}
```

_异步性：_

每个异步函数都必须返回一个 Promise。这意味着你可以返回一个延迟的值，Nest 将能够自行解析它

```ts
@Get()
async findAll(): Promise<any[]> {
  return [];
}
```

_请求负载_

通过 `DTO`（数据传输对象）来定义了数据将如何通过网络发送的对象。推荐使用*类*来定义 DTO。（ES6 class 会保留实体，而 interface 在编译过程中，会被删除，nest 在运行时无法使用。在某些情景下，运行时会存现错误的可能，保留实体比较重要）。

```ts
export class CreateCatDto {
  name: string;
  age: number;
  breed: string;
}
```
