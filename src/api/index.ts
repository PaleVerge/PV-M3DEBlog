/**
 * 博客数据 API 抽象层
 * 连接到后端服务器
 */

import { request } from './config';

// --- 留言板 API ---
export async function getMessages() {
  try {
    return await request('/messages');
  } catch (error) {
    console.error('Failed to get messages:', error);
    return [];
  }
}

export async function saveMessages(messages) {
  // 这个函数在新的API设计中不需要，因为每个操作都是独立的
  // 保留函数签名以保持兼容性
  console.warn('saveMessages is deprecated in server mode');
  return messages;
}

export async function addMessage(msg) {
  try {
    return await request('/messages', {
      method: 'POST',
      body: JSON.stringify(msg),
    });
  } catch (error) {
    console.error('Failed to add message:', error);
    throw error;
  }
}

// --- 文章点赞与评论 API ---
export async function getArticleLikes(slug) {
  try {
    return await request(`/articles/${slug}/likes`);
  } catch (error) {
    console.error('Failed to get article likes:', error);
    return { count: 0, liked: false };
  }
}

export async function toggleArticleLikeAPI(slug, currentLiked) {
  try {
    return await request(`/articles/${slug}/likes`, {
      method: 'POST',
      body: JSON.stringify({ currentLiked }),
    });
  } catch (error) {
    console.error('Failed to toggle article like:', error);
    throw error;
  }
}

export async function getArticleComments(slug) {
  try {
    return await request(`/articles/${slug}/comments`);
  } catch (error) {
    console.error('Failed to get article comments:', error);
    return [];
  }
}

export async function addArticleComment(slug, comment) {
  try {
    return await request(`/articles/${slug}/comments`, {
      method: 'POST',
      body: JSON.stringify(comment),
    });
  } catch (error) {
    console.error('Failed to add article comment:', error);
    throw error;
  }
}

export async function deleteMessageAPI(id) {
  try {
    return await request(`/messages/${id}`, { method: 'DELETE' });
  } catch (error) {
    console.error('Failed to delete message:', error);
    throw error;
  }
}

export async function toggleMessageLikeAPI(id, nickname) {
  try {
    return await request(`/messages/${id}/like`, {
      method: 'POST',
      body: JSON.stringify({ nickname }),
    });
  } catch (error) {
    console.error('Failed to like message:', error);
    throw error;
  }
}

export async function addMessageReplyAPI(id, nickname, content) {
  try {
    return await request(`/messages/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ nickname, content }),
    });
  } catch (error) {
    console.error('Failed to reply message:', error);
    throw error;
  }
}

export async function updateMessageAPI(id, content) {
  try {
    return await request(`/messages/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  } catch (error) {
    console.error('Failed to update message:', error);
    throw error;
  }
}

export async function deleteArticleCommentAPI(slug, commentId) {
  try {
    return await request(`/articles/${slug}/comments/${commentId}`, { method: 'DELETE' });
  } catch (error) {
    console.error('Failed to delete comment:', error);
    throw error;
  }
}

// --- 管理员鉴权 API ---
export async function adminLoginAPI(password) {
  try {
    const result = await request('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
    
    if (result.success && result.sessionId) {
      sessionStorage.setItem('m3eblog_admin_session', result.sessionId);
      sessionStorage.setItem('m3eblog_admin_token', 'true');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Admin login failed:', error);
    return false;
  }
}

export async function isAdminAPI() {
  try {
    const sessionId = sessionStorage.getItem('m3eblog_admin_session');
    if (!sessionId) {
      return false;
    }
    
    const result = await request(`/admin/check?session=${sessionId}`);
    return result.isAdmin || false;
  } catch (error) {
    console.error('Admin check failed:', error);
    return false;
  }
}

export async function adminLogoutAPI() {
  try {
    const sessionId = sessionStorage.getItem('m3eblog_admin_session');
    if (sessionId) {
      await request('/admin/logout', {
        method: 'POST',
        body: JSON.stringify({ session: sessionId }),
      });
    }
    
    sessionStorage.removeItem('m3eblog_admin_session');
    sessionStorage.removeItem('m3eblog_admin_token');
    return true;
  } catch (error) {
    console.error('Admin logout failed:', error);
    sessionStorage.removeItem('m3eblog_admin_session');
    sessionStorage.removeItem('m3eblog_admin_token');
    return false;
  }
}