# 手写 Promise 及方法

[promise a+ 规范](https://promisesaplus.com/)

待更新

### isPromiseLike

判断是否是一个 thenable 对象

```js
export function isPromiseLike(obj) {
  return (
    !!obj &&
    (typeof obj === "object" || typeof obj === "function") &&
    typeof obj.then === "function"
  );
}
```

## 方法

- Promise.resolve()
- Promise.reject()
- Promise.all()
- Promise.race()
- Promise.finally()
- Promise.allSettled()
- Promise.any()

以上属于 Promise 的类方法，但是他们都不是 promise a+ 规范
