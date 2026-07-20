<template>
  <div class="app">
    <div class="mobile-view" :class="{ hidden: !isMobile }">
      <Navbar />
    </div>
    <div class="desktop-view" :class="{ hidden: isMobile }">
      <DesktopLayout />
    </div>

    <div v-if="isMobile" class="fab-container">
      <md-fab v-if="!fabExpanded" class="fab-main" @click="fabExpanded = true" aria-label="Menu">
        <md-icon slot="icon">add</md-icon>
      </md-fab>
      <template v-else>
        <div class="fab-wide" @click="scrollToTop">
          <md-icon>arrow_upward</md-icon>
          <span>回到顶部</span>
        </div>
        <div class="fab-wide" @click="goToMessages">
          <md-icon>chat</md-icon>
          <span>留言板</span>
        </div>
        <div class="fab-wide" @click="goToSettings">
          <md-icon>settings</md-icon>
          <span>设置</span>
        </div>
        <md-fab class="fab-close" @click="fabExpanded = false" aria-label="Close">
          <md-icon slot="icon">close</md-icon>
        </md-fab>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Navbar from './components/Navbar.vue'
import DesktopLayout from './components/DesktopLayout.vue'
import '@material/web/fab/fab.js'
import '@material/web/icon/icon.js'

const isMobile = ref(true)
const fabExpanded = ref(false)

function checkScreen() {
  isMobile.value = window.innerWidth <= 1024
}

onMounted(() => {
  checkScreen()
  window.addEventListener('resize', checkScreen)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreen)
})

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  fabExpanded.value = false
}

function goToMessages() {
  window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'messages' }))
  fabExpanded.value = false
}

function goToSettings() {
  window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'settings' }))
  fabExpanded.value = false
}
</script>

<style scoped>
.mobile-view,
.desktop-view {
  width: 100%;
}

.hidden {
  display: none !important;
}

.fab-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-end;
  gap: 12px;
}

.fab-main {
  --md-fab-container-color: var(--md-sys-color-primary);
  --md-fab-icon-color: var(--md-sys-color-on-primary);
}

.fab-wide {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  border-radius: var(--m3-shape-large);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: var(--m3-elevation-2);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  min-width: 140px;
}

.fab-wide:hover {
  box-shadow: var(--m3-elevation-3);
  transform: scale(1.02);
}

.fab-wide md-icon {
  font-size: 20px;
}

.fab-close {
  --md-fab-container-color: var(--md-sys-color-error);
  --md-fab-icon-color: var(--md-sys-color-on-error);
}
</style>
