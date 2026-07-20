<template>
  <div class="settings-container">
    <h2>设置</h2>
    <Divider />
    <div class="setting-item">
      <span>暗色模式</span>
      <md-switch :selected="darkMode" @change="toggleDarkMode"></md-switch>
    </div>
    <Divider />

    <div class="admin-section">
      <h3>留言管理</h3>
      <Divider />

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
          <p v-if="loginError" class="error-tip">密码错误，请重试</p>
        </div>
      </template>

      <template v-else>
        <div class="admin-header">
          <p class="message-count">共 {{ messages.length }} 条留言</p>
          <md-filled-tonal-button @click="logout">
            <md-icon slot="icon">logout</md-icon>
            退出
          </md-filled-tonal-button>
        </div>

        <div v-if="messages.length === 0" class="empty-state">
          <p>暂无留言</p>
        </div>

        <md-list v-else>
          <div v-for="(msg, index) in messages" :key="index" class="message-item">
            <div class="message-info">
              <div class="message-header">
                <span class="nickname">{{ msg.nickname }}</span>
                <span class="time">{{ msg.time }}</span>
              </div>
              <p class="message-content">{{ msg.content }}</p>
            </div>
            <md-icon-button @click="deleteMessage(index)" class="delete-btn">
              <md-icon>delete</md-icon>
            </md-icon-button>
            <Divider />
          </div>
        </md-list>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Divider from './Divider.vue'
import { adminLoginAPI, isAdminAPI, adminLogoutAPI, getMessages } from '../api/index'

const DARK_MODE_KEY = 'm3eblog_dark_mode'
const MESSAGES_KEY = 'm3eblog_messages'

const darkMode = ref(false)
const password = ref('')
const isLoggedIn = ref(false)
const loginError = ref(false)
const messages = ref([])

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
    if (prefersDark) {
      document.documentElement.classList.add('dark')
    }
  }

  isLoggedIn.value = await isAdminAPI()
  if (isLoggedIn.value) {
    loadMessages()
  }
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
    loadMessages()
    password.value = ''
  } else {
    loginError.value = true
  }
}

async function logout() {
  await adminLogoutAPI()
  isLoggedIn.value = false
}

async function loadMessages() {
  messages.value = await getMessages()
}

function deleteMessage(index) {
  // In a real API, call backend to delete
  messages.value.splice(index, 1)
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages.value))
}
</script>

<style scoped>
.settings-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 8px 0;
}
.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
}
.setting-item span {
  color: var(--md-sys-color-on-surface);
}
.admin-section {
  margin-top: 8px;
}
.admin-section h3 {
  color: var(--md-sys-color-on-surface);
  font-size: 1.1rem;
  margin: 8px 0;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 400px;
  padding: 8px 0;
}
.error-tip {
  color: var(--md-sys-color-error);
  margin: 0;
  font-size: 0.875rem;
}
.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0;
}
.message-count {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.875rem;
  margin: 0;
}
.message-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.message-info {
  flex: 1;
  min-width: 0;
}
.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}
.nickname {
  font-weight: 500;
  color: var(--md-sys-color-on-surface);
}
.time {
  font-size: 0.75rem;
  color: var(--md-sys-color-on-surface-variant);
}
.message-content {
  margin: 0;
  color: var(--md-sys-color-on-surface-variant);
  white-space: pre-wrap;
}
.delete-btn {
  --md-icon-button-icon-color: var(--md-sys-color-error);
  flex-shrink: 0;
}
.delete-btn:hover {
  background-color: var(--md-sys-color-error-container);
}
.empty-state {
  text-align: center;
  padding: 32px;
  color: var(--md-sys-color-on-surface-variant);
}
</style>
