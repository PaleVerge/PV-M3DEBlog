<template>
  <div class="desktop-layout">
    <header class="desktop-header">
      <div class="header-left">
        <h1 class="site-title">M3DEBlog</h1>
        <span class="site-subtitle">Personal Blog</span>
      </div>
      <div class="header-center">
        <SearchBar v-model="searchQuery" />
      </div>
      <div class="header-right">
        <md-icon-button @click="showSettings = true">
          <md-icon>settings</md-icon>
        </md-icon-button>
      </div>
    </header>

    <main class="desktop-main">
      <aside class="sidebar-left">
        <div class="panel profile-panel">
          <h3>个人简介</h3>
          <Divider />
          <div class="profile-content" v-html="homeContent"></div>
        </div>

        <div class="panel contact-panel">
          <h3>联系作者</h3>
          <Divider />
          <md-list>
            <md-list-item @click="copyText('fnme3706679@gmail.com')">
              <md-icon slot="start">email</md-icon>
              <div slot="supporting-text">fnme3706679@gmail.com</div>
            </md-list-item>
            <md-list-item @click="copyText('574746791')">
              <md-icon slot="start">chat</md-icon>
              <div slot="supporting-text">QQ: 574746791</div>
            </md-list-item>
            <md-list-item @click="copyText('distandce')">
              <md-icon slot="start">chat</md-icon>
              <div slot="supporting-text">微信: distandce</div>
            </md-list-item>
            <md-list-item type="link" href="https://x.com/qing1435" target="_blank">
              <md-icon slot="start">open_in_new</md-icon>
              <div slot="supporting-text">X</div>
            </md-list-item>
            <md-list-item type="link" href="https://github.com/paleverge" target="_blank">
              <md-icon slot="start">open_in_new</md-icon>
              <div slot="supporting-text">Github</div>
            </md-list-item>
          </md-list>
        </div>

        <div class="panel friend-panel">
          <h3>友情链接</h3>
          <Divider />
          <div class="friend-placeholder">
            <p>虚位以待，广告招租中...</p>
          </div>
        </div>
      </aside>

      <section class="content-main">
        <div class="panel article-panel">
          <div class="panel-header">
            <h3>文章</h3>
            <div class="sort-buttons">
              <md-filled-tonal-button :class="{ active: articleSort === 'time' }" @click="articleSort = 'time'">
                <md-icon slot="icon">schedule</md-icon>
                最新
              </md-filled-tonal-button>
              <md-filled-tonal-button :class="{ active: articleSort === 'hot' }" @click="articleSort = 'hot'">
                <md-icon slot="icon">local_fire_department</md-icon>
                热门
              </md-filled-tonal-button>
            </div>
          </div>
          <Divider />
          <div v-if="filteredArticles.length === 0" class="empty-state">
            <p>暂无文章</p>
          </div>
          <md-list v-else>
            <md-list-item
              v-for="article in filteredArticles"
              :key="article.slug"
              @click="openArticle(article)"
              class="article-item"
            >
              <div slot="headline">{{ article.title }}</div>
              <div slot="supporting-text">{{ article.date }}</div>
              <md-icon slot="end">chevron_right</md-icon>
            </md-list-item>
          </md-list>
        </div>

        <div class="panel article-detail" v-if="selectedArticle">
          <div class="panel-header">
            <h3>{{ selectedArticle.title }}</h3>
            <md-icon-button @click="selectedArticle = null">
              <md-icon>close</md-icon>
            </md-icon-button>
          </div>
          <Divider />
          <p class="article-date">{{ selectedArticle.date }}</p>
          <div v-html="renderedArticle" class="markdown-body"></div>

          <Divider />
          <div class="article-actions">
            <md-icon-button @click="toggleArticleLike" class="like-btn" :class="{ liked: articleLiked }">
              <md-icon>{{ articleLiked ? 'favorite' : 'favorite_border' }}</md-icon>
            </md-icon-button>
            <span class="like-count">{{ articleLikeCount }} 赞</span>
          </div>

          <Divider />
          <h4>评论 ({{ articleComments.length }})</h4>
          <div class="comment-form">
            <md-outlined-text-field label="昵称" :value="commentNickname" @input="commentNickname = $event.target.value" placeholder="昵称"></md-outlined-text-field>
            <md-outlined-text-field label="评论" :value="commentContent" @input="commentContent = $event.target.value" placeholder="说点什么..." type="textarea" rows="3"></md-outlined-text-field>
            <md-filled-button @click="submitComment" :disabled="!commentNickname || !commentContent">发表评论</md-filled-button>
          </div>
          <div v-for="comment in articleComments" :key="comment.id" class="comment-item">
            <div class="comment-header">
              <span class="comment-nickname">{{ comment.nickname }}</span>
              <span class="comment-time">{{ comment.time }}</span>
            </div>
            <p class="comment-content">{{ comment.content }}</p>
            <Divider />
          </div>
        </div>
      </section>

      <aside class="sidebar-right">
        <div class="panel message-panel">
          <h3>留言板</h3>
          <Divider />
          <div class="message-form">
            <md-outlined-text-field label="昵称" :value="msgNickname" @input="msgNickname = $event.target.value" placeholder="你的昵称"></md-outlined-text-field>
            <md-outlined-text-field label="留言" :value="msgContent" @input="msgContent = $event.target.value" placeholder="说点什么..." type="textarea" rows="3"></md-outlined-text-field>
            <md-filled-button @click="submitMessage" :disabled="!msgNickname || !msgContent">发送</md-filled-button>
          </div>
          <Divider />
          <div class="message-list">
            <div v-for="msg in filteredMessages" :key="msg.id" class="message-item">
              <div class="message-header">
                <span class="msg-nickname">{{ msg.nickname }}</span>
                <span class="msg-time">{{ msg.time }}</span>
              </div>
              <p class="msg-content">{{ msg.content }}</p>
              <div class="message-actions">
                <md-icon-button @click="toggleMsgLike(msg)" class="action-btn" :class="{ liked: isMsgLiked(msg) }">
                  <md-icon>{{ isMsgLiked(msg) ? 'favorite' : 'favorite_border' }}</md-icon>
                </md-icon-button>
                <span class="action-count">{{ msg.likes || 0 }}</span>
              </div>
              <Divider />
            </div>
          </div>
        </div>
      </aside>
    </main>

    <md-dialog :open="showSettings" @close="showSettings = false">
      <div slot="headline">设置</div>
      <div slot="content" class="settings-content">
        <div class="setting-item">
          <span>暗色模式</span>
          <md-switch :selected="darkMode" @change="toggleDarkMode"></md-switch>
        </div>
        <Divider />
        <div class="admin-section">
          <h4>留言管理</h4>
          <Divider />
          <template v-if="!isAdmin">
            <div class="login-form">
              <md-outlined-text-field label="管理员密码" type="password" :value="adminPassword" @input="adminPassword = $event.target.value" placeholder="请输入密码" @keydown.enter="adminLogin"></md-outlined-text-field>
              <md-filled-button @click="adminLogin" :disabled="!adminPassword">登录</md-filled-button>
              <p v-if="loginError" class="error-tip">密码错误</p>
            </div>
          </template>
          <template v-else>
            <div class="admin-header">
              <span>已登录管理员</span>
              <md-filled-tonal-button @click="adminLogout">退出</md-filled-tonal-button>
            </div>
          </template>
        </div>
      </div>
      <div slot="actions">
        <md-filled-button @click="showSettings = false">关闭</md-filled-button>
      </div>
    </md-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { marked } from 'marked'
