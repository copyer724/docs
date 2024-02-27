---
title: flex
author: Copyer
date: 2024-01-04
categories: # 分类
  - 前端
---

# flex

## 篇前疑问

- flex-item 的特定
- 为什么使用 flex-wrap 换行后，不是依次排列，而是排列之间存在间距？
- flex-grow ? flex-shrink ? 默认值？
- flex-basic ?
- flex 缩写？

## 简介

**flex 布局**作为开发中的常规手段，使用起来简直不要太爽。其特点：

- 相对于常规布局（float, position），它具备更高的灵活性；
- 相对于 grid 布局，它具有更强的兼容性；
- 使用简单，几个属性就能解决常规布局需求（当然 grid 布局也可以哈）

但是在开发使用 flex 布局的过程中，也会遇到一些自己难以解释的现象；通俗表述：**为什么会是这样效果，跟自己想象的不一样啊？**。

那么针对自己提出的**为什么**，自己有去研究过？为什么是这样的效果？如何解决呢？

## flex 模型

使用 flex 的第一步，脑海中浮现 flex 模型

<img src="/images/basics/css/flex1.png">

理解如下的几个概念：

- 主轴（main axis）
- 交叉轴（cross axis）
- flex 容器（flex container）
- flex 项（flex item）

> 其中，**main size** 也可以简单理解下，后面内容 **flex-basis** 会涉及到。

还顺便理解一下 **flex-item 的基本特点**：

1. flex item 的布局将由 flex container 属性的设置来进行控制的。
2. flex item 不在严格区分块级元素和行内级元素。
3. flex item 默认情况下是包裹内容的，但是可以设置的高度和宽度。

## 现象一：flex-wrap 换行引起的间距

关键代码：

```html
<!-- css -->
<style>
  .father {
    width: 400px;
    height: 400px;
    background-color: #ddd;
    display: flex;
    flex-wrap: wrap;
  }
  .son {
    width: 120px;
    height: 120px;
  }
</style>

<!-- html -->
<body>
  <div class="father">
    <div class="son" style="background-color: aqua">1</div>
    <div class="son" style="background-color: blueviolet">2</div>
    <div class="son" style="background-color: burlywood">3</div>
    <div class="son" style="background-color: chartreuse">4</div>
  </div>
</body>
```

具体现象：

<img src="/images/basics/css/flex2.png" style="zoom:50%;" />

**疑惑**：为什么使用 flex-wrap 换行后，不是依次排列，而是排列之间存在间距？

> 一般来说，父元素的高度不会固定的，而是由内容撑开的。但是我们也不能排除父元素的高度固定这种情况。

**排查问题**：针对多行，并且在交叉轴上，不能想到是 `align-content` 属性的影响。但是又由于代码中根本都没有设置该属性，那么问题肯定出现在该属性的**默认值**身上。

那么通过 MDN 查询：

<img src="/images/basics/css/flex3.png" style="zoom:50%;" />

**align-content 的默认值为 normal**，其解释是按照`默认位置`填充。这里默认位置填充到底代表什么呢，MDN 上没有明确说明。

但是在 MDN 上查看 **align-items** 时，却发现了有用的信息（align-items 是单行，align-content 是多行），normal 在不同布局中有不同的表现形式。

<img src="/images/basics/css/flex4.png" style="zoom:50%;" />

可以发现，针对弹性盒子，normal 与 stretch 的表现形式一样。

自己又去测试 align-content，果然发现 normal 和 stretch 的表现形式一样。那么看看 stretch 属性的解释：

<img src="/images/basics/css/flex6.png" style="zoom:50%;" />

那么只需简单的需改，去掉 height 属性，那么 height 属性默认值就为 auto。

```html
<!-- css -->
<style>
  .son {
    width: 120px;
    /* 注释掉 height */
    /* height: 120px */
  }
</style>
```

看效果：

<img src="/images/basics/css/flex5.png" style="zoom:50%;" />

可以发现，子元素被拉伸了，这是子元素在默认情况下应该占据的空间大小。

> 这里就需要理解 flex item 的特点之一：**flex item 的布局将由 flex container 属性的设置来进行控制的**

那么当子元素设置高度时，是子元素自己把自己的高度限制了，但是并没有改变 flex container 对 flex item 布局占据的空间大小，所以就会多出一点空间，也就是所谓的间距。

