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

### 提供者（Services）

作用：抽离 controller 层的复杂逻辑。通过使用 `@Injectable()` 装饰器来定义。

由 `@Injectable()` 申明的类会被 nest IOC 容器进行管理。

::: tip 注意点
搞清楚什么时候使用 DTO，什么时候使用 interface。

DTO 简单的来说，就是对用户传递过来的数据进行验证，所以说，针对 @Body()，就会使用 DTO；而针对返回值，类的参数等，都是使用 interface。
:::

_基本使用_

:::code-group

```ts [catService.ts]
import { Injectable } from "@nestjs/common";

export interface Cats {
  name: string;
}

@Injectable()
class CatsService {
  private readonly cats: Cats[] = [];
  add(cat: Cats) {
    this.cats.push(cat);
  }
  findAll() {
    return this.cats;
  }
}

export default CatsService;
```

```ts [dto/cat.dto]
export class CatDto {
  name: string;
}
```

```ts [catController.ts]
import { Controller, Get, Post, Body } from "@nestjs/common";
import CatsService, { Cats } from "./cats.service";
import { CatDto } from "./dto/cat.dto";

@Controller("/cats")
export default class CatsController {
  constructor(private catService: CatsService) {}
  @Post("create")
  create(@Body() cat: CatDto) {
    return this.catService.add(cat);
  }

  @Get("find")
  async findAll(): Promise<Cats[]> {
    return this.catService.findAll();
  }
}
```

```ts [catModule.ts]
import { Module } from "@nestjs/common";
import CatsController from "./cats.controller";
import CatsService from "./cats.service";

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
```

:::

注意事项：

- 什么时候使用 interface，什么时候使用 dto
- dto 和 interface 如何定义
- 创建了 service 之后，需要在 module 中声明一下，不然使用会报错
- 在 controller 中使用 service, **注意初始化的特殊写法**：CatsService 是通过类构造函数注入的。请注意使用了 private 语法。这种简写允许我们在**同一位置立即声明和初始化 catsService 成员**。

### 模块（Module）

模块是带有`@Module()`装饰器的类。`@Module()`装饰器提供元数据，供 nest 组织程序结构。

**注意事项：**

- 每个应用程序必须有一个模块，即**根模块**。应用程序图的构建起点。
- `@Module()` 接受一个对象作为参数，其结构（provides, controllers, imports, exports）。前面两个， nest 内部会自动的进行实例化。imports 导入其他的模块，构建程序图

<hr />

_特性模块_：

就类似于一个业务模块，包含业务的 controller 和 services。

```ts
// cat.module.ts
@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
```

<hr />

_共享模块_：

nest 中，模块是单例的，因此可以在其他模块中共享 Services 实例（业务模块提供者）。

```ts
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsCervice], // 需要导出 Service，供其他模块使用
})
export class CatsModule {}
```

- 其他模块要使用`CatsService`, 就需要导出 `CatsService`（使用 `exports` 进行导出）。
- 其他模块导入整个模块`CatsModule`之后，就可以使用 `CatsService` 了，并且共享同一个实例对象（下面可以体现出来）。

<hr />

_其他模块使用 Service_：

::: code-group

```ts [dogs.module.ts]
import { Module } from "@nestjs/common";
import DogsController from "./dogs.controller";
import DogsService from "./dogs.service";
import { CatsModule } from "src/cats/cats.module";

@Module({
  controllers: [DogsController],
  providers: [DogsService],
  imports: [CatsModule], // 使用其他模块的 Service，需要注册 modules
})
export class DogsModule {}
```

```ts [dogs.controller.ts]
import { Controller, Get, Post, Body } from "@nestjs/common";
import CatsService, { Cats } from "src/cats/cats.service";
import { DogDto } from "./dto/dog.dto";

@Controller("/dogs")
export default class CatsController {
  constructor(private catsService: CatsService) {}
  @Post("create")
  create(@Body() cat: DogDto) {
    return this.catsService.add(cat);
  }

  @Get("find")
  async findAll(): Promise<Cats[]> {
    return this.catsService.findAll();
  }
}
```

:::

