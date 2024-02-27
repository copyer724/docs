---
title: bfc
author: Copyer
date: 2023-12-29
categories: # 分类
  - CSS
tags: # 标签
  - 原理
---

# BFC

## 篇前疑问

- 你能看见 BFC 吗？

> 反复问自己这个问题，当你有清晰的答案时，你就彻底明白了 BFC

## FC

`FC`：formatting context，译为**格式上下文**，可以简单的理解为一种**环境**。

官方解释：

<img src="/images/basics/css/BFC1.png" />

1. 元素（块级元素，行内元素）只要在**标准流**中，就会属于一个 **FC**。
2. 块级元素属于 **BFC**，行内元素属于 **IFC**。
3. 但是不会存在一个元素既属于 **BFC**，又属于 **IFC**。

**总结：FC 是一种环境，在该环境下就遵循该环境下的规则。**

## BFC

`BFC`: block formatting context，译为**块级格式化上下文**。

### BFC 环境形成的条件

知道了 BFC 的存在，那么怎么才能看见它呢？

[MDN：块格式化上下文](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)

在上面的 MDN 地址中列举了可以形成 BFC 的全部条件，还是比较多的。但是在实际开发中，往往只需要几个即可。

下面是我认为几个比较常用的条件：

- 根元素（`<html>`）
- 浮动元素 float 值不为 `none`
- 绝对定位元素值为`absolute` 或 `fixed`
- overflow 的值不为 `visible`、`clip`
- 弹性元素（`flex`）

### BFC 环境下的规则

在理解规则之前，先来思考几个问题：

1. 为什么块级盒子会一行一行的布局？
2. 为什么盒子的布局是从浏览器的左边开始布局，而不是右边？
3. 盒子之间的间距是通过 `margin` 属性来进行设置的，为什么？

相信大多数人的感觉，就是应该**理所当然**，一种约定俗成的规则。那么请想一下，人是可以通过约定来形成规则；但是对于电脑（机器）而言却是不行，它们必须内部存在一种规则，根据该规则来执行对应的任务。

那么问题就来了，机器里面的布局规则（也可以更加具体的说浏览器里面的布局规则）是什么？相信你们已经想到了，里面布局规则就是 **BFC 规则** 和 **IFC 规则**。

官方解释：

<img src="/images/basics/css/BFC2.png" />

1. 规则一：在 BFC 中，盒子的布局是在垂直方向上一个一个的排列，从容器的顶部开始。
2. 规则二：盒子与盒子之间的距离，通过 `margin` 属性设置。
3. 规则三：在同一个 BFC 环境中，两个垂直之间的盒子，都设置了 margin 属性，则会产生折叠（collapse）。
4. 规则四：每个盒子的布局都是从容器的左边缘开始布局的。

这就是 BFC 环境中的规则，浏览器里面的规则就是基于 BFC 环境下的规则的（当然还有 IFC 环境下的规则）。

到了这里，总结一下：**BFC 就是一种环境，环境里面存在一系列的规则。**。

> 环境这种东西，本来就摸不到的，但是可以详细的描述，希望面试的时候，可以回答出来哟。

## BFC 代码演示

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>bfc</title>
    <style>
      * {
        margin: 0;
        padding: 0;
      }
      .box1 {
        background-color: red;
        width: 300px;
        height: 100px;
      }
      .box2 {
        background-color: blue;
        width: 200px;
        margin-top: 30px;
        height: 100px;
      }
    </style>
  </head>
  <body>
    <div class="box1"></div>
    <div class="box2"></div>
  </body>
