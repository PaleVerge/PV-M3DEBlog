<template>
  <div class="article-detail-view" v-if="selectedArticle">
    <div class="article-header">
      <md-icon-button @click="clearArticle">
        <md-icon>close</md-icon>
      </md-icon-button>
      <div class="header-info">
        <h3 class="header-title">{{ selectedArticle.title }}</h3>
        <p class="header-date">{{ selectedArticle.date }}</p>
      </div>
    </div>

    <div class="article-scroll">
      <article v-html="renderedArticle" class="markdown-body two-col"></article>
    </div>

    <div class="fab-group">
      <md-fab class="fab-like" :class="{ liked: articleLiked }" @click="toggleArticleLike" aria-label="点赞">
        <md-icon slot="icon">
          {{ articleLiked ? 'favorite' : 'favorite_border' }}
        </md-icon>
      </md-fab>
      <div v-if="articleLikeCount > 0" class="fab-badge like-badge">{{ articleLikeCount }}</div>

      <md-fab class="fab-comment" @click="showComments = true" aria-label="评论">
        <md-icon slot="icon">chat_bubble_outline</md-icon>
      </md-fab>
      <div v-if="articleComments.length > 0" class="fab-badge comment-badge">{{ articleComments.length }}</div>
    </div>

    <md-dialog :open="showComments" @close="showComments = false" class="comment-dialog">
      <div slot="headline">评论 ({{ articleComments.length }})</div>
      <div slot="content" class="comment-dialog-body">
        <div class="comment-form">
          <md-outlined-text-field label="昵称" :value="commentNickname" @input="commentNickname = $event.target.value" placeholder="昵称"></md-outlined-text-field>
          <md-outlined-text-field label="评论" :value="commentContent" @input="commentContent = $event.target.value" placeholder="说点什么..." type="textarea" rows="2"></md-outlined-text-field>
          <md-filled-button @click="submitComment" :disabled="!commentNickname || !commentContent">发表评论</md-filled-button>
        </div>
        <Divider />
        <div v-if="articleComments.length === 0" class="empty-comments">
          <p>暂无评论，快来发表第一条吧！</p>
        </div>
        <div v-else class="comment-list">
          <div v-for="comment in articleComments" :key="comment.id" class="comment-item">
            <div class="comment-header">
              <span class="comment-nickname">{{ comment.nickname }}</span>
              <div class="comment-right">
                <span class="comment-time">{{ comment.time }}</span>
                <md-icon-button v-if="isAdmin" @click="deleteComment(comment.id)" class="admin-delete">
                  <md-icon>delete</md-icon>
                </md-icon-button>
              </div>
            </div>
            <p class="comment-content">{{ comment.content }}</p>
            <Divider />
          </div>
        </div>
      </div>
      <div slot="actions">
        <md-filled-button @click="showComments = false">关闭</md-filled-button>
      </div>
    </md-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { marked } from 'marked'
import Divider from './Divider.vue'
import { getArticleLikes, toggleArticleLikeAPI, getArticleComments, addArticleComment, isAdminAPI, deleteArticleCommentAPI } from '../api/index'
import { useArticleState } from '../composables/useArticleState'

import '@material/web/fab/fab.js'
import '@material/web/icon/icon.js'

const { selectedArticle, clearArticle, setArticleRaw, getArticleRaw } = useArticleState()

const articleLikeCount = ref(0)
const articleLiked = ref(false)
const articleComments = ref([])
const commentNickname = ref('')
const commentContent = ref('')
const isAdmin = ref(false)
const showComments = ref(false)
const NICKNAME_KEY = 'm3eblog_nickname'

function closeDialogs() { showComments.value = false }

const mdModules = import.meta.glob('/articles/*.md', { query: '?raw', import: 'default' })

const renderedArticle = computed(() => {
  if (!selectedArticle.value) return ''
  const raw = getArticleRaw(selectedArticle.value.slug)
  if (!raw) return ''
  return marked.parse(raw)
})

watch(selectedArticle, async (article) => {
  if (article) {
    await loadArticleContent(article)
    await loadArticleData(article.slug)
  }
}, { immediate: true })

onMounted(async () => {
  window.addEventListener('close-all-dialogs', closeDialogs)
  const savedNickname = sessionStorage.getItem(NICKNAME_KEY)
  if (savedNickname) commentNickname.value = savedNickname
  isAdmin.value = await isAdminAPI()
})

onUnmounted(() => window.removeEventListener('close-all-dialogs', closeDialogs))

async function loadArticleContent(article) {
  const slug = article.slug
  if (getArticleRaw(slug)) return
  const fetcher = mdModules[`/articles/${slug}.md`]
  if (fetcher) {
    let raw = await fetcher()
    const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/)
    if (match) raw = match[2]
    setArticleRaw(slug, raw)
  }
}

async function loadArticleData(slug) {
  const likesData = await getArticleLikes(slug)
  articleLikeCount.value = likesData.count || 0
  articleLiked.value = likesData.liked || false
  articleComments.value = await getArticleComments(slug)
}

