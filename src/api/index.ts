/**
 * 博客数据 API 抽象层
 * 目前使用 localStorage 进行本地模拟 (Mock)。
 * 既然你有自己的服务器，未来你只需要将这里的逻辑替换为真实的 fetch/axios 请求即可，
 * 例如： `return fetch('/api/messages').then(res => res.json())`
 */

const LIKE_KEY = 'm3eblog_likes'
const COMMENT_KEY = 'm3eblog_comments'
const MSG_KEY = 'm3eblog_messages'
const ADMIN_AUTH_KEY = 'm3eblog_admin_token'

// --- 留言板 API ---
export async function getMessages() {
  const stored = localStorage.getItem(MSG_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  }
  return []
}

export async function saveMessages(messages) {
  localStorage.setItem(MSG_KEY, JSON.stringify(messages))
}

export async function addMessage(msg) {
  const messages = await getMessages()
  messages.unshift(msg)
  await saveMessages(messages)
  return msg
}

// --- 文章点赞与评论 API ---
export async function getArticleLikes(slug) {
  const allLikes = JSON.parse(localStorage.getItem(LIKE_KEY) || '{}')
  return allLikes[slug] || { count: 0, liked: false }
}

export async function toggleArticleLikeAPI(slug, currentLiked) {
  const allLikes = JSON.parse(localStorage.getItem(LIKE_KEY) || '{}')
  if (!allLikes[slug]) allLikes[slug] = { count: 0, liked: false }
  
  if (currentLiked) {
    allLikes[slug].count = Math.max(0, allLikes[slug].count - 1)
    allLikes[slug].liked = false
  } else {
    allLikes[slug].count++
    allLikes[slug].liked = true
  }
  
  localStorage.setItem(LIKE_KEY, JSON.stringify(allLikes))
  return allLikes[slug]
}

export async function getArticleComments(slug) {
  const allComments = JSON.parse(localStorage.getItem(COMMENT_KEY) || '{}')
  return allComments[slug] || []
}

export async function addArticleComment(slug, comment) {
  const allComments = JSON.parse(localStorage.getItem(COMMENT_KEY) || '{}')
  if (!allComments[slug]) allComments[slug] = []
  allComments[slug].unshift(comment)
  localStorage.setItem(COMMENT_KEY, JSON.stringify(allComments))
  return allComments[slug]
}

// --- 管理员鉴权 API ---
export async function adminLoginAPI(password) {
  // 注意：在真实的服务器环境中，这里应该发送 POST 请求到后端验证密码，而不是在前端比对
  const expectedPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'm3de2025'
  if (password === expectedPassword) {
    sessionStorage.setItem(ADMIN_AUTH_KEY, 'true')
    return true
  }
  return false
}

export async function isAdminAPI() {
  // 真实环境应调用如 /api/admin/check 验证 token 是否有效
  return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true'
}

export async function adminLogoutAPI() {
  sessionStorage.removeItem(ADMIN_AUTH_KEY)
}
