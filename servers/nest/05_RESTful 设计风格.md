# RESTful 设计风格

是一个编写风格，遵循不遵循，随意。

## api 设计

以前风格：业务 api, 着重在于**路径**区分

```js
/api/page/aceert; // 新增 post
/api/page/update  // 更新 get
/api/page/delete  // 删除 get
```

resuful 风格：业务逻辑，着重在于**请求方式**区分

```js
/api/page; // 新增 post
/api/page  // 更新 put
/api/page  // 删除 delete
/api/page  // 列表 get
```

接口名称一样，只是请求方法不一样。

## 版本

正常接口：http://localhost/api/getUserInfo
v1 版本：http://localhost/api/v1/getUserInfo
v2 版本：http://localhost/api/v2/getUserInfo

使用场景：迭代，使用接口版本控制。

nestjs 也是支持控制 version 的。支持四种方式：

```ts
import { VersioningType } from "@nestjs/common";
export declare enum VersioningType {
  URI = 0, // 路由形式
  HEADER = 1, // 头部信息
  MEDIA_TYPE = 2, // ??
  CUSTOM = 3, // 自定义
}
```

```ts
// main.ts
import { NestFactory } from "@nestjs/core";
import { VersioningType } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 开启版本控制
  app.enableVersioning({
    type: VersioningType.URI,
  });
  await app.listen(3000);
}
bootstrap();
```

::: code-group

```ts{1-4} [整体业务版本]
@Controller({
  path: "/cats",
  version: "1",
})
export default class CatsController {
  constructor(private catService: CatsService) {}
  @Get()
  async findAll(): Promise<Cats[]> {
    return this.catService.findAll();
  }
}
```

```ts{5} [接口版本]
@Controller("/cats")
export default class CatsController {
  constructor(private catService: CatsService) {}
  @Get()
  @Version("1")
  async findAll(): Promise<Cats[]> {
    return this.catService.findAll();
  }
}
```

:::

## 状态码 code

- 200: OK
- 304: Not Modified 协商缓存
- 400: Bad Request 参数错误
- 401: unauthorized token 错误
- 403: Forbidden referer origin 验证失败
- 404: Not Found 接口不存在
- 500: Internal Server Error 服务端错误
- 502: Bad Gateway 网关问题或者服务器问题
