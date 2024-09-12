# Nest 功能封装

## 成功响应拦截

`response.interceptor.ts`

```ts
/**
 * @file 成功统一响应请求
 */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, map } from "rxjs";

interface Data<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Data<T>> {
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          code: 0,
          message: "请求成功",
          success: true,
        };
      })
    );
  }
}
```

`main.ts`

```ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ResponseInterceptor } from "src/common/interceptors/response.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // 全局成功响应拦截
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(3000);
}
bootstrap();
```

## 失败响应拦截

`response.filter.ts``

```ts
/**
 * @file 统一相应异常处理
 */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { Response, Request } from "express";

@Catch()
export class ResponseFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    console.log(status, "status");

    response.status(status).json({
      success: false,
      time: new Date(),
      msg: exception.message,
      status,
      path: request.url,
    });
  }
}
```

`main.ts`

```ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ResponseFilter } from "src/common/filters/response.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // 全局失败响应拦截
  app.useGlobalFilters(new ResponseFilter());
  await app.listen(3000);
}
bootstrap();
```
