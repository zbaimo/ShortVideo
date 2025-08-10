# 短视频平台 (Short Video Platform)

一个类似TikTok的短视频平台，包含Web前端、移动端和后端API。

## 🚀 功能特性

### 用户功能
- 用户注册和登录
- 个人资料管理
- 关注/取消关注其他用户
- 用户认证和授权

### 视频功能
- 短视频和长视频支持
- 视频上传和管理
- 视频点赞、评论、分享
- 视频搜索和分类
- 推荐算法
- 无限滚动浏览

### 社交功能
- 评论系统
- 点赞系统
- 分享功能
- 收藏功能

## 🛠️ 技术栈

### 后端
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** 认证
- **Multer** 文件上传
- **Helmet** 安全中间件
- **Rate Limiting** 速率限制

### 前端
- **React 18** + **TypeScript**
- **Vite** 构建工具
- **Tailwind CSS** 样式框架
- **React Router** 路由管理
- **Zustand** 状态管理
- **Axios** HTTP客户端
- **Lucide React** 图标库

### 移动端
- **React Native** (开发中)

## 📁 项目结构

```
短视频/
├── backend/                 # 后端API服务
│   ├── src/
│   │   ├── controllers/    # 控制器
│   │   ├── models/        # 数据模型
│   │   ├── routes/        # 路由定义
│   │   ├── middleware/    # 中间件
│   │   ├── config/        # 配置文件
│   │   └── utils/         # 工具函数
│   ├── package.json
│   └── config.env.example
├── frontend/               # Web前端
│   ├── src/
│   │   ├── components/    # React组件
│   │   ├── pages/        # 页面组件
│   │   ├── store/        # 状态管理
│   │   ├── types/        # TypeScript类型
│   │   └── utils/        # 工具函数
│   ├── package.json
│   └── vite.config.ts
├── mobile/                # 移动端应用
├── docs/                  # 文档
└── package.json           # 根目录配置
```

## 🚀 快速开始

### 环境要求
- Node.js 18+
- MongoDB 5+
- npm 或 yarn

### 1. 克隆项目
```bash
git clone <repository-url>
cd 短视频
```

### 2. 安装依赖
```bash
# 安装所有依赖
npm run install:all

# 或者分别安装
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 3. 配置环境变量

#### 后端配置
```bash
cd backend
cp config.env.example .env
```

编辑 `.env` 文件，配置以下必要参数：
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/short-video-platform
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
```

#### 前端配置
```bash
cd frontend
cp .env.example .env
```

编辑 `.env` 文件：
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. 启动数据库
确保MongoDB服务正在运行：
```bash
# macOS/Linux
sudo systemctl start mongod

# Windows
net start MongoDB

# 或者使用Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 5. 启动开发服务器
```bash
# 同时启动前后端
npm run dev

# 或者分别启动
npm run dev:backend    # 后端端口: 5000
npm run dev:frontend   # 前端端口: 3000
```

## 📱 使用说明

### 用户注册/登录
1. 访问 `http://localhost:3000/register` 注册新账户
2. 或访问 `http://localhost:3000/login` 登录现有账户

### 浏览视频
- 首页显示推荐视频，支持无限滚动
- 点击视频进入详情页面
- 支持点赞、评论、分享、收藏

### 上传视频
1. 登录后点击底部导航的"上传"按钮
2. 填写视频标题、描述、分类等信息
3. 选择视频文件并上传

### 搜索功能
- 支持按关键词搜索视频
- 支持按分类和视频类型筛选
- 支持搜索用户、标签等

## 🔧 开发指南

### 添加新的API端点
1. 在 `backend/src/routes/` 中添加路由
2. 在 `backend/src/controllers/` 中实现控制器逻辑
3. 在 `backend/src/models/` 中定义数据模型

### 添加新的前端页面
1. 在 `frontend/src/pages/` 中创建页面组件
2. 在 `frontend/src/App.tsx` 中添加路由
3. 在 `frontend/src/types/` 中定义相关类型

### 代码规范
- 使用ESLint和Prettier保持代码风格一致
- 遵循TypeScript最佳实践
- 组件使用函数式组件和Hooks
- 使用Tailwind CSS进行样式设计

## 🧪 测试

### 后端测试
```bash
cd backend
npm test
```

### 前端测试
```bash
cd frontend
npm test
```

## 📦 构建部署

### 构建生产版本
```bash
npm run build
```

### 部署到生产环境
1. 配置生产环境变量
2. 构建前端和后端
3. 部署到服务器或云平台

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发送邮件
- 参与讨论

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！
