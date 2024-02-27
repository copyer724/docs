# 手写 async await

定义一个自动执行生成器函数，参数为生成器函数。

```js
function asyncToGenerator(generatorFunc) {
  return function () {
    // 内部对象，调用 next 改变状态
    const gen = generatorFunc.apply(this, arguments);
    return new Promise((resolve, reject) => {
      function step(key, arg) {
        let generatorResult;
        try {
          generatorResult = gen[key](arg);
        } catch (error) {
          return reject(error);
        }
        const { value, done } = generatorResult;
        // 成功之后，就返回（done 为 true）
        if (done) {
          return resolve(value);
        } else {
          return Promise.resolve(value).then(
            (val) => step("next", val),
            (err) => step("throw", err)
          );
        }
      }
      // 第一次手动执行 next 函数
      step("next");
    });
  };
}
```

测试代码：

```js
function* testG() {
  // await被编译成了yield
  const data = yield getData();
  console.log("data: ", data);
  const data2 = yield getData();
  console.log("data2: ", data2);
  return "success";
}

asyncToGenerator(testG).then((res) => {
  console.log(res);
});
```

参考代码：

```js
async function test() {
  const data = await getData();
  console.log("data: ", data);
  const data2 = await getData();
  console.log("data2: ", data2);
  return "success";
}
test().then((res) => {
  console.log(res);
});
```

> 阅读：https://juejin.cn/post/6844904102053281806
