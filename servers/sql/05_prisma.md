# prisma

## 介绍

Prisma 创造了一种 DSL（Domain Specific Language，领域特定语言）。

具体流程：把表映射成了 DSL 里的 model，然后编译这个 DSL 会生成 `prismaClient` 的代码，之后就可以调用它的 find、delete、create 等 api 来做 crud 了。

先在项目中，安装一下：

```bash
pnpm install prisma --save-dev # 安装到开发依赖
```

## prisma 指令

查看 prisma 的所有指令，使用 `npx prisma -h`

<img src="/images/servers/sql/prisma01.png" />

- init：创建 schema 文件
- generate： 根据 schema 文件生成 client 代码
- db：同步数据库和 schema
- migrate：生成数据表结构更新的 sql 文件
- studio：用于 CRUD 的图形化界面，查询 api 的使用方法
- validate：检查 schema 文件的语法错误（vscode 安装 prisma 插件即可）
- format：格式化 schema 文件（vscode 安装 prisma 插件即可）
- version：版本信息

::: tip 温馨提示
针对上面的指令，都可以使用 `npx prisma xxx -h` 来查看各自的具体用法。
:::

拿 init 来举例： `npx prisma init -h`

<img src="/images/servers/sql/prisma02.png" />

其他的指令情况也都是如此的。

接下来就看看在开发过程中常用的几个指令：

### init

初始化指令，会生成 `prisma/shcema.prisma` 和 `.env` 文件。

```bash
prisma init

prisma init --datasource-provider mysql # 指定连接的数据库

prisma init --url mysql://xxx:yyy@localhost:3306/prisma_test # 连接数据库信息
```

### db

创建完 schema 文件之后，就需要对 schema 进行定义，与数据库进行交互。

继续使用 `npx prisma db -h`，你会发现有四个指令

```bash
prisma db pull # 拉取数据库的结构，生成 model
prisma db push # 根据 model 生成数据库表（数据库里面的表都会进行删除，在执行该命令之前，一定要先 pull 一下）
prisma db seed # 执行脚本插入初始数据到数据库（少用）
prisma db execute # 执行 SQL 语句

# --file 执行 SQL 文件，-- shcama 读取数据库配置信息
prisma db execute --file prisma/test.sql --schema prisma/schema.prisma
```

针对 seed 的指令执行，需要在 package.json 中添加 prisma 指令。

```json [package.json]
{
  "script": {},
  "prisma": {
    "seed": "npx ts-node prisma/seed.ts"
  }
}
```

然后执行 `prisma db seed` 就可以执行 SQL 语句，初始数据到数据库。

其实也不难发现，也就是使用 ts-node 来执行的 seed.ts 文件。

整体结构就是这样的，

<img src="/images/servers/sql/prisma03.png" />

### migrate

使用 `db pull` 或者 `db push`使本地 schema 和数据库保持一致后，但后续发生变动时，就需要同步：

- 当数据库发生结构变化，使用 db pull 来更新 schema
- 当 schema 发生变动，使用 db push 来更新数据库表结构

::: danger 这里会存在一个问题，就是无论是拉取还是推送，只是数据库和 schema 的结构保持一致了，但是会存在问题，其一 @prisma/client 是没有更新的；其二，结构变化了，数据也是没有推送的（删除还好说，新增的话，数据时没有新增的）。
:::

那么 prisma 提供了 migrate 指令来解决这个问题，该指令用于迁移。

这里的迁移指的是表的结构发生了变化。

```bash
npx prisma migrate -h
```

<img src="/images/servers/sql/prisma04.png" />

这里的 `npx prisma migrate dev --name xxx` 是多个指令的集合

1. `prisma generate`: 更新 @prisma/client
2. `prisma db push`: 同步数据库表结构
3. `prisma db seed`: 同步表的数据
4. `--name xxx`：是用于记录迁移文件命名（日期+xxx）

案例演示：

旧的 model 和数据展示

<img src="/images/servers/sql/prisma05.png" />

现在增加一个 sex 字段，int 类型

```prisma
model user {
  id   Int    @id @default(autoincrement())
  name String @db.VarChar(20)
  age  Int
  sex  Int    @db.TinyInt // [!code ++]
}
```

当执行 `npx prisma migrate dev --name add_sex` 时

