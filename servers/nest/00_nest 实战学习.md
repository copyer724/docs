# nest 学习实战笔记

### ExecutionContext 切换上下文

不同类型的服务它能拿到的参数是不同的，比如 http 服务可以拿到 request、response 对象，而 ws 服务就没有，如何让 Guard、Interceptor、Exception Filter **跨多种上下文复用**呢

**Nest 的解决方法是 `ArgumentHost` 和 `ExecutionContext` 类**

```ts
@Catch()
export class AaaFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    // exception 异常信息
    // host 上下文对象 ArgumentsHost
  }
}
```

`ArgumentHost` 是用于切换 http、ws、rpc 等上下文类型的

```ts
if (host.getType() === "http") {
  const ctx = host.switchToHttp(); // 获取 node 上下文 request response next 信息
}
if (host.getType() === "ws") {
  const ctx = host.switchToWs();
}
if (host.getType() === "rpc") {
  const ctx = host.switchToRpc();
}
```

**ExecutionContext 是 ArgumentHost 的子类，只是扩展了 getClass、getHandler 方法**。

- `getClass()` 获取当前类(也就是 Controller, 或者 service)
- `getHandler()` 获取当前方法(也就是 Controller 的方法)，一般用于获取元数据

### MetaData 和 Reflector

nest 实现的核心就是 Reflect metadata 的 api。

metaData 是 Reflect 的 api，还在草案阶段, 需要使用 `reflect-metadata` 这个 polyfill 包才行。

`Reflect.defineMetadata` 和 `Reflect.getMetadata` 分别用于设置和获取某个类的元数据

```ts
// 给对象设置元数据
Reflect.defineMetadata(metadataKey, metadataValue, target);
// 给对象属性设置元数据
Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
// 获取对象的元数据
let result = Reflect.getMetadata(metadataKey, target);
// 获取对象属性的元数据
let result = Reflect.getMetadata(metadataKey, target, propertyKey);
```

Nest 中无论是 `@Module()` 还是 `@Controller()`等装饰器接受的参数都是通过定义元数据绑定的，在初始化时取出元数据，进行依赖分析依赖分析时，这是 IOC 容器实现的根本。

```ts
@Module({
  imports: [],
  providers: [],
})
// imports | providers 都会被定义为 metadataKey，在类上或者属性上设置为元数据
```

针对**构造函数注入（也就是 Controller 类中注册 Service）**，是如何添加 metaDate 的呢?

TypeScript 支持编译时自动添加一些 metadata 数据，且有一个编译选项叫做 `emitDecoratorMetadata`，开启它就会自动添加一些元数据。类似：

```ts
Reflect.metadata("design:type", type);
Reflect.metadata("design:paramtypes", types);
Reflect.metadata("design:returntype", type);
```

那么在创建对象的时候就可以通过 design:paramtypes 来拿到构造器参数的类型了，就能知道依赖注入了。

::: error nest 的核心实现原理
通过装饰器给 class 或者对象添加 metadata，并且开启 ts 的 emitDecoratorMetadata 来自动添加类型相关的 metadata，然后运行的时候通过这些元数据来实现依赖的扫描，对象的创建等等功能
:::

Nest 也提供了 `@SetMetadata` 装饰器，给类和方法添加元数据，该装饰器的底层也是`Reflect.metadata`来实现的。在守卫或者拦截器中使用 `Reflector` 来获取元数据。

```ts
// app.controller.ts
@Controller("/app")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseInterceptors(TestInterceptor) // [!code warning] // 使用中间件
  @SetMetadata("name", "copyer") // [!code warning] // 定义元数据
  getHello() {
    return "hello world";
  }
}
```

```ts
// test.interceptor.ts

import { Reflector } from "@nestjs/core"; // [!code warning]

@Injectable()
export class TestInterceptor implements NestInterceptor {
  @Inject(Reflector) // [!code warning]
  private readonly reflector: Reflector; // [!code warning]
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 获取元数据
    console.log(this.reflector.get("name", context.getHandler())); // [!code warning]
    return next.handle();
  }
}
```

