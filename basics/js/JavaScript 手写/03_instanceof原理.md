# instanceof 原理

instanceof 原理：检查右边的构造函数的函数原型是否在左边实例对象的原型链上，如果存在返回 true，不存在返回 false

```js
/**
 *
 * @param {*} left: 实例对象
 * @param {*} right: 构造函数
 * @return {Boolean} Boolean
 */
function mock_instaceof(left, right) {
  let l = left.__proto__;
  let r = right.prototype;
  while (true) {
    // 找到原型链顶端为 null
    if (l === null) {
      return false;
    } else if (l === r) {
      // 实例对象的原型指向构造函数的函数原型
      return true;
    }
    // 沿着原型链查找
    l = l.__proto__;
  }
}
```
