# 短视频平台 - 移动端应用

基于React Native和Expo的移动端应用，提供与Web端相同的短视频浏览、上传和社交功能。

## 🚀 功能特性

- 📱 原生移动端体验
- 🎥 短视频播放和浏览
- 📤 视频上传和编辑
- ❤️ 点赞、评论、分享功能
- 🔍 视频搜索和发现
- 👤 用户资料和关注系统
- 📱 推送通知支持

## 🛠️ 技术栈

- **React Native** - 跨平台移动应用开发
- **Expo** - React Native开发工具链
- **TypeScript** - 类型安全的JavaScript
- **React Navigation** - 移动端路由管理
- **Zustand** - 轻量级状态管理
- **Expo AV** - 音视频播放
- **Expo Camera** - 相机功能
- **Expo Image Picker** - 图片/视频选择

## 📱 支持的平台

- iOS 13.0+
- Android 6.0+
- Web (通过Expo Web)

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn
- Expo CLI
- iOS Simulator (macOS) 或 Android Emulator

### 安装依赖

```bash
cd mobile
npm install
```

### 启动开发服务器

```bash
# 启动Expo开发服务器
npm start

# 在iOS模拟器中运行
npm run ios

# 在Android模拟器中运行
npm run android

# 在Web浏览器中运行
npm run web
```

### 构建应用

```bash
# 构建Android APK
expo build:android

# 构建iOS应用
expo build:ios

# 构建Web版本
expo build:web
```

## 📁 项目结构

```
mobile/
├── src/
│   ├── components/     # 可复用组件
│   ├── screens/        # 页面屏幕
│   ├── navigation/     # 导航配置
│   ├── store/          # 状态管理
│   ├── services/       # API服务
│   ├── types/          # TypeScript类型定义
│   └── utils/          # 工具函数
├── assets/             # 静态资源
├── app.json           # Expo配置
├── babel.config.js    # Babel配置
├── tsconfig.json      # TypeScript配置
└── package.json       # 依赖配置
```

## 🔧 开发指南

### 添加新页面

1. 在 `src/screens/` 中创建新的屏幕组件
2. 在 `src/navigation/` 中添加导航配置
3. 更新类型定义

### 状态管理

使用Zustand进行状态管理，状态存储在 `src/store/` 目录中。

### API集成

API服务位于 `src/services/` 目录，与Web端共享相同的API端点。

## 📱 主要功能实现

### 视频播放

- 使用Expo AV进行视频播放
- 支持手势控制（播放/暂停、音量调节）
- 自动播放和循环播放

### 视频上传

- 相机拍摄和相册选择
- 视频压缩和格式转换
- 上传进度显示

### 导航系统

- 底部标签导航
- 堆栈导航用于页面跳转
- 手势导航支持

## 🧪 测试

### 单元测试

```bash
npm test
```

### 集成测试

```bash
npm run test:integration
```

### E2E测试

```bash
npm run test:e2e
```

## 📦 构建和部署

### 开发构建

```bash
expo build:development
```

### 生产构建

```bash
expo build:production
```

### 应用商店发布

1. 配置应用签名
2. 构建生产版本
3. 提交到App Store和Google Play

## 🔒 安全考虑

- 使用HTTPS进行API通信
- JWT令牌认证
- 敏感数据本地加密存储
- 应用签名验证

## 📊 性能优化

- 视频懒加载
- 图片压缩和缓存
- 内存管理优化
- 网络请求优化

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 📄 许可证

MIT License

## 📞 支持

如有问题，请通过以下方式联系：
- 提交Issue
- 查看文档
- 参与社区讨论
