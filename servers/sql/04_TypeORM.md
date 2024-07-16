# TypeORM

`ORM` 是 Object Relational Mapping，对象关系映射。也就是说把关系型数据库的表映射成面向对象的 class，表的字段映射成对象的属性映射，表与表的关联映射成属性的关联。

`TypeORM` 是一个 ORM 框架，它提供了一套 TypeScript/JavaScript 的对象关系映射 API，用于将关系型数据库映射到对象上。

## 创建项目及配置解析

创建一个 TypeORM 项目

```bash
npx typeorm@latest init --name typeorm-all-feature --database mysql

# 创建 IdCard: entity
npx typeorm entity:create src/entity/IdCard
```

数据库连接配置

```ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
  /** 数据库类型:  mysql,oracle 等 */
  type: "mysql",
  /** 数据库主机 */
  host: "localhost",
  /** 数据库端口 */
  port: 3306,
  /** 用户名 */
  username: "root",
  /** 密码  */
  password: "copyer123",
  /** 数据库名 database | schema */
  database: "copyer_db",
  /** 根据 entities 是否自动创建表，没有就创建，有就不创建，生产环境要关掉  */
  synchronize: true,
  /** 是否显示 sql 语句 */
  logging: false,
  /** 实体 -> 表名 */
  entities: [User],
  /** 修改 sql 结构，基本用不上 */
  migrations: [],
  /** Entity 生命周期的订阅者，比如 insert、update、remove 前后加上一些逻辑 */
  subscribers: [],
  /** 连接池数量 */
  poolSize: 10,
  /** 连接数据库的驱动包 */
  connectorPackage: "mysql2",
  /** 传递给驱动包的额外配置 */
  extra: {
    authPlugins: "sha256_password",
  },
});
```

创建表的依据就是 Entity，那么就来学习一下其中的语法吧

```ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

/**
 * 使用 @Entity() 来指定它是一个 entity
 * 如果指定 name 属性，则表的名字则是 name 属性，如果没有指定，则是类名的小写
 */
@Entity({
  name: "copyer_user",
})
export class User {
  /**
   * 使用 @PrimaryGeneratedColumn() 来指定它是一个主键
   */
  @PrimaryGeneratedColumn({
    comment: "id",
  })
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;
}
```

其中 `@PrimaryGeneratedColumn` 是定义主键的，`@Column` 是定义字段的，接受一个 `ColumnOptions` 类型参数

```ts
export interface ColumnCommonOptions {
  /**
   * 设置类型
   */
  type?: ColumnType;
  /**
   * Indicates if column is always selected by QueryBuilder and find operations.
   * Default value is "true".
   */
  select?: boolean;
  /**
   * 指定该字段的名称
   */
  name?: string;
  /**
   * 指定该字段为主键
   */
  primary?: boolean;
  /**
   * 该列是否自增（必须为主键）
   */
  generated?: boolean | "increment" | "uuid" | "rowid" | "identity";
  /**
   * 设置 UNIQUE 唯一索引.
   */
  unique?: boolean;
  /**
   * 设置 NOT NULL 约束
   */
  nullable?: boolean;
  /**
   * 设置默认值，注意默认值不支持 mysql 的 json 类型
   */
  default?: any;
  /**
   * ON UPDATE trigger. Works only for MySQL.
   */
  onUpdate?: string;
  /**
   * 注释
   */
  comment?: string;
  /**
   * Indicates if this column is an array.
   * Can be simply set to true or array length can be specified.
   * Supported only by postgres.
   */
  array?: boolean;
  /**
   * Specifies a value transformer that is to be used to (un)marshal
   * this column when reading or writing to the database.
   */
  transformer?: ValueTransformer | ValueTransformer[];
}
```

## 语法和函数

TypeORM 提供了非常多的函数。

<img src="/images/servers/sql/typeora.png" />

具体使用方式

```ts
AppDataSource.initialize().then(async () => {
  await AppDataSource.manager.xxx();
});
```

在`AppDataSource.initialize()`中初始化配置成功之后，就可以使用`AppDataSource.manager`中提供的各种各种函数了。

看看函数的具体使用

`save()`： 插入数据，如果存在 id 的话，就是更新数据。然后无论是插入数据，还是更新数据，都有着各自的方法：`insert()` 和 `update()`。那么与 save 方法的区别是什么呢？save 方法会选执行 `select` 语法，然后再判断是新增数据还是更新数据。

