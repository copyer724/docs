# 为什么需要 react-redux

## 篇前疑问

1. 为什么要使用`react-redux`?
2. `react-redux`为开发提供了什么？

## react 中使用 redux

如果在 react 组件中，使用`redux`的话，肯定会有三个步骤：

1. 导入 state 数据到组件。
2. 在组件加载的时候，监听`state数据`的变化。
3. 在组件卸载的时候，取消监听 state 数据变化。

```jsx
// 那么就会出现，每个组件中，大致有这样的几行代码

// 导入整体的state
import stores from 'src/stores'

// 在组件加载的时候，监听state数据变化
componentDidMount() {
    this.unSubScribe = store.subscribe(() => {
        this.setState({
            counter: stores.getState.count
        })
    })
}

// 组件卸载的时候，取消监听
componentWillUnmount() {
    this.unSubScribe()
}
```

> `store.subscribe()`的返回值，是一个取消监听的函数，执行该函数，就取消监听。

这样就会想，如果每个组件都有这样的几行代码，那么就会进行`代码抽离`。

## 代码抽离

**抽离的实现：** 利用高阶组件(HOC)

```jsx
import React, {PureComponent} from 'react

// 导入store
import stores from '../stores'

export default function connect(mapStateToProps, mapDispatchToProps) {
  return function HandleNewCom(WrapComponent) {
    return class extends PureComponent {    //这里是使用的class表达式，可以不用写类名
      constructor(props) {
        super(props)
        this.state = {
          storeState: mapStateToProps(stores.getState())
        }
      }

      //在生命周期中处理订阅和取消订阅
      componentDidMount() {
        this.unSubScribe = store.subscribe(() => {
          this.setState({
            storeState: mapStateToProps(stores.getState())
          })
        })
      }
      componentWillUnmount() {
        this.unSubScribe()
      }

      //这里我们把传递过来组件，重新return出去，也把store中的state值和store.dispatch传送过去
      return<WrapComponent
        {...this.props }
        {...this.mapStateToProps(store.getState())}
        {...this.mapDispatchToProps(store.dispatch) }
      />
    }
  }
}
```

**简单分析：**

- 执行`connect` 函数，返回一个组件，调用 connect 函数，就需要你手动的传递两个参数，并且这`两个参数也是函数`

  - `mapStateToProps`： 映射 state 到 props 中去。
  - `mapDispatchToProps`: 映射 dispatch 到 props 中。

- `connect`函数，返回`一个函数组件`，函数组件接受一个参数，该参数也是`组件`。
  - 这一步的目的就是为了`注入state和dispatch到props`中
  - `...this.mapStateToProps(store.getState())`: 注入`mapStateToProps的返回值`到 props 中
  - `...this.mapDispatchToProps(store.dispatch)`: 注入`mapDispatchToProps的返回值`到 props 中

**具体使用：**

```jsx
// 定义两个函数，作为connect的参数
const mapStateToProps = (state) => {  // state：store.getState()调用传入的
  return {
    counter: state.counter
  }
};

const mapDispatchToProps = (dispatch) => { // dispatch: store.dispatch 调用传入的
  return {
    increment: (...args) => dispatch(actions.increment(...args)),
  }
};

// 调用connect函数，返回一个函数组件
const Com = connect(mapStateToProps, mapDispatchToProps)
// 函数组件，接受一个参数：组件,返回一个组件（HOC）
const NewCount = Com(Count)
export default NewCount;

// 连起来写
export default connect(mapStateToProps, mapDispatchToProps)(Count)
```

这样，`redux`在组件中，就不用每个组件都去写一边`redux`的监听事件等等，只需要调用 connect 函数即可，返回一个新的组件，新的组件就具有 state 的一些列操作。

## react-redux 的出现

那么对于开发者而言，只想要 connect 函数功能，不想去实现它。所以，这下 react-redux 就出现了，react-redux 里面，就提供了 connect 函数，直接使用即可。

```jsx
import { connect } from "react-redux";
```

并在 react-redux 中还提供了`Provider的组件`（利用 useContext 实现的），在项目的入口文件处，主组件中提供，在所有的子组件中都能使用。

```jsx
import { Provider } from "react-redux";

<Provider store={store}>
  <App />
</Provider>;
```

并且从 react16.8 以后，hooks 的出现，react-redux 有提供了两个 hooks，用来拿取 state 和 dispatch

```jsx
import { useSelector, useDispatch } from "react-redux";
```

并且`useSelector` 还可以做性能优化，利用第二个参数的浅层比较。

## 总结

1. 为什么要使用 react-redux?

   > 封装了一些使用 redux 的通用逻辑，可以直接调用 API

2. `react-redux`为开发提供了什么？

   > 针对类组件 ：`connect函数`，`Provider组件`
   >
   > 针对函数组件： `useSelector`, `useDispatch` 两个 hooks，`Provider组件`
