<template>
  <div class="messages-container">
    <h2>留言板</h2>
    <Divider />
    <div class="message-form">
      <md-outlined-text-field label="昵称" v-model="nickname" placeholder="你的昵称"></md-outlined-text-field>
      <md-outlined-text-field label="留言" v-model="content" placeholder="说点什么吧..." type="textarea" rows="4"></md-outlined-text-field>
      <md-filled-button @click="submitMessage" :disabled="!nickname || !content">发送留言</md-filled-button>
    </div>
    <Divider />
    <div class="message-list">
      <div v-for="(msg, index) in messages" :key="index" class="message-item">
        <div class="message-header">
          <span class="nickname">{{ msg.nickname }}</span>
          <span class="time">{{ msg.time }}</span>
        </div>
        <p class="message-content">{{ msg.content }}</p>
        <Divider v-if="index < messages.length - 1" />
      </div>
    </div>
    <p v-if="messages.length === 0" class="empty-tip">暂无留言，快来发表第一条吧！</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Divider from './Divider.vue'

const STORAGE_KEY = 'm3eblog_messages'

const nickname = ref('')
const content = ref('')
const messages = ref([])

onMounted(() => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      messages.value = JSON.parse(stored)
    } catch (e) {
      messages.value = []
    }
  }
})

const submitMessage = () => {
  if (!nickname.value || !content.value) return
  const msg = {
    nickname: nickname.value,
    content: content.value,
    time: new Date().toLocaleString()
  }
  messages.value.unshift(msg)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.value))
  nickname.value = ''
  content.value = ''
}
</script>

<style scoped>
.messages-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
}
.message-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}
.message-list {
  margin-top: 8px;
}
.message-item {
  padding: 8px 0;
}
.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}
.nickname {
  font-weight: 500;
}
.time {
  font-size: 0.8rem;
  color: var(--md-sys-color-on-surface-variant);
}
.message-content {
  margin: 0;
  white-space: pre-wrap;
}
.empty-tip {
  text-align: center;
  color: var(--md-sys-color-on-surface-variant);
}
</style>