<img src="/images/servers/sql/prisma06.png" />

报错的原因，很简单，添加了 sex 字段，更新了 @prisma/client 的代码，但是

<img src="/images/servers/sql/prisma07.png" />

明确表示了，缺少 sex 字段，这是必填的。

解决办法，两种方案：

- 方案一：修改 seed.ts 文件，添加 sex 字段，然后执行执行命令

```ts [seed.ts]
const user = await prisma.user.createMany({
  data: [
    {
      name: "copyer",
      age: 23,
      sex: 1, // [!code ++]
    },
  ],
});
```

- 方案二：使 sex 变为可选字段，也就是说可以设置为 null

```prisma
model user {
  id   Int    @id @default(autoincrement())
  name String @db.VarChar(20)
  age  Int
  sex  Int?    @db.TinyInt // [!code ++]
}
```

以上两种方案，都能解决。

迁移日志文件记录着，执行的 SQL 语句来更新数据库

<img src="/images/servers/sql/prisma08.png" />

dev 指令的用法就是这样了。

还有一个 reset 指令

```bash
npx prisma migrate reset
```

- 删除表中所有数据（表中可能存在脏数据）
- 执行所有的日志文件（也就是 SQL 集合）
- 更新 @prisma/client 代码
- 执行 seed.ts 来初始化数据

:::warning 生产环境还有几个指令，当后续使用 prisma 接触到生产环境时，在更新。
:::

### generate

生成 prisma client 代码，用于操作数据库。

使用 `npx prisma migrate dev` 就可以省略这一步

### 其他指令

- format：格式化(借用 vscode 插件完成: prisma)
- validate：检查(借用 vscode 插件完成: prisma)
- studio：图形化界面（CRUD 时有用）
- version: 版本信息

都是一些辅助指令，了解即可。

## prisma schema 语法

在上面的介绍中，已经大致了解了 prisma 指令的用法。无论是什么指令，都是对 `prisma/schema.prisma` 文件进行操作。

接下来就熟悉 schema 文件里面的语法。

- `datasource` 关键词

当项目创建之初，我们就会执行 `npx prisma init` 指令，就会开始配置数据库信息，数据库名，用户，密码等等

```prisma [prisma/schema.prisma]
// 数据库连接信息配置
datasource db {
  provider = "mysql" // 数据库类型
  url      = env("DATABASE_URL")  // 数据库连接信息
}
```

- `generator` 关键词

generator 是生成的意思，一般也就是指生成 @prisma/client 的最新代码。

@prisma/client 默认生成的路径在：**node_modules/@prisma/client**，但是可以进行修改，指定 output 属性来进行修改。

```prisma [prisma/schema.prisma]
generator client {
  provider = "prisma-client-js",
  output   = "../generated/client" // [!code ++]
}
```

除了 @prisma/client, 其实也可以安装一些社区的三方包，生成可视化文档，比如：

1. prisma-docs-generator：生成 docs 文档，通过 http-server 来进行启动，对 crud 非常有用
2. prisma-json-schema-generator：生成 JSON

先安装

```bash
pnpm install prisma-docs-generator prisma-json-schema-generator -D

```

再使用

```prisma
generator docs {
  provider = "node node_modules/prisma-docs-generator"
  output   = "../generated/docs"
}

generator json {
  provider = "prisma-json-schema-generator"
  output   = "../generated/json"
}
```

通过 live-server 来启动 docs 来看看，实际效果。

<img src="/images/servers/sql/prisma09.png" />

- `model` 关键词

model 就是用来定义数据库模型的，其语法最终为被转化为 SQL 语句，同步到数据库。

```prisma [prisma/schema.prisma]
// 定义枚举值
enum Status {
  AAA
  BBB
  CCC
}

model Test {
  // id int类型 自动增长
  id         Int      @id @default(autoincrement())
  // name varchar(50) 长度，唯一性
  name       String   @unique @db.VarChar(50)
  // age  int类型  重新取名：new_age
  age        Int      @map("new_age")
  // 性别，可选
  sex        Int?     @db.TinyInt
  // 启用/禁用  布尔类型 默认值为 true
  enable     Boolean  @default(true)
  // createTime 时间格式类型 默认值为当前创建时间 now()
  createTime DateTime @default(now())
  // updateTime 时间格式类型，跟随更新 @upadteAt
  updateTime DateTime @updatedAt
  // 枚举
  status     Status   @default(AAA)

  // 表名test改名为new_test
  @@map("new_test")
  // 定义索引
  @@index([id])
}
```

