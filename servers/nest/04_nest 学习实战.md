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
