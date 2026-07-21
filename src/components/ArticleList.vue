<template>
  <div class="panel article-panel">
    <div class="panel-header">
      <h3>文章</h3>
      <div class="sort-buttons">
        <md-filled-tonal-button :style="articleSort === 'time' ? activeSortStyle : baseSortStyle" @click="articleSort = 'time'">
          <md-icon slot="icon">schedule</md-icon>
          最新
        </md-filled-tonal-button>
        <md-filled-tonal-button :style="articleSort === 'hot' ? activeSortStyle : baseSortStyle" @click="articleSort = 'hot'">
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
        v-for="article in pagedArticles"
        :key="article.slug"
        @click="$emit('select', article)"
        class="article-item"
      >
        <div slot="headline">{{ article.title }}</div>
        <div slot="supporting-text">{{ article.date }}</div>
        <md-icon slot="end">chevron_right</md-icon>
      </md-list-item>
    </md-list>
    <div v-if="totalArticlePages > 1" class="pagination">
      <md-filled-tonal-button :disabled="articlePage === 1" @click="articlePage--">
        <md-icon slot="icon">chevron_left</md-icon>
        上一页
      </md-filled-tonal-button>
      <span class="page-info">{{ articlePage }} / {{ totalArticlePages }}</span>
      <md-filled-tonal-button :disabled="articlePage === totalArticlePages" @click="articlePage++">
        下一页
        <md-icon slot="icon">chevron_right</md-icon>
      </md-filled-tonal-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import Divider from './Divider.vue'
import articlesMeta from 'virtual:articles-meta'
import { getArticleLikes, getArticleComments } from '../api/index'

const baseSortStyle = '--md-filled-tonal-button-container-color:var(--md-sys-color-surface-container-high);--md-filled-tonal-button-label-text-color:var(--md-sys-color-on-surface-variant)'
const activeSortStyle = '--md-filled-tonal-button-container-color:var(--md-sys-color-primary-container);--md-filled-tonal-button-label-text-color:var(--md-sys-color-on-primary-container)'

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
})

defineEmits(['select'])

const articleSort = ref('time')
const articlePage = ref(1)
const articlesPerPage = 6
const articles = ref([])

onMounted(async () => {
  const list = [...articlesMeta]
  for (const article of list) {
    const [likesData, comments] = await Promise.all([
      getArticleLikes(article.slug),
      getArticleComments(article.slug)
    ])
    article.likes = likesData.count || 0
    article.commentCount = comments.length || 0
    article.hot = article.likes + article.commentCount
  }
  list.sort((a, b) => (b.date > a.date ? 1 : -1))
  articles.value = list
})

const filteredArticles = computed(() => {
  let list = [...articles.value]
  if (props.searchQuery) {
    const q = props.searchQuery.toLowerCase()
    list = list.filter(a => a.title.toLowerCase().includes(q))
  }
  if (articleSort.value === 'hot') list.sort((a, b) => b.hot - a.hot)
  else list.sort((a, b) => (b.date > a.date ? 1 : -1))
  return list
})

watch([() => props.searchQuery, articleSort], () => {
  articlePage.value = 1
})

const pagedArticles = computed(() => {
  const start = (articlePage.value - 1) * articlesPerPage
  return filteredArticles.value.slice(start, start + articlesPerPage)
})

const totalArticlePages = computed(() => Math.ceil(filteredArticles.value.length / articlesPerPage))
</script>

<style scoped>
.panel {
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
.panel-header h3 { margin: 0; }
.sort-buttons {
  display: flex;
  gap: 8px;
}
.sort-buttons md-filled-tonal-button {
  --md-filled-tonal-button-container-color: var(--md-sys-color-surface-container-high);
  --md-filled-tonal-button-label-text-color: var(--md-sys-color-on-surface-variant);
  font-size: 0.75rem;
}
.article-item { cursor: pointer; }
.empty-state { text-align: center; color: var(--md-sys-color-on-surface-variant); padding: 24px; }
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 16px;
  margin-top: 16px;
  background: var(--md-sys-color-surface-container);
  border-radius: var(--m3-shape-large);
  box-shadow: var(--m3-elevation-2);
}
.pagination md-filled-tonal-button {
  --md-filled-tonal-button-container-color: var(--md-sys-color-primary-container);
  --md-filled-tonal-button-label-text-color: var(--md-sys-color-on-primary-container);
}
.page-info { font-size: 0.875rem; color: var(--md-sys-color-on-surface-variant); }
</style>