- 使用`其他 Service`, 需要导入`其他 module`
- 使用`其他 Service`, 是共享同一个实例对象
- controller 中使用多个 Service, 就只需要在类的构造函数多传递几个参数

```ts
@Controller("/dogs")
export default class CatsController {
  constructor(
    private catsService: CatsService,
    private dogsService: DogsService
  ) {}
}
```

::: warning 注意事项
这种写法不一定正确，还在学习中
:::

<hr />

_模块的重新导出_：

`DogsModule`模块导入 `CatsModule` 模块，又可以导出`CatsModule`模块。那么当其他模块导入 `DogsModule`时，同时可以使用 DogsModule 暴露出来的 Service，又可以使用 CatsModule 暴露出来的 Service。

```ts
//dogs.module.ts
@Module({
  imports: [CatsModule],
  exports: [CatsModule],
})
export class DogsModule {}
```

<hr />

_全局模块_

```ts
// cats.module.ts
@Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}
```

使用 `@Global` 来注册全局模块，那么在其他模块中，使用 `CatsService` 就不需要导入 `CatsModule` 了，直接使用即可。

> 针对核心业务模块，不建议所有模块都使用全局的

### 中间件（Middleware）

- Middleware 是在路由处理程序之前调用的函数。
- Nest 中间件默认情况下与 express 中间件等效。

<hr />

_编写中间件_

1. 类的形式：需要带有`@Injectable()`装饰器的类，并且实现 `NestMiddleware` 接口。
2. 函数形式：没有特别要求，跟 express 基本一致。

:::code-group

```ts [类形式中间件]
// 打印中间件
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  // use 方法
  use(req: Request, res: Response, next: NextFunction) {
    console.log("Request...");
    next(); // 也是必须调用 nest, 才能继续向下走
  }
}
```

```ts [函数形式中间件]
import { Request, Response, NextFunction } from "express";

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`Request...`);
  next();
}
```

:::

::: tip 使用建议
当中间件不需要任何依赖时，可以考虑使用更简单的**函数式中间件**替代方案
:::

<hr />

_应用中间件_

上面编写中间件之后，就要应用在项目中。但是在 `@Module` 中没有中间件的位置，需要使用模块类（实现 `NestModule` 的类）的`configure()`方法来使用它。

```ts
// cats.module.ts
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";

// 中间件
import { LoggerMiddleware } from "../middleware/logger";

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
// 需要实现 NestModule 类
export class CatsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 应用中间件给 ['cats'] 路径
    consumer.apply(LoggerMiddleware).forRoutes("cats");
    // 针对路径的某个方法 [cats / get]
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'cats', method: RequestMethod.GET });
  }
  }
}
```

- `MiddlewareConsumer`: 一个辅助类，它提供了几种内置方法来管理中间件。
- `apply()` 方法可以接受单个中间件，或者多个参数来指定多个中间件。
- `forRoutes()` 方法可以接受一个字符串、多个字符串、一个 RouteInfo 对象、一个控制器类，甚至是多个控制器类。

```ts
// 多个中间件（顺序执行）
apply(LoggerMiddleware, logger); // 类或者函数
```

::: info forRoutes 尝试
在大多数情况下，您可能只需要传递用**逗号**分隔的**控制器**列表。但是上面的几种情况，可能也会使用，有时间，可以尝试的使用多种情况。
:::

<hr />

_排除路由_

`exclude()` 该方法可以接受单个字符串、多个字符串或 RouteInfo 对象，用于标识要排除的路由。

```ts
consumer
  .apply(LoggerMiddleware)
  .exclude(
    { path: "cats", method: RequestMethod.GET },
    { path: "cats", method: RequestMethod.POST },
    "cats/(.*)"
  )
  .forRoutes(CatsController);
```

LoggerMiddleware 将绑定到 CatsController 中定义的所有路由，除了传递给 exclude() 方法的三个路由。

<hr />

_全局中间件_

```ts
const app = await NestFactory.create(AppModule);
app.use(logger);
```

### 异常过滤器

Nest 框架内置了一个异常处理层，负责处理应用程序中的所有未处理异常。

