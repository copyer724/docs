# css 深入理解

### 标签具有所有 CSS 属性

每一个标签都具有`所有 CSS` 属性值，因为这样浏览器才能确定该标签元素改如何展示。

<img src="/images/basics/css/css_07_01.png" />

打开控制台，选择一个元素之后，就会有如图所示的结构：

- `1:`选择 Computed (计算过程：这个非常重要)
- `2:`勾选 show all，展示该标签的所有 css 属性
- `3:`勾选 group，对 css 属性进行分组（好的分组，更加有利于 css 的计算）。

### CSS 属性编写顺序

::: tip 说明
没有强制要求，只是养成一种良好的编程习惯。
:::

上面谈到，一个好的 css 属性编写顺序，更加有利于 css 属性值的计算。

编写的顺序，就如上面的 group 分组，有时间可以具体看看，养成一种良好的习惯。

1. layout: (display | position | width | height | padding | margin | left | overflow | box-sizing | z-index)
2. text: (font | line-height | text)
3. appearance: (color | background | border | cursor | outline | shadow)
4. animation
5. other

### CSS 属性值的计算过程

看看渡一的短视频(虽说有广告，但是讲的还是挺清晰的)

https://www.bilibili.com/video/BV1Gb4y1L7CV/?spm_id_from=333.337.search-card.all.click&vd_source=73b012c3730a25fea48281b3af665c0e
