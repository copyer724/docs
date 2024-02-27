# Object 细节知识

## 对象的属性描述符

`属性描述符`：就是对对象的属性进行精确的控制。比如说：不能让其被修改、不能让其被删除、或者说不能让其被遍历等一些列操作。

属性描述符：

- `value`： 对象 key 的属性值
- `writable`：判断属性是否可以修改（true: 修改；false 不修改）
- `enumerable`：判断能否被遍历（true: 能被遍历；false: 不能被遍历）
- `configurable`：判断能否被配置，能否被删除，能否被修改属性描述符

### 修改与设置

获取属性描述符：`Object.getOwnPropertyDescriptor(obj, key)` 和 `Object.getOwnPropertyDescriptors(obj)`

设置属性描述符：`Object.defineProperty(obj, key, options)` 和 `Object.defineProperties(obj, options)`

::: code-group

```js [获取属性描述符]
const obj = {
  name: 'copyer',
  age； 18
}

// 获取一个属性的描述符
Object.getOwnPropertyDescriptor(obj, 'name')

/*
{
  value: 'copyer',
  writable: true,
  enumerable: true,
  configurable: true
}
*/

// 获取所有属性的描述符
Object.getOwnPropertyDescriptors(obj)  // 加上了一个 s
/*
{
name: {
    value: 'copyer',
    writable: true,
    enumerable: true,
    configurable: true
},
age: {
    value: 18,
    writable: true,
    enumerable: true,
    configurable: true
}
}
 */
```

```js [设置属性描述符]
const obj = { name: "copyer" };

// 修改一个属性
Object.defineProperty(obj, "name", {
  value: "james", // 重新设置值为 james
});
console.log(name); // james

// 修改所有属性
Object.defineProperties(obj, {
  name: {
    value: "copyer",
    configurable: true,
    writable: false,
    enumerable: true,
  },
  age: {
    value: 17,
    configurable: true,
    writable: false,
    enumerable: true,
  },
});
```

:::

### 存取属性描述符

存取属性描述符中是没有 value 和 writable 属性的，代替它们的就是 get 和 set。

```js
const obj = { _name: "copyer" };
Object.defineProperty(obj, "name", {
  configurable: true,
  enumerable: true,
  set: function (value) {
    console.log("进入了set方法");
    this._name = value;
  },
  get: function () {
    console.log("进入了get方法");
    return this._name;
  },
});
obj.name = "james";
// 调用set方法
console.log(obj.name);
// 调用了get方法
// 打印结果： // 进入了set方法 // 进入了get方法 // james
```

## object 方法

- `Object.preventExtensions()` 阻止对象继续添加新的属性。
- `Object.seal()` 禁止对象删除里面属性和重新配置，就相当于设置属性描述信息 {configurable: false}。
- `Object.freeze()` 冻结一个对象，让对象属性不可修改 {writable: false}。
