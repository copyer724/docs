# 理解 Nest 中的 AOP

AOP （Aspect Oriented Programming）： 面向切面编程。何为切面呢？

<img src="/images/servers/nest/aop01.png" />

在 Controller 的前后都分别加上一些通用的逻辑，比如日志、权限验证等。

::: tip AOP 的好处就是将通用的逻辑抽离到切面中，保存了业务逻辑的存粹性，页面逻辑复用，还可以动态增删。
:::

Nest 中使用 AOP 的方式有多种：

- Middleware
- Guard
- Pipe
- Interceptor
- ExceptionFilter

### middleware

在请求对象和响应对象上添加逻辑。

### guard

判断用户的请求是否能进入 Controller 层中，返回 true 就能够正常的进入；返回 false 就阻止了进入。在这个过程中，不能对请求和响应对象进行修改（其实更准确的来说是请求对象，因为它的作用只是能否进入 Controller 层，如果进入了 Controller 层，那么响应对象就跟它无关了）。

```bash
# 创建文件
nest g guard login --no-spec --flat
```

实现 CanActivate，拿取上下文，进行权限判断，返回 true | false

```ts
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class LoginGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log("login check");
    return false;
  }
}
```

支持局部注册和全局注册（全局注册有两种方式： 是否需要使用 IOC）

### interceptor

拦截器

在 Controller 方法前后加入一些逻辑，请求对象和响应对象都能修改。

与 middleware 的功能很相似，但是 interceptor 可以做更多的事情，因为它可以拿到`上下文(context)`和`当前调用的 handler(Controller 中的方法)`。那么在有些 Controller 或者 handler 上定义了元数据 matedata，就可以在拦截器中拿到这些元数据，而中间件 middleware 不行。

```bash
# 创建文件
nest g interceptor time --no-spec --flat
```

```ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class TimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    /**
     * next.handle() 当前执行的 handler
     * 就可以在调用之前和调用之后，插入一些逻辑
     */
    const startTime = Date.now();
    return next.handle().pipe(
      tap(() => {
        console.log("time: ", Date.now() - startTime);
      })
    );
  }
}
```

- context: 上下文
- next.handle(): 当前执行的 handler

也支持局部注册和全局注册（全局注册也有两种方式）

### pipe

就是对参数进行验证，然后进行转换。

```bash
# 生成文件
nest g pipe validate --no-spec --flat
```

```ts
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";

@Injectable()
export class ValidatePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (Number.isNaN(parseInt(value))) {
      throw new BadRequestException(`参数${metadata.data}错误`);
    }

    return typeof value === "number" ? value * 10 : parseInt(value) * 10;
  }
}
```

### ExceptionFilter

异常处理，无论是前面的中间件，拦截器，管道，守卫抛出异常，还是业务逻辑抛出的异常，都会被这个过滤器捕获。

```bash
# 生成文件
nest g filter test --no-spec --flat
```

```ts
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from "@nestjs/common";
import { Response } from "express";

@Catch(BadRequestException)
export class TestFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const response: Response = host.switchToHttp().getResponse();

    response.status(400).json({
      statusCode: 400,
      message: "test: " + exception.message,
    });
  }
}
```

### 执行顺序

<img src="/images/servers/nest/aop02.png" />

但是又因为以上的几种，都支持局部注册和全局注册（全局注册又分为两种，是否进入 IOC）

那么它们的执行顺序更加的深入，可以观看下文：

https://nestjs.inode.club/faq/request-lifecycle
