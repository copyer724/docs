---
layout: home
---

<script setup>
import {ref} from 'vue'
import home from '../.vitepress/components/mind.vue'
const data = ref(`
# Nest

## 快捷指令

- nest new xxx
- nest g xxx
- nest -h 查看指令

## 基本知识

### 装饰器
- 装饰器原理
- 内置装饰器
- 自定义装饰器: createParamDecorator
- 合并装饰器：applyDecorators

### 模块
- 基本语法
- 全局，静态，动态
- 导入导出（重导）
- 循环依赖：forwardRef

### 控制器
- 基本语法
- 数据传递方式：5 种
- 请求方式，路径匹配，重定向等

### 提供者（服务）
- 基本语法
- 实现思想：DI
- 注入方式：构造函数和属性注入，可选注入
- 注册方式：useClass、useValue、useFactory、useExisting
- 循环引用

### 生命周期
- 基本使用：类实现
- 生命周期钩子：onModuleInit、onApplicationBootstrap、onModuleDestroy、onApplicationShutdown
- 执行顺序：controller > service > module
- 使用场景

### 中间件

### 守卫

### 拦截器

### 异常处理

### 管道

## 场景应用

### 文件上传

- 文件上传的基本原理
- multer
- Nest 中的使用：单文件上传，多文件上传，校验等

### 配置文件

1. .env
2. js-yaml
3. @nestjs/config

### redis
  - GUI
  - npm: redis
  - npm: ioredis
  - nest 中使用

### 连接数据库 prisma
  - prisma
  - @prisma/client

### dto 验证
  - class-validator
  - class-transformer

`)
</script>

<home :data="data" />