import SearchBar from './SearchBar.vue'
import Divider from './Divider.vue'

const searchQuery = ref('')
const articleSort = ref('time')
const selectedArticle = ref(null)
const renderedArticle = ref('')
const articleLikeCount = ref(0)
const articleLiked = ref(false)
const articleComments = ref([])
const commentNickname = ref('')
const commentContent = ref('')

const msgNickname = ref('')
const msgContent = ref('')
const messages = ref([])

const homeContent = ref('')
const articles = ref([])

const showSettings = ref(false)
const darkMode = ref(false)
const isAdmin = ref(false)
const adminPassword = ref('')
const loginError = ref(false)

const LIKE_KEY = 'm3eblog_likes'
const COMMENT_KEY = 'm3eblog_comments'
const MSG_KEY = 'm3eblog_messages'
const NICKNAME_KEY = 'm3eblog_nickname'
const DARK_KEY = 'm3eblog_dark_mode'
const AUTH_KEY = 'm3eblog_admin_auth'
const ADMIN_PASSWORD = 'm3de2025'

const mdModules = import.meta.glob('/articles/*.md', { as: 'raw', eager: true })

function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/)
  if (!match) return { meta: {}, content: raw }
  const frontmatter = {}
  match[1].split('\n').forEach(line => {
    const [key, ...rest] = line.split(':')
    if (key) frontmatter[key.trim()] = rest.join(':').trim()
  })
  return { meta: frontmatter, content: match[2] }
}

