<template>
  <div class="article-container">
    <template v-if="!selectedArticle">
      <h2>文章</h2>
      <Divider />
      <div v-if="articles.length === 0">
        <md-list-item>
          <div slot="supporting-text">暂无文章</div>
        </md-list-item>
      </div>
      <md-list v-else>
        <md-list-item
          v-for="article in articles"
          :key="article.slug"
          @click="openArticle(article)"
          class="article-item"
        >
          <div slot="headline">{{ article.title }}</div>
          <div slot="supporting-text">{{ article.date }}</div>
          <md-icon slot="end">chevron_right</md-icon>
        </md-list-item>
      </md-list>
    </template>

    <template v-else>
      <md-filled-button @click="backToList" class="back-btn">
        <md-icon slot="icon">arrow_back</md-icon>
        返回列表
      </md-filled-button>
      <Divider />

      <div class="article-content">
        <p class="article-date">{{ selectedArticle.date }}</p>
        <Divider />
        <div v-html="renderedContent" class="markdown-body"></div>
      </div>

      <Divider />

      <div class="article-actions">
        <md-icon-button @click="toggleArticleLike" class="like-btn" :class="{ liked: articleLiked }">
          <md-icon>{{ articleLiked ? 'favorite' : 'favorite_border' }}</md-icon>
        </md-icon-button>
        <span class="like-count">{{ articleLikeCount }} 赞</span>
      </div>

      <Divider />

      <div class="comment-section">
        <h3>评论 ({{ comments.length }})</h3>
        <div class="comment-form">
          <md-outlined-text-field label="昵称" :value="commentNickname" @input="commentNickname = $event.target.value" placeholder="你的昵称"></md-outlined-text-field>
          <md-outlined-text-field label="评论" :value="commentContent" @input="commentContent = $event.target.value" placeholder="说点什么..." type="textarea" rows="3"></md-outlined-text-field>
          <md-filled-button @click="submitComment" :disabled="!commentNickname || !commentContent">发表评论</md-filled-button>
        </div>

        <div class="sort-bar" v-if="comments.length > 1">
          <span class="sort-label">排序：</span>
          <md-filled-tonal-button :class="{ active: commentSortBy === 'time' }" @click="commentSortBy = 'time'">
            <md-icon slot="icon">schedule</md-icon>
            最新
          </md-filled-tonal-button>
          <md-filled-tonal-button :class="{ active: commentSortBy === 'hot' }" @click="commentSortBy = 'hot'">
            <md-icon slot="icon">local_fire_department</md-icon>
            热门
          </md-filled-tonal-button>
        </div>

        <div v-if="comments.length === 0" class="empty-comments">
          <p>暂无评论，快来发表第一条吧！</p>
        </div>

        <div v-else class="comment-list">
          <div v-for="comment in sortedComments" :key="comment.id" class="comment-item">
            <div class="comment-header">
              <span class="comment-nickname">{{ comment.nickname }}</span>
              <div class="comment-right">
                <span class="comment-time">{{ comment.time }}</span>
                <md-icon-button v-if="isAdmin" @click="deleteComment(comment.id)" class="delete-comment-btn">
                  <md-icon>delete</md-icon>
                </md-icon-button>
              </div>
            </div>
            <p class="comment-content">{{ comment.content }}</p>

            <div class="comment-actions">
              <md-icon-button @click="toggleCommentLike(comment)" class="action-btn" :class="{ liked: isCommentLiked(comment) }">
                <md-icon>{{ isCommentLiked(comment) ? 'favorite' : 'favorite_border' }}</md-icon>
              </md-icon-button>
              <span class="like-count">{{ comment.likes || 0 }}</span>
              <md-icon-button @click="toggleReply(comment)" class="action-btn reply-btn">
                <md-icon>reply</md-icon>
              </md-icon-button>
              <span class="reply-count">{{ (comment.replies || []).length }}</span>
            </div>

            <div v-if="replyingTo === comment.id" class="reply-form">
              <md-outlined-text-field label="回复内容" :value="replyContent" @input="replyContent = $event.target.value" placeholder="写点回复..." type="textarea" rows="2"></md-outlined-text-field>
              <div class="edit-actions">
                <md-filled-tonal-button @click="cancelReply">取消</md-filled-tonal-button>
                <md-filled-button @click="submitReply(comment.id)" :disabled="!replyContent">回复</md-filled-button>
              </div>
            </div>

            <div v-if="comment.replies && comment.replies.length > 0" class="reply-list">
              <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                <div class="reply-header">
                  <span class="reply-nickname">{{ reply.nickname }}</span>
                  <span class="reply-time">{{ reply.time }}</span>
                </div>
                <p class="reply-content">{{ reply.content }}</p>
              </div>
            </div>

            <Divider />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { marked } from 'marked'
