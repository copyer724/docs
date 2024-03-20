# as const 使用五个场景

`as const` 是一种类型断言，它将变量标记为 “常量”。使用 `as const` 可以告诉 TypeScript 编译器，某个对象的所有属性都是只读的，并且它们的类型是字面量类型，而不是更通用的类型。

## 对象属性不可变

```ts
const obj = {
  name: "copyer",
};

obj.name = "james"; // 尽管 const 定义，但是也能改变
```

```ts
const obj = {
  name: "copyer",
} as const;

obj.name = "james"; // 编译报错
```

也支持更深层次的嵌套对象。

## 确保数组或者元组不可变

```ts
const color = ["red", "green", "blue"]; // 可以 push
const color = ["red", "green", "blue"] as const; // 不可以 push, 只能读
```

## 赋值时缩窄变量的类型

```ts
// 默认推断
let color1 = "Red"; // let color1: string
const color2 = "Red"; // const color2: "Red"

// 使用 as const
let color3 = "Green" as const; // let color3: "Green"
```

## 让类型推断更精准

```ts
// 推断为 string
const RGB_COLORS = ["red", "green", "blue"];
let red = RGB_COLORS[0]; // string

// 准确推断
const RGB_COLORS = ["red", "green", "blue"] as const;
let red = RGB_COLORS[0]; // 'red'
```

## 常量枚举的替代方案（不推荐）

```ts
const enum Colors {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE",
}

let color: Colors = Colors.Red; // Ok
color = Colors.Green; // Ok
```

```ts
const Colors = {
  Red: "RED",
  Green: "GREEN",
  Blue: "BLUE",
} as const;

type ColorKeys = keyof typeof Colors;
type ColorValues = (typeof Colors)[ColorKeys];

let color: ColorValues = "RED"; // Ok
color = "GREEN"; // Ok
```
