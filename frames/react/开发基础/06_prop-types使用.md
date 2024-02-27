# prop-types 使用

## 前篇疑问

- 为什么需要使用 prop-types？

## 使用

安装

```bash
yarn add prop-types  # yarn
npm install prop-types  # npm
```

导入

```tsx
import PropTypes from "prop-types"; //ES6语法
```

使用

```tsx
组件.propTypes = {
  propName: PropTypes.约束,
};
//例
App.propTypes = {
  colors: PropTypes.array,
};
```

## 类型限制

```tsx
// 常见类型
PropTypes.array; //数组
PropTypes.bool; //布尔
PropTypes.func; //函数
PropTypes.object; //对象
PropTypes.number; //数值
PropTypes.string; //字符串
PropTypes.symbol; //Symbol
PropTypes.element; //React元素

// 必填
App.propTypes = {
  colors: PropTypes.array.isRequired, //限制colors为数组类型，且必需
};

App.propTypes = {
  colors: PropTypes.any.isRequired, //限制colors类型随意，但必需
};

// 多可选类型：oneOfType([])
App.propTypes = {
  colors: PropTypes.oneOfType(
    [PropType.string, PropType.number] //该方法接受一个数组参数，数组内容为允许通过的类型
  ),
};

// 多可选值：oneOf([])
App.propTypes = {
  colors: PropTypes.oneOf(
    ["red", "blue"] //colors的值只能从red和blue中选择一个
  ),
};

// 特定的结构对象：shape({})
App.propTypes = {
  people: PropTypes.shape({
    // people = {name: 'zhangsan', id: 123} 满足校验
    name: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  }),
};

// 任何可被渲染的元素（包括数字、字符串、元素或数组）
// (或 Fragment) 也包含这些类型。
App.propTypes = {
  optionalNode: PropTypes.node,
};

// 一个 React 元素。
App.propTypes = {
  optionalElement: PropTypes.element,
};
```
