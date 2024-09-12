# Nest 操作数据库

### 连接方式

- mysql2
- typeora
- prisma

### mysql2

- mysql2: 操作 sql 语句
  - createConnection： 创建数据库
  - createPool：创建连接池

### typeorm

`ORM` 是 `Object Relational Mapping`，对象关系映射，让 ORM 框架自动执行 sql 去同步数据库

也就是说把**关系型数据库的表映射成面向对象的 class**，表的字段映射成对象的属性映射，表与表的关联映射成属性的关联。

```bash
# 使用 typeorm 初始化项目
npx typeorm@latest init --name typeorm-mysql-test --database mysql
```

```ts
export const AppDataSource = new DataSource({
  /** 连接数据库的类型 mysql oracle 等 */
  type: "mysql",
  /** 数据库主机名 */
  host: "localhost",
  /** 数据库端口 */
  port: 3306,
  /** 用户名 */
  username: "root",
  /** 密码  */
  password: "guang",
  /** 数据库名 */
  database: "practice",
  /** 同步表（存在则不会创建表，没有就会创建） */
  synchronize: true,
  /** 终端显示打印日志  */
  logging: true,
  /** 指定有哪些和数据库的表对应的 Entity */
  entities: [User],
  /** 修改数据库表结构 */
  migrations: [],
  /** 一些 Entity 生命周期的订阅者，比如 insert、update、remove 前后，可以加入一些逻辑 */
  subscribers: [],
  /** 数据库连接池中连接的最大数量 */
  poolSize: 10,
  /** 驱动包（需要安装 mysql2） */
  connectorPackage: "mysql2",
  /** 额外发送给驱动包的一些选项 */
  extra: {
    authPlugin: "sha256_password",
  },
});
```

### prisma

```bash
npx prisma init
```
