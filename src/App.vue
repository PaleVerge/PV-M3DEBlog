<template>
  <div class="app">
    <template v-if="isMobile">
      <Navbar />
    </template>
    <template v-else>
      <DesktopLayout />
    </template>

    <div v-if="isMobile" class="fab-container">
      <md-fab v-if="!fabExpanded" class="fab-main" @click="fabExpanded = true" aria-label="Menu">
        <md-icon slot="icon">add</md-icon>
      </md-fab>
      <template v-else>
        <md-fab class="fab-item" @click="scrollToTop" aria-label="Back to top">
          <md-icon slot="icon">arrow_upward</md-icon>
        </md-fab>
        <md-fab class="fab-item" @click="goToMessages" aria-label="Messages">
          <md-icon slot="icon">chat</md-icon>
        </md-fab>
        <md-fab class="fab-item" @click="goToSettings" aria-label="Settings">
          <md-icon slot="icon">settings</md-icon>
        </md-fab>
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
.fab-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 12px;
}

.fab-main {
  --md-fab-container-color: var(--md-sys-color-primary);
  --md-fab-icon-color: var(--md-sys-color-on-primary);
}

.fab-item {
  --md-fab-container-color: var(--md-sys-color-secondary-container);
  --md-fab-icon-color: var(--md-sys-color-on-secondary-container);
  width: 40px;
  height: 40px;
}

.fab-close {
  --md-fab-container-color: var(--md-sys-color-error);
  --md-fab-icon-color: var(--md-sys-color-on-error);
  width: 40px;
  height: 40px;
}
</style>