this.reflector 存在四个方法：

- get 的实现就是 Reflect.getMetadata
- getAll 是返回一个 metadata 的数组
- getAllAndMerge，会把它们合并为一个对象或者数组
- getAllAndOverride 会返回第一个非空的 metadata

### 装饰器

定义装饰器

```ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AaaInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 调用 Controller 的方法
    return next.handle(); // [!code warning]
  }
}
```

路由局部注册

```ts
@Controller("/app")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseInterceptors(TestInterceptor) // [!code warning] 局部注册
  getHello() {
    return "hello world";
  }
}
```

全局注册

```ts
// 方式一
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new TestInterceptor()); // [!code warning] 全局注册
  await app.listen(3000);
}
bootstrap();
```

```ts
// 方式二
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TestInterceptor,
    },
  ],
})
```

路由级别的可以注入依赖，而全局的不行。

### Pipe

Pipe 是在参数传给 handler 之前对参数做一些验证和转换的 class

Nest 中内置了

- ValidationPipe
- ParseIntPipe
- ParseBoolPipe
- ParseArrayPipe
- ParseUUIDPipe
- DefaultValuePipe
- ParseEnumPipe
- ParseFloatPipe
- ParseFilePipe

测试

```ts
@Get('test')
test(@Query('name', ParseIntPipe) name: number) {
  // 默认是 string 类型
  console.log(typeof name);
  return 'test' + name;
}
```

- 默认类型是 string
- 检查 name 是否是 number 类型，不是就抛出异常
- 默认的错误提示和状态码

```ts
{
    "message": "Validation failed (numeric string is expected)",
    "error": "Bad Request",
    "statusCode": 400
}
```

- 可以修改状态码

```ts
// 修改状态码
@Get('test')
test(
  @Query(
    'name',
    new ParseIntPipe({ // [!code warning]
      errorHttpStatusCode: HttpStatus.UNAUTHORIZED, // [!code warning]
    }), // [!code warning]
  )
  name: number,
) {
  return 'test' + name;
}
```

- 修改错误提示，直接抛出异常

```ts
@Get('test')
test(
  @Query(
    'name',
    new ParseIntPipe({ // [!code warning]
      exceptionFactory: (error) => { // [!code warning]
        throw new HttpException('xxxx' + error, HttpStatus.UNAUTHORIZED); // [!code warning]
      }, // [!code warning]
    }),
  )
  name: number,
) {
  return 'test' + name;
}
```

- 自定义 pipe

```bash
nest g pipe test --flat --no-spec
```

```ts
import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class TestPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    /**
     * value 就是获取到的属性值
     * metadata 是元数据，包含 type、metatype、data
     *  - type 就是 @Query、@Param、@Body 装饰器，或者自定义装饰器（'query' | 'body' | 'param' | 'custom'）
     *  - metatype 是参数的 ts 类型
     *  - data 属性名
     */
    return value;
  }
}
```

### POST 验证

内置的 pipe 只能验证 GET 请求，针对 POST 请求（就是验证 DTO: 数据传输对象），需要借助第三方工具。

```ts
npm install class-validator class-transformer -D
```

- class-transformer: 把普通对象转化为 DTO 类的实例对象

```ts
// 原理：转化为 DTO 实例对象, plainToClass 被遗弃了
const user = plainToInstance(User, userObj);
```

- class-validator: 对实例对象进行验证

```ts
// 原理：验证
validate(user).then();
```

::: tip 我们声明了参数的类型为 dto 类，pipe 里拿到这个类，把参数对象通过 class-transformer 转换为 dto 类的对象，之后再用 class-validator 包来对这个对象做验证。
:::

具体使用

```ts
// 当然这里面提供的类型，可能要去深究一下，再使用的时候
import { IsInt, IsString, IsDateString, Min, Max } from "class-validator";

export class CreateAaaDto {
  @IsInt()
  @Min(10)
  @Max(20)
  age: number;

  @IsString()
  name: string;

  @IsDateString()
  time: Date;
}
```