onMounted(async () => {
  const stored = localStorage.getItem(DARK_KEY)
  if (stored === 'true') {
    darkMode.value = true
  } else if (stored === null) {
    darkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  isAdmin.value = sessionStorage.getItem(AUTH_KEY) === 'true'

  const list = []
  for (const path in mdModules) {
    const slug = path.split('/').pop().replace('.md', '')
    const { meta, content } = parseFrontmatter(mdModules[path])
    list.push({ slug, title: meta.title || slug, date: meta.date || '', raw: content, likes: 0 })
  }

  const allLikes = JSON.parse(localStorage.getItem(LIKE_KEY) || '{}')
  list.forEach(a => { a.likes = allLikes[a.slug]?.count || 0 })
  list.sort((a, b) => (b.date > a.date ? 1 : -1))
  articles.value = list

  const savedNickname = sessionStorage.getItem(NICKNAME_KEY)
  if (savedNickname) {
    commentNickname.value = savedNickname
    msgNickname.value = savedNickname
  }

  const msgStored = localStorage.getItem(MSG_KEY)
  if (msgStored) {
    try { messages.value = JSON.parse(msgStored) } catch { messages.value = [] }
  }

  try {
    const res = await fetch('/content/home.md')
    const md = await res.text()
    const { content } = parseFrontmatter(md)
    homeContent.value = marked.parse(content)
  } catch {
    homeContent.value = '<p>加载中...</p>'
  }
})

function toggleDarkMode(e) {
  darkMode.value = e.target.selected
  if (darkMode.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem(DARK_KEY, 'true')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem(DARK_KEY, 'false')
  }
}

function adminLogin() {
  if (adminPassword.value === ADMIN_PASSWORD) {
    isAdmin.value = true
    loginError.value = false
    sessionStorage.setItem(AUTH_KEY, 'true')
    adminPassword.value = ''
  } else {
    loginError.value = true
  }
}

function adminLogout() {
  isAdmin.value = false
  sessionStorage.removeItem(AUTH_KEY)
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

const filteredArticles = computed(() => {
  let list = [...articles.value]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(a => a.title.toLowerCase().includes(q) || a.raw.toLowerCase().includes(q))
  }
  if (articleSort.value === 'hot') list.sort((a, b) => b.likes - a.likes)
  return list
})

const filteredMessages = computed(() => {
  let list = [...messages.value]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(m => m.nickname.toLowerCase().includes(q) || m.content.toLowerCase().includes(q))
  }
  return list
})

function openArticle(article) {
  selectedArticle.value = article
  loadArticleData(article.slug)
}

function loadArticleData(slug) {
  const allLikes = JSON.parse(localStorage.getItem(LIKE_KEY) || '{}')
  articleLikeCount.value = allLikes[slug]?.count || 0
  articleLiked.value = allLikes[slug]?.liked || false
  const allComments = JSON.parse(localStorage.getItem(COMMENT_KEY) || '{}')
  articleComments.value = allComments[slug] || []
  renderedArticle.value = marked.parse(selectedArticle.value.raw)
}