很容易看出上面的书写规则：第一列是字段名，第二列是类型，第三列是一些其他信息。

**类型**：

- `Int`: 数字类型
- `String`: 字符串
- `Boolean`: 波尔类型
- `DateTime`: 时间类型
- 自定义枚举

也可以添加一个 `?` 表示该字段是可选的，可以为 null。

针对**其他信息**的定义，其实大致跟 SQL 语句的关键词是保持一致的

- `@id` 定义主键
- `@default` 设置默认值： **@default(autoincrement())**: 主键自动增长；**@default(now())**: 默认当前时间; **@default(true)**: 默认值为 true
- `@unique` 添加唯一约束
- `@map` 重命名字段名称，敏感大小写
- `@@index` 定义索引
- `@@map` 重命名表名，敏感大小写
- `@db.xxx` 更加具体化类型，跟 sql 类型是一致的（其实类型大致就分为三种）

字符串
<img src="/images/servers/sql/prisma10.png" style="zoom: 50%" />
数字
<img src="/images/servers/sql/prisma11.png" style="zoom: 50%" />
时间
<img src="/images/servers/sql/prisma12.png" style="zoom: 50%" />

上面是一张表的定义，也就是一个 model；如果存在多个 model，那么就是多个表，表与表之间的关联，这些又是怎么样的呢？

继续看案列：

表与表：一对多

```prisma [prisma/schema.prisma]
// 数学老师
model MathTeacher {
  id       Int       @id @default(autoincrement())
  name     String    @db.VarChar(20)
  // 一个数学老师对应多个学生
  students Student[]
}

// 学生
model Student {
  id            Int         @id @default(autoincrement())
  name          String      @unique
  // 先定义一个关联 mathTeacherId
  mathTeacherId Int
  // 建立外键
  mathTeacher   MathTeacher @relation(fields: [mathTeacherId], references: [id])
}
```

## prisma CRUD api

==========================================================

## 犯错点

- 手动改数据库配置文件，需要修改多个地方 `env` 和 `provider`
- `@prisma/client`必须在同层级下才可以生成，测试 monorepo 形式，好像报错

## 疑问

- 创建外键时，如何设置关联操作，**一起删除，一个更新，删除之后 set null** 等
- 表到底是手动创建的，还是可视化工具创建的，一般一个系统包含几十张表？创建表之后，pull 一下？那么在设置关联表的字段是什么？

## prisma 命令

- `npx prisma -h`: 用于查看所有 prisma 命令。

::: tip

- init：创建 schema 文件
- generate： 根据 shcema 文件生成 client 代码
- db：同步数据库和 schema
- migrate：生成数据表结构更新的 sql 文件
- studio：用于 CRUD 的图形化界面
- validate：检查 schema 文件的语法错误
- format：格式化 schema 文件
- version：版本信息

:::

#### init

```bash
# 初始化：会生成 prisma/shcema.prisma 和 .env 文件
prisma init

prisma init --datasource-provider mysql # 指定连接的数据库

prisma init --url mysql://xxx:yyy@localhost:3306/prisma_test # 连接数据库信息
```

#### db

```bash
prisma db pull # 数据库拉取生成 model
prisma db push # 根据 model 生成数据库（数据库里面的表都会进行删除，在执行该命令之前，一定要先 pull 一下）
prisma db seed # 执行脚本插入初始数据到数据库（少用）
prisma db execute # 执行 SQL 语句

# --file 执行 SQL 文件，-- shcama 读取数据库配置信息
prisma db execute --file prisma/test.sql --schema prisma/schema.prisma
```

```json [package.json]
{
  "prisma": {
    "seed": "npx ts-node prisma/seed.ts"
  }
}
```

`npx prisma db seed` 执行脚本插入初始数据到数据库（读取 package.json 配置的 seed 字段）

#### migrate

当 pull 或者 push 之后，后续如果存在表结构的变化，就需要重新迁移一下，保持信息一致。

常用两个：

