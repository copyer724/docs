# 单元测试 Jest

## 篇前疑问

- 什么是单元测试？我们为什么需要？
- 如何做一个简单的单元测试？
- jest 有哪些语法，Jest 的报告包含哪些信息？

## 文章学习

- [花一个小时，迅速掌握 Jest 的全部知识点~](https://juejin.cn/post/7145269660635070495)

## 什么是单元测试？

单元测试：指的是以原件的单元为单位，对软件进行测试。

其中单元可以是一个函数，也可以是一个模块或一个组件，基本特征就是**只要输入不变，必定返回同样的输出**。

## jest

Jest 是 Facebook 开源的一个前端测试框架，主要用于 React 和 React Native 的单元测试，并且被集成在 create-react-app 中。

## 配置文件

- jest.config.js: 可以是对象，也可以是函数
- jest.config.json: 类似 package.json 文件
- package.json: jest 属性

```ts
// 对象
import type {Config} from 'jest';

const config: Config = {
    verbose: true,
    ...
};

export default config;

// 函数
import type {Config} from 'jest';

export default async (): Promise<Config> => {
    return {
        verbose: true,
        ...
    };
};
```

## 全局函数

- describe
- it: 别名 test
- afterAll： 所有的测试用例执行完`后`执行 （可以写在 **全局** 或者 **局部**）
- beforeAll：所有的测试用例执行完`前`执行（可以写在 **全局** 或者 **局部**）
- afterEach：每个测试用例`后`执行
- beforeEach： 每个测试用例`前`执行
- expect：断言（重要）

## 断言

## mock

- `jest.clearAllMocks()`: 用于清除所有 mock 函数的调用和实例
- `jest.restoreAllMocks()`：用于恢复所有 mock 函数的原始实现。会遍历所有的 mock 函数，将其还原为原始的实现，这样可以保证下一个测试用例开始时，mock 函数处于正常的状态。这样做可以避免 mock 函数的状态泄漏和干扰其他测试用例的运行
- `jest.fn()` 创建随机函数

- `mockImplementation`: `jest.fn()` 创建一个随机函数，但是实现的内容是不能控制的。通过 mockImplementation 函数来实现自定义 mock 函数行为，返回我们期望的结果。

```ts
const fetchData = jest.fn();
fetchData.mockImplementation(() => Promise.resolve("mocked data"));

// 在测试中调用fetchData会返回'mocked data'
```

- `toHaveBeenCalledWith`: 用于验证 mock 函数是否以特定的参数被调用过。通常用于验证某个函数是否以正确的参数被调用。

```ts
const mockFunction = jest.fn();
mockFunction("hello", "world");

expect(mockFunction).toHaveBeenCalledWith("hello", "world");
```

- `mockResolvedValue(xxx)`: 类似 Promise.resolve(xxx) 函数。
- `mockRejectedValue`: 类似 Promise.reject(xxx) 函数
- `mockReturnValue`: 类似 return xxx

## 异步处理
