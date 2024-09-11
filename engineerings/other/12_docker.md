# docker

### 为什么需要 docker

解决问题：我在我的电脑可以运行代码，为什么他的电脑不能？

如何解决：把源代码的打包文件和环境一起打包成**镜像**，通过**容器**来进行运行。

### 概念

`images` 是本地的所有镜像，`containers` 是镜像跑起来的容器。

<img src="/images/engineerings/other/docker01.png" />

::: tip 简单理解，images 看成类，containers 看成实例。
:::

搜索镜像

<img src="/images/engineerings/other/docker02.png" />

### 容器运行

<img src="/images/engineerings/other/docker03.png" style="zoom: 50%" />

- 如果容器不写，会随机生成一个容器名称。
- 端口映射：访问宿主机的一个端口（3000），就能映射到容器的端口（80）。
- 数据卷：把宿主机的一个目录映射到容器，共享一个目录（这样每次启动容器，就可以把宿主机挂载到容器中，为了**保存数据**）。

点击 run。

上面的步骤也等价于：

```bash
docker run --name copyer-test -p 3000:80 -v /tmp/aaa:/usr/share/nginx/html -e KEY1=VALUE1 -d nginx:latest
```

`--name`: 容器名称

`-p`: 端口映射

`-v`: 数据卷目录映射（可以加修饰词： `:ro` 代表 readonly, `:rw` 代表 readwrite 可读可写）

`-e`: 环境变量

`-d`: 后台运行（镜像：版本）

docker run 执行之后，会返回一个容器的 hash（下面图片有所展示）。1

<img src="/images/engineerings/other/docker04.png" style="zoom: 50%" />

- logs: 容器启动日志
- inspect: 查看容器配置信息，详情
- bind mounts: 数据卷目录映射
- files: 容器目录内容

最后通过 http://localhost:3000/index.html（数据卷下面的内容都可以访问） 就能进行访问了。

### docker 命令

- docker search: 搜索镜像（例如: docker search nginx）
- docker pull
- docker ps [-a]
- docker start：启动一个已经停止的容器
- docker rm：删除一个容器
- docker stop：停止一个容器
