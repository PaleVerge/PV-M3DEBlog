require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// 导入路由
const messageRoutes = require('./routes/messages');
const articleRoutes = require('./routes/articles');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:5173', 'http://localhost:4173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// API路由
app.use('/api/messages', messageRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/admin', adminRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 静态文件服务（生产环境）
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`M3DEBlog server running on http://localhost:${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  - GET  /api/health`);
  console.log(`  - GET  /api/messages`);
  console.log(`  - POST /api/messages`);
  console.log(`  - GET  /api/articles/:slug/likes`);
  console.log(`  - POST /api/articles/:slug/likes`);
  console.log(`  - GET  /api/articles/:slug/comments`);
  console.log(`  - POST /api/articles/:slug/comments`);
  console.log(`  - POST /api/admin/login`);
  console.log(`  - GET  /api/admin/check`);
  console.log(`  - POST /api/admin/logout`);
});

module.exports = app;