```json
// 404
{
  "message": "Cannot GET /cats/find1", // [!code error]
  "error": "Not Found",
  "statusCode": 404 // [!code error]
}

// error(默认)
{
  "statusCode": 500, // [!code error]
  "message": "Internal server error" // [!code error]
}
```

不难看出，`statusCode` 和 `message` 都是存在的。

- statusCode: http 状态码
- message: http 错误简单描述

<hr />

_标准异常_

Nest 提供了一个内置的 `HttpException` 类，可以从@nestjs/common 包中引入。最佳实践是在发生某些错误条件时发送标准的 HTTP 响应对象。
·
::: code-group

```ts{5} [抛出异常]
import { HttpException, HttpStatus } from "@nestjs/common";
class Controller {
  @Get("/error")
  async test() {
    return new HttpException("Forbidden", HttpStatus.FORBIDDEN);
  }
}
```

```json [现象]
{
  "response": "Forbidden",
  "status": 403,
  "message": "Forbidden",
  "name": "HttpException"
}
```

:::

::: tip

nest 中 HttpStatus 中的状态码: [nest http 状态码](./07_nest%20http状态码.md)
:::

`HttpException` 接受两个参数：

- 参数一：`response` JSON 响应体
  - 如果想修改 message 的提示语，只需要传递一个**字符串**
  - 如果想自定义返回格式，参数就传递一个**对象**，其格式就按照自定义的返回
- 参数二：`status` HTTP 状态码
- 参数三（可选）：options

```ts {3,4,5}
new HttpException(
  {
    // 自定义格式
    status: HttpStatus.FORBIDDEN,
    error: "This is a custom message",
  },
  HttpStatus.FORBIDDEN
);
```

其返回自定义格式：

```json
{
  "status": 403,
  "error": "This is a custom message"
}
```

<hr />

_自定义异常_

在大多数情况下，不需要自定义异常，因为 nest 内部已经内置了很多的异常类。但是如果真的需要自定义的时候，你可以这样写:

```ts
class CustomException extends HttpException {
  constructor() {
    super("Forbidden", HttpStatus.FORBIDDEN);
  }
}
```

必须继承于 HttpException，这样 Nest 将识别您的异常，并自动处理错误响应。

### 管道(`Parse*`)

`管道`是具有 `@Injectable()` 装饰器的类。管道应实现 `PipeTransform` 接口。

_管道的两个作用_：

1. 转化参数类型
2. 判断参数有效性（例如类型不正确，抛出异常）

_发生时机_：

在控制器（Controller）中的参数验证，然后进行验证和转化之后，之后就会拿去转化之后的参数进行程序后续逻辑。

_nest 默认内置的管道有_：

- ValidationPipe
- ParseIntPipe
- ParseFloatPipe
- ParseBoolPipe
- ParseArrayPipe
- ParseUUIDPipe
- ParseEnumPipe
- DefaultValuePipe
- ParseFilePipe

`ParseIntPipe` 类型演示：

::: code-group

```ts [代码]
import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";

@Controller("/dogs")
export default class CatsController {
  constructor(private dogsService: DogsService) {}

  @Get(":id")
  // 验证 id 是否为数字
  async findInfoById(@Param("id", ParseIntPipe) id: number) {
    console.log(id);
    return 123;
  }
}
```

```json [错误实例]
// dogs/abc
{
  "message": "Validation failed (numeric string is expected)",
  "error": "Bad Request",
  "statusCode": 400
}
```

```bash [成功实例]
# dogs/12
匹配成功，拿取到返回数据;
```

:::

_管道语法_：

- 可以传递类，让 nest 内部进行实例
- 也可以传递就地实例，传递选项来自定义内置管道的行为

```ts
class A {
  @Get(":id")
  async findInfoById(
    @Param(
      "id",
      // 自定义返回状态，传递的一个实例
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.METHOD_NOT_ALLOWED })
    )
    id: number
  ) {
    console.log(id);
    return 123;
  }
}
```

_自定义管道_：

- 管道也是通过 `@Injectable()` 来注解的类。
- 每个管道都必须实现 `transform()` 方法来履行 `PipeTransform` 接口契约。
- `PipeTransform<T, R>` 是一个通用接口，任何管道都必须实现。泛型接口用 T 表示输入 value 的类型，用 R 表示 transform() 方法的返回类型