function toggleArticleLike() {
  if (!selectedArticle.value) return
  const slug = selectedArticle.value.slug
  const allLikes = JSON.parse(localStorage.getItem(LIKE_KEY) || '{}')
  if (!allLikes[slug]) allLikes[slug] = { count: 0, liked: false }
  if (articleLiked.value) { allLikes[slug].count--; allLikes[slug].liked = false }
  else { allLikes[slug].count++; allLikes[slug].liked = true }
  articleLiked.value = allLikes[slug].liked
  articleLikeCount.value = allLikes[slug].count
  localStorage.setItem(LIKE_KEY, JSON.stringify(allLikes))
  const art = articles.value.find(a => a.slug === slug)
  if (art) art.likes = allLikes[slug].count
}

function submitComment() {
  if (!commentNickname.value || !commentContent.value || !selectedArticle.value) return
  const slug = selectedArticle.value.slug
  const allComments = JSON.parse(localStorage.getItem(COMMENT_KEY) || '{}')
  if (!allComments[slug]) allComments[slug] = []
  allComments[slug].unshift({ id: generateId(), nickname: commentNickname.value, content: commentContent.value, time: new Date().toLocaleString(), likes: 0, likedBy: [], replies: [] })
  localStorage.setItem(COMMENT_KEY, JSON.stringify(allComments))
  articleComments.value = allComments[slug]
  sessionStorage.setItem(NICKNAME_KEY, commentNickname.value)
  commentContent.value = ''
}

function submitMessage() {
  if (!msgNickname.value || !msgContent.value) return
  const msg = { id: generateId(), nickname: msgNickname.value, content: msgContent.value, time: new Date().toLocaleString(), likes: 0, likedBy: [], replies: [] }
  messages.value.unshift(msg)
  localStorage.setItem(MSG_KEY, JSON.stringify(messages.value))
  sessionStorage.setItem(NICKNAME_KEY, msgNickname.value)
  msgContent.value = ''
}

function isMsgLiked(msg) { return (msg.likedBy || []).includes(msgNickname.value) }

function toggleMsgLike(msg) {
  if (!msgNickname.value) { alert('请先输入昵称'); return }
  if (!msg.likedBy) msg.likedBy = []
  if (!msg.likes) msg.likes = 0
  const idx = msg.likedBy.indexOf(msgNickname.value)
  if (idx === -1) { msg.likedBy.push(msgNickname.value); msg.likes++ }
  else { msg.likedBy.splice(idx, 1); msg.likes-- }
  localStorage.setItem(MSG_KEY, JSON.stringify(messages.value))
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => alert('已复制: ' + text)).catch(() => alert(text))
}
</script>

<style scoped>
.desktop-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, var(--md-sys-color-surface) 0%, var(--md-sys-color-surface-container) 100%);
}

