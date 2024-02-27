# React.Children.map 使用

## 篇前疑问

- props.children.map 和 js 的 map 有什么区别？为什么优先选择 react 的？

## props.children

props.children 分为三种情况：

1.如果当前组件没有子节点，它的值就是 undefined

2.如果当前组件只有一个子节点，它的值就是 object

3.如果当前组件有多个子节点，它的值就是 array

因此：

当 this.props.children 的值不是数组时，使用 js 的 map 会报错；

React 提供了工具方法 React.Children 来处理 this.props.children, 它已经将 this.props.children 的所有情况考虑在内了。

React.Children.map 遍历子元素，执行回调函数，返回结果。