```ts
AppDataSource.initialize().then(async () => {
  const user = new User();
  user.firstName = "Timber";
  user.lastName = "Saw";
  user.age = 25;
  // 1、save返回值：新增的数据对象
  const res1 = await AppDataSource.manager.save(user);

  // 2、insert返回值：InsertResult(无用的信息)
  const res2 = await AppDataSource.manager.insert(User, user);

  // 3、update返回值：UpdateResult(无用的信息)
  const res3 = await AppDataSource.manager.update(User, 1, {
    firstName: "copyer",
    lastName: "Saw",
    age: 25,
  });

  // 4、批量新增，返回值，插入的数据对象
  const res4 = await AppDataSource.manager.save(User, [
    { firstName: "copyer", lastName: "copyer", age: 25 },
    { firstName: "copyer1", lastName: "copyer1", age: 26 },
    { firstName: "copyer21", lastName: "copyer2", age: 27 },
  ]);

  // 5、批量更新，还是使用 save 方法，每条数据加上 id 属性
});
```

`delete()`: 删除数据。删除方法，也有 `remove()` 方法。remove 方法接受 entity 对象作为参数，而 delete 方法接受 `id` 作为参数。

```ts
AppDataSource.initialize().then(async () => {
  // 1、单个删除： DeleteResult（无用信息）
  const res = await AppDataSource.manager.delete(User, 6);

  // 2、批量删除: DeleteResult（无用信息）
  const res2 = await AppDataSource.manager.delete(User, [6, 7]);

  // 3、remove 方法删除，返回 entity 对象（无用信息）
  const user = new User();
  user.id = 8;
  const res3 = await AppDataSource.manager.remove(User, user);
});
```

查询函数方法就比较多了，但是使用方式大致是一样的，第一个参数接受 Entity 的类型，（可选）第二个参数接受配置对象。

- `find()`：查询所有数据，也接收配置对象

```ts
AppDataSource.initialize().then(async () => {
  /** 1、查询所有的数据： User[] */
  const res = await AppDataSource.manager.find(User);

  // 2、支持筛选条件： User[]
  const res1 = await AppDataSource.manager.find(User, {
    where: {
      age: 25,
    },
  });

  // 3、根据条件查询，并返回指定的字段： User[]
  const res2 = await AppDataSource.manager.find(User, {
    where: {
      age: 25,
    },
    select: ["id", "firstName", "lastName"],
    order: {
      id: "DESC",
    },
  });
});
```

- `findBy()`: 查找多条记录，第二个参数直接指定 where 条件，更简便一点
- `findAndCount()`: 查询所有数据并返回数据的总数，第二个参数的配置对象跟 find 函数是一样的。
- `findAndCountBy()`: 第二个参数就是 where 的过滤条件
- `findOne()`: 查询一条数据，第二个参数的配置对象跟 find 函数是一样的。
- `findOneBy()`:查找单条记录，第二个参数直接指定 where 条件，更简便一点
- `findOneOrFail()`: 没有找到，抛出错误
- `findOneByOrFail()`: 没有找到，抛出错误，第二个参数直接指定 where 条件，更简便一点

```ts
import { In } from "typeorm";
AppDataSource.initialize().then(async () => {
  // 1、返回值：[ User[], count ]
  const [users, count] = await AppDataSource.manager.findAndCount(User);

  // 2、返回值：[ User[], count ], 第二个参数就是 where 语句的筛选
  const [users, count] = await AppDataSource.manager.findAndCountBy(User, {
    age: In([25, 26]),
  });

  // 3、返回值：user, 返回满足条件的第一个
  const user = await AppDataSource.manager.findOne(User, {
    where: {
      age: 25,
    },
  });

  // 4、返回值：user, 返回满足条件的第一个
  const user = await AppDataSource.manager.findOneBy(User, {
    age: 25,
  });
});
```

- `query()`： 直接执行原生的 sql 语句
- `createQueryBuilder()`: 针对简单的查询，可以使用函数以及 query 的方式执行 sql 语法，但是针对复杂的连表查询，或者复杂的 sql 语句，得使用 queryBuilder 的方式（后续学习）。
- `transaction()`: 用于添加事务
- `getRepository()`: 用于拿取 Entity 类，再进行 CRUD，就不用每次都传递 Entity 类了。

```ts
AppDataSource.initialize().then(async () => {
  // 1、直接执行 sql 语句
  const res = await AppDataSource.manager.query("select * from user");

  // 2、添加事务
  await AppDataSource.manager.transaction(async (manager) => {
    await manager.save(User, {
      firstName: "copyer",
      lastName: "copyer",
      age: 25,
    });
  });

  // 3、拿取 User Entity 类，再进行查询
  AppDataSource.manager.getRepository(User).find();
});
```

## 一对一的关联和映射

```ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class IdCard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: "身份证号",
    length: 50,
  })
  cardNo: string;

  @JoinColumn()
  @OneToOne(() => User)
  user: User;
}
```

- `@JoinColumn()`：加入外键，可以指定 name 属性设置字段名称，默认为 entity_id
- `@OneToOne()`：指定一对一的映射，引用 User 表中的 id
