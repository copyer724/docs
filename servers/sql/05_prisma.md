# prisma

## 介绍

Prisma 创造了一种 DSL（Domain Specific Language，领域特定语言）。

具体流程：把表映射成了 DSL 里的 model，然后编译这个 DSL 会生成 prismaClient 的代码，之后就可以调用它的 find、delete、create 等 api 来做 CRUD 了。

## 犯错点

- 手动改数据库配置文件，需要修改多个地方 `env` 和 `provider`
- `@prisma/client`必须在同层级下才可以生成，测试 monorepo 形式，好像报错

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
prisma db push # 根据 model 生成数据库
prisma db seed # 执行脚本插入初始数据到数据库（少用）
prisma db execute # 执行 SQL 语句

# --file 执行 SQL 文件，-- shcama 读取数据库配置信息
prisma db execute --file prisma/test.sql --schema prisma/schema.prisma
```

```json [pageage.json]
{
  "prisma": {
    "seed": "npx ts-node prisma/seed.ts"
  }
}
```

`npx prisma db seed` 执行脚本插入初始数据到数据库（读取 package.json 配置的 seed 字段）

## migrate

当 pull 或者 push 之后，后续如果存在表结构的变化，就需要重新迁移一下，保持信息一致。

常用两个：

1. `prisma migrate dev`：会根据 schema 的变化生成 sql 文件，并执行这个 sql，还会生成 client 代码，也会执行 seed 指令（如果在配置 package.json 中配置了 seed，则会执行）

```bash
prisma migrate dev --name init # 生成 sql 文件, 文件格式：年月日时分秒_名字
```
