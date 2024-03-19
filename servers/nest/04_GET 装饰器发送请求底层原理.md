# GET 装饰器发送请求底层原理

## 装饰器类型

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

## @Get 装饰器底层原理实现

```ts
const Get = (path: string) => {
  // 方法装饰器
  return (target: any, key: any, descriptor: TypedPropertyDescriptor<any>) => {
    // 保存函数 (getList)
    const saveFn = descriptor.value;
    // 发送请求，获取结果
    axios
      .get(path)
      .then((res) => {
        // 然后回调保存的函数
        saveFn({ data: res.data });
      })
      .catch((err) => {
        saveFn({ err });
      });
  };
};

class Controller {
  constructor() {}

  @Get("/cats")
  getList(res) {
    console.log("res======>", res);
  }
}
```

上面虽然是个简陋版，但是大致知道其中 `Get 装饰器`中实现的原理。

- 保存函数
- 内部发送请求
- 获取结果，触发函数，参数为请求的结果值

::: tip 嘿嘿

nestjs 内部肯定封装的更加的完善和强大。理解思路即可。

:::
