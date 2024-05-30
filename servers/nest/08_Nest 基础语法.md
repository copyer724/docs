# Nest 基础语法

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
