# async await 用法理解

_基础用法_

- async 声明该函数是异步的，且函数会返回一个 promise
- await 必须放在 aasync 函数中使用

_await 的使用值情况_

- `await + promise`: await 会等待 promise 的状态改变为 fullfilled; 如果成功，那么会将 async 函数剩余任务推入到微任务队列中；如果失败，那么剩余任务不会被推入到微任务队列中，它会返回 `Promise.reject(err)`。

- `await + 普通值`： 会被直接转化为 `promise.resolve(xxx)`，返回一个成功的 promise，然后 剩余任务推入到微任务队列中。

```ts
async function run() {
  console.log("start 1");
  const res = await 2; // 下面进入微任务
  console.log(res);
  console.log("end");
}
run();
console.log("3");

// start 1
// 3
// 2
// end
```

- `await + 函数`： 立即执行函数，而且只有当这个函数执行结束后（即函数完成: 是任务队列（宏任务，微任务）里面的东西都执行完成之后），才会将 async 剩余任务推入到微任务队列中。

```ts
function fn() {
  console.log("fn start");
  console.log("fn end");
}
async function run() {
  console.log("start 1");
  const res = await fn(); // 下面进入微任务
  console.log(res);
  console.log("end");
}
run();
console.log("3");

// start 1
// fn start
// fn end
// 3
// undefined
// end
```

::: tip 着重理解

`await xxx`: xxx 无论是什么类型，xxx 执行完成（**函数完成：包含任务队列中也执行了**）之后，剩余的代码才会进入微任务（失败除外，失败的话，剩余代码不会进入）

:::

## 案列

```ts
async function async1() {
  console.log(1);
  await async2();
  console.log(2);
}

const async2 = async () => {
  await setTimeout((_) => {
    Promise.resolve().then((_) => {
      console.log(3);
    });
    console.log(4);
  }, 0);
};

const async3 = async () => {
  Promise.resolve().then(() => {
    console.log(6);
  });
};

async1();

console.log(7);

async3();
```

1. 输出 `1`, 进入 async2 函数。
2. async2 函数中，`await + 函数`， 该 setTimeout 函数是一个宏任务，推入到宏任务队列之后，async2 函数返回 undefined。
3. <span style="text-decoration: line-through;">async2 函数执行完成，`console.log(2)` 就会被推入到微任务队列中</span>。
4. <span style="text-decoration: line-through;">async1 函数执行完成，打印 `7`</span>。
5. 执行 async3 函数，推入一个 `console.log(6)` 到微任务中。
6. <span style="text-decoration: line-through;">接下来，就是依次执行微任务(2 个)和宏任务（1 个）了。微任务执行打印 `2, 6`</span>；
7. 宏任务执行，打印 `4`，然后 `console.log(3)` 推入到微任务中。
8. 继续执行微任务，打印 `3`
9. 最终的顺序：1、7、2、6、4、3。

> 一顿操作猛如虎，然后错了。上面之所以没有干掉，是因为想记录犯错的点。

针对几点重新修改：

2. async2 函数中，`await + 函数`， 该函数是一个宏任务，推入到宏任务队列之后，async2 函数返回 undefined，进入微任务队列。_`return undefined` 进入微任务队列并执行，才说明 async2 函数执行完成, 目前并没有执行，说明 async2 函数没有执行完成_。
3. 由于 async2 没有执行完成，那么 `console.log(2)` 就没有被推入到微队列之中。
4. 同步代码执行完成, 打印 `7`
5. 执行 async3 函数，推入一个 `console.log(6)` 到微任务中。
6. 接下来，就是执行任务队列了。先执行微任务（2 个），再执行宏任务（1 个）。先执行 undefined 的微任务队列，完成之后，async2 函数执行完成，那么就会把 `console.log(2)` 加入微任务队列中。由于原来微任务队列中，存在一个`6`, 现在有加入了一个 `2`， 从而打印 `6 2`。
7. 宏任务执行，打印 `4`，然后 `console.log(3)` 推入到微任务中。
8. 继续执行微任务，打印 `3`
9. 最终的顺序：1、7、6、2、4、3。

最终案列

```ts
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}
async function async2() {
  console.log("async2 start");
  return new Promise((resolve, reject) => {
    //p2
    resolve();
    console.log("async2 promise");
  });
}
console.log("script start");
setTimeout(function () {
  console.log("setTimeout");
}, 0);
async1();
new Promise(function (resolve) {
  console.log("promise1");
  resolve();
})
  .then(function () {
    console.log("promise2");
  })
  .then(function () {
    console.log("promise3");
  });
console.log("script end");
```

> 如果.then()方法里或者 await 函数返回了一个 promise，那么返回的 promise 和其内部 promise 状态一致。但是它会把函数完成封装到内部 promise 的.then()方法里，即 p.then(()=>当前函数完成)，再把这个 p.then()整个任务放到微任务队列中，这也就为什么会推迟两步执行的原因