1. `prisma migrate dev`：会根据 schema 的变化生成 sql 文件，并执行这个 sql，还会生成 client 代码，也会执行 seed 指令（如果在配置 package.json 中配置了 seed，则会执行，测试好像也不会执行）

```bash
prisma migrate dev --name init # 生成 sql 文件, 文件格式：年月日时分秒_名字
```

> 一般执行这一步，会提示是否重置数据库（看自己操作， 是否有太大的影响）

2. `npx prisma migrate reset`: 手动重置, 先提示是否重置数据库，选择是之后，再会执行 migrate dev 后续操作。

### generator

`prisma generator`: 生成 client 代码（但是一般都是通过 migrate dev 来生成 client 代码， 一步到位）
。
默认生成的路径在：**node_modules/@prisma/client**，但是可以进行修改，指定 output 属性来进行修改。

```prisma
generator client {
  provider = "prisma-client-js",
  output   = "../generated/client"
}
```

其实也可以安装一些社区的三方包，生成可视化文档，比如：

- prisma-docs-generator：生成 docs 文档，通过 http-server 来进行启动，进行 CRUD 非常有用
- prisma-json-schema-generator：生成 JSON

```ts
generator docs {
  provider = "node node_modules/prisma-docs-generator"
  output   = "../generated/docs"
}

generator json {
  provider = "prisma-json-schema-generator"
  output   = "../generated/json"
}
```

了解一下即可

### vaildate

`prisma vaildate`: 用于检查 schema 文件是否有语法错误，一般通过插件就可以解决了。

### format

`prisma format`: 格式化

## prisma 语法

在上面的介绍中，已经大致了解了 prisma 指令的用法。无论是什么指令，都是对 `prisma/schema.prisma` 文件进行操作。

接下来就熟悉 schema 文件里面的语法。

```prisma [prisma/schema.prisma]
// 数据库连接信息配置
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

```prisma [prisma/schema.prisma]
// @prisma/client 代码配置信息
generator client {
  provider = "prisma-client-js"
}

// 数据库连接信息
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### model 语法

基本语法

```ts
enum Status {
  AAA
  BBB
  CCC
}

model Copyer {
  // id int类型 自动增长
  id         Int      @id @default(autoincrement())
  // name varchar(50) 长度，唯一性
  name       String   @unique @db.VarChar(50)
  // age 数字类型，重新命名：new_age
  age        Int?     @map("new_age")
  // flag 布尔类型 默认值为 true
  flag       Boolean  @default(true)
  // createTime 时间格式类型 默认值为当前创建时间 now()
  createTime DateTime @default(now())
  // updateTime 时间格式类型，跟随更新 @upadteAt
  updateTime DateTime @updatedAt
  // 枚举
  status     Status   @default(AAA)

  // 表名copyer改名为new_copyer
  @@map("new_copyer")
}
```

一对多

```ts
// 数学老师
model MathTeacher {
  id       Int       @id @default(autoincrement())
  name     String    @db.VarChar(20)
  // 一个数学老师对应多个学生
  students Student[]
}

// 学生
model Student {
  id            Int         @id @default(autoincrement())
  name          String      @unique
  // 先定义一个关联 mathTeacherId
  mathTeacherId Int
  // 建立外键
  mathTeacher   MathTeacher @relation(fields: [mathTeacherId], references: [id])
}
```

多对多，建立中间表

```ts
model Teacher1 {
  id                Int                 @id @default(autoincrement())
  name              String              @unique
  teacher_student_1 teacher_student_1[]
}

model Student1 {
  id                Int                 @id @default(autoincrement())
  name              String              @unique
  teacher_student_1 teacher_student_1[]
}

model teacher_student_1 {
  teacherId Int
  teacher   Teacher1 @relation(fields: [teacherId], references: [id])

  studentId Int
  student   Student1 @relation(fields: [studentId], references: [id])

  // id Int @id @default(autoincrement())
  @@id([studentId, teacherId])
}

```

针对一对一，就是在一个多上面，加上一个 `@unique` 即可。

上面是 prisma 定义的示例，下面就看看具体的注意事项。

