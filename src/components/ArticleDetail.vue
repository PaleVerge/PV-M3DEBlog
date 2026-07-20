<template>
  <div class="article-fullscreen" v-if="article">
    <div class="article-fullscreen-left">
      <div class="panel article-detail">
        <div class="panel-header">
          <md-icon-button @click="$emit('close')">
            <md-icon>close</md-icon>
          </md-icon-button>
          <h3>{{ article.title }}</h3>
        </div>
        <Divider />
        <p class="article-date">{{ article.date }}</p>
        <div class="article-scroll">
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
      </div>
    </div>
    <div class="article-fullscreen-right">
      <div class="panel">
        <h3>文章目录</h3>
        <Divider />
        <div class="article-toc">
          <p>{{ article.title }}</p>
          <p class="toc-date">{{ article.date }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { marked } from 'marked'
import Divider from './Divider.vue'
import { getArticleLikes, toggleArticleLikeAPI, getArticleComments, addArticleComment } from '../api/index'

const props = defineProps({
  article: {
    type: Object,
    default: null
  }
})

defineEmits(['close'])

const articleLikeCount = ref(0)
const articleLiked = ref(false)
const articleComments = ref([])
const commentNickname = ref('')
const commentContent = ref('')
const NICKNAME_KEY = 'm3eblog_nickname'

const mdModules = import.meta.glob('/articles/*.md', { query: '?raw', import: 'default' })

const renderedArticle = ref('')

watch(() => props.article, async (newVal) => {
  if (newVal) {
    await loadArticleData(newVal.slug)
    
    // Lazy load content
    if (!newVal.raw) {
      const fetcher = mdModules[`/articles/${newVal.slug}.md`]
      if (fetcher) {
        let raw = await fetcher()
        const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/)
        if (match) raw = match[2]
        newVal.raw = raw
      }
    }
    renderedArticle.value = marked.parse(newVal.raw || '')
  }
}, { immediate: true })

onMounted(() => {
  const savedNickname = sessionStorage.getItem(NICKNAME_KEY)
  if (savedNickname) {
    commentNickname.value = savedNickname
  }
})

async function loadArticleData(slug) {
  const likesData = await getArticleLikes(slug)
  articleLikeCount.value = likesData.count || 0
  articleLiked.value = likesData.liked || false
  
  articleComments.value = await getArticleComments(slug)
}

async function toggleArticleLike() {
  if (!props.article) return
  const slug = props.article.slug
  const newData = await toggleArticleLikeAPI(slug, articleLiked.value)
  articleLikeCount.value = newData.count
  articleLiked.value = newData.liked
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

async function submitComment() {
  if (!commentNickname.value || !commentContent.value || !props.article) return
  const slug = props.article.slug
  
  const newComment = {
    id: generateId(),
    nickname: commentNickname.value,
    content: commentContent.value,
    time: new Date().toLocaleString(),
    likes: 0,
    likedBy: [],
    replies: []
  }
  
  articleComments.value = await addArticleComment(slug, newComment)
  sessionStorage.setItem(NICKNAME_KEY, commentNickname.value)
  commentContent.value = ''
}
</script>

<style scoped>
.article-fullscreen {
  position: fixed;
  top: 56px;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  background: var(--md-sys-color-surface);
  z-index: 90;
}

.article-fullscreen-left {
  flex: 1;
  padding: 20px;
  overflow: hidden;
  display: flex;
}

.article-fullscreen-left .panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel {
  background: var(--md-sys-color-surface-container-lowest);
  border-radius: var(--m3-shape-large);
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--md-sys-color-outline-variant);
}

.article-fullscreen-left .panel-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.article-fullscreen-left .panel-header h3 {
  flex: 1;
  margin-left: 12px;
  font-size: 1.1rem;
}

.article-scroll {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
}

.article-fullscreen-right {
  width: 280px;
  padding: 20px 20px 20px 0;
  flex-shrink: 0;
}

.article-fullscreen-right .panel {
  position: sticky;
  top: 76px;
}

.article-toc p {
  margin: 4px 0;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.875rem;
}

.toc-date {
  font-size: 0.75rem !important;
  color: var(--md-sys-color-on-surface-variant) !important;
}

.article-date {
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
.comment-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.comment-nickname { font-weight: 500; font-size: 0.875rem; color: var(--md-sys-color-on-surface); }
.comment-time { font-size: 0.7rem; color: var(--md-sys-color-on-surface-variant); }
.comment-content { margin: 0; font-size: 0.875rem; color: var(--md-sys-color-on-surface-variant); }
</style>
