# Providers 细说

providers 提供者，也就是说注册的 services。

在前面已经学习到：

::: code-group

```ts{3} [cats.module.ts]
@Module({
  controllers: [CatsController],
  providers: [CatsService], // 提供者  // [!code warning]
})
export class CatsModule {}
```

```ts{3,4} [cats.controller.ts]
@Controller("/cats")
export default class CatsController {
  // 提供之后，就可以使用
  constructor(private readonly catService: CatsService) {} // [!code warning]
  @Get()
  async findAll(): Promise<Cats[]> {
    return this.catService.findAll();
  }
}
```

:::

这是一种简单快速的写法，也是一种语法糖。那么针对其中的缘由，以及为什么这样写，就需要自己了解一波。

## 语法糖

**private readonly `catService`: CatsService** 中标注的能不能改？毫无疑问，肯定可以改，这只是我们取的一个变量名。

那么 nest 内部是如何知道是要使用 `CatsService` 这个类呢？_问题是不是发生 CatsServices 类型上呢？_

这个就是看提供者那里是如何的编写的，具体语法是什么。

```ts
@Module({
  controllers: [CatsController],
  providers: [CatsService], // [!code warning]
})

// 等价于

@Module({
  providers: [{
    provide: CatsService,
    useClass: CatsService
  }]
})
```
