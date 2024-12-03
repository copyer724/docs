# NestJS

### 学习难点

Nest 是对标 Java 的 Spring 框架的后端框架，它有很多概念。

有非常的多的概率，非常的多的知识需要了解，这就造成了学习的困难。

如果想要真正的学习好，并且能够自己独立的实战开发，就需要先掌握好其中的概念和使用方式，才有后续操作。

我并不认同网上人说的，先把知识过一遍，就进行开发，遇到问题的时候再来学习。因为我感觉这种就会临时磨枪，当时会一下，后续就忘记了，又要重新学习。

把基础知识打牢，形成知识体系网，后续开发才能真正的是一个合格的后端开发者。

### 项目路径结构

```ts
├─config                         // 配置目录
├─public                         // 静态资源目录
│ └─uploads                      // 图片上传目录
├─dist                           // 编译打包目录
├─src                            // 源代码目录
│  ├─common                      // 自定义公共目录
│  │  ├─pipe                     // 管道
│  │  │  ├─custom.pipe.ts
│  │  ├─guard                    // 守卫
│  │  │  ├─custom.guard.ts
│  │  ├─middleware               // 中间件
│  │  │  ├─custom.middleware.ts
│  │  ├─filter                   // 过滤器
│  │  │  ├─custom.filter.ts
│  │  ├─interceptor              // 拦截器
│  │  │  ├─custom.interceptor.ts
│  │  └─decorator                // 装饰器
│  │     └─custom.decorator.ts
│  ├─constant                    // 定义常量目录
│  ├─utils                       // 工具函数目录
│  ├─modules                     // 业务模块目录
│  │  ├─user                     // 用户模块
│  │  │  ├─dto
│  │  │  │  ├─create.dot.ts
│  │  │  ├─entity
│  │  │  │  ├─create.entity.ts
│  │  │  ├─user.module.ts
│  │  │  ├─user.service.ts
│  │  │  └─user.controller.ts
│  │  ├─auth                     // 授权模块
│  │  └─xxx                      // 其他模块
│  ├─redis                       // redix 缓存目录
│  │  ├─redis-cache.module.ts
│  │  └─redis-cache.service.ts
│  ├─app.service.ts
│  ├─app.controller.ts
│  ├─app.module.ts
│  └─main.ts
├─test                          // 测试目录
│  ├─filter
│  └─helper
├─views                         // 模板目录
│  ├─admin
│  └─default
├─ .env
├─ .env.prod
└─ tsconfig.json
```

### 执行流程

> 感觉这个通俗易通

nest 应用跑起来后，会从 AppModule 开始解析，初始化 IoC 容器，加载所有的 service 到容器里，然后解析 controller 里的路由，接下来就可以接收请求了。

AppModule 到了各个模块，而每个模块的 providers 里面有提供了各种服务，把所有服务添加到 IOC 容器中，就可以在 Controller 中进行注入，使用了。
