const express = require('express');
const router = express.Router();
const { adminLogin, isAdmin, adminLogout, requireAdmin } = require('../middleware/admin');

// POST /api/admin/login - 管理员登录
router.post('/login', (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }
    
    const result = adminLogin(password);
    
    if (result.success) {
      res.json({ 
        success: true, 
        sessionId: result.sessionId,
        message: 'Login successful' 
      });
    } else {
      res.status(401).json({ 
        success: false, 
        error: 'Invalid password' 
      });
    }
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/admin/check - 检查管理员登录状态
router.get('/check', (req, res) => {
  try {
    const sessionId = req.headers['x-admin-session'] || req.query.session;
    
    if (!sessionId) {
      return res.json({ isAdmin: false });
    }
    
    const admin = isAdmin(sessionId);
    res.json({ isAdmin: admin });
  } catch (error) {
    console.error('Error checking admin status:', error);
    res.json({ isAdmin: false });
  }
});

// POST /api/admin/logout - 管理员登出
router.post('/logout', (req, res) => {
  try {
    const sessionId = req.headers['x-admin-session'] || req.body.session;
    
    if (sessionId) {
      adminLogout(sessionId);
    }
    
    res.json({ success: true, message: 'Logout successful' });
  } catch (error) {
    console.error('Error during admin logout:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// GET /api/admin/messages - 获取所有留言（管理员）
router.get('/messages', requireAdmin, (req, res) => {
  try {
    const db = require('../db');
    const messages = db.getMessages();
    res.json(messages);
  } catch (error) {
    console.error('Error getting admin messages:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// DELETE /api/admin/messages/:id - 删除留言（管理员）
router.delete('/messages/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const db = require('../db');
    const success = db.deleteMessage(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting admin message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// GET /api/admin/articles/:slug/comments - 获取文章评论（管理员）
router.get('/articles/:slug/comments', requireAdmin, (req, res) => {
  try {
    const { slug } = req.params;
    const db = require('../db');
    const comments = db.getArticleComments(slug);
    res.json(comments);
  } catch (error) {
    console.error('Error getting admin comments:', error);
    res.status(500).json({ error: 'Failed to get comments' });
  }
});

// DELETE /api/admin/articles/:slug/comments/:commentId - 删除文章评论（管理员）
router.delete('/articles/:slug/comments/:commentId', requireAdmin, (req, res) => {
  try {
    const { slug, commentId } = req.params;
    const db = require('../db');
    const success = db.deleteArticleComment(slug, commentId);
    
    if (!success) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting admin comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

module.exports = router;