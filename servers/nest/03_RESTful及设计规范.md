# restful 设计风格

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

## 接口的设计规范

1.**签名**

目的：防止数据被篡改

- 接口请求方法将请求方式，时间戳和密钥拼接成一个字符串
- 使用 MD5 等 hash 算法生成签名（sign）
- 在请求参数或请求头中增加 sign 参数传给 API 接口
- API 接口王国服务验证传递的 sign 值，与自己生成的 sign 值对比，如果一样，则认为请求有效

时间戳的作用：防止同一次请求被反复利用，增加密钥被破解的可能性。每次请求设置合理的过期时间（如 15 分钟）

2. **加密**

目的：保护重要数据（密码，银行卡等）

方法：

- 使用 AES 算法对数据进行加密
- 在前端使用公钥加密用户密码
- 在注册接口中使用密钥解密用户密码并做相关验证

3. **IP 白名单**

目的：防止被恶意请求

方法：

- 限制请求 IP
- 添加 IP 白名单在 API 网关服务上。
- 防止内部服务器被攻破，需增加 web 防火墙。

4. **限流**

目的：防止 API 接口被频繁调用导致服务器压力过大，不可用

方法：

- 对请求 IP，请求接口，请求用户做限流。
- 使用 Nginx, Redis 或 Gateway 做限流。

5. **参数校验**

目的：拦截无效请求，保护系统资源

方法：

- 校验字段是否为空，字段类型，字段长度，枚举值

6. **同一返回值**

目的：避免返回值结构不统一，便于接口维护

方法：

- 所有异常通过 API 网关捕获并转化成统一的异常结构返回。

7. **同一封装异常**

目的：防止敏感信息

```ts
{
  code: 500,
  message: '服务器内部异常',
  data: null
}
```

8. **请求日志**

目的：便于快速分析和定位问题

9. **数据脱敏**

10. **接口文档**

11. **请求方式**

12. **请求头**

13. **职责单一**

目的：降低接口维护成本