所以针对上面这个案例，**换行存在间隔**的现象也就理解了，因为第四个元素本身就排布在弹性盒子的正确位置，只是我们把子元素高度固定了，造成的现象是有存在间隔。

理解完了上面的现象，可以设想一下，如果子元素的高度加起来大于父元素的高度，又是什么效果呢？可以自己尝试一下，看自己能够解释不？

## 现象二：flex item 拉伸？压缩？

在使用 flex 时，最常见的现象是这样的：

<img src="/images/basics/css/flex7.png" style="zoom:50%;" />

当子元素为 3 个时，不会被拉伸，为什么呢？

当子元素为 6 个事，会被压缩，又是为什么呢？

其实上面这两个疑问 ❓，只需了解两个属性：`flex-grow` 和 `flex-shrink`。因为这两个属性不常用，所以容易忽略，从而不去了解，那么就会造成疑惑。

`flex-grow` 属性指定了 flex 元素的拉伸规则。flex 元素当存在剩余空间时，根据 flex-grow 的系数去分配剩余空间。 **flex-grow 的默认值为 0，元素不拉伸**。

`flex-shrink` 属性指定了 flex 元素的收缩规则。flex 元素仅在默认宽度之和大于容器的时候才会发生收缩，其收缩的大小是依据 flex-shrink 的值。**flex-shrink 的默认值为 1，元素压缩**。

> 该两个属性都是针对 _主轴方向的剩余空间_。

**所以**：

- 当子元素数量较少时，存在剩余空间，但是又由于 flex-grow 的值为 0，所以子元素宽度不会进行拉伸。
- 当子元素数量较多时，空间不足，但是又由于 flex-shrink 的值为 1，那么子元素就会根据相应的计算，来进行压缩。

**特殊场景**：
当空间不足时，子元素一定会压缩？试试单词很长（字符串很长）的时候呢？

<img src="/images/basics/css/flex8.png" style="zoom:50%;" />

## 现象三：文本溢出，flex-basis？width？

在布局中，如果指定了宽度，当内容很长的时候，就会换行。但是会存在一种特殊情况，就是如果一个**单词很长**为内容时，则不会进行换行；跟汉字是一样的道理，不可能从把汉字分成两半。

那么在 flex 布局中，会存在两种情况：

<img src="/images/basics/css/flex9.png" style="zoom:50%;" />

可以发现：

- 设置了固定的 **width** 属性，字符串超出宽度之后，就会截取。
- 而设置了固定的 **flex-basis** 属性，字符串超出宽度之后，会自动扩充宽度。

其实在这里可能有人会有疑惑：为什么把 width 和 flex-basis 进行对比？或者说 flex-basis 这个属性到底是干什么？

> 对于我来说，也是刚刚才熟悉到这个属性。

**因为 flex-basis 是使用在 flex item 上，而 flex-basis（主轴上的基础尺寸）属性在大多数情况下跟 width 属性是等价的，都是用于设置 flex-item 的宽度。**

**只是针对上面的特殊情况，单词超长不换行时，flex-basis 就会表现出不一样的形式，自动扩充宽度**。

简单学习一下 flex-basis 的基本语法吧。

flex-basis 属性值：

- auto: **默认值**，参照自身 `width` 或者 `height` 属性。
- content: 自动尺寸，根据内容撑开。
- `<'width'>`: 指定宽度。

当一个属性同时设置 flex-basis（属性值不为 auto） 和 width 时，flex-basis 具有更高的**优先级**。

## 现象四：flex 平分

当相对父容器里面的子元素进行平分时，我们会毫不犹豫的写出：

```css
.father {
  width: 400px;
  height: 400px;
  background-color: #ddd;
  display: flex;
}
.son {
  flex: 1; /* 平分 */
  height: 90px;
}
```

<img src="/images/basics/css/flex10.png" style="zoom:50%;" />

那么我们是否会想过为什么会**平分空间？ 其中 flex:1 起了什么作用？**

我们也许都知道 **flex** 属性是一个简写，是 `flex-grow`、`flex-shrink`、`flex-basis` 的简写。所以，flex 的属性值应该是三个组合值。

但是呢，flex 又类似于 font 属性一样，是一个很多属性的简写，其中一些属性值是可以不用写的，采用其默认值。

所以 flex 的属性值就会分析三种情况：一个值，两个值，三个值。

MDN 对其做了总结：

<img src="/images/basics/css/flex11.png" style="zoom:50%;" />

