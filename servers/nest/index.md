# Nestjs

### 基础语法及知识

- [Nest 实战学习](./00_nest%20实战学习.md)
- [Nest 基础语法](./01_Nest%20基础语法.md)
- [Nest 内置模块](./02_nest%20内置模块.md)
- [restful 及设计规范](./03_RESTful及设计规范.md)
- [Nest 功能封装](./04_Nest%20功能封装.md)
- [Nest 集成 Swagger](./05_Nest%20集成%20Swagger.md)
- [文件上传](./07_文件上传.md)
- [dto 验证](./08_dto%20的验证.md)
- [理解 Nest 中的 AOP](./09_理解Nest中的AOP.md)
- [详解 Nest 中的 AOP](./10_详解Nest中的AOP.md)

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