- 只能使用 `""` 双引号
- 注意编写顺序，安装了插件，会自动进行格式化
- String 默认是 VARCHAR(191), 如果想要修改类型，通过 @db.xxx()
- Int 默认值 INTEGER，如果想要修改类型，通过 @db.xxx()
- 针对外键定义，先定义一个字段（xxxId）, 然后再创建外键关联
- 熟悉 @relation 的语法 `@relation(fields: [yyyId], references: [id]))`

```ts
// 在 xxx 里面关联 yyy
model xxx {
  // 外键 id
  yyyId Int
  // 这里加上 s, 因为对应的多条数据，但是如果是一对一，也可以不用加
  // 这个字段还是比较重要的，因为后面再联合保存数据时，还是通过这个字段来保存数据的
  yyys yyy @relation(fields: [yyyId], references: [id])
}
```

- 熟悉语法，`@id、@default、@map、@relation、@unique、@updatedAt、@@index、@@map、@db.xxx` 等等

### CRUD 操作

格式：`prisma + 表名 + 方法`

#### 创建数据

- `createMany`: 创建多条
- `create`: 创建单条

```ts
// 创建多条
const user = await prisma.user.createMany({
  data: [
    {
      name: "copyer1",
      age: 12,
    },
    {
      name: "copyer2",
      age: 22,
    },
    {
      name: "copyer3",
      age: 23,
    },
  ],
});

// 创建单条
const user = await prisma.user.create({
  data: {
    name: "copyer4",
    age: 44,
  },
});
```

#### 查询数据

- `findUnique`：是用来查找唯一的记录的，可以根据主键或者有唯一索引（unique）的列（也就是说 where 语句的查询条件是唯一的）。
- `findUniqueOrThrow`：与 findUnique 使用基本一致，就是没有找到结果，处理的结果不一样，findUnique 返回 null，而 findUniqueOrThrow 会抛出异常
- `findMany`：查询多条数据
- `findFirst`：查询第一条数据（也就是 findMany 的第一条数据）

```ts
// findUnique
const user = await prisma.user.findUnique({
  where: {
    id: 1,
  },
  // 指定返回的字段
  select: {
    id: true,
    name: true,
  },
});

// findMany
const user = await prisma.user.findMany({
  where: {
    age: 12,
  },
  // 如果是多条数据，就可以排序处理
  orderBy: {
    name: "desc",
  },
  /**
   * 数据过滤：从第 2 条开始，获取 3 条数据
   * 但是感觉不是分页处理，是查询出所有数据，然后再根据条件截取数据
   */
  skip: 2,
  take: 3,
});

// findFirst
const user = await prisma.user.findFirst({
  where: {
    // 模糊搜索
    age: {
      // 包含枚举
      in: [],
      // 不包含枚举
      notIn: [],
      // 不等于
      not: "",
      // 包含
      contains: "",
      // 以什么开始
      startsWith: "",
      // 以什么结尾
      endsWith: "",
      // greater than: 大于
      gt: "",
      // greater than equals: 大于或等于
      gte: "",
      // less than: 小于
      lt: "",
      // less than equals: 小于或等于
      lte: "",
      // 等于
      equals: "",
    },
  },
});
```

::: tip 注意：上面的条件都是可以进行组合
:::

#### 更新数据

- `update`：更新单条数据（筛选条件要确定唯一性，id, unique）
- `udpateMany`：更新多条数据（筛选条件是模糊搜索，再更新）
- `upsert`：update 和 insert 的组合，当传入的 id 有对应记录的时候，会更新，否则，会创建记录

```ts
// update
const user = await prisma.user.update({
  // 更新条件
  where: {
    id: 1, // 唯一性
  },
  // 更新数据
  data: { name: "james" },
});

// updateMany
const user = await prisma.user.updateMany({
  where: {
    // name 包含 copyer 的数据，age 全部改为 34
    name: {
      contains: "copyer",
    },
  },
  data: { age: 34 },
});

// upsert: 有id更新，没有id新增
const user = await prisma.user.upsert({
  where: { id: 11 },
  update: { name: "copyer11", age: 12 },
  create: {
    id: 11,
    name: "copyer22",
    age: 99,
  },
});
```

#### 删除数据

- `delete`：删除单条数据
- `deleteMany`：删除多条数据

```ts
await prisma.user.delete({
  where: { id: 1 },
});

await prisma.user.deleteMany({
  where: {
    id: {
      in: [11, 2],
    },
  },
});
```

