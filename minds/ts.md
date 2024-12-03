---
layout: home
---

<script setup>
import {ref} from 'vue'
import home from '../.vitepress/components/mind.vue'
const data = ref(`
# TypeScript

## TypeScript 是什么

- TypeScript 与 JavaScript 的区别
- 获取 TypeScript
- 典型 TypeScript 工作流程
- TypeScript 的初体验

## TypeScript 基础类型

- Boolean 类型
- Number 类型
- String 类型
- Symbol 类型
- Array 类型
- Enum 类型
- Any 类型
- unknown 类型
- Tuple 类型
- Void 类型
- Null 和 Undefined 类型
- Object、object 和 {} 类型
- Never 类型

## TypeScript 断言

- 类型断言
- 非空断言
- 确定赋值断言

## TypeScript 类型守卫

- in 关键字
- typeof 关键字
- instanceof 关键字
- 自定义类型保护的类型谓词

## 联合类型和类型别名

- 联合类型
- 可辨识联合
- 类型别名


## TypeScript 交叉类型

- 同名基础类型属性的合并
- 同名非基础类型属性的合并

## TypeScript 函数

- TypeScript 和 JavaScript 的函数的区别
- 箭头函数
- 参数类型和返回类型
- 函数类型
- 可选参数及默认值
- 剩余参数
- 函数重载

## TypeScript 数组

- 数组解构
- 数组展开运算符
- 数组遍历

## TypeScript 对象

- 对象解构
- 对象展开运算符

## TypeScript 接口

- 对象的形状
- 可选 | 只读属性
- 任意属性
- 接口和类型别名的区别

## TypeScript 类

- 类的属性和方法
- ECMAScript 私有字段
- 访问器
- 类的继承
- 抽象类
- 类方法重载

## TypeScript 泛型

- 泛型接口
- 泛型类
- 泛型变量
- 泛型工具类型

## TypeScript 装饰器

- 什么是装饰器
- 装饰器分类
- 类装饰器
- 方法装饰器
- 参数装饰器
- 属性装饰器

## 编译上下文

- tsconfig.json 的作用
- tsconfig.json 的重要字段
- compilerOptions 选项

## TypeScript 开发辅助工具

- TypeScript PlayGround
- JSON TO TS
- schemats
- TypeScript AST Viewer
- TypeDoc
- TypeScript ESLint

`)
</script>

<home :data="data" />
