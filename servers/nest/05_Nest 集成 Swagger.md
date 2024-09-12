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
