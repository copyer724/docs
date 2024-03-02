# SQL 语句

`SQL`： Structured Query Language，称为结构化查询语句，简称 SQL。

**SQL 语句的常用规范**：

1. 关键词使用大写。比如：CREATE、 TABLE 等（当然**小写**也行）
2. 一条语句需要以分号结尾。
3. 如果遇到关键词作为表名或者字段名称，可以使用``包裹。

**SQL 分类**：

1. DDL（Data Definition Language）: 数据定义语言。
   可以通过 DDL 语句对数据库或表进行：创建，删除，修改等操作。
2. DML （Data Manipulation Language）: 数据语法操作。
   可以通过 DML 语句对表进行：添加，删除，修改等操作。
3. DQL（Data Query Language）：数据查询语句。
   可以通过 DQL 从数据库中查询。
4. DCL（Data Control Language）： 数据控制语句。
   对数据库，表格的权限进行相关的访问控制操作。

::: tip 注意
为了好记，下面的 SQL 语句都是小写，但是推荐大写
:::

## SQL 类型

<img src="/public/images/servers/sql/type.png">

## 表约束

- `primary key`: 主键
  - 主键是表中唯一的索引
  - 必须是 not null; 如果没有设置，mysql 也会自动设置；
  - 联合主键，多个字段合成的主键
  - 尽量不要使用业务主键
- `unique`: 唯一；除了主键以外，针对某些字段，也是唯一的。
- `not null`: 字段不能为空
- `default`: 默认值
- `auto_increment`: 自动增长；
- `foreign key`: 外键，与其他表的字段关联

```sql
create table if not exists yyy(
  id int primary key,
  `name` varchar(50) unique not null,
  age int default 18,
  num int auto_increment,
  homeId int, -- 外键
  foreign key (homeId) references home(id) -- 关联 home 表的 id
)
```

## DDL(数据定义语言)

::: code-group

```sql [库操作]
-- 查看所有数据库
show databases;

-- 使用数据库 xxx
use xxx;

-- 查看选择的数据库
select databases();

-- 创建数据库
create database if not exists xxx; -- 先判断 xxx 库是否存在，不存在则创建
create database xxx; -- 若存在，会报错；

-- 删除数据库
drop database if exists xxx;
drop database xxx; -- 数据库不存在，会报错
```

```sql [表操作]
use xxx; -- 使用 xxx 库，下面的表操作，都在 xxx 库下

-- 查看库中所有的表
show tables;

-- 创建一张表
create table if not exists yyy(
  name varchar(10),
  age int
);

-- 查看表的结构
desc yyy; -- 上面定义的描述信息

-- 删除 yyy 表
drop table if exists yyy;

-- 修改 yyy 表
alter table yyy rename to users; -- 修改表名 yyy 变成 users
alter table yyy add height int; -- 添加 height 字段，为 int 类型；
alter table yyy change height newHeight int; -- height 改为 newHeight, 类型也可以重新定义
alter table yyy modify height bigint; -- 类型 int 变为 bigint
alter table yyy drop height; -- 删除 height 字段
```

:::

## DQL(数据查询语句)

查询语句公式：

```sql
select *
       from table
       where xxx
       order by xxx
       limit xxx
       group by xxx
       having xxx
```

### 取别名 as

```sql
-- 查询所有数据字段
select * from yyy;
-- 查询 name age 字段, 以及取别名
select name, age as c_age from yyy;
-- 取别名的意义：在于多表查询，防止字段相同

```

### 比较运算符

```sql

-- where 比较运算符 ( >  <  =  != )

select * from users where age > 20; -- 年龄大于 20
select * from users where age != 20; --年龄不等于 20

```

### 逻辑运算符

```sql

-- name 为 thinker，且 age 大于 10
select * from users where name = 'thinker' and age > 10;
select * from users where name = 'thinker' && age > 10;

-- name 为 thinker，或者 age 大于 10
select * from users where name = 'thinker' or age > 10;
select * from users where name = 'thinker' || age > 10;

-- age 在 10 到 20 岁间的
select * from users where age between 10 and 20;
select * from users where age >=10 && age <= 20;

-- age 为 10岁 的，或者 20 岁的
select * from users where age in (10, 20);
select * from users where age age = 10 or age = 20;

```

