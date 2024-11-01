# docker

## 理解虚拟机

虚拟机就是通过软件来模拟计算机系统，包括硬件（完整硬件系统功能）

## 宿主机

就是指我们本地电脑去连接，操作

## 镜像与容器

镜像看成一个类，容器就是运行的实例。

Docker 利用容器来运行应用，容器可以被启动、停止、删除，每个容器（实例不相互影响）都是互相隔离的、保证安全的平台；

## docker 仓库

docker 仓库是集中存放镜像文件的场所，类似 git 的代码仓库。

- `docker pull mysql` 下载 mysql 镜像，是不是和 git 类似

## docker 指令

- `docker images` 查看已下载的镜像列表

- `docker run -d -p 13306:3306 --name mysql -v /opt/mydata:/var/lib/mysql -e mysql:latest` 根据镜像创建并启动容器 `p: port` `--name: mysql 取名` `v: volumes` `e: environment 环境变量`，并返回一个 hash 值

- `docker start mysql` 启动已有的容器

- `docker ps` 查看正在运行的容器

## docker 镜像启动

<img src="/images/servers/tools/docker.png" />

上面的数据卷不对（方向反了），应该是把宿主机的目录映射到容器中的目录

## 构建镜像

根据 dockerfile 或者 Dockerfile 指令构建一个镜像

```shell
FROM node:latest

WORKDIR /app

COPY . .

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install -g http-server

EXPOSE 9090

CMD ["http-server", "-p", "9090"]
```

执行指令: `docker build . -t copyer:v1`

- `. 所有文件` `-t target` `镜像名:标签`

:::danger 目前尚未成功
:::

在上面构建的时候 `.` 就是包含了所有的文件，但是针对 docker 构建来说，有一些文件根本都不需要，反而言之，就是镜像越小性能越好。

所以在构建之前，需要先过滤一些问题，创建 `.dockerignore`

```shell
*.md
!README.md
node_modules/
[a-c].txt
.git/
.DS_Store
.vscode/
.dockerignore
.eslintignore
.eslintrc
.prettierrc
.prettierignore
```

类似上面格式的文件，都先排除，再继续构建，发送给 docker daemon。

**小结**

docker build 时，会先解析 .dockerignore，把该忽略的文件忽略掉，然后把剩余文件打包发送给 docker daemon 作为上下文来构建产生镜像。

## docker daemon

dockerfile 是在哪里 build 的，在命令行工具里，还是在 docker 守护进程呢？

肯定是守护进程： `docker daemon`

<img src="/images/servers/tools/docker.png" />

## docker 问题

问题一：

ERROR: failed to solve: DeadlineExceeded: DeadlineExceeded: DeadlineExceeded: node:18: failed to resolve source metadata for docker.io/library/node:18: failed to authorize: DeadlineExceeded: failed to fetch anonymous token: Get "https://auth.docker.io/token?scope=repository%3Alibrary%2Fnode%3Apull&service=registry.docker.io"