import Divider from './Divider.vue'

const articles = ref([])
const selectedArticle = ref(null)
const articleLikeCount = ref(0)
const articleLiked = ref(false)
const comments = ref([])
const commentNickname = ref('')
const commentContent = ref('')
const isAdmin = ref(false)
const commentSortBy = ref('time')
const replyingTo = ref(null)
const replyContent = ref('')

const LIKE_KEY = 'm3eblog_likes'
const COMMENT_KEY = 'm3eblog_comments'
const AUTH_KEY = 'm3eblog_admin_auth'
const NICKNAME_KEY = 'm3eblog_nickname'

const mdModules = import.meta.glob('/articles/*.md', { as: 'raw', eager: true })

function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/)
  if (!match) {
    const titleMatch = raw.match(/^#\s+(.+)$/m)
    return { meta: { title: titleMatch ? titleMatch[1] : '' }, content: raw }
  }
  const frontmatter = {}
  match[1].split('\n').forEach(line => {
    const [key, ...rest] = line.split(':')
    if (key) frontmatter[key.trim()] = rest.join(':').trim()
  })
  if (!frontmatter.title) {
    const titleMatch = match[2].match(/^#\s+(.+)$/m)
    if (titleMatch) frontmatter.title = titleMatch[1]
  }
  return { meta: frontmatter, content: match[2] }
}

onMounted(() => {
  const list = []
  for (const path in mdModules) {
    const slug = path.split('/').pop().replace('.md', '')
    const { meta, content } = parseFrontmatter(mdModules[path])
    list.push({
      slug,
      title: meta.title || slug,
      date: meta.date || '',
      raw: content
    })
  }
  list.sort((a, b) => (b.date > a.date ? 1 : -1))
  articles.value = list

  isAdmin.value = sessionStorage.getItem(AUTH_KEY) === 'true'

  const savedNickname = sessionStorage.getItem(NICKNAME_KEY)
  if (savedNickname) {
    commentNickname.value = savedNickname
  }
})

const renderedContent = computed(() => {
  if (!selectedArticle.value) return ''
  return marked.parse(selectedArticle.value.raw)
})

const sortedComments = computed(() => {
  const list = [...comments.value]
  if (commentSortBy.value === 'hot') {
    list.sort((a, b) => (b.likes || 0) - (a.likes || 0))
  }
  return list
})

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function openArticle(article) {
  selectedArticle.value = article
  loadArticleData()
}

function backToList() {
  selectedArticle.value = null
}

function loadArticleData() {
  if (!selectedArticle.value) return
  const slug = selectedArticle.value.slug

  const allLikes = JSON.parse(localStorage.getItem(LIKE_KEY) || '{}')
  articleLikeCount.value = allLikes[slug]?.count || 0
  articleLiked.value = allLikes[slug]?.liked || false

  const allComments = JSON.parse(localStorage.getItem(COMMENT_KEY) || '{}')
  comments.value = allComments[slug] || []
}

function toggleArticleLike() {
  if (!selectedArticle.value) return
  const slug = selectedArticle.value.slug
  const allLikes = JSON.parse(localStorage.getItem(LIKE_KEY) || '{}')

  if (!allLikes[slug]) {
    allLikes[slug] = { count: 0, liked: false }
  }

  if (articleLiked.value) {
    allLikes[slug].count--
    allLikes[slug].liked = false
    articleLiked.value = false
  } else {
    allLikes[slug].count++
    allLikes[slug].liked = true
    articleLiked.value = true
  }
  articleLikeCount.value = allLikes[slug].count
  localStorage.setItem(LIKE_KEY, JSON.stringify(allLikes))
}

function submitComment() {
  if (!commentNickname.value || !commentContent.value || !selectedArticle.value) return
  const slug = selectedArticle.value.slug
  const allComments = JSON.parse(localStorage.getItem(COMMENT_KEY) || '{}')

  if (!allComments[slug]) {
    allComments[slug] = []
  }

  allComments[slug].unshift({
    id: generateId(),
    nickname: commentNickname.value,
    content: commentContent.value,
    time: new Date().toLocaleString(),
    likes: 0,
    likedBy: [],
    replies: []
  })

  localStorage.setItem(COMMENT_KEY, JSON.stringify(allComments))
  comments.value = allComments[slug]
  sessionStorage.setItem(NICKNAME_KEY, commentNickname.value)
  commentContent.value = ''
}

function deleteComment(id) {
  if (!selectedArticle.value) return
  const slug = selectedArticle.value.slug
  const allComments = JSON.parse(localStorage.getItem(COMMENT_KEY) || '{}')

  if (allComments[slug]) {
    const index = allComments[slug].findIndex(c => c.id === id)
    if (index !== -1) {
      allComments[slug].splice(index, 1)
      localStorage.setItem(COMMENT_KEY, JSON.stringify(allComments))
      comments.value = allComments[slug]
    }
  }
}

function isCommentLiked(comment) {
  return (comment.likedBy || []).includes(commentNickname.value)
}

function toggleCommentLike(comment) {
  if (!commentNickname.value) {
    alert('请先输入昵称')
    return
  }
  if (!comment.likedBy) comment.likedBy = []
  if (!comment.likes) comment.likes = 0

  const idx = comment.likedBy.indexOf(commentNickname.value)
  if (idx === -1) {
    comment.likedBy.push(commentNickname.value)
    comment.likes++
  } else {
    comment.likedBy.splice(idx, 1)
    comment.likes--
  }

  const slug = selectedArticle.value.slug
  const allComments = JSON.parse(localStorage.getItem(COMMENT_KEY) || '{}')
  allComments[slug] = comments.value
  localStorage.setItem(COMMENT_KEY, JSON.stringify(allComments))
}

function toggleReply(comment) {
  if (replyingTo.value === comment.id) {
    replyingTo.value = null
    replyContent.value = ''
  } else {
    replyingTo.value = comment.id
    replyContent.value = ''
  }
}

function cancelReply() {
  replyingTo.value = null
  replyContent.value = ''
}

function submitReply(commentId) {
  if (!replyContent.value) return
  if (!commentNickname.value) {
    alert('请先输入昵称')
    return
  }

  const comment = comments.value.find(c => c.id === commentId)
  if (comment) {
    if (!comment.replies) comment.replies = []
    comment.replies.push({
      id: generateId(),
      nickname: commentNickname.value,
      content: replyContent.value,
      time: new Date().toLocaleString()
    })

    const slug = selectedArticle.value.slug
    const allComments = JSON.parse(localStorage.getItem(COMMENT_KEY) || '{}')
    allComments[slug] = comments.value
    localStorage.setItem(COMMENT_KEY, JSON.stringify(allComments))
  }
  replyingTo.value = null
  replyContent.value = ''
}
</script>

<style scoped>
.article-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 8px 0;
}
.article-item {
  cursor: pointer;
}
.back-btn {
  margin-bottom: 8px;
}
.article-content h1 {
  margin: 8px 0;
  color: var(--md-sys-color-on-surface);
  font-weight: 500;
}
.article-date {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.875rem;
  margin: 4px 0 8px;
}
.markdown-body {
  line-height: 1.7;
  color: var(--md-sys-color-on-surface);
}
.markdown-body :deep(h2) {
  margin-top: 24px;
  color: var(--md-sys-color-on-surface);
  font-weight: 500;
}
.markdown-body :deep(h3) {
  margin-top: 20px;
  color: var(--md-sys-color-on-surface);
  font-weight: 500;
}
.markdown-body :deep(code) {
  background: var(--md-sys-color-surface-container-high);
  padding: 2px 6px;
  border-radius: var(--m3-shape-extra-small);
  font-size: 0.875em;
  color: var(--md-sys-color-primary);
}
.markdown-body :deep(pre) {
  background: var(--md-sys-color-surface-container);
  padding: 16px;
  border-radius: var(--m3-shape-medium);
  overflow-x: auto;
}
.markdown-body :deep(pre code) {
  background: none;
  padding: 0;
  color: var(--md-sys-color-on-surface);
}
.markdown-body :deep(blockquote) {
  border-left: 4px solid var(--md-sys-color-primary);
  margin: 12px 0;
  padding: 12px 16px;
  background: var(--md-sys-color-primary-container);
  border-radius: 0 var(--m3-shape-medium) var(--m3-shape-medium) 0;
  color: var(--md-sys-color-on-primary-container);
}
.markdown-body :deep(a) {
  color: var(--md-sys-color-primary);
  text-decoration: none;
}
.markdown-body :deep(a:hover) {
  text-decoration: underline;
}
.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 24px;
}
.markdown-body :deep(li) {
  margin: 4px 0;
}
.markdown-body :deep(p) {
  margin: 8px 0;
}
.markdown-body :deep(strong) {
  color: var(--md-sys-color-on-surface);
  font-weight: 500;
}
.markdown-body :deep(hr) {
  border: none;
  border-top: 1px solid var(--md-sys-color-outline-variant);
  margin: 16px 0;
}