### 模糊搜索 like

```sql
select * from users where name like 't%';  -- t...
select * from users where name like '%t%'; -- ...t...
select * from users where name like '_t%'; -- .t... 第二个字符
```

### 排序 order by

- 升序 asc
- 降序 desc

```sql
select * from  users order by age asc; -- 年龄升序
```

### 限制分页 limit

- limit 数据条数 offset 偏移量 (推荐)
- limit 偏移量，数据条数 （不推荐）

`offset 偏移量`

```sql
select * from users limit 30 offset 10;

select * from users limit 10, 30;
```

```js
// 前端格式
const pages = {
  current: 3,
  pageSize: 10,
};
// 后端查询
const offsetNum = (page.current - 1) * pages.pageSize;
const limitNum = pages.pageSize;
// sql
const sql = `select * from users limit ${limitNum} offset ${offsetNum}`;
```

### 聚合函数

::: tip
`聚合函数`： 先收集到一起，然后对收集的结果进行操作。（看成一组）
:::

- avg: 平均值
- max: 最大值
- min: 最小值
- sum: 求和
- count: 计算个数（count 的参数必须是必填的）

```sql
-- 平均值
select name, avg(age) as age from users;

-- 计算人数
select count(*) as count from users;

-- 最大值
select max(age) as maxAge from users;

-- 求和
select sum(age) as sumAge from users;
```

### 分组 group by

::: tip
`聚合函数`看成一组；有时需要进行分组，然后进行操作。

`使用建议`：group by 一定要和聚合函数使用，不然分组没有意义。
:::

```sql
-- 统计男女个数
select sex, count(*) as num from users group by sex;
```

### 分组筛选条件 having

::: tip
在进行分组的时候，有时也需要过滤条件。

但是 `group by` 与 `where` 不能一起使用，语法报错。取而代之的是 `having`。
:::

```sql
-- 根据 sex 性别进行分组，然后筛选出 count 大于 2
select count(*) as count, sex from users group by sex having count > 2;
```

### 多表

#### 外键添加

针对新建的表，创建外键。

```sql
create table if not exists users(
  id int primary key,
  name varchar(255) not null,
  teamId varchar(255) not null,
  foreign key (teamId) references team(id)
);
```

针对已有的表，创建外键

```sql
alter table users add teamId int;
alter table users add foreign key (teamId) references team(id);
```

#### 外键删除（更新）

产生了关联，就不能直接删除或者更新，否则会对其他的表产生影响。

<img src="/public/images/servers/sql/delete.png">

**删除外键**

```sql
show create table users; -- 查看外键名称
alter table users grop foreign key users_ibfk_1;
```

如果存在多个外键：

- users_ibfk_1
- users_ibfk_2
- ...

**重新绑定外键**

```sql
alter table users add foreign key (teamId) references team(id)
                                           on delete cascade
                                           on update cascade;
```

#### 多表查询

多张表一起查询，一定存在某种联系：**外键**。

```sql
select * from users, team;
```

这样查询会产生大量的无用数据，这里采用的组合形式是：**笛卡尔积**。

#### 表连接

- 左连接（`left join`）: 常用
- 右连接（`right join`）: 不常用
- 内连接（`[cross/inner] join`）: 常用
- 全连接（mysql 不支持全连接，需要 union）： 不常用

这里的`左右` 想说的是：**以哪张表为主，然后展示该张表的所有数据**。

`左表 [left/right] join 右表`

**左连接**

```sql
-- 左连接 LEFT JOIN. ON 连接条件
select * from users left join team
                    on users.teamId = team.id;

-- 筛选出 team_id 不是 null 的 （因为以左表为主，如果不存在外键，就为null, 就没有结合右表的任何信息，无用的数据，删除掉)
select * from users left join team
                           ON users.teamId = team.id
													 WHERE teamId IS NOT NULL;
```

**内连接**

不是以哪张表为主，而是以条件进行满足搜集。

```sql
select * from users join team on users.teamId = team.id;
```

::: tip
针对多对多的查询出现时，就是多次采用连接即可。
:::