#### 其他

- `count`: 统计数量，用法跟 findMany 一样，只不过返回的数量
- `aggregate`：统计相关，指定 `_count`、`_avg`、`_sum`、`_min`、`_max`
- `groupBy`：分组

```ts
// aggregate
const res = await prisma.user.aggregate({
  where: {
    name: {
      contains: "copyer",
    },
  },
  _count: {
    _all: true,
  },
  _max: {
    age: true,
  },
  _min: {
    age: true,
  },
  _avg: {
    age: true,
  },
});

/**
 * 返回值的格式
 * {
 *   _count: { _all: 3 },
 *   _max: { age: 23 },
 *   _min: { age: 12 },
 *   _avg: { age: 17 }
 * }
 */

// groupBy: 按照 email 分组，过滤出平均年龄大于 2 的分组，计算年龄总和返回
const res = await prisma.user.groupBy({
  by: ["email"],
  _count: {
    _all: true,
  },
  _sum: {
    age: true,
  },
  // 过滤条件
  having: {
    age: {
      _avg: {
        gt: 2,
      },
    },
  },
});
console.log(res);
```

### 多表的 CRUD

#### 新增

采用 `create` 方法

```ts {5-17}
await prisma.department.create({
  data: {
    name: "技术部",
    // employees 是在创建表时定义的字段
    employees: {
      // 联表新增单条
      create: [
        {
          name: "小张",
          phone: "13333333333",
        },
        {
          name: "小李",
          phone: "13222222222",
        },
      ],
    },
  },
});
```

换种形式写法，采用 `createMany` 的方式

```ts{4-17}
await prisma.department.create({
  data: {
    name: "技术部",
    employees: {
      createMany: {
        data: [
          {
            name: "小王",
            phone: "13333333333",
          },
          {
            name: "小周",
            phone: "13222222222",
          },
        ],
      },
    },
  },
});
```

#### 查询

通过 `include` 关键词来进行查询

```ts
const res1 = await prisma.department.findUnique({
  where: {
    id: 1,
  },
  // 包含 employees 信息的全部查询出来，类似与左连接
  include: {
    employees: true,
  },
});

const res2 = await prisma.department.findUnique({
  where: {
    id: 1,
  },
  // 根据条件查询，并且指定字段返回
  include: {
    employees: {
      where: {
        name: "小张",
      },
      select: {
        name: true,
      },
    },
  },
});
```

#### 更新

采用 update 的方式

```ts
// 更新 department 的时候，并插入了一条 employee 的记录
const res1 = await prisma.department.update({
  where: {
    id: 1,
  },
  data: {
    name: "销售部",
    employees: {
      create: [
        {
          name: "小刘",
          phone: "13266666666",
        },
      ],
    },
  },
});
```

更新部门表的同时，也可以改变关联：update 的时候使用 `connect`和它关联

```ts
const res1 = await prisma.department.update({
  where: {
    id: 1,
  },
  data: {
    name: "销售部",
    employees: {
      connect: [
        {
          // 原来id为 4 的员工关联着部门id为 2 的数据，
          // connect 在更新的时候，就可以改变关联，变成部门id为 1 的数据
          id: 4,
        },
      ],
    },
  },
});
console.log(res1);
```

`connectOrCreate`：没有就新增，有就更新。但是我感觉这种写法，基本只有更新，因为新增的时候，根本就拿不到 id

```ts
const res1 = await prisma.department.update({
  where: {
    id: 1,
  },
  data: {
    name: "销售部",
    employees: {
      // 当 id 为 6 的时候，没有数据，就新增，有数据就更新
      connectOrCreate: {
        where: {
          id: 6,
        },
        create: {
          id: 6,
          name: "小张",
          phone: "13256665555",
        },
      },
    },
  },
});
```

#### 删除

`deleteMany` 方法进行删除

```ts
// 删除部门 id 为 1 的所有员工
await prisma.employee.deleteMany({
  where: {
    // 关联删除
    department: {
      id: 1,
    },
  },
});
```

### prisma 执行 sql

当一些列方法不满足时，就自己写 sql 执行，其格式`prisma.$queryRaw`

```ts
await prisma.$queryRaw`select * from Department`;
```
