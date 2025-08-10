# 部署指南 (Deployment Guide)

本文档详细说明了如何部署短视频平台到不同的环境。

## 🚀 快速部署

### 1. 使用预构建镜像 (推荐)

```bash
# 拉取最新镜像
docker pull zbaimo/shortvideo:latest

# 运行容器
docker run -d \
  --name shortvideo \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e MONGODB_URI=mongodb://your-mongo-host:27017/shortvideo \
  zbaimo/shortvideo:latest
```

### 2. 使用 Docker Compose

```bash
# 开发环境
docker-compose up -d

# 生产环境
docker-compose -f docker-compose.prod.yml up -d
```

## 🏗️ 多架构部署

### 支持的架构

- **linux/amd64**: Intel/AMD 64位处理器
- **linux/arm64**: ARM 64位处理器 (如 Apple Silicon, ARM 服务器)

### 架构检测

Docker 会自动选择适合当前平台的镜像版本：

```bash
# 查看镜像支持的架构
docker buildx imagetools inspect zbaimo/shortvideo:latest
```

### 手动指定架构

```bash
# 强制使用特定架构
docker run --platform linux/arm64 zbaimo/shortvideo:latest
```

## 🌍 环境配置

### 环境变量

| 变量名 | 必需 | 描述 | 示例 |
|--------|------|------|------|
| `NODE_ENV` | 否 | 运行环境 | `production`, `development` |
| `PORT` | 否 | 服务端口 | `3000` |
| `MONGODB_URI` | 是 | MongoDB 连接字符串 | `mongodb://localhost:27017/shortvideo` |
| `JWT_SECRET` | 是 | JWT 签名密钥 | `your-secret-key` |
| `UPLOAD_PATH` | 否 | 文件上传路径 | `./uploads` |

### 配置文件

创建 `config.env` 文件：

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/shortvideo
JWT_SECRET=your-super-secret-jwt-key
UPLOAD_PATH=./uploads
```

## 🐳 Docker 部署选项

### 选项 1: 完整应用 (推荐)

```bash
# 使用生产镜像
docker run -d \
  --name shortvideo \
  -p 3000:3000 \
  -v $(pwd)/uploads:/app/uploads \
  -v $(pwd)/config.env:/app/backend/config.env \
  zbaimo/shortvideo:latest
```

### 选项 2: 分离服务

```bash
# 后端服务
docker run -d \
  --name shortvideo-backend \
  -p 3000:3000 \
  -v $(pwd)/uploads:/app/uploads \
  zbaimo/shortvideo-backend:latest

# 前端服务 (需要 Nginx)
docker run -d \
  --name shortvideo-frontend \
  -p 80:80 \
  -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf \
  zbaimo/shortvideo-frontend:latest
```

### 选项 3: 开发环境

```bash
# 开发环境
docker run -d \
  --name shortvideo-dev \
  -p 3000:3000 \
  -p 19000:19000 \
  -v $(pwd):/app \
  zbaimo/shortvideo-dev:latest
```

## 🗄️ 数据库配置

### MongoDB

```bash
# 使用官方 MongoDB 镜像
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_DATABASE=shortvideo \
  -v mongodb_data:/data/db \
  mongo:6.0

# 连接到应用
MONGODB_URI=mongodb://localhost:27017/shortvideo
```

### Redis (可选)

```bash
# 使用官方 Redis 镜像
docker run -d \
  --name redis \
  -p 6379:6379 \
  -v redis_data:/data \
  redis:7-alpine
```

## 🔒 安全配置

### 防火墙

```bash
# 只开放必要端口
sudo ufw allow 3000/tcp  # 应用端口
sudo ufw allow 27017/tcp # MongoDB (如果外部访问)
sudo ufw enable
```

### SSL/TLS

使用 Nginx 反向代理配置 SSL：

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📊 监控和健康检查

### 健康检查端点

```bash
# 检查应用状态
curl http://localhost:3000/health

# 检查数据库连接
curl http://localhost:3000/health/db
```

### 日志监控

```bash
# 查看应用日志
docker logs shortvideo -f

# 查看数据库日志
docker logs mongodb -f
```

## 🔄 更新和回滚

### 更新应用

```bash
# 拉取新镜像
docker pull zbaimo/shortvideo:latest

# 停止旧容器
docker stop shortvideo

# 删除旧容器
docker rm shortvideo

# 启动新容器
docker run -d \
  --name shortvideo \
  -p 3000:3000 \
  -v $(pwd)/uploads:/app/uploads \
  zbaimo/shortvideo:latest
```

### 回滚

```bash
# 回滚到特定版本
docker run -d \
  --name shortvideo \
  -p 3000:3000 \
  -v $(pwd)/uploads:/app/uploads \
  zbaimo/shortvideo:v1.0.0
```

## 🚨 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 检查端口使用情况
   netstat -tulpn | grep :3000
   
   # 杀死占用进程
   sudo kill -9 <PID>
   ```

2. **数据库连接失败**
   ```bash
   # 检查 MongoDB 状态
   docker exec mongodb mongosh --eval "db.adminCommand('ping')"
   
   # 检查网络连接
   docker network ls
   ```

3. **权限问题**
   ```bash
   # 修复上传目录权限
   sudo chown -R 1000:1000 ./uploads
   sudo chmod -R 755 ./uploads
   ```

### 日志分析

```bash
# 查看错误日志
docker logs shortvideo 2>&1 | grep ERROR

# 实时监控日志
docker logs shortvideo -f --tail 100
```

## 📈 性能优化

### 资源限制

```bash
# 限制容器资源使用
docker run -d \
  --name shortvideo \
  --memory=512m \
  --cpus=1.0 \
  -p 3000:3000 \
  zbaimo/shortvideo:latest
```

### 缓存配置

```bash
# 启用 Redis 缓存
docker run -d \
  --name redis \
  -p 6379:6379 \
  redis:7-alpine redis-server --appendonly yes
```

## 🌐 生产环境部署

### 使用 Docker Swarm

```bash
# 初始化 Swarm
docker swarm init

# 部署服务
docker stack deploy -c docker-compose.prod.yml shortvideo
```

### 使用 Kubernetes

```bash
# 应用 Kubernetes 配置
kubectl apply -f k8s/

# 查看部署状态
kubectl get pods
kubectl get services
```

## 📞 支持

如果遇到部署问题：

1. 检查 [GitHub Issues](https://github.com/zbaimo/ShortVideo/issues)
2. 查看 [项目文档](https://github.com/zbaimo/ShortVideo#readme)
3. 创建新的 Issue 描述问题

---

**注意**: 生产环境部署前请确保：
- 配置了强密码和密钥
- 启用了防火墙和 SSL
- 配置了备份策略
- 设置了监控和告警
