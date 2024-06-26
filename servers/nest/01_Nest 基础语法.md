# Nest 基础语法

::: danger 个人掘金发布
:::

#### [Nest 安装，指令，及入口文件分析](https://juejin.cn/post/7363836438935011363)

- nest 的安装
- nest 指令使用
- app 实例对象（注册全局事件，暴露静态资源，处理跨域）

#### [Nest 装饰器](https://juejin.cn/post/7364051847177289728)

- 装饰器的基本语法及含义
- 四种装饰器：类装饰器，方法装饰器，属性装饰器，参数装饰器
- nest 中内置的装饰器（很多）
- applyDecorators 合并多个装饰器
- createParamDecorator 自定义装饰器
- 模拟 GET 装饰器内部逻辑

#### [Nest 模块](https://juejin.cn/post/7364785558802350090)

- 模块的基本定义，理解 `@Module()` 里面接受的参数。
- 模块的导入导出
- `@Global()` 定义全局模块
- 静态模块和动态模块
- 如何创建动态模块

#### [Nest 控制器](https://juejin.cn/post/7370170468781277199)

- 控制器的基本定义
- 路由的匹配顺序
- 路由常见的请求方式
- 五种数据传输格式，nest 通过 @Body() @Query() @Param() @Headers() 获取数据
- file 对象的特殊处理
- 请求方式通匹配，路径通匹配，设置头部信息，重定向，函数的异步性，以及请求负载（DTO）

#### [Nest 提供者与服务](https://juejin.cn/post/7374677514537254939)

- 服务的基本使用，使用 `@Injectable()` 来定义一个服务，在模块 `@Module()` 的 providers 属性中注册。
- 注入方式有两种：构造函数注入和属性注入`@Inject()`。
- providers 的注册有多种方式，最常用的就是直接注册一个类，这是一种简写，其实本质上是使用的 useClass 的方法。还能使用 useValue 注册静态数据，useFactory 注册动态数据。
- `useFactory` 功能比较强大，不仅能使用异步的形式，也能在其内部注册其他的服务。
- 使用 `@Optional()` 来定义可选服务
- 跟模块一样，可以使用 `forwardRef` 来解决循环依赖服务。

#### [Nest 生命周期](https://juejin.cn/post/7379826188749586473)

- 生命周期就是在解析过程中，在某一刻执行的回调钩子函数。
- 生命周期的实现是通过接口实现（implements）的，在 nestjs 内部提供了五种生命周期接口。
- 初始阶段（onModuleInit，onApplicationBootstrap），挂载（onModuleDestroy， beforeApplicationShutdown， onApplicationShutdown）
- 生命周期中做着不同是事情，需要自己去收集总结。
- 在挂载阶段中，拿取 provide 实例是通过 moduleRef 来进行拿取的
- 每个生命周期钩子都是支持异步的 async。

### [Nest 中间件](https://juejin.cn/post/7380357384775942194)

- 知道 koa，express，nest 的中间件的本质是什么：中间件就是函数。
- nest 的中间件使用场景大部分就是鉴权和统一逻辑处理（比如说日志，修改请求响应对象等）
- nest 中定义中间件可以是类也可以是函数，如果不涉及到依赖注册，函数可能更加简洁，反之，就需要使用类的形式
- nest 在注入中间件时，可以针对所有路由，也可以精确指定某个路由，某种方法，甚至某种控制器；也支持排除一些路由
- 类形式的依赖注入也是支持属性注入和构造函数注入的

### Nest 过滤器

### Nest 守卫

### Nest 异常处理

### Nest 管道

### Nest RxJS

## 学习方向错了

在学习 Nest 的过程中，我发现自己为了写博客，而强行的学习各种知识点，然后凑集在一起而写博文，但是呢，其实我发现这种学习，学的快也忘记的快，都是根本没有学习牢固。

我写博客的思路，是从**是什么，何时用，怎么用**三个维度来进行写的，但是呢，我心中其实还有一个维度，就是**为什么**，其实这也是加分项，说明你对原理都进行了深入理解。但是现在为了写博客而学技术，都忽略了这一点，这是很糟糕的。

所以说，我发现我自己的学习方向错了。写博客的正常方向，还是需要坚持四个维度：**是什么，何时用，怎么用，为什么**来进行编写，当要知道为什么时，那么就需要你对知识点的累积和深入理解，这样你对知识点的个人理解在来进行写博客，才能是好的文章。

学习方向错了，我要改成。针对安排好的博文，后续理解深入了，再来补上。
