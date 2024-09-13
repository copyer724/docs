# Nest 集成 Swagger

## 安装

```bash
pnpm add @nestjs/swagger -D
```

## 基本使用

在 `main.ts` 中集成 swagger，就可以使用 `http:localhost:3000/doc` 查看接口文档。

```ts
/** 集成 swagger */
const config = new DocumentBuilder()
  .setTitle("标题")
  .setDescription("对文档的描述")
  .setVersion("版本号")
  .addTag("标签")
  .build();
const document = SwaggerModule.createDocument(app, config);
// 将文档挂载在 /doc 路径下
SwaggerModule.setup("doc", app, document);
```

在 `@nestjs/swagger` 提供了多种装饰器，用于描述接口的元数据。

使用的场景就是在 `Controller` 中或者 `DTO` 中添加装饰器。

```ts
// 对接口进行分组，一般在 @Controller() 定义那里使用
@ApiTags("接口分组")
@Controller('/test')
exprot class A {

  // 定义接口描述元数据
  @ApiOperation({
    summary: "接口名称、总结",
    description: "接口描述",
  })

  // 定义接口返回的元数据（可以写多个，一个成功，一个失败等等）
  @ApiResponse({
    status: "状态码",
    description: "返回值描述",
    type: "返回值类型",
  })

  // 定义参数元数据（query, body, param），
  // 三个装饰器的用法一致，只不过 @ApiBody() 中的 type 是 DTO 类型
  @ApiParam({
    name: "参数名称",
    type: "参数类型",
    description: "参数描述",
    required: "是否必传",
    example: "样例",
  })
  @ApiQuery({})
  @ApiBody({})
}
```

```ts
// ApiProperty() 用于 DTO 类中, ApiPropertyOptional() 用于可选参数
export class CreateCatDto {
  @ApiProperty({ name: "name", enum: ["a", "b"] })
  name: string;

  @ApiPropertyOptional({
    name: "age",
    maximum: 60,
    minimum: 40,
    default: 50,
    example: 55,
  })
  age?: number;
}
```

## 合并装饰器

为什么需要合并装饰器呢？一个接口的 swagger 始终有这几部分组成：`接口描述元数据`，`接口返回值元数据`，`接口参数元数据（可选）`。

那么是不是可以进行组合封装一下呢？但是针对`接口参数元数据`，我们无法做到合并，因为参数元数据是动态的，无法确定。

那么就针对接口描述元数据，和返回值元数据进行合并。

在 nestJs 中提供了一个函数`applyDecorators`，用于合并装饰器

```ts
import { ApiOperation, ApiResponse, ApiProperty } from "@nestjs/swagger";
import { applyDecorators, HttpStatus } from "@nestjs/common";

interface SwaggerResponseOptions {
  /** 名称 */
  summary: string;
  /** 返回数据类型 */
  resultType: any;
  /** 描述  */
  description?: string;
  /** 成功状态码 */
  successStatus?: HttpStatus;
  /** 成功描述 */
  successDesc?: string;
  /** 错误状态码 */
  errorStatus?: HttpStatus;
  /** 错误描述 */
  errorDesc?: string;
}
export const SwaggerResponse = (options: SwaggerResponseOptions) => {
  const {
    summary,
    resultType,
    description,
    successStatus = HttpStatus.OK,
    successDesc = "请求成功",
    errorStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    errorDesc = "请求失败",
  } = options;
  return applyDecorators(
    // 接口描述
    ApiOperation({
      summary: summary,
      description: description ?? `${summary}`,
    }),
    // 成功响应
    ApiResponse({
      status: successStatus,
      description: successDesc,
      type: resultType,
    }),
    // 失败响应
    ApiResponse({
      status: errorStatus,
      description: errorDesc,
    })
  );
};
```

这样在每个接口处，只需要支持使用 `SwaggerResponse` 注解，就可以自动生成对应的接口文档。

## 身份认证

三种方式：

- jwt：@ApiBearerAuth('bearer')
- cookie：@ApiCookieAuth('cookie')
- 登录密码：@ApiBasicAuth('basic')

在 `main.ts` 中新增配置：

```ts{6-20}
const config = new DocumentBuilder()
  .setTitle("Test example")
  .setDescription("The API description")
  .setVersion("1.0")
  .addTag("test")
  .addBasicAuth({
    type: "http",
    name: "basic",
    description: "用户名 + 密码",
  })
  .addCookieAuth("sid", {
    type: "apiKey",
    name: "cookie",
    description: "基于 cookie 的认证",
  })
  .addBearerAuth({
    type: "http",
    description: "基于 jwt 的认证",
    name: "bearer",
  })
  .build();
```

## 文件上传

https://juejin.cn/post/7234058578801311781
