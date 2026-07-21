const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');

// 确保数据目录存在
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 读取JSON文件
function readJSON(filename) {
  const filePath = path.join(dataDir, filename);
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return null;
  }
}

// 写入JSON文件
function writeJSON(filename, data) {
  const filePath = path.join(dataDir, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
}

// 获取所有留言
function getMessages() {
  const data = readJSON('messages.json');
  return data ? data.messages : [];
}

// 保存留言
function saveMessages(messages) {
  return writeJSON('messages.json', { messages });
}

// 添加留言
function addMessage(message) {
  const messages = getMessages();
  messages.unshift(message);
  return saveMessages(messages);
}

// 获取文章点赞信息
function getArticleLikes(slug) {
  const data = readJSON('likes.json');
  return data ? (data[slug] || { count: 0, liked: false }) : { count: 0, liked: false };
}

// 切换文章点赞
function toggleArticleLike(slug, currentLiked) {
  const data = readJSON('likes.json') || {};
  if (!data[slug]) {
    data[slug] = { count: 0, liked: false };
  }
  
  if (currentLiked) {
    data[slug].count = Math.max(0, data[slug].count - 1);
    data[slug].liked = false;
  } else {
    data[slug].count++;
    data[slug].liked = true;
  }
  
  writeJSON('likes.json', data);
  return data[slug];
}

// 获取文章评论
function getArticleComments(slug) {
  const data = readJSON('comments.json');
  return data ? (data[slug] || []) : [];
}

// 保存文章评论
function saveArticleComments(slug, comments) {
  const data = readJSON('comments.json') || {};
  data[slug] = comments;
  return writeJSON('comments.json', data);
}

// 添加文章评论
function addArticleComment(slug, comment) {
  const data = readJSON('comments.json') || {};
  if (!data[slug]) {
    data[slug] = [];
  }
  data[slug].unshift(comment);
  writeJSON('comments.json', data);
  return data[slug];
}

// 删除留言
function deleteMessage(id) {
  const messages = getMessages();
  const index = messages.findIndex(m => m.id === id);
  if (index !== -1) {
    messages.splice(index, 1);
    saveMessages(messages);
    return true;
  }
  return false;
}

// 删除文章评论
function deleteArticleComment(slug, commentId) {
  const data = readJSON('comments.json') || {};
  if (!data[slug]) {
    return false;
  }
  const index = data[slug].findIndex(c => c.id === commentId);
  if (index !== -1) {
    data[slug].splice(index, 1);
    writeJSON('comments.json', data);
    return true;
  }
  return false;
}

module.exports = {
  getMessages,
  saveMessages,
  addMessage,
  getArticleLikes,
  toggleArticleLike,
  getArticleComments,
  saveArticleComments,
  addArticleComment,
  deleteMessage,
  deleteArticleComment
};