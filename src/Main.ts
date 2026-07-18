import { createApp } from 'vue'
import App from './App.vue'

import '@material/web/all.js'
import './styles/main.css'

// 暗色模式初始化，尽早应用
const darkMode = localStorage.getItem('m3eblog_dark_mode')
if (darkMode === 'true') {
  document.documentElement.classList.add('dark')
} else if (darkMode === null) {
  // 跟随系统
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (prefersDark) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('m3eblog_dark_mode', 'true')
  } else {
    localStorage.setItem('m3eblog_dark_mode', 'false')
  }
} else {
  document.documentElement.classList.remove('dark')
}

createApp(App).mount('#app')