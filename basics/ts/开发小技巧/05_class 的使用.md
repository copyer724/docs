# class 使用

## 类的属性初始化

不初始化，会编译报错

```ts
// 方式一
class Person {
  name: string = "copyer";
}

// 方式二
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}
```

## 类的成员修饰符

- `public`：默认值的修饰符，类的内部，实例对象，继承类 都能够直接访问
- `protected`：类的内部，继承类 能够访问，但是实例对象不能访问。
- `private`：类的内部使用，继承类，实例对象都不能访问
- `readonly`：只读属性。只是针对不能重新赋值，并不是不能修改内部的值
- `abstract`：父类写函数名；子类写函数体；

::: code-group

```ts [protected]
// protected: 类的内部，继承类 能够访问，但是实例对象不能访问。

class Person {
  protected name: string;
  constructor(name: string) {
    this.name = name;
  }
  play() {
    console.log(this.name);
  }
}

class James extends Person {
  constructor() {
    super("james");
  }
  run() {
    console.log(this.name); // 继承类的内部可以访问
  }
}

const p = new Person("copyer");
console.log(p.name); // name 属性不能实例对象访问
```

```ts [private]
// private: 类的内部使用，继承类，实例对象都不能访问。

class Person {
  private _name: string; // 社区规范
  constructor(name: string) {
    this._name = name;
  }
  play() {
    console.log(this._name);
  }

  // 供外部进行修改和获取 private 属性
  set name(newName: string) {
    this._name = newName;
  }
  get name() {
    return this._name;
  }
}

class James extends Person {
  constructor() {
    super("james");
  }
  run() {
    console.log(this.name); // 继承类的内部不可以访问
  }
}

const p = new Person("copyer");
console.log(p.name); // name 属性不能实例对象访问
```

:::

**抽象修饰符**:

- 抽象修饰符只能在修饰类中使用
- 父类不需要实现，只需要定义函数名，函数体子类实现（而且是必须实现）。
- 抽象类不能被实例化

::: code-group

```ts [基本使用]
abstract class Person {
  abstract foo(): void;
}
class James extends Person {
  foo() {
    console.log("james");
  }
}
const james = new James();
james.foo();
```

```ts [经典案例]
abstract class Shape {
  abstract getArea(): number;
}

// 圆形
class Circle extends Shape {
  private _r: number;
  constructor(r: number) {
    super();
    this._r = r;
  }
  getArea(): number {
    return this._r * this._r * 3.14;
  }
}

// 矩形
class Reatangle extends Shape {
  private _width: number;
  private _height: number;
  constructor(width: number, height: number) {
    super();
    this._height = height;
    this._width = width;
  }
  getArea(): number {
    return this._height * this._width;
  }
}

const circle = new Circle(10);
const rect = new Reatangle(10, 20);

// 调用形状，获取面积方法
function clacArea(shape: Shape) {
  return shape.getArea();
}

// 传递形状，计算面积
console.log(clacArea(circle));
console.log(clacArea(rect));
```

:::

## 类方法的重载

- 重载函数参数匹配，从上到下。
- 实现函数进行逻辑处理

```ts
class Person {
  add(num: string): string;
  add(num: number): number;
  add(num: string | number) {
    if (typeof num === "string") {
      return num;
    }
    if (typeof num === "number") {
      return num * 100;
    }
  }
}
```

## 类的特性

- 封装
- 继承
- 多态（继承是多态的前提）
- ?? 抽象 （抽象类的实现）

```ts
// 封装
class Person {
  name: string = ""; // 任何人都具有名字
}

// 继承
class Student extends Person {
  no: string;
  constructor(name: string, no: string) {
    super(name); // 继承 name 属性
    this.no = no;
  }
}

// 多态
class Animal {
  action() {
    console.log("animal action");
  }
}

class Dog extends Animal {
  action() {
    console.log("dog running!!!");
  }
}

class Fish extends Animal {
  action() {
    console.log("fish swimming");
  }
}

// 父类引用指向子类对象
// 多态的目的是为了写出更加具备通用性的代码
function makeActions(animals: Animal[]) {
  animals.forEach((animal) => {
    animal.action();
  });
  // 如果不写多态，这里就需要写很多的 if 判断
}

makeActions([new Dog(), new Fish(), new Person()]); // 这里自能穿 anmial 相关的类
```
