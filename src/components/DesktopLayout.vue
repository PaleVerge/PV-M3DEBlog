<template>
  <div class="desktop-layout">
    <div class="floating-bar">
      <div class="floating-search">
        <SearchBar v-model="searchQuery" />
      </div>
      <md-icon-button class="floating-settings" @click="showSettings = true" aria-label="设置">
        <md-icon>settings</md-icon>
      </md-icon-button>
    </div>

    <a class="floating-title" href="https://github.com/paleverge" target="_blank" rel="noopener">
      <span>Wwhip's-Blog</span>
      <md-icon class="title-icon">open_in_new</md-icon>
    </a>

    <div class="floating-messages">
      <Messages compact />
    </div>

    <main class="desktop-main" :class="{ hidden: selectedArticle }">
      <aside class="sidebar-left">
        <div class="panel bulletin-panel">
          <div class="bulletin-content" v-html="homeContent"></div>
        </div>
      </aside>

      <section class="content-main">
        <ArticleList :searchQuery="searchQuery" @select="selectArticle" @selectProject="projectRef?.openProject()" />
      </section>

      <aside class="sidebar-right">
        <div class="panel panel-compact">
          <Friend compact />
        </div>
        <div class="panel">
          <Contact />
        </div>
        <div class="panel panel-compact">
          <MyProject ref="projectRef" />
        </div>
      </aside>
    </main>

    <ArticleDetail v-if="selectedArticle" />

    <md-dialog :open="showSettings" @close="showSettings = false" class="settings-dialog">
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

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { marked } from 'marked'
import SearchBar from './SearchBar.vue'
import ArticleList from './ArticleList.vue'
import ArticleDetail from './ArticleDetail.vue'
import Messages from './Messages.vue'
import Contact from './Contact.vue'
import Friend from './Friend.vue'
import MyProject from './MyProject.vue'
import Settings from './Settings.vue'
import { useArticleState } from '../composables/useArticleState'

const { selectedArticle, selectArticle } = useArticleState()

const searchQuery = ref('')
const showSettings = ref(false)
const homeContent = ref('')
const projectRef = ref(null)

function closeDialogs() { showSettings.value = false }

onMounted(async () => {
  window.addEventListener('close-all-dialogs', closeDialogs)
  try {
    const res = await fetch('/content/home.md')
    const md = await res.text()

    const match = md.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/)
    const content = match ? match[2] : md

    homeContent.value = marked.parse(content)
  } catch {
    homeContent.value = '<p>加载中...</p>'
  }
})

onUnmounted(() => window.removeEventListener('close-all-dialogs', closeDialogs))
</script>

<style scoped>
.desktop-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, var(--md-sys-color-surface) 0%, var(--md-sys-color-surface-container) 100%);
}

.floating-bar {
  position: fixed;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: calc(100vw - 24px);
}

.floating-title {
  position: fixed;
  top: 12px;
  left: 24px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 56px;
  padding: 0 20px;
  border-radius: var(--m3-shape-full);
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  box-shadow: var(--m3-elevation-2);
  transition: filter 0.2s;
}

.floating-title:hover {
  filter: brightness(0.95);
}

.title-icon {
  font-size: 18px;
  color: var(--md-sys-color-on-primary-container);
}

.floating-messages {
  position: fixed;
  top: 12px;
  right: 24px;
  z-index: 100;
  width: 320px;
  border-radius: var(--m3-shape-large);
  background: var(--md-sys-color-surface-container);
  box-shadow: var(--m3-elevation-2);
  padding: 4px 12px;
  height: 56px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.floating-search {
  flex: 1;
  min-width: 0;
  max-width: 360px;
  box-shadow: var(--m3-elevation-3);
  background: var(--md-sys-color-surface-container);
  padding: 4px;
  border-radius: var(--m3-shape-small);
}

.floating-settings {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: var(--m3-shape-full);
  background: var(--md-sys-color-primary-container);
  box-shadow: var(--m3-elevation-2);
  --md-icon-button-icon-color: var(--md-sys-color-on-primary-container);
  --md-icon-button-container-shape: var(--m3-shape-full);
  --md-icon-button-hover-state-layer-color: transparent;
  --md-icon-button-pressed-state-layer-color: transparent;
}

.floating-settings md-icon-button {
  border-radius: var(--m3-shape-full);
  overflow: hidden;
}

.desktop-main {
  display: flex;
  gap: 20px;
  padding: 72px 24px 20px;
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.sidebar-left {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  background: var(--md-sys-color-surface-container);
  border-radius: var(--m3-shape-large);
  padding: 20px;
  box-shadow: var(--m3-elevation-2);
}

.content-main {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  background: var(--md-sys-color-surface-container);
  border-radius: var(--m3-shape-large);
  padding: 20px;
  box-shadow: var(--m3-elevation-2);
}

.sidebar-right {
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-right .panel {
  background: var(--md-sys-color-surface-container);
  border-radius: var(--m3-shape-large);
  padding: 0;
  box-shadow: var(--m3-elevation-2);
  flex-shrink: 0;
}

.sidebar-right .panel-compact {
  padding: 4px 12px;
  min-height: 56px;
  display: flex;
}

.panel {
  background: transparent;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
}

.panel-compact {
  padding: 0;
}



.bulletin-content {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--md-sys-color-on-surface-variant);
  padding: 0 16px;
}

.bulletin-content :deep(h1) {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 12px 0 6px;
  color: var(--md-sys-color-on-surface);
}

.bulletin-content :deep(h2) {
  font-size: 1rem;
  font-weight: 500;
  margin: 10px 0 4px;
  color: var(--md-sys-color-primary);
}

.bulletin-content :deep(h3) {
  font-size: 0.9rem;
  font-weight: 500;
  margin: 8px 0 4px;
  color: var(--md-sys-color-primary);
}

.bulletin-content :deep(p) {
  margin: 4px 0;
}

.bulletin-content :deep(ul) {
  padding-left: 18px;
  margin: 4px 0;
}

.hidden {
  display: none !important;
}

.settings-dialog {
  min-width: min(90vw, 480px);
}

@media (max-width: 1024px) {
  .desktop-layout { display: none; }
}
</style>