::: code-group

```ts [自定义管道]
import { PipeTransform, ArgumentMetadata } from "@nestjs/common";
@Injectable()
class ValidationPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    console.log(value, metadata);
    /**
     * value: 1231
     * metadata: {type: 'param', data: 'id', metatype: XXX }
     */
    return +value;
  }
}
```

```ts{6} [Controller 使用]
@Controller("/dogs")
export default class CatsController {
  constructor(private dogsService: DogsService) {

  @Get(':id')
  async findInfoById(@Param('id', ValidationPipe) id: number) {
    console.log(id);
    return 123;
  }
  }
}
```

:::

测试： '/dogs/1231', 会出现以上的结构。

_joi 验证 dto_

::: code-group

```bash [安装]
pnpm install joi
```

```ts{7,11,14} [自定义 joi 验证管道]
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";
import { ObjectSchema } from "joi";

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value); // 校验
    if (error) {
      throw new BadRequestException("Validation failed");
    }
    return value;
  }
}
```

```ts{1-5} [定义 dto 和 schame]
const createCatSchema = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().required(),
  breed: Joi.string().required(),
});

export interface CreateCatDto {
  name: string;
  age: number;
  breed: string;
}
```

```ts{4} [校验 dto]
import { UsePipes } from '@nestjs/core';

@Post()
@UsePipes(new JoiValidationPipe(createCatSchema)) // 校验
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

:::

这样当 dto 中存在类型不匹配，就会抛出异常。

_class-validator 验证 dto_

这是比较常用的方法。

::: code-group

```bash [安装]
# 安装（两个库的作者是一个）
npm i --save class-validator class-transformer
```

```ts{4,7} [定义 dto]
import { IsString, IsInt } from "class-validator";

export class DogDto {
  @IsString()
  name: string;

  @IsInt()
  age: number;
}

// 注意装饰器是大写的 Is, 而不是小写的 is，犯错记录
```

```ts [自定义 pipe]
@Injectable()
class ValidationDtoPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata): Promise<any> {
    // metatype 需要了解清楚??? // [!code error]
    if (!metatype || !this.validate(metatype)) {
      return value;
    }
    const obj = plainToInstance(metatype, value);
    const errors = await validate(obj);
    if (errors.length > 0) {
      // 返回错误信息也需要优化  // [!code error]
      throw new BadRequestException("Validation failed");
    }
    return value;
  }

  /**
   * 当正在处理的参数是原生 JavaScript 类型时，它负责绕过验证步骤;
   * 因为它们不能附加验证装饰器
   * @param metatype: 验证数据源
   * @private
   */
  private validate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
```

```ts [使用]
@Post('page')
async getPages(@Body(new ValidationDtoPipe()) pageInfo: DogDto) {
  return pageInfo;
}
```

:::
当类型不满足时，就会抛出异常。

管道可以是`参数范围(parameter-scoped)`的、`方法范围(method-scoped)`的、`控制器范围的(controller-scoped)`或者`全局范围(global-scoped)`的。

_全局管道_

全局作用域的管道用于整个应用程序的每个路由器。使用 `useGlobalPipes`

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
```

_管道默认值_

- 接收到 null 或者 undefined 值时，它们会抛出异常。
- 在管道之前，把 DefaultValuePipe 实例化一下，就可以开启默认值了。

```ts{3,4}
@Get()
async findAll(
  @Query('activeOnly', new DefaultValuePipe(false), ParseBoolPipe) activeOnly: boolean,
  @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
) {
  return this.catsService.findAll({ activeOnly, page });
}
```

<hr />

### 守卫

守卫是一个使用 `@Injectable()` 装饰器的类。 守卫应该实现 `CanActivate` 接口。

守卫具有单一职责。它们根据运行时的某些条件（如权限、角色、ACL 等）确定是否将处理给定请求，这通常称为**授权**

> 在 express 中使用中间件来进行验证的，把授权信息带到全局的上下文

但是中间件存在缺点：中间件是无知的，它不知道在调用 `next()` 后会执行哪个处理程序。**守卫**可以访问 `ExecutionContext` 实例，因此确切地知道接下来将执行什么。

