const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/articles/:slug/likes - 获取文章点赞信息
router.get('/:slug/likes', (req, res) => {
  try {
    const { slug } = req.params;
    const likes = db.getArticleLikes(slug);
    res.json(likes);
  } catch (error) {
    console.error('Error getting article likes:', error);
    res.status(500).json({ error: 'Failed to get article likes' });
  }
});

// POST /api/articles/:slug/likes - 切换文章点赞
router.post('/:slug/likes', (req, res) => {
  try {
    const { slug } = req.params;
    const { currentLiked } = req.body;
    
    const likes = db.toggleArticleLike(slug, currentLiked);
    res.json(likes);
  } catch (error) {
    console.error('Error toggling article like:', error);
    res.status(500).json({ error: 'Failed to toggle article like' });
  }
});

// GET /api/articles/:slug/comments - 获取文章评论
router.get('/:slug/comments', (req, res) => {
  try {
    const { slug } = req.params;
    const comments = db.getArticleComments(slug);
    res.json(comments);
  } catch (error) {
    console.error('Error getting article comments:', error);
    res.status(500).json({ error: 'Failed to get article comments' });
  }
});

// POST /api/articles/:slug/comments - 添加文章评论
router.post('/:slug/comments', (req, res) => {
  try {
    const { slug } = req.params;
    const { nickname, content } = req.body;
    
    if (!nickname || !content) {
      return res.status(400).json({ error: 'Nickname and content are required' });
    }
    
    const comment = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      nickname,
      content,
      time: new Date().toLocaleString(),
      likes: 0,
      likedBy: [],
      replies: []
    };
    
    const comments = db.addArticleComment(slug, comment);
    res.status(201).json(comments);
  } catch (error) {
    console.error('Error adding article comment:', error);
    res.status(500).json({ error: 'Failed to add article comment' });
  }
});

// DELETE /api/articles/:slug/comments/:commentId - 删除文章评论
router.delete('/:slug/comments/:commentId', (req, res) => {
  try {
    const { slug, commentId } = req.params;
    const success = db.deleteArticleComment(slug, commentId);
    
    if (!success) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting article comment:', error);
    res.status(500).json({ error: 'Failed to delete article comment' });
  }
});

// POST /api/articles/:slug/comments/:commentId/like - 点赞文章评论
router.post('/:slug/comments/:commentId/like', (req, res) => {
  try {
    const { slug, commentId } = req.params;
    const { nickname } = req.body;
    
    if (!nickname) {
      return res.status(400).json({ error: 'Nickname is required' });
    }
    
    const comments = db.getArticleComments(slug);
    const comment = comments.find(c => c.id === commentId);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    if (!comment.likedBy) comment.likedBy = [];
    if (!comment.likes) comment.likes = 0;
    
    const idx = comment.likedBy.indexOf(nickname);
    if (idx === -1) {
      comment.likedBy.push(nickname);
      comment.likes++;
    } else {
      comment.likedBy.splice(idx, 1);
      comment.likes--;
    }
    
    // 更新存储
    db.saveArticleComments(slug, comments);
    
    res.json(comments);
  } catch (error) {
    console.error('Error liking article comment:', error);
    res.status(500).json({ error: 'Failed to like article comment' });
  }
});

// POST /api/articles/:slug/comments/:commentId/reply - 回复文章评论
router.post('/:slug/comments/:commentId/reply', (req, res) => {
  try {
    const { slug, commentId } = req.params;
    const { nickname, content } = req.body;
    
    if (!nickname || !content) {
      return res.status(400).json({ error: 'Nickname and content are required' });
    }
    
    const comments = db.getArticleComments(slug);
    const comment = comments.find(c => c.id === commentId);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    if (!comment.replies) comment.replies = [];
    
    const reply = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      nickname,
      content,
      time: new Date().toLocaleString()
    };
    
    comment.replies.push(reply);
    
    // 更新存储
    db.saveArticleComments(slug, comments);
    
    res.json(comments);
  } catch (error) {
    console.error('Error replying to article comment:', error);
    res.status(500).json({ error: 'Failed to reply to article comment' });
  }
});

module.exports = router;