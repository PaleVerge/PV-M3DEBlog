// 简单的管理员验证中间件
// 在实际生产环境中，应该使用JWT或其他更安全的认证方式

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'm3de2025';

// 存储活跃的管理员会话（内存中，重启后失效）
const activeSessions = new Set();

// 生成简单的会话ID
function generateSessionId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// 管理员登录
function adminLogin(password) {
  if (password === ADMIN_PASSWORD) {
    const sessionId = generateSessionId();
    activeSessions.add(sessionId);
    return { success: true, sessionId };
  }
  return { success: false };
}

// 检查是否是管理员
function isAdmin(sessionId) {
  return activeSessions.has(sessionId);
}

// 管理员登出
function adminLogout(sessionId) {
  activeSessions.delete(sessionId);
}

// 验证管理员中间件
function requireAdmin(req, res, next) {
  const sessionId = req.headers['x-admin-session'] || req.query.session;
  
  if (!sessionId || !isAdmin(sessionId)) {
    return res.status(401).json({ error: 'Unauthorized: Admin access required' });
  }
  
  next();
}

module.exports = {
  adminLogin,
  isAdmin,
  adminLogout,
  requireAdmin
};