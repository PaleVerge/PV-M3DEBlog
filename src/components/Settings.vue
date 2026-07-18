"<template>
  <div class="settings-container">
    <h2>设置</h2>
    <Divider />
    <div class="setting-item">
      <span>暗色模式</span>
      <md-switch :selected="darkMode" @change="toggleDarkMode"></md-switch>
    </div>
    <Divider />
    <p>更多设置开发中...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Divider from './Divider.vue'

const darkMode = ref(false)

onMounted(() => {
  const stored = localStorage.getItem('m3eblog_dark_mode')
  if (stored === 'true') {
    darkMode.value = true
    document.documentElement.classList.add('dark')
  } else if (stored === 'false') {
    darkMode.value = false
    document.documentElement.classList.remove('dark')
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    darkMode.value = prefersDark
    if (prefersDark) {
      document.documentElement.classList.add('dark')
    }
  }
})

const toggleDarkMode = (e) => {
  darkMode.value = e.target.selected
  if (darkMode.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('m3eblog_dark_mode', 'true')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('m3eblog_dark_mode', 'false')
  }
}
</script>

<style scoped>
.settings-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
}
.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
}
</style>"