async function toggleArticleLike() {
  if (!selectedArticle.value) return
  const slug = selectedArticle.value.slug
  const newData = await toggleArticleLikeAPI(slug, articleLiked.value)
  articleLikeCount.value = newData.count
  articleLiked.value = newData.liked
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

async function submitComment() {
  if (!commentNickname.value || !commentContent.value || !selectedArticle.value) return
  const slug = selectedArticle.value.slug
  const newComment = {
    id: generateId(), nickname: commentNickname.value, content: commentContent.value,
    time: new Date().toLocaleString(), likes: 0, likedBy: [], replies: []
  }
  articleComments.value = await addArticleComment(slug, newComment)
  sessionStorage.setItem(NICKNAME_KEY, commentNickname.value)
  commentContent.value = ''
}

async function deleteComment(commentId) {
  if (!selectedArticle.value) return
  try {
    await deleteArticleCommentAPI(selectedArticle.value.slug, commentId)
    articleComments.value = articleComments.value.filter(c => c.id !== commentId)
  } catch (e) {
    alert('删除失败')
  }
}
</script>

<style scoped>
.article-detail-view {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--md-sys-color-surface);
  z-index: 200;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.article-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 24px;
  background: var(--panel-bg);
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
}

.header-info { flex: 1; min-width: 0; }
.header-title { margin: 0; font-size: 1.05rem; font-weight: 500; color: var(--md-sys-color-on-surface); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.header-date { color: var(--md-sys-color-on-surface-variant); font-size: 0.75rem; margin: 1px 0 0; }

.article-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
}

.markdown-body {
  line-height: 1.8;
  color: var(--md-sys-color-on-surface);
  font-size: 0.9rem;
}

.markdown-body.two-col {
  column-count: 2;
  column-gap: 36px;
  column-rule: 1px solid var(--md-sys-color-outline-variant);
}

.markdown-body :deep(h1) { display: none; }
.markdown-body :deep(h2) { margin-top: 0; font-weight: 500; break-after: avoid; }
.markdown-body :deep(h3) { margin-top: 12px; font-weight: 500; break-after: avoid; }
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
  break-inside: avoid;
}
.markdown-body :deep(blockquote) {
  border-left: 3px solid var(--md-sys-color-primary);
  margin: 8px 0;
  padding: 8px 12px;
  background: var(--md-sys-color-primary-container);
  border-radius: 0 8px 8px 0;
  color: var(--md-sys-color-on-primary-container);
  break-inside: avoid;
}
.markdown-body :deep(a) { color: var(--md-sys-color-primary); text-decoration: none; }
.markdown-body :deep(a:hover) { text-decoration: underline; }
.markdown-body :deep(p) { margin: 6px 0; }
.markdown-body :deep(img) { max-width: 100%; break-inside: avoid; }

.fab-group {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 16px;
}

.fab-like {
  --md-fab-container-color: var(--md-sys-color-surface-container-high);
  --md-fab-icon-color: var(--md-sys-color-on-surface-variant);
}

.fab-like.liked {
  --md-fab-container-color: var(--md-sys-color-surface-container-highest);
  --md-fab-icon-color: var(--md-sys-color-primary);
}

.fab-comment {
  --md-fab-container-color: var(--md-sys-color-surface-container-high);
  --md-fab-icon-color: var(--md-sys-color-on-surface-variant);
}

.fab-badge {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--md-sys-color-on-surface-variant);
  background: var(--md-sys-color-surface-container-high);
  border-radius: var(--m3-shape-full);
  padding: 1px 6px;
  margin-top: -12px;
  min-width: 20px;
  text-align: center;
}

.comment-dialog {
  min-width: min(90vw, 520px);
}

.comment-dialog-body {
  max-height: 60vh;
  overflow-y: auto;
}

.comment-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.empty-comments {
  text-align: center;
  color: var(--md-sys-color-on-surface-variant);
  padding: 16px;
  font-size: 0.85rem;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.comment-item { padding: 6px 0; }
.comment-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; }
.comment-right { display: flex; align-items: center; gap: 4px; }
.comment-nickname { font-weight: 500; font-size: 0.8rem; color: var(--md-sys-color-on-surface); }
.comment-time { font-size: 0.7rem; color: var(--md-sys-color-on-surface-variant); }
.comment-content { margin: 0; font-size: 0.8rem; color: var(--md-sys-color-on-surface-variant); white-space: pre-wrap; }
.admin-delete { --md-icon-button-icon-color: var(--md-sys-color-error); opacity: 0.6; }
.admin-delete:hover { opacity: 1; background-color: var(--md-sys-color-error-container); }

@media (max-width: 1024px) {
  .article-detail-view { position: relative; top: auto; }
  .article-scroll { padding: 12px; }
  .markdown-body.two-col { column-count: 1; }
  .fab-group { bottom: 16px; right: 16px; }
}
</style>
