# GitHub Actions 设置指南

## 设置 Docker Hub 认证

为了使用 GitHub Actions 自动构建和推送 Docker 镜像，你需要在 GitHub 仓库中设置以下 secrets：

### 1. 访问 GitHub 仓库设置

1. 打开你的 GitHub 仓库：https://github.com/zbaimo/ShortVideo
2. 点击 "Settings" 标签页
3. 在左侧菜单中点击 "Secrets and variables" → "Actions"

### 2. 添加 Docker Hub 认证信息

点击 "New repository secret" 按钮，添加以下两个 secrets：

#### DOCKER_USERNAME
- **Name**: `DOCKER_USERNAME`
- **Value**: `zbaimo` (你的 Docker Hub 用户名)

#### DOCKER_PASSWORD
- **Name**: `DOCKER_PASSWORD`
- **Value**: 你的 Docker Hub 密码或访问令牌

### 3. 验证设置

设置完成后，当你推送代码到 `main` 分支时，GitHub Actions 将自动构建和推送多架构 Docker 镜像。