::: tip 提示
请注意，守卫在所有中间件之后执行，但在拦截器或管道之前执行。
:::

_授权守卫_

授权：特定路由应仅在调用者具有足够权限时可用。

```ts [auth.guard.ts]
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    /**
     * validateRequest 里面验证逻辑
     */
    return validateRequest(request);
  }
}
```

每个守卫必须实现一个 `canActivate()` 函数，此函数返回一个布尔值，指示当前请求是否被允许。它可以同步或异步（通过 Promise 或 Observable）返回响应。

- true: 允许
- false: 拒绝

守卫可以是`控制器范围`、`方法范围`或`全局范围`。

_守卫使用_

使用`@UseGuards()`装饰器设置了一个控制器范围的守卫。可以接受一个或者多个，使用逗号隔开。

```ts
import { UseGuards } from "@nestjs/common";

@Controller("cats")
@UseGuards(RolesGuard) // 传递的构造函数，实例化留给 nest，并启用依赖注入
@UseGuards(new RolesGuard()) // 传递实例
export class CatsController {}
```

::: code-group

```ts{4} [方法守卫]
@Controller("cats")
export class CatsController {
  @Get()
  @UseGuards(RolesGuard)
  find() {}
}
```

```ts{2} [全局守卫]
const app = await NestFactory.create(AppModule);
app.useGlobalGuards(new RolesGuard());
```

:::

_为路由设置特定角色_

哪些角色可以访问这些路由

方式一：采用自定义元数据

```ts{4}
import { SetMetadata } from '@nestjs/common'

@Post()
@SetMetadata('roles', ['admin']) // admin 角色能访问 key-value形式
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

方式二：自定义装饰器

自定义元素不是很优雅，可以采用装饰器来解决。

```ts
// roles.decorator.ts
import { SetMetadata } from "@nestjs/common";

export const Roles = (...roles: string[]) => SetMetadata("roles", roles);
```

```ts{2}
@Post()
@Roles('admin')
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}

```

定义好了角色限制，就来强化一下守卫，增强对角色的判断。

```ts
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>("roles", context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return matchRoles(roles, user.roles); // 是否匹配 // [!code error]
  }
}
```

`Reflector` 用于获取上下文。

### 拦截器

拦截器是使用 `@Injectable()` 装饰器注解的类。拦截器应该实现 `NestInterceptor` 接口。

可以实现：

- 在函数执行之前/之后绑定额外的逻辑
- 转换从函数返回的结果
- 转换从函数抛出的异常
- 扩展基本函数行为
- 根据所选条件完全重写函数 (例如, 缓存目的)

_基础知识_

- 每个拦截器都有 `intercept()` 方法，它接收 2 个参数。
- 第一个参数：`ExecutionContext`，执行上下文，继承至 ArgumentsHost。
- 第二个参数： `CallHandler`，CallHandler 实现了 `handle` 函数，在拦截器的某个地方使用它来调用路由处理程序方法

::: code-group

```ts [拦截器定义]
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class logIntercept implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    console.log("before", context);
    next.handle();
    console.log("after");
  }
}
```

```ts{1} [使用拦截器]
import { UseInterceptors } from '@nestjs/common'

@UseInterceptors(LoggingInterceptor)
export class CatsController {}
```

:::

在使用过程中，

- `@UseInterceptors` 还是传递的构造函数，把依赖注入留给 nest 内部进行处理。也可以传递实例。
- 上面的拦截器应用在`控制器`上, 也可以应用在`方法`上，以及`全局`。

```ts
const app = await NestFactory.create(AppModule);
app.useGlobalInterceptors(new LoggingInterceptor());
```

_基本案例_

```ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((value) => (value === null ? "" : value)));
  }
}
```

- `handle()`返回一个 `Observable`。这个流包含来自路由处理程序返回的值，因此我们可以使用 RxJS 的 map()操作符轻松地对其进行变换。
- 将每个 `null` 值转换为空字符串`''

### 自定义装饰器

- 在 Node.js 世界中，通常的做法是将属性附加到 request 对象上
- 与管道一起使用
- 组合装饰器
