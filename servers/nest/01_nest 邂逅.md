# nest 邂逅

::: danger 改换目标
自己思索了一番，2024 年以后逐渐会向全栈工程师迈进。但是现在的我，可能前端都没有玩明白，没有必要向全栈迈进。

现在的我，已经熟悉 node、express、koa，在前端工程化，后端接口化都能满足，现在以后的目标，先把前端玩弄明白。

当前端真的熟悉以后，再来学习 nestjs。

2024 年 3 月 2 日晚，暂停 nestjs 的学习。
:::

## 安装和创建

```bash
npm i -g @nestjs/cli # 推荐全局安装（后面需要使用 nest 命令）
nest new project-name
```

## nest 常用指令

##

## 装饰器

```ts
// 类装饰器    target: 类本身
declare type ClassDecorator = <TFunction extends Function>(
  target: TFunction
) => TFunction | void;
// 属性装饰器： target 原型对象  propertyKey 属性key
declare type PropertyDecorator = (
  target: Object,
  propertyKey: string | symbol
) => void;
// 方法装饰器： target 原型对象 propertyKey 方法名 descriptor 对象描述符
declare type MethodDecorator = <T>(
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
) => TypedPropertyDescriptor<T> | void;
// 参数装饰器 target 原型对象 propertyKey 参数名 parameterIndex 参数的索引
declare type ParameterDecorator = (
  target: Object,
  propertyKey: string | symbol | undefined,
  parameterIndex: number
) => void;
```
