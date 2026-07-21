# M3EBlog —— 一个个人博客项目

## 技术栈
> UI：Material Design 3
> 
> 前端：Vue 3
> 
> 后端：Node.js + Express

## 项目进度
* 友情链接
* 个人主页
* 联系作者
* 推文页面

## 项目配置

### 前端

```sh
npm install
```

#### Compile and Hot-Reload for Development

```sh
npm run dev
```

#### Compile and Minify for Production

```sh
npm run build
```

### 后端

```sh
cd server
npm install
```

#### 启动后端服务器

```sh
npm start
```

#### 开发模式（自动重启）

```sh
npm run dev
```

## 环境变量

### 前端 (.env)
```
VITE_API_BASE_URL=http://localhost:3000/api
```

### 后端 (server/.env)
```
PORT=3000
ADMIN_PASSWORD=m3de2025
JWT_SECRET=m3eblog_secret_key_2024
```

## API接口

### 留言板
- `GET /api/messages` - 获取所有留言
- `POST /api/messages` - 添加新留言
- `PUT /api/messages/:id` - 更新留言
- `DELETE /api/messages/:id` - 删除留言
- `POST /api/messages/:id/like` - 点赞留言
- `POST /api/messages/:id/reply` - 回复留言

### 文章
- `GET /api/articles/:slug/likes` - 获取文章点赞信息
- `POST /api/articles/:slug/likes` - 切换文章点赞
- `GET /api/articles/:slug/comments` - 获取文章评论
- `POST /api/articles/:slug/comments` - 添加文章评论
- `DELETE /api/articles/:slug/comments/:commentId` - 删除文章评论
- `POST /api/articles/:slug/comments/:commentId/like` - 点赞文章评论
- `POST /api/articles/:slug/comments/:commentId/reply` - 回复文章评论

### 管理员
- `POST /api/admin/login` - 管理员登录
- `GET /api/admin/check` - 检查管理员登录状态
- `POST /api/admin/logout` - 管理员登出
- `GET /api/admin/messages` - 获取所有留言（管理员）
- `DELETE /api/admin/messages/:id` - 删除留言（管理员）
- `GET /api/admin/articles/:slug/comments` - 获取文章评论（管理员）
- `DELETE /api/admin/articles/:slug/comments/:commentId` - 删除文章评论（管理员）
