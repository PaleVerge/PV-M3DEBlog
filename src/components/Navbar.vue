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
  if (target === 'messages') activeIndex.value = 3
  else if (target === 'settings') showSettings.value = true
}

onMounted(() => {
  window.addEventListener('navigate-to', handleNavigate as EventListener)
})

onUnmounted(() => {
  window.removeEventListener('navigate-to', handleNavigate as EventListener)
})

const currentComponent = computed(() => {
  switch (activeIndex.value) {
    case 0: return Home
    case 1: return Article
    case 2: return Friend
    case 3: return Contact
    case 4: return Messages
    default: return Home
  }
})
</script>

<template>
  <div class="mobile-nav">
    <div class="nav-header">
      <h1 class="nav-title">M3DEBlog</h1>
    </div>
    <md-tabs :active-tab-index="activeIndex" @change="handleTabChange">
      <md-primary-tab>主页</md-primary-tab>
      <md-primary-tab>文章</md-primary-tab>
      <md-primary-tab>友情链接</md-primary-tab>
      <md-primary-tab>联系作者</md-primary-tab>
      <md-primary-tab>留言</md-primary-tab>
    </md-tabs>
  </div>

  <div class="content-container">
    <Transition name="fade" mode="out-in">
      <component :is="currentComponent" :key="activeIndex" />
    </Transition>
  </div>

  <md-dialog :open="showSettings" @close="showSettings = false">
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
}

.nav-header {
  background: linear-gradient(90deg, #6750A4 0%, #4F378B 100%);
  padding: 12px 16px 0;
}

.dark .nav-header {
  background: linear-gradient(90deg, #4F378B 0%, #381E72 100%);
}

.nav-title {
  color: white;
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0;
}

.content-container {
  padding: 8px 0;
}
</style>
