# M3EBlog —— 个人博客项目

## 技术栈

| 层级 | 技术 |
|------|------|
| UI | Material Design 3 (`@material/web`) |
| 前端 | Vue 3 + Vite |
| 后端 | Node.js + Express |

## 功能

- 个人主页（`content/home.md` 渲染）
- 我的项目（`content/myproject.md` 渲染）
- 文章系统（`articles/*.md` 自动读取，支持点赞、评论）
- 友情链接
- 留言板
- 联系作者
- 暗色模式
- 响应式布局（桌面端 / 移动端）

## 开发

### 安装依赖

```bash
npm run install:all
```

### 启动开发服务器

同时启动前端（Vite）和后端（Express），支持热更新：

```bash
npm start
```

- 前端：http://localhost:5173
- 后端：http://localhost:3001

### 单独启动

```bash
# 仅前端
npm run dev

# 仅后端
npm run server:dev
```

## 生产构建与部署

### 1. 构建前端

```bash
npm run build
```

产物输出到 `dist/` 目录。

### 2. 配置后端环境变量

编辑 `server/.env`：

```
PORT=3001
NODE_ENV=production
ADMIN_PASSWORD=你的管理员密码
JWT_SECRET=你的JWT密钥
```

`NODE_ENV=production` 是必须的，后端会根据此变量托管 `dist/` 静态文件。

### 3. 启动生产服务器

```bash
npm run server
```

服务器会在 `http://localhost:3001` 同时提供前端页面和 API 接口。

### 4. 内网穿透（可选）

使用 Cloudflare Tunnel 将本地服务暴露到公网：

```bash
cloudflared tunnel --url http://localhost:3001
```

### 部署流程总结

```bash
# 完整流程
npm run install:all    # 安装依赖
npm run build          # 构建前端
npm run server         # 启动生产服务器
```

## 内容管理

| 文件 | 说明 |
|------|------|
| `articles/*.md` | 文章，放入即自动识别 |
| `content/home.md` | 主页个人简介 |
| `content/myproject.md` | 我的项目内容 |

Markdown 文件支持 YAML frontmatter：

```markdown
---
title: 文章标题
date: 2024-01-01
---

正文内容...
```

## 环境变量

### 后端 (`server/.env`)

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `PORT` | 服务端口 | `3001` |
| `NODE_ENV` | 运行环境 | `development` |
| `ADMIN_PASSWORD` | 管理员密码 | - |
| `JWT_SECRET` | JWT 密钥 | - |

## API 接口

### 留言板

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/messages` | 获取所有留言 |
| POST | `/api/messages` | 添加新留言 |
| PUT | `/api/messages/:id` | 更新留言 |
| DELETE | `/api/messages/:id` | 删除留言 |
| POST | `/api/messages/:id/like` | 点赞留言 |
| POST | `/api/messages/:id/reply` | 回复留言 |

### 文章

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/articles/:slug/likes` | 获取文章点赞信息 |
| POST | `/api/articles/:slug/likes` | 切换文章点赞 |
| GET | `/api/articles/:slug/comments` | 获取文章评论 |
| POST | `/api/articles/:slug/comments` | 添加文章评论 |
| DELETE | `/api/articles/:slug/comments/:commentId` | 删除文章评论 |

### 管理员

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/admin/login` | 管理员登录 |
| GET | `/api/admin/check` | 检查登录状态 |
| POST | `/api/admin/logout` | 管理员登出 |
| DELETE | `/api/admin/messages/:id` | 删除留言 |
| DELETE | `/api/admin/articles/:slug/comments/:commentId` | 删除文章评论 |
