<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Home from './Home.vue'
import Article from './Article.vue'
import Friend from './Friend.vue'
import Contact from './Contact.vue'
import Messages from './Messages.vue'
import Settings from './Settings.vue'

const activeIndex = ref(0)
const showSettings = ref(false)

const handleTabChange = (event: Event) => {
  const tabsElement = event.target as any
  activeIndex.value = tabsElement.activeTabIndex
}

function handleNavigate(e: CustomEvent) {
  const target = e.detail
  if (target === 'messages') activeIndex.value = 4
  else if (target === 'settings') showSettings.value = true
  else if (target === 'articles') activeIndex.value = 1
}

function closeDialogs() { showSettings.value = false }

onMounted(() => {
  window.addEventListener('navigate-to', handleNavigate as EventListener)
  window.addEventListener('close-all-dialogs', closeDialogs)
})

onUnmounted(() => {
  window.removeEventListener('navigate-to', handleNavigate as EventListener)
  window.removeEventListener('close-all-dialogs', closeDialogs)
})

const tabs = [Home, Article, Friend, Contact, Messages]
const currentComponent = computed(() => tabs[activeIndex.value] || Home)
</script>

<template>
  <div class="mobile-nav">
    <md-tabs :active-tab-index="activeIndex" @change="handleTabChange" class="capsule-tabs">
      <md-primary-tab>主页</md-primary-tab>
      <md-primary-tab>文章</md-primary-tab>
      <md-primary-tab>友链</md-primary-tab>
      <md-primary-tab>联系</md-primary-tab>
      <md-primary-tab>留言</md-primary-tab>
    </md-tabs>
  </div>

  <div class="content-container">
    <KeepAlive>
      <component :is="currentComponent" />
    </KeepAlive>
  </div>

  <md-dialog :open="showSettings" @close="showSettings = false" class="settings-dialog">
    <div slot="headline">设置</div>
    <div slot="content">
      <Settings />
    </div>
    <div slot="actions">
      <md-filled-button @click="showSettings = false">关闭</md-filled-button>
    </div>
  </md-dialog>
</template>

<style scoped>
.mobile-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 6px 10px;
  background: var(--md-sys-color-surface);
}

.capsule-tabs {
  border-radius: var(--m3-shape-full) !important;
  overflow: hidden;
}

.content-container {
  padding: 4px 0;
}

.settings-dialog {
  min-width: min(90vw, 480px);
}
</style>
