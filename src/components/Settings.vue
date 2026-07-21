<template>
  <div class="settings-container">
    <div class="setting-item">
      <span>暗色模式</span>
      <md-switch :selected="darkMode" @change="toggleDarkMode"></md-switch>
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

const DARK_MODE_KEY = 'm3eblog_dark_mode'

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
</style>
