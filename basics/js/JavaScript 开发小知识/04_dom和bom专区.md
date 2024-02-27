# DOM 和 BOM 专区

## 原生 DOM 的冒泡

::: code-group

```html [html]
<body>
  <div id="id">
    <button id="btn">点击</button>
  </div>
</body>
```

```js [正常冒泡]
const div = document.querySelector("#id");
const btn = document.querySelector("#btn");

document.addEventListener("click", (e) => {
  console.log(1);
});

div.addEventListener("click", (e) => {
  console.log(2);
});

div.addEventListener("click", (e) => {
  console.log(3);
});

div.addEventListener("click", (e) => {
  console.log(4);
});

btn.addEventListener("click", () => {
  console.log(5);
});

// 点击按钮： 5 2 3 4 1
```

```js [e.stopPropagation]
const div = document.querySelector("#id");
const btn = document.querySelector("#btn");

document.addEventListener("click", (e) => {
  console.log(1);
});

div.addEventListener("click", (e) => {
  console.log(2);
});

div.addEventListener("click", (e) => {
  console.log(3);
  e.stopPropagation();
});

div.addEventListener("click", (e) => {
  console.log(4);
});

btn.addEventListener("click", () => {
  console.log(5);
});

// 点击按钮： 5 2 3 4
```

```js [e.stopImmediatePropagation]
const div = document.querySelector("#id");
const btn = document.querySelector("#btn");

document.addEventListener("click", (e) => {
  console.log(1);
});

div.addEventListener("click", (e) => {
  console.log(2);
});

div.addEventListener("click", (e) => {
  console.log(3);
  e.stopImmediatePropagation();
});

div.addEventListener("click", (e) => {
  console.log(4);
});

btn.addEventListener("click", () => {
  console.log(5);
});

// 点击按钮： 5 2 3
```

:::

区别:

- `e.stopPropagation()`： 阻止往上冒泡，但是不会阻止同级的执行
- `e.stopImmediatePropagation()`：阻止同级的后面执行，也会阻止向上冒泡

## documentElement 和 body

- document.documentElement 返回的是 `html` 节点
- document.body 返回的是 `body` 节点

## JavaScript 的长宽高

- client： 用户，内容区域
- offset：偏移量
- scroll：滚动

<img src="/images/basics/js/dom_01.png" />
