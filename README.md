# 短视频平台 (Short Video Platform)

一个完整的短视频平台，包含移动应用、后端 API 和前端 Web 界面。支持多架构 Docker 部署。

## 🚀 特性

- **移动应用**: React Native + Expo 构建的跨平台应用
- **后端 API**: Node.js + Express + MongoDB 的 RESTful API
- **前端界面**: React + TypeScript + Tailwind CSS 的现代化 Web 界面
- **多架构支持**: Docker 镜像支持 AMD64 和 ARM64 架构
- **容器化部署**: 完整的 Docker 和 Docker Compose 配置
- **CI/CD**: GitHub Actions 自动构建和部署

## 🏗️ 技术栈

### 移动应用
- React Native
- Expo
- TypeScript
- React Navigation
- AsyncStorage

### 后端
- Node.js
- Express.js
- MongoDB
- JWT 认证
- Multer 文件上传

### 前端
- React 18
- TypeScript
- Tailwind CSS
- Vite
- React Router

### 部署
- Docker
- Docker Compose
- GitHub Actions
- Docker Hub

## 🐳 Docker 部署

### 快速开始

1. **克隆项目**
   ```bash
   git clone https://github.com/zbaimo/ShortVideo.git
   cd ShortVideo
   ```

2. **使用 Docker Compose 启动**
   ```bash
   # 开发环境
   docker-compose up -d
   
   # 生产环境
   docker-compose -f docker-compose.prod.yml up -d
   ```

### 多架构支持

本项目支持 AMD64 和 ARM64 架构，可以在以下平台上运行：
- Intel/AMD 服务器 (x86_64)
- ARM 服务器 (ARM64)
- Apple Silicon Mac (ARM64)
- ARM 云服务器

### 可用的 Docker 镜像

- `zbaimo/shortvideo:latest` - 生产环境完整应用
- `zbaimo/shortvideo-backend:latest` - 仅后端服务
- `zbaimo/shortvideo-frontend:latest` - 仅前端服务
- `zbaimo/shortvideo-mobile:latest` - 移动开发环境
- `zbaimo/shortvideo-dev:latest` - 开发环境

### 手动构建多架构镜像

#### Linux/macOS
```bash
chmod +x build-multiarch.sh
./build-multiarch.sh [版本号]
```

#### Windows PowerShell
```powershell
.\build-multiarch.ps1 [版本号]
```

### 环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `NODE_ENV` | 运行环境 | `production` |
| `PORT` | 服务端口 | `3000` |
| `MONGODB_URI` | MongoDB 连接字符串 | `mongodb://mongo:27017/shortvideo` |

## 📱 移动应用开发

### 安装依赖
```bash
cd mobile
npm install
```

### 启动开发服务器
```bash
npx expo start
```

### 构建应用
```bash
# Android
npx expo build:android

# iOS
npx expo build:ios
```

## 🌐 前端开发

### 安装依赖
```bash
cd frontend
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 🔧 后端开发

### 安装依赖
```bash
cd backend
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 启动生产服务器
```bash
npm start
```

## 📁 项目结构

```
短视频/
├── backend/                 # 后端 API 服务
│   ├── src/                # 源代码
│   ├── config/             # 配置文件
│   ├── models/             # 数据模型
│   ├── routes/             # 路由定义
│   └── controllers/        # 控制器
├── frontend/               # 前端 Web 应用
│   ├── src/                # 源代码
│   ├── components/         # React 组件
│   ├── pages/              # 页面组件
│   └── store/              # 状态管理
├── mobile/                 # 移动应用
│   ├── src/                # 源代码
│   ├── screens/            # 屏幕组件
│   ├── components/         # 通用组件
│   └── navigation/         # 导航配置
├── docs/                   # 文档
├── Dockerfile              # 多架构 Docker 构建文件
├── docker-compose.yml      # 开发环境 Docker Compose
├── docker-compose.prod.yml # 生产环境 Docker Compose
├── build-multiarch.sh      # Linux/macOS 构建脚本
├── build-multiarch.ps1     # Windows PowerShell 构建脚本
└── .github/workflows/      # GitHub Actions CI/CD
```

## 🔄 CI/CD 流程

GitHub Actions 会自动：
1. 在代码推送时触发构建
2. 构建多架构 Docker 镜像
3. 推送到 Docker Hub
4. 生成软件物料清单 (SBOM)

## 📊 健康检查

所有服务都包含健康检查端点：
- 后端: `GET /health`
- MongoDB: 数据库连接检查
- Redis: 缓存服务检查

## 🤝 贡献

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🆘 支持

如果遇到问题，请：
1. 检查 [Issues](https://github.com/zbaimo/ShortVideo/issues)
2. 创建新的 Issue
3. 查看项目文档

---

**注意**: 本项目默认禁用用户注册功能，仅支持管理员通过 API 创建账户。