```ts
@Post()
// 是对整个 body 的验证
create(@Body(new ValidationPipe()) createAaaDto: CreateAaaDto) {
  return this.aaaService.create(createAaaDto);
}

// 是对整个 body.info 的验证
create(@Body('info', new ValidationPipe()) createAaaDto: CreateAaaDto) {
  return this.aaaService.create(createAaaDto);
}
```

使用 ValidationPipe，消息提示的格式都是默认的，也支持自定义消息提示，例如：

```ts
export class CreateAaaDto {
  @IsInt({
    message: (info) => {
      // info 里面可以拿到有用的数据，错误提示可以跟着这个组装
      return "xxx";
    },
  })
}
```

也可以自定义 pipe

```ts
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

@Injectable()
export class TestPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    console.log(metadata);
    if (!metadata.metatype) {
      return value;
    }
    const obj = plainToInstance(metadata.metatype, value); // [!code warning]
    const errors = await validate(obj); // [!code warning]
    console.log(errors);
    if (errors) {
      throw new BadRequestException("参数验证失败");
    }
    return value;
  }
}
```

局部注册

```ts
@Post()
// 不需要 new 了
create(@Body(TestPipe) createAaaDto: CreateAaaDto) {
  return this.aaaService.create(createAaaDto);
}
```

全局注册（不支持依赖注入版）

```ts
app.useGlobalPipes(new TestPipe());
```

全局注册(支持依赖注入版)

```ts
@Module({
  providers: [
    {
      provide: APP_PIPE, // 使用 Nest 提供的 APP_PIPE，就全局生效，Nest 内部已经使用了，如果自定写成字符串，还需要自己去手动调用
      useClass: TestPipe,
    },
  ],
})
```

全局注册，在路由那里就不需要任何的处理，会自动进行验证。

当然，我们大多数情况下还是使用 ValidationPipe ，功能已经比较完善了

### 异常处理

Nest 会把所有 token 为 `APP_FILTER`的 provider 注册为全局 Exception Filter。

pipe interceptor guard 都是一样的。

```ts
// @nestjs/core 里面导出
export declare const APP_INTERCEPTOR = "APP_INTERCEPTOR";
export declare const APP_PIPE = "APP_PIPE";
export declare const APP_GUARD = "APP_GUARD";
export declare const APP_FILTER = "APP_FILTER";
```

nest 内部默认的异常处理

```ts
throw new HttpException("错误信息", HttpStatus.UNAUTHORIZED);
```

```json
{
  "message": "错误信息",
  "statusCode": 401
}
```

但是一般都是走的自定义异常处理

```bash
nest g filter test --flat --no-spec
```

--flat: 不生成 test 目录，是生成 test 文件
--no-spec: 不生成 test.spec.ts 文件

```ts
import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";

@Catch()
export class TestFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {}
}
```

- `@Catch()` 捕获错误的类， 一般指定 HttpException 类，因为 BadRequestExeption、BadGateWayException 等都是它的子类。

```ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { Response } from "express";

@Catch(HttpException)
export class TestFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // 切换 http 服务，并获取响应对象
    const http = host.switchToHttp();
    const res = http.getResponse<Response>();
    const code = exception.getStatus();
    // 兼容 dto 验证的错误数组
    const errorInfo = exception.getResponse() as { message: any[] };
    res.status(code).json({
      code,
      message: Array.isArray(errorInfo.message)
        ? errorInfo.message.join(",")
        : exception.message,
      success: false,
      error: "Bad Request",
    });
  }
}
```

使用

```ts
// 全局
app.useGlobalFilters(new TestFilter());
// 或者
@Module({
  providers: [{
    provide: APP_FILTER,
    useClass: TestFilter,
  }]
})

// 局部（Controller | handler）
@UseFilters(TestFilter)
```

### 接口指定版本号

在 NestJS 中，我们可以通过 `@Version` 装饰器来指定接口的版本号。针对 Controller 或者其中的方法。

注意方法编写顺序。

使用方法：请求头或者路径上。
