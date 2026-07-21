const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/messages - 获取所有留言
router.get('/', (req, res) => {
  try {
    const messages = db.getMessages();
    res.json(messages);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// POST /api/messages - 添加新留言
router.post('/', (req, res) => {
  try {
    const { nickname, content } = req.body;
    
    if (!nickname || !content) {
      return res.status(400).json({ error: 'Nickname and content are required' });
    }
    
    const message = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      nickname,
      content,
      time: new Date().toLocaleString(),
      likes: 0,
      likedBy: [],
      replies: []
    };
    
    db.addMessage(message);
    res.status(201).json(message);
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ error: 'Failed to add message' });
  }
});

// PUT /api/messages/:id - 更新留言
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    const messages = db.getMessages();
    const index = messages.findIndex(m => m.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    messages[index].content = content;
    messages[index].time = new Date().toLocaleString() + ' (已编辑)';
    
    db.saveMessages(messages);
    res.json(messages[index]);
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// DELETE /api/messages/:id - 删除留言
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const success = db.deleteMessage(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// POST /api/messages/:id/like - 点赞留言
router.post('/:id/like', (req, res) => {
  try {
    const { id } = req.params;
    const { nickname } = req.body;
    
    if (!nickname) {
      return res.status(400).json({ error: 'Nickname is required' });
    }
    
    const messages = db.getMessages();
    const message = messages.find(m => m.id === id);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    if (!message.likedBy) message.likedBy = [];
    if (!message.likes) message.likes = 0;
    
    const idx = message.likedBy.indexOf(nickname);
    if (idx === -1) {
      message.likedBy.push(nickname);
      message.likes++;
    } else {
      message.likedBy.splice(idx, 1);
      message.likes--;
    }
    
    db.saveMessages(messages);
    res.json(message);
  } catch (error) {
    console.error('Error liking message:', error);
    res.status(500).json({ error: 'Failed to like message' });
  }
});

// POST /api/messages/:id/reply - 回复留言
router.post('/:id/reply', (req, res) => {
  try {
    const { id } = req.params;
    const { nickname, content } = req.body;
    
    if (!nickname || !content) {
      return res.status(400).json({ error: 'Nickname and content are required' });
    }
    
    const messages = db.getMessages();
    const message = messages.find(m => m.id === id);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    if (!message.replies) message.replies = [];
    
    const reply = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      nickname,
      content,
      time: new Date().toLocaleString()
    };
    
    message.replies.push(reply);
    db.saveMessages(messages);
    res.json(message);
  } catch (error) {
    console.error('Error replying to message:', error);
    res.status(500).json({ error: 'Failed to reply to message' });
  }
});

module.exports = router;