看图，规则挺多的，如果要死记的话，还是挺麻烦的。

针对上面的规则，其实只需要理解 flex 的语法形式，还是能够完全掌握（有公式，谁想背呢）。

```js
flex = none | auto | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
```

希望你能看懂这个语法，很多 api 都有类似的组合。

- `|` 表示要么是 none, 要么是 auto, 要么是后面这一坨，三选一。

- `||` 逻辑或
- `?` 可选

理解上面这种语法之后，总结起来就是如下：

**一个值**：

1. `none（0 0 auto）`和` auto（1 1 auto）` 是需要单独记一下的，这个无法避免。
2. `无单位`，就是 flex-grow，因为存在单位，就是 flex-grow 属性值规定为一个 number 类型的
3. `有单位`，就是 flex-basis，因为类似 width 属性是需要单位的，不然没有效果。

**两个值**：

1. 无单位，就是 flex-grow 和 flow-shrink，理由如上
2. 其中一个有单位，就是 flex-grow 和 flex-basis，因为 flex-shrink 是可选的（这种情况是没有任何实际意义的，flex-basis 设置了根本无效）。

**三个值**

不用多说，一一对应。

理解了上面的语法形式，再来看 flex: 1 的含义就轻而易举了。**一个值，没有单位，就是 flex-grow，剩余空间平均分配**。

## 现象五：多行，两边对齐布局

无论是 app 开发，还是网页开发，遇到最多的场景就是这样的：

<img src="/images/basics/css/flex12.png" style="zoom:50%;" />

两边对齐，一行元素之间的间距相同；如果一行显示不下，就换行依次对齐排布。

那么不难想到的就是 flex 布局，会写下如此代码:

```css
.father {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.son {
  width: 90px;
  height: 90px;
}
```

那么你就会遇到如下情况：

<img src="/images/basics/css/flex13.png" style="zoom:50%;" />

其中的第二、三种情况布局是不可以接受，数据数量不齐的问题。但是数据是动态的，所以不能避免出现类似情况。

你们遇到过这种类似的布局吗？会存在这种情况吗？是怎么解决的呢？

第一种解决方案：**硬算**。

不使用 flex 的 justify-content 属性，直接算出元素的 margin 间隔。

```css
.father {
  width: 400px;
  background-color: #ddd;
  display: flex;
  flex-wrap: wrap;
}
.son {
  margin-right: calc(
    40px / 3
  ); /* 40px 为 父元素的宽度 - 子元素的宽度总和，    然后平分剩余空间*/
  width: 90px;
  height: 90px;
  background-color: #5adacd;
  margin-bottom: 10px;
}
/* 针对一行最后一个，清空边距 */
.son:nth-child(4n) {
  margin-right: 0;
}
```

缺点：只要其中的一个宽度发生变化，又要重新计算。

第二种解决方案：**添加空节点**

为什么要添加空节点呢？因为在 flex 布局中，没有严格的区分块级元素和行内元素。那么就可以使用空节点，来占据空间，引导正确的布局。

```html
<style>
  .father {
    width: 400px;
    background-color: #ddd;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .son {
    width: 90px;
    height: 90px;
    background-color: #5adacd;
    margin-bottom: 10px;
  }

  /* height 设置为 0 */
  .father span {
    width: 90px; /*空节点也是 flex-item, width 是必须一致的，只是设置高度为0，不占据空间*/
  }
</style>
</head>
<body>
  <div></div>
  <div class="father">
    <div class="son">1</div>
    <div class="son">2</div>
    <div class="son">3</div>
    <div class="son">4</div>
    <div class="son">5</div>
    <div class="son">6</div>
    <div class="son">7</div>
    <!-- 添加空节点，个数为 n-2 -->
    <i></i>
    <i></i>
  </div>
</body>
```

这样也能解决上面的问题。

**添加空节点的个数**：n(一行的个数) - 2（行头和行尾，就是类似第一种情况和第四种情况本身就是正常的，就不需要空间点占据）

**缺点**：添加了 dom 节点

上面两种方案都解决问题，但是都有着各自的缺点，具体采用哪种方式，就看自己的选择了。

那么你们还有其他的解决方案吗？

## 总结

其实本篇所解释的现象是自己对 flex 知识掌握不牢而造成的，从而记录此篇，提升熟悉度。也希望能够帮助对这些现象有困惑的码友。

如果存在错误解释，评论区留言。
