# M3DEBlog 启动指南

## 快速启动

### 1. 安装所有依赖
```bash
npm run install:all
```

### 2. 同时启动前端和后端
```bash
npm start
```

这将同时启动：
- 前端开发服务器 (http://localhost:5173)
- 后端API服务器 (http://localhost:3000)

## 分别启动

### 启动前端
```bash
npm run dev
```

### 启动后端
```bash
npm run server
```

或者进入server目录：
```bash
cd server
npm start
```

## 环境配置

### 前端环境变量 (.env)
```
VITE_API_BASE_URL=http://localhost:3000/api
```

### 后端环境变量 (server/.env)
```
PORT=3000
ADMIN_PASSWORD=m3de2025
JWT_SECRET=m3eblog_secret_key_2024
```

## 测试API

运行API测试脚本：
```bash
cd server
node test-api.js
```

## 生产部署

### 1. 构建前端
```bash
npm run build
```

### 2. 启动后端（生产模式）
```bash
cd server
NODE_ENV=production npm start
```

## 默认管理员密码
- 密码：`m3de2025`

## 数据存储
- 留言数据：`server/data/messages.json`
- 点赞数据：`server/data/likes.json`
- 评论数据：`server/data/comments.json`

## API文档

详细的API文档请参考 README.md 文件。