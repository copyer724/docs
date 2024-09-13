# 详解 Nest 中的 AOP

在前面的一节中，已经了解到了 AOP 的基本概念，有哪几种方式，几种方式使用的具体场景。

那么在这一节中，我们就来学习一下具体的语法吧。

## pipe

pipe 管道，在参数传递给 handler 之前，先对参数进行`验证`和`转化`。

抓住两个关键词：`验证`和`转化`。

在此之前，还是先了解一下 pipe 的底层实现，对于后面使用管道有着更加清晰的认知。

借用光神的一张图：

<img src="/images/servers/nest/pipe01.png" />

pipe 的执行时机，是在执行 handler 自执行之前(callback.apply)，就会执行 pipe，进行参数验证和转化。

并且会对每个参数做转化（有 pipe 执行 pipe 方法， 没有 pipe 直接返回 value）

### 自定义 pipe

生成 pipe 文件

```bash
nest g pipe validate --no-spec --flat
```

生成的内容是这样的：

```ts
import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ValidatePipe implements PipeTransform {
  /**
   * 对传入的参数值 value 做参数验证，比如格式、类型是否正确，不正确就抛出异常。
   * 也可以做转换，返回转换后的值
   * @param value 传入的参数值，实际值
   * @param metadata 参数元数据，{type: 'query' | 'params' | 'body' | 'custom', data: 形参值}
   * @returns 转换后的值，该值就会传递给 handler
   */
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}
```

要点就是实现 PipeTransform 类中的 `transform` 方法。

### 内置 pipe

在 Nest 中，都已经内置了各种 `pipe`（通俗的来说，就是各种类型的验证器和转化器）。

```ts
import {
  /** 数字验证 */
  ParseIntPipe
  /** 布尔验证 */
  ParseBoolPipe
  /** 数组验证 */
  ParseArrayPipe
  /** UUID 验证 */
  ParseUUIDPipe
  /** 默认值 */
  DefaultValuePipe
  /** 枚举 */
  ParseEnumPipe
  /** 浮点数  */
  ParseFloatPipe
  /** 文件验证  */
  ParseFilePipe
  /** DTO 验证 */
  ValidationPipe
 } from "@nestjs/common";
```

其实根据名字，还是很容易区分的，并且它们的用法也大致相似。

::: danger 简单总结

- 如果不想传递参数，直接使用即可；当然也可以使用 new 进行调用
- 如果需要传递参数，就使用 new 调用，然后传递参数
  :::

`ParseIntPipe` 简单使用：

```ts
// 写法一：简单实用
class A {
  @Get("test")
  /**
   * ParseIntPipe 用于对 num 的验证是否是数字
   * 能够转化为数字就转化为数字，"12" => 12
   * 不能转化为数字就抛出异常， "a" => 抛出异常
   */
  test(@Query("num", ParseIntPipe) num: string) {
    console.log(num);
  }
}
```

```ts
// 写法二：传递参数，这种写法就要 new 调用，然后传递参数
class A {
  @Get("test")
  /**
   * errorHttpStatusCode: 异常时自定义错误码
   * exceptionFactory: 自己抛出错误异常类型
   */
  test(
    @Query(
      "num",
      new ParseIntPipe({
        // 错误码
        errorHttpStatusCode: 400,
        // 自抛异常错误
        exceptionFactory(error) {
          return new HttpException(`${error}`, 500);
        },
      })
    )
    num: string
  ) {
    console.log(num);
  }
}
```

::: tip `ParseBoolPipe`、`ParseUUIDPipe`、`ParseFloatPipe` 用法与上一致
:::

`DefaultValuePipe` 用于设置默认值

```ts {4}
class A {
  @Get("test")
  test(
    @Query("num", new DefaultValuePipe("1")) // 默认值为 1
    num: string
  ) {
    console.log(num);
    return num;
  }
}
```

::: warning 小小尝试

我想尝试能否可以同时使用多个 pipe，结果是：可以。

但是针对 `ParseIntPipe(必填)` 和 `DefaultValuePipe(可选)` 是互斥的，但是不传递值，总会抛出异常。

```ts
class A {
  @Get("test")
  test(
    @Query(
      "num",
      new ParseIntPipe({
        errorHttpStatusCode: 400,
        exceptionFactory(error) {
          return new HttpException(`${error}`, 500);
        },
      }),
      new DefaultValuePipe("1")
    )
    num?: string
  ) {
    return num;
  }
}
```

:::