</html>
```

效果图：
<img src="/images/basics/css/BFC3.png" style="zoom:50%;" />

看了效果图，也相信大家能够解释其中的因果。

> 温馨提示：这是 html 根标签已经形成了 BFC，那么就会遵守 BFC 规则（margin 规则）。

## BFC 的应用

1. 解决 margin 折叠的问题。
2. 解决清除浮动，高度塌陷的问题。

### margin 折叠问题

BFC 环境有个规则：就是在同一个 BFC 环境下，相邻的两个盒子，存在 margin 会进行折叠，取最大值。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>bfc</title>
    <style>
      * {
        margin: 0;
        padding: 0;
      }
      .box1 {
        background-color: red;
        width: 300px;
        height: 100px;
        margin-bottom: 100px; /* margin-bottom */
      }
      .box2 {
        background-color: blue;
        width: 200px;
        margin-top: 30px; /* margin-top */
        height: 100px;
      }
    </style>
  </head>
  <body>
    <div class="box1"></div>
    <div class="box2"></div>
  </body>
</html>
```

无论是 `box1` 盒子 还是 `box2` 盒子都在 html 根标签形成 BFC 中，所以会产生折叠。

<img src="/images/basics/css/BFC4.png" alt="BFC4" style="zoom:50%;" />

那么想要不发生折叠，就让其中的一个盒子处于另外一个 BFC 环境中

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>bfc</title>
    <style>
      * {
        margin: 0;
        padding: 0;
      }
      .container {
        overflow: auto; /* 形成 BFC 环境 */
      }
      .box1 {
        background-color: red;
        width: 300px;
        height: 100px;
        margin-bottom: 100px;
      }
      .box2 {
        background-color: blue;
        width: 200px;
        margin-top: 30px;
        height: 100px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="box1"></div>
    </div>
    <div class="box2"></div>
  </body>
</html>
```

<img src="/images/basics/css/BFC5.png" alt="BFC5" style="zoom:50%;" />

这样就不会产生折叠，因为没有处于同一个 BFC 环境中。

### 清除浮动的问题

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>bfc</title>
    <style>
      * {
        margin: 0;
        padding: 0;
      }
      .container {
        /* overflow: auto; */
      }
      .item {
        background-color: red;
        height: 50px;
        width: 100px;
        float: left; /* 浮动 */
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
    </div>
  </body>
</html>
```

在浮动布局的时候，就会产生一种现象，盒子内部设置了浮动，盒子的高度就塌陷了。那么解决方案就两种：

1. 清除浮动
2. 形成 BFC 环境

主要说下第二种解决方案。

先来关注一下，为什么设置了浮动，高度就塌陷了？**是因为浮动元素，就已经脱离标准流了，不会把自身的高度汇报给父元素，从而父元素就没有高度了。**

那么**~~形成了 BFC 环境之后，就能把脱标元素的高度汇报给父元素~~**了，这种说法对不对？答案是不对的。

因为脱标元素不仅仅只有浮动，还有绝对定位，那么把子元素设置为 `position: absolute`，并且再把父元素形成 BFC 环境 之后，观察现象，也是没有汇报高度给父元素的，所以上面的那种说法是不成立的。

那么正确的结论是怎么样的呢？

官方解释：

<img src="/images/basics/css/BFC6.png" alt="BFC6" style="zoom: 67%;" />

这张截图挺模糊的，但是大致的意思就是：

针对 `height：auto` 的 BFC 环境的盒子，高度的计算如下：

1. 如果子元素是**行内元素**，那么高度就是**行高的顶部到行高的底部距离**。
2. 如果子元素是**块级元素**，那么高度就是**最上面盒子的上边缘到最下面盒子的下边缘的距离**。
3. 如果是**绝对定位元素**，那么将直接被**忽略**。
4. 如果是**浮动元素**，那么**就会增加高度，完全包裹子元素的下边缘**。

这也就解释了上面的那种说法是错误的。**因为 BFC 盒子，发现子元素是浮动元素，就增加自身的高度，来完全包裹子元素，并不是子元素汇报高度给父元素。**

> 上面满足的条件：
>
> 1.  形成 BFC。
> 2.  height 为 auto。

## 总结

BFC 是一种环境，里面存在着各种规则。

BFC 能解决 **margin 合并**和**清除浮动**问题。
