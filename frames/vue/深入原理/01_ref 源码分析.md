# ref 源码分析

### 源码截图

<br />
<img src="/images/frames/vue/ref_01.png" />
<br />

<img src="/images/frames/vue/ref_02.png" />
<br />

<img src="/images/frames/vue/ref_03.png" />
<br />

在类的实现上，存在的属性：

- `_rawValue`: 保留的是上一次的值
- `_value`: 最新的值
- `dep`: 不知道
- `__v_isRef`：true 是一个 ref 对象，false 者不是一个 ref 对象
- `value`：返回\_value，触发的是 getter 和 setter 操作，也就是 Object.defineProperty() 方法。
