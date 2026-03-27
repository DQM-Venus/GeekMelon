# Geek Melon 云服务器 Docker 部署说明

## 1. 本地准备

### 1.1 绑定远程仓库

```powershell
cd D:\project\GeekMelon
git remote add origin https://github.com/DQM-Venus/GeekMelon.git
git push -u origin master
```

### 1.2 推荐先做本地校验

```powershell
cd D:\project\GeekMelon\backend
.\mvnw.cmd test

cd D:\project\GeekMelon\frontend
npm run build

cd D:\project\GeekMelon
python -m unittest discover D:\project\GeekMelon\crawler\tests
```

## 2. 服务器初始化

登录服务器：

```bash
ssh root@47.105.112.190
```

安装基础工具：

```bash
dnf -y install git dnf-plugins-core
dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
dnf -y install docker-ce docker-ce-cli containerd.io docker-compose-plugin
systemctl enable --now docker
```

放行 HTTP 端口：

```bash
firewall-cmd --permanent --add-service=http || true
firewall-cmd --reload || true
```

## 3. 拉取项目

```bash
mkdir -p /opt/geekmelon
cd /opt/geekmelon
git clone https://github.com/DQM-Venus/GeekMelon.git app
mkdir -p /opt/geekmelon/env
mkdir -p /opt/geekmelon/logs
```

## 4. 环境变量

创建环境文件：

```bash
cat >/opt/geekmelon/env/.env <<'EOF'
GM_DB_URL=jdbc:mysql://127.0.0.1:3306/geek_melon?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai&useSSL=false
GM_DB_USERNAME=geekmelon_app
GM_DB_PASSWORD=请填写数据库密码
GM_INGEST_TOKEN=请填写采集令牌
GM_ADMIN_USERNAME=admin
GM_ADMIN_PASSWORD=请填写后台密码
GM_EDITORIAL_ENABLED=true
DEEPSEEK_API_KEY=请填写你的DeepSeek-Key
GM_EDITORIAL_MODEL=deepseek-chat
GM_EDITORIAL_BASE_URL=https://api.deepseek.com
GM_EDITORIAL_REQUEST_TIMEOUT_SECONDS=20
GM_EDITORIAL_PICK_COUNT=6
GM_EDITORIAL_CANDIDATE_COUNT=10
GM_EDITORIAL_CACHE_TTL_SECONDS=300
EOF
```

说明：

- 线上沿用宿主机现有 MySQL，不新建数据库容器。
- 当前 MySQL 只监听 `127.0.0.1:3306`，所以本项目三个容器统一走宿主机网络。
- 这样后端和 crawler 都可以直接访问服务器本机 MySQL，不需要改数据库监听配置。

如果暂时不想在线上启用首页主编精选，可以把：

```text
GM_EDITORIAL_ENABLED=true
```

改成：

```text
GM_EDITORIAL_ENABLED=false
```

## 5. 启动服务

```bash
cd /opt/geekmelon/app
docker compose --env-file /opt/geekmelon/env/.env build
docker compose --env-file /opt/geekmelon/env/.env up -d
```

查看状态：

```bash
docker compose --env-file /opt/geekmelon/env/.env ps
docker compose --env-file /opt/geekmelon/env/.env logs backend --tail=100
docker compose --env-file /opt/geekmelon/env/.env logs frontend --tail=100
```

## 6. 验证访问

公开首页：

```text
http://47.105.112.190/
```

公开接口：

```text
http://47.105.112.190/api/feeds?page=1&page_size=10
```

后台登录页：

```text
http://47.105.112.190/admin/login
```

## 7. 手动抓取与定时抓取

手动执行一次抓取：

```bash
cd /opt/geekmelon/app
docker compose --env-file /opt/geekmelon/env/.env --profile tools run --rm crawler python main.py --source china_mix
```

给脚本加执行权限：

```bash
chmod +x /opt/geekmelon/app/scripts/run-crawler-cron.sh
chmod +x /opt/geekmelon/app/scripts/deploy-refresh.sh
```

配置 crontab：

```bash
crontab -e
```

加入：

```cron
0 2 * * * /opt/geekmelon/app/scripts/run-crawler-cron.sh
```

查看抓取日志：

```bash
tail -f /opt/geekmelon/logs/crawler-cron.log
```

## 8. 后续更新

本地推送新代码后，服务器执行：

```bash
/opt/geekmelon/app/scripts/deploy-refresh.sh
```

或者手动执行：

```bash
cd /opt/geekmelon/app
git pull
docker compose --env-file /opt/geekmelon/env/.env build
docker compose --env-file /opt/geekmelon/env/.env up -d
```
