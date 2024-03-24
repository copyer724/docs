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

**private readonly `catService`: CatsService** 中标注的能不能改？毫无疑问，肯定可以改，它只是我们取的一个变量名。

那么 nest 内部是如何知道是要使用 `CatsService` 这个类呢？

想要明白其中的缘由，那么就要看看提供者那里是如何的编写的，具体语法是什么。

**providers 完整**写法如下：

```ts
@Module({
  controllers: [CatsController],
  providers: [CatsService], // [!code warning]
})

// 等价于

@Module({
  providers: [{
    provide: CatsService, // token
    useClass: CatsService // 类
  }]
})
```

通过 provide 指定 token useClass 指定对象的类，Nest 会自动对它做实例化后用来注入。只要在 Controller 中构造器里参数里声明了 `CatsService` 的依赖(_这里可以简单的可以把类型看成为 key，在 IOC 容器中去进行匹配，找到就进行注入_)，就会自动注入。

上面是构造器注入，也可以采用另外一种形式：属性注入。

```ts{4-6}
import { Inject } from "@nestjs/common";
@Controller()
class CatsController {
  // 属性注入
  @Inject(CatsServices)
  private readonly catsService: CatsService;

  @Get()
  findAll() {
    return this.catsService.findAll();
  }
}
```

## 其他用法

### 字符串作为 token

```ts
// 注册
@Module({
  providers: [{
    provide: 'copyer', // key
    useClass: CatsService // 类
  }]
})
```

如果 token 是字符串的话，注入的时候就要用 @Inject 手动指定注入对象的 token 了

```ts
import { Inject } from "@nestjs/common";
export default class CatsController {
  constructor(@Inject("copyer") private readonly catService: CatsService) {}
}
```

### 直接注入值 useValue

:::code-group

```ts [cats.module.ts]
@Module({
  controllers: [CatsController],
  providers: [CatsService, { provide: "copyer", useValue: { age: 18 } }], //  [!code warning]
  exports: [CatsService],
})
export class CatsModule implements NestModule {}
```

```ts{7,12} [cats.controller.ts]
@Controller({
  path: "/cats",
})
export default class CatsController {
  constructor(
    private readonly cats: CatsService,
    @Inject("copyer") private readonly copyer: { age: number }
  ) {}

  @Get("/copyer")
  async find() {
    return this.copyer.age;
  }
}
```

:::

### 动态注入 useFactory

- useFactory 是一个函数，类似工厂函数
- 可以其他的提供值
- 可以是异步函数

```ts
@Module({
  controllers: [CatsController],
  providers: [
    CatsService,
    // 值
    {
      provide: 'copyer1',
      useFactory() {
        return {
          age: 20,
        };
      },
    },
    // 异步
    {
      provide: 'copyer2',
      async useFactory() {
        // Nest 会等拿到异步方法的结果之后再注入
        return new Promise(resolve => {
          setTimeout(() => resolve(12), 2000)
        })
      },
    },
    // 使用其他提供者
    {
      provide: 'copyer3',
      useFactory(copyer: { age: number }, catsService: CatsService) {
        return {
          age: copyer.age,
          find: catsService.findAll,
        };
      },
      inject: ['copyer', CatsService], // 这里需要注入其他的 Services,不然报错
    },
  ],
})
```

### 区别名 useExisting

```ts
@Module({
  providers: [{
    provide: 'copyer',
    useExisting: 'new_copyer'
  }]
})
```

### 验证测试

```ts
@Controller({
  path: "/cats",
})
export default class CatsController {
  constructor(
    private readonly cats: CatsService,
    @Inject("copyer1") private readonly copyer1: { age: number },
    @Inject("copyer2") private readonly copyer2: Promise<number>,
    @Inject("copyer3")
    private readonly copyer4: { age: number; find: () => number[] }
  ) {}

  @Get("/copyer1")
  async find() {
    return this.copyer1.age;
  }
  @Get("/copyer2")
  async find2() {
    const res = await this.copyer2;
    return res;
  }
  @Get("/copyer4")
  async find3() {
    return this.copyer4.find();
  }
}
```
