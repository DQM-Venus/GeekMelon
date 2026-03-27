# Geek Melon SSH 隧道开发连接说明

## 1. 适用场景

当本地开发环境需要连接云服务器上的 MySQL，但不希望直接暴露 `3306` 公网端口时，推荐使用 SSH 隧道。

当前服务器已经按该方案配置完成：

- SSH 服务对外开放：`47.105.112.190:22`
- MySQL 仅监听服务器本机：`127.0.0.1:3306`

这意味着：

- 外网不能直接访问 MySQL
- 本地可以通过 SSH 将本机端口转发到服务器的 MySQL 端口

## 2. 本地建立 SSH 隧道

在 Windows PowerShell 中执行：

```powershell
ssh -L 3307:127.0.0.1:3306 root@47.105.112.190
```

输入服务器密码后，保持这个窗口不要关闭。

含义如下：

- 本地监听端口：`3307`
- 远端目标地址：服务器上的 `127.0.0.1:3306`

## 3. 本地数据库连接参数

隧道建立成功后，本地开发环境应连接：

- Host：`127.0.0.1`
- Port：`3307`
- Database：`geek_melon`
- Username：`geekmelon_app`
- Password：`P9px$G62F3us9mq*ahXjBZ6C`

## 4. Spring Boot 配置示例

```properties
spring.datasource.url=jdbc:mysql://127.0.0.1:3307/geek_melon?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai&useSSL=false
spring.datasource.username=geekmelon_app
spring.datasource.password=P9px$G62F3us9mq*ahXjBZ6C
```

## 5. 连接测试方法

### 5.1 测试隧道端口

本地执行：

```powershell
Test-NetConnection 127.0.0.1 -Port 3307
```

若返回 `TcpTestSucceeded : True`，说明隧道已建立。

### 5.2 使用 MySQL 客户端测试

如果本机装有 MySQL 客户端，可执行：

```powershell
mysql -h 127.0.0.1 -P 3307 -u geekmelon_app -p
```

## 6. 常见问题

### 6.1 为什么本地突然连不上

常见原因：

- SSH 隧道窗口被关闭
- 本地网络变化后 SSH 连接断开
- 服务器 SSH 服务异常

### 6.2 VPN 会不会影响

会影响 SSH 线路质量，但不会像数据库公网白名单方案那样依赖固定出口 IP，因此更适合长期开发。

### 6.3 能不能后台运行

可以，但 MVP 阶段建议先手动开一个终端保持连接，最简单也最直观。

## 7. 当前服务器状态

当前 MySQL 已恢复为仅本机监听：

- `127.0.0.1:3306`

当前可用的数据库账号：

- `geekmelon_app@127.0.0.1`
- `geekmelon_app@localhost`

公网直连账号已经移除。
