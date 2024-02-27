# watch 和 watchEffect 源码分析

他们的内部都是调用了同一个函数 doWatch，但是呢对于里面的逻辑是不清楚，对 watchEffect 的收集依赖也不清楚，但是可以清楚的知道 watch 第一个参数接收的四种类型。

<br />
<img src="/images/frames/vue/watch_01.png" />

情况一：如果是参数为 ref 对象，直接返回 value 属性。那么对应的 newValue 和 oldValue 也是 value 值。

情况二：如果是参数为 reactive 对象，直接返回，那么对应的 newValue 和 oldValue 也是 reactive 对象。并且针对 reactive 对象，deep 设置了默认为 true，深度侦听。

<br />
<img src="/images/frames/vue/watch_02.png" />

情况三：如果参数是 array ，就是侦听多个变量，就依次变量，再依次判断每个项的类型。newValue 和 oldValue 对应的也是数组以及相应的类型。

<br />
<img src="/images/frames/vue/watch_03.png" />

情况四：侦听的是一个函数，就是针对 reactive 对象的具体的一个属性。设置的函数情景：
<br />
<img src="/images/frames/vue/watch_04.png" />
