# Nestjs

### 基础语法及知识

- [Nest 基础语法](./01_Nest%20基础语法.md)
- [nest 中文文档阅读笔记](./02_nest%20中文文档阅读笔记.md)
- [RESTful 设计风格](./05_RESTful%20设计风格.md)
- [nest http 状态码](./02_nest%20http状态码.md)
- [接口设计规范](./03_接口设计规范.md)

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
