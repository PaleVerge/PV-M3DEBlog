<template>
  <div class="settings-container">
    <div class="setting-item">
      <span>暗色模式</span>
      <md-switch :selected="darkMode" @change="toggleDarkMode"></md-switch>
    </div>
    <Divider />
    <div class="theme-section">
      <span class="setting-label">主题配色</span>
      <div class="theme-grid">
        <button
          v-for="(theme, id) in themes"
          :key="id"
          class="theme-chip"
          :class="{ active: currentTheme === id }"
          @click="selectTheme(id)"
        >
          <span class="theme-dot" :style="{ background: theme.light.primary }"></span>
          <span class="theme-name">{{ theme.name }}</span>
        </button>
      </div>
    </div>
    <Divider />
    <div class="admin-section">
      <template v-if="!isLoggedIn">
        <div class="login-form">
          <md-outlined-text-field
            label="管理员密码"
            type="password"
            :value="password"
            @input="password = $event.target.value"
            placeholder="请输入密码"
            @keydown.enter="login"
          ></md-outlined-text-field>
          <md-filled-button @click="login" :disabled="!password">登录</md-filled-button>
          <p v-if="loginError" class="error-tip">密码错误</p>
        </div>
      </template>
      <template v-else>
        <div class="admin-info">
          <span>已登录为管理员</span>
          <md-filled-tonal-button @click="logout">
            <md-icon slot="icon">logout</md-icon>
            退出
          </md-filled-tonal-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Divider from './Divider.vue'
import { adminLoginAPI, isAdminAPI, adminLogoutAPI } from '../api/index'
import { useTheme } from '../composables/useTheme'

const DARK_MODE_KEY = 'm3eblog_dark_mode'

const { themes, currentTheme, applyTheme } = useTheme()

const darkMode = ref(false)
const password = ref('')
const isLoggedIn = ref(false)
const loginError = ref(false)

onMounted(async () => {
  const stored = localStorage.getItem(DARK_MODE_KEY)
  if (stored === 'true') {
    darkMode.value = true
    document.documentElement.classList.add('dark')
  } else if (stored === 'false') {
    darkMode.value = false
    document.documentElement.classList.remove('dark')
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    darkMode.value = prefersDark
    if (prefersDark) document.documentElement.classList.add('dark')
  }
  isLoggedIn.value = await isAdminAPI()
  applyTheme(currentTheme.value)
})

const toggleDarkMode = (e) => {
  darkMode.value = e.target.selected
  if (darkMode.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem(DARK_MODE_KEY, 'true')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem(DARK_MODE_KEY, 'false')
  }
  applyTheme(currentTheme.value)
}

function selectTheme(id) {
  applyTheme(id)
}

async function login() {
  const success = await adminLoginAPI(password.value)
  if (success) {
    isLoggedIn.value = true
    loginError.value = false
    password.value = ''
  } else {
    loginError.value = true
  }
}

async function logout() {
  await adminLogoutAPI()
  isLoggedIn.value = false
}
</script>

<style scoped>
.settings-container {
  min-width: 280px;
}
.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
}
.setting-item span { color: var(--md-sys-color-on-surface); }
.setting-label {
  color: var(--md-sys-color-on-surface);
  font-size: 0.875rem;
  display: block;
  margin-bottom: 10px;
}
.theme-section { padding: 8px 0; }
.theme-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.theme-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: var(--m3-shape-small);
  background: var(--md-sys-color-surface-container);
  cursor: pointer;
  font-size: 0.8rem;
  color: var(--md-sys-color-on-surface);
  transition: all 0.2s;
}
.theme-chip:hover {
  background: var(--md-sys-color-surface-container-high);
}
.theme-chip.active {
  border-color: var(--md-sys-color-primary);
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}
.theme-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0;
}
.theme-name { white-space: nowrap; }
.admin-section { margin-top: 4px; }
.login-form { display: flex; flex-direction: column; gap: 12px; padding: 8px 0; }
.error-tip { color: var(--md-sys-color-error); margin: 0; font-size: 0.8rem; }
.admin-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.875rem;
}
.admin-info md-filled-tonal-button {
  --md-filled-tonal-button-container-color: var(--md-sys-color-primary-container);
  --md-filled-tonal-button-label-text-color: var(--md-sys-color-on-primary-container);
}
</style>
