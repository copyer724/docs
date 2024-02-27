# 推荐 void 0 代替 undefined

## 篇前疑问

- 就如标题，为什么推荐使用 void 0 代替 undefined

## void 用法

void 是一个关键词，无论后面跟什么，都是返回 undefined

<img src="/images/basics/js/01_void.png" style="zoom: 50%" />

所以说，这也是为什么 void 0 可以取代 undefined。

`void 0` 写法，社区习惯性写法。

## undefined

`undefined` 在 JavaScrip 不是一个关键词（重点）。如下图：

<img src="/images/basics/js/02_void.png" style="zoom: 50%" />

看见没，定义变量不会报错，再次证明 undefined 不是一个关键词

<img src="/images/basics/js/03_void.png" style="zoom: 50%" />

undefined 是 window 对象里面的一个`只读属性`，是不能被修改的。

所以在平时代码中写的 undefined 就是使用的 window 里面的属性。所以针对全局对象来说，是不会存在问题的。

但是针对函数来说，如果在局部定义一个 undefined 变量，性质就变了。

```js
function foo() {
  let undefined = 12;
  console.log(undefined); // 12
}
foo();
```

可以亲自测试一下，undefined 的值就变了。

所以说，这也是为什么推荐 void 0 代替 undefined 的。

虽然在平时代码中不会这样写，但是为了代码严谨，你值的注意。

## 总结

- `void 0` 代替 `undefined` 的目的是为了代码的严谨性

- `undefined` 不是一个关键词，在函数中定义变量 undefined，就会改变属性值。
