# 短视频平台 (Short Video Platform)

一个完整的短视频平台，包含移动端应用、Web 前端和后端 API。

## 功能特性

- 📱 移动端应用 (React Native + Expo)
- 🌐 Web 前端 (React + TypeScript + Vite)
- 🔧 后端 API (Node.js + Express)
- 🔐 用户认证系统
- 📹 视频上传和播放
- 🔍 视频搜索功能
- 👤 用户个人资料管理

## 技术栈

### 移动端
- React Native
- Expo
- TypeScript
- React Navigation
- Expo AV (视频播放)
- Expo Image Picker (视频选择)

### Web 前端
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand (状态管理)

### 后端
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT 认证
- Multer (文件上传)

## 快速开始

### 使用 Docker (推荐)

1. 克隆仓库
```bash
git clone https://github.com/zbaimo/ShortVideo.git
cd ShortVideo
```

2. 使用 Docker Compose 启动
```bash
docker-compose up -d
```

3. 访问应用
- 前端: http://localhost
- 后端 API: http://localhost:3000
- 移动端开发服务器: http://localhost:19000

### 手动安装

#### 后端
```bash
cd backend
npm install
cp config.env.example config.env
# 编辑 config.env 文件配置数据库连接
npm start
```

#### Web 前端
```bash
cd frontend
npm install
npm run dev
```

#### 移动端
```bash
cd mobile
npm install
npx expo start
```

## Docker 镜像

项目已配置自动构建和推送到 Docker Hub：

- `zbaimo/shortvideo:latest` - 生产环境镜像
- `zbaimo/shortvideo-backend:latest` - 后端服务镜像
- `zbaimo/shortvideo-frontend:latest` - 前端服务镜像
- `zbaimo/shortvideo-mobile:latest` - 移动端开发镜像

## 环境变量

### 后端 (.env)
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/shortvideo
JWT_SECRET=your_jwt_secret
```

### 移动端
移动端应用使用模拟数据进行开发，生产环境需要配置真实的 API 端点。

## API 文档

### 用户认证
- `POST /api/users/login` - 用户登录
- `POST /api/users/register` - 用户注册 (仅管理员)

### 视频管理
- `GET /api/videos` - 获取视频列表
- `POST /api/videos` - 上传视频
- `GET /api/videos/:id` - 获取视频详情
- `PUT /api/videos/:id` - 更新视频信息
- `DELETE /api/videos/:id` - 删除视频

## 部署

### 使用 Docker Hub 镜像
```bash
# 拉取镜像
docker pull zbaimo/shortvideo:latest

# 运行容器
docker run -d -p 3000:3000 zbaimo/shortvideo:latest
```

### 使用 Docker Compose
```bash
docker-compose up -d
```

## 开发

### 代码结构
```
├── backend/          # 后端 API 服务
├── frontend/         # Web 前端应用
├── mobile/           # 移动端应用
├── docs/             # 文档
├── Dockerfile        # Docker 镜像构建
├── docker-compose.yml # Docker Compose 配置
└── .github/          # GitHub Actions 工作流
```

### 贡献
1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

- 项目链接: https://github.com/zbaimo/ShortVideo
- Docker Hub: https://hub.docker.com/r/zbaimo/shortvideo