.desktop-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: linear-gradient(90deg, #6750A4 0%, #4F378B 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(103, 80, 164, 0.3);
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.site-title {
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0;
  color: white;
}

.site-subtitle {
  font-size: 0.875rem;
  opacity: 0.8;
}

.header-center {
  flex: 1;
  max-width: 400px;
  margin: 0 24px;
}

.header-center :deep(md-outlined-text-field) {
  --md-outlined-text-field-container-color: rgba(255, 255, 255, 0.15);
  --md-outlined-text-field-label-text-color: rgba(255, 255, 255, 0.7);
  --md-outlined-text-field-input-text-color: white;
  --md-outlined-text-field-hover-label-text-color: white;
  --md-outlined-text-field-hover-outline-color: rgba(255, 255, 255, 0.5);
  --md-outlined-text-field-focus-outline-color: white;
  --md-outlined-text-field-caret-color: white;
}

.header-right {
  display: flex;
  gap: 8px;
}

.header-right md-icon-button {
  --md-icon-button-icon-color: white;
}

.desktop-main {
  display: flex;
  gap: 20px;
  padding: 20px 24px;
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.sidebar-left {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.content-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sidebar-right {
  width: 320px;
  flex-shrink: 0;
}

.panel {
  background: var(--md-sys-color-surface-container-lowest);
  border-radius: var(--m3-shape-large);
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--md-sys-color-outline-variant);
  transition: box-shadow 0.2s ease;
}

.panel:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.panel h3 {
  color: var(--md-sys-color-on-surface);
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 8px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-header h3 {
  margin: 0;
}

.sort-buttons {
  display: flex;
  gap: 8px;
}

.sort-buttons md-filled-tonal-button {
  --md-filled-tonal-button-container-color: var(--md-sys-color-surface-container-high);
  --md-filled-tonal-button-label-text-color: var(--md-sys-color-on-surface-variant);
  font-size: 0.75rem;
}

.sort-buttons md-filled-tonal-button.active {
  --md-filled-tonal-button-container-color: var(--md-sys-color-primary-container);
  --md-filled-tonal-button-label-text-color: var(--md-sys-color-on-primary-container);
}

.profile-content {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--md-sys-color-on-surface-variant);
}

.profile-content :deep(h1),
.profile-content :deep(h2) { display: none; }

.profile-content :deep(h3) {
  color: var(--md-sys-color-primary);
  font-size: 0.9rem;
  margin: 12px 0 4px;
}

.profile-content :deep(p) { margin: 4px 0; }

.friend-placeholder {
  text-align: center;
  color: var(--md-sys-color-on-surface-variant);
  padding: 16px;
  font-size: 0.875rem;
}

.article-item { cursor: pointer; }

.empty-state {
  text-align: center;
  color: var(--md-sys-color-on-surface-variant);
  padding: 24px;
}

.article-detail .article-date {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.875rem;
  margin: 4px 0 8px;
}

.markdown-body {
  line-height: 1.7;
  color: var(--md-sys-color-on-surface);
  font-size: 0.9rem;
}

.markdown-body :deep(h1) { display: none; }
.markdown-body :deep(h2) { margin-top: 16px; font-weight: 500; }
.markdown-body :deep(h3) { margin-top: 12px; font-weight: 500; }
.markdown-body :deep(code) {
  background: var(--md-sys-color-surface-container-high);
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 0.85em;
  color: var(--md-sys-color-primary);
}
.markdown-body :deep(pre) {
  background: var(--md-sys-color-surface-container);
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
}
.markdown-body :deep(blockquote) {
  border-left: 3px solid var(--md-sys-color-primary);
  margin: 8px 0;
  padding: 8px 12px;
  background: var(--md-sys-color-primary-container);
  border-radius: 0 8px 8px 0;
  color: var(--md-sys-color-on-primary-container);
}
.markdown-body :deep(a) { color: var(--md-sys-color-primary); text-decoration: none; }
.markdown-body :deep(a:hover) { text-decoration: underline; }
.markdown-body :deep(p) { margin: 6px 0; }

.article-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
}

.like-btn { --md-icon-button-icon-color: var(--md-sys-color-on-surface-variant); }
.like-btn.liked { --md-icon-button-icon-color: #E91E63; }
.like-count { color: var(--md-sys-color-on-surface-variant); font-size: 0.875rem; }

.comment-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 12px 0;
}

.comment-item { padding: 8px 0; }

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.comment-nickname { font-weight: 500; font-size: 0.875rem; color: var(--md-sys-color-on-surface); }
.comment-time { font-size: 0.7rem; color: var(--md-sys-color-on-surface-variant); }
.comment-content { margin: 0; font-size: 0.875rem; color: var(--md-sys-color-on-surface-variant); }

.message-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.message-list {
  max-height: 400px;
  overflow-y: auto;
}

.message-item { padding: 8px 0; }

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.msg-nickname { font-weight: 500; font-size: 0.875rem; color: var(--md-sys-color-on-surface); }
.msg-time { font-size: 0.7rem; color: var(--md-sys-color-on-surface-variant); }
.msg-content { margin: 0; font-size: 0.875rem; color: var(--md-sys-color-on-surface-variant); }

.message-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

.action-btn { opacity: 0.7; }
.action-btn:hover { opacity: 1; }
.liked { --md-icon-button-icon-color: #E91E63; opacity: 1; }
.action-count { font-size: 0.75rem; color: var(--md-sys-color-on-surface-variant); }

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
}

.setting-item span {
  color: var(--md-sys-color-on-surface);
}

.admin-section h4 {
  color: var(--md-sys-color-on-surface);
  font-size: 0.9rem;
  margin: 8px 0 4px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px 0;
}

.error-tip {
  color: var(--md-sys-color-error);
  margin: 0;
  font-size: 0.875rem;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
}

@media (max-width: 1024px) {
  .desktop-layout { display: none; }
}
</style>
