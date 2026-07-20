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

    <main class="desktop-main" :class="{ hidden: selectedArticle }">
      <aside class="sidebar-left">
        <div class="panel profile-panel">
          <h3>个人简介</h3>
          <Divider />
          <div class="profile-content" v-html="homeContent"></div>
        </div>
      </aside>

      <section class="content-main">
        <ArticleList :searchQuery="searchQuery" @select="openArticle" />
      </section>

      <aside class="sidebar-right">
        <div class="panel">
          <Messages />
        </div>
        <div class="panel">
          <Friend />
        </div>
        <div class="panel">
          <Contact />
        </div>
      </aside>
    </main>

    <ArticleDetail 
      v-if="selectedArticle" 
      :article="selectedArticle" 
      @close="selectedArticle = null" 
    />

    <md-dialog :open="showSettings" @close="showSettings = false">
      <div slot="headline">设置</div>
      <div slot="content" class="settings-content">
        <Settings />
      </div>
      <div slot="actions">
        <md-filled-button @click="showSettings = false">关闭</md-filled-button>
      </div>
    </md-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { marked } from 'marked'
import SearchBar from './SearchBar.vue'
import Divider from './Divider.vue'
import ArticleList from './ArticleList.vue'
import ArticleDetail from './ArticleDetail.vue'
import Messages from './Messages.vue'
import Contact from './Contact.vue'
import Friend from './Friend.vue'
import Settings from './Settings.vue'

const searchQuery = ref('')
const selectedArticle = ref(null)
const showSettings = ref(false)
const homeContent = ref('')

onMounted(async () => {
  try {
    const res = await fetch('/content/home.md')
    const md = await res.text()
    
    // Quick extract frontmatter content
    const match = md.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/)
    const content = match ? match[2] : md
    
    homeContent.value = marked.parse(content)
  } catch {
    homeContent.value = '<p>加载中...</p>'
  }
})

function openArticle(article) {
  selectedArticle.value = article
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
  --md-outlined-text-field-leading-icon-color: rgba(255, 255, 255, 0.7);
}

.header-center :deep(md-outlined-text-field:focus-within) {
  --md-outlined-text-field-container-color: rgba(255, 255, 255, 0.2);
  --md-outlined-text-field-label-text-color: white;
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
  height: calc(100vh - 56px);
  overflow: hidden;
}

.sidebar-left {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.content-main {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
}

.sidebar-right {
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.panel {
  background: var(--md-sys-color-surface-container-lowest);
  border-radius: var(--m3-shape-large);
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--md-sys-color-outline-variant);
}

.panel h3 {
  color: var(--md-sys-color-on-surface);
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 8px;
}

.profile-content {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--md-sys-color-on-surface-variant);
}

.profile-content :deep(h1),
.profile-content :deep(h2) { display: none; }
.profile-content :deep(h3) { color: var(--md-sys-color-primary); font-size: 0.9rem; margin: 12px 0 4px; }
.profile-content :deep(p) { margin: 4px 0; }

.hidden {
  display: none !important;
}

@media (max-width: 1024px) {
  .desktop-layout { display: none; }
}
</style>