.article-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
}
.like-btn {
  --md-icon-button-icon-color: var(--md-sys-color-on-surface-variant);
}
.like-btn.liked {
  --md-icon-button-icon-color: #E91E63;
}
.like-count {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.875rem;
}

.comment-section {
  padding: 8px 0;
}
.comment-section h3 {
  color: var(--md-sys-color-on-surface);
  font-size: 1rem;
  margin: 0 0 12px;
}
.comment-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}
.sort-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
}
.sort-label {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.875rem;
}
.sort-bar md-filled-tonal-button {
  --md-filled-tonal-button-container-color: var(--md-sys-color-surface-container-high);
  --md-filled-tonal-button-label-text-color: var(--md-sys-color-on-surface-variant);
}
.sort-bar md-filled-tonal-button.active {
  --md-filled-tonal-button-container-color: var(--md-sys-color-primary-container);
  --md-filled-tonal-button-label-text-color: var(--md-sys-color-on-primary-container);
}
.empty-comments {
  text-align: center;
  color: var(--md-sys-color-on-surface-variant);
  padding: 24px;
}
.comment-item {
  padding: 12px 0;
}
.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}
.comment-nickname {
  font-weight: 500;
  color: var(--md-sys-color-on-surface);
}
.comment-right {
  display: flex;
  align-items: center;
  gap: 4px;
}
.comment-time {
  font-size: 0.75rem;
  color: var(--md-sys-color-on-surface-variant);
}
.comment-content {
  margin: 0;
  color: var(--md-sys-color-on-surface-variant);
  white-space: pre-wrap;
}
.comment-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
}
.like-count, .reply-count {
  font-size: 0.8rem;
  color: var(--md-sys-color-on-surface-variant);
  min-width: 16px;
}
.action-btn {
  opacity: 0.7;
}
.action-btn:hover {
  opacity: 1;
}
.reply-btn {
  --md-icon-button-icon-color: var(--md-sys-color-on-surface-variant);
}
.liked {
  --md-icon-button-icon-color: #E91E63;
  opacity: 1;
}
.delete-comment-btn {
  --md-icon-button-icon-color: var(--md-sys-color-error);
}
.reply-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}
.edit-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
.reply-list {
  margin-top: 8px;
  padding-left: 16px;
  border-left: 2px solid var(--md-sys-color-outline-variant);
}
.reply-item {
  padding: 8px 0;
}
.reply-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.reply-nickname {
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--md-sys-color-on-surface);
}
.reply-time {
  font-size: 0.7rem;
  color: var(--md-sys-color-on-surface-variant);
}
.reply-content {
  margin: 0;
  font-size: 0.875rem;
  color: var(--md-sys-color-on-surface-variant);
  white-space: pre-wrap;
}
</style>
