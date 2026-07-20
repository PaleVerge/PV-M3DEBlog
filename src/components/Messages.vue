<template>
  <div class="messages-container">
    <h2>留言板</h2>
    <Divider />
    <div class="message-form">
      <md-outlined-text-field label="昵称" :value="nickname" @input="nickname = $event.target.value" placeholder="你的昵称"></md-outlined-text-field>
      <md-outlined-text-field label="留言" :value="content" @input="content = $event.target.value" placeholder="说点什么吧..." type="textarea" rows="4"></md-outlined-text-field>
      <md-filled-button @click="submitMessage" :disabled="!nickname || !content">发送留言</md-filled-button>
    </div>
    <Divider />
    <div class="message-list">
      <div v-for="(msg, index) in messages" :key="msg.id" class="message-item">
        <div class="message-header">
          <span class="nickname">{{ msg.nickname }}</span>
          <div class="header-right">
            <span class="time">{{ msg.time }}</span>
            <template v-if="msg.nickname === currentNickname">
              <md-icon-button v-if="editingId !== msg.id" @click="startEdit(msg)" class="action-btn edit-btn">
                <md-icon>edit</md-icon>
              </md-icon-button>
              <md-icon-button @click="deleteMessage(index)" class="action-btn delete-btn">
                <md-icon>delete</md-icon>
              </md-icon-button>
            </template>
          </div>
        </div>
        <template v-if="editingId === msg.id">
          <div class="edit-form">
            <md-outlined-text-field
              label="编辑留言"
              :value="editContent"
              @input="editContent = $event.target.value"
              type="textarea"
              rows="3"
            ></md-outlined-text-field>
            <div class="edit-actions">
              <md-filled-tonal-button @click="cancelEdit">取消</md-filled-tonal-button>
              <md-filled-button @click="saveEdit(index)" :disabled="!editContent">保存</md-filled-button>
            </div>
          </div>
        </template>
        <template v-else>
          <p class="message-content">{{ msg.content }}</p>
        </template>
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
const NICKNAME_KEY = 'm3eblog_nickname'

const nickname = ref('')
const content = ref('')
const messages = ref([])
const currentNickname = ref('')
const editingId = ref(null)
const editContent = ref('')

onMounted(() => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      messages.value = JSON.parse(stored)
    } catch (e) {
      messages.value = []
    }
  }
  const savedNickname = sessionStorage.getItem(NICKNAME_KEY)
  if (savedNickname) {
    currentNickname.value = savedNickname
    nickname.value = savedNickname
  }
})

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

const submitMessage = () => {
  if (!nickname.value || !content.value) return
  const msg = {
    id: generateId(),
    nickname: nickname.value,
    content: content.value,
    time: new Date().toLocaleString()
  }
  messages.value.unshift(msg)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.value))
  currentNickname.value = nickname.value
  sessionStorage.setItem(NICKNAME_KEY, nickname.value)
  content.value = ''
}

function startEdit(msg) {
  editingId.value = msg.id
  editContent.value = msg.content
}

function cancelEdit() {
  editingId.value = null
  editContent.value = ''
}

function saveEdit(index) {
  if (!editContent.value) return
  messages.value[index].content = editContent.value
  messages.value[index].time = new Date().toLocaleString() + ' (已编辑)'
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.value))
  editingId.value = null
  editContent.value = ''
}

function deleteMessage(index) {
  messages.value.splice(index, 1)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.value))
}
</script>

<style scoped>
.messages-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 8px 0;
}
.message-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
}
.message-list {
  margin-top: 8px;
}
.message-item {
  padding: 12px 0;
}
.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 4px;
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
  white-space: pre-wrap;
  color: var(--md-sys-color-on-surface-variant);
}
.action-btn {
  opacity: 0.7;
}
.action-btn:hover {
  opacity: 1;
}
.edit-btn {
  --md-icon-button-icon-color: var(--md-sys-color-primary);
}
.delete-btn {
  --md-icon-button-icon-color: var(--md-sys-color-error);
}
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}
.edit-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
.empty-tip {
  text-align: center;
  color: var(--md-sys-color-on-surface-variant);
  padding: 24px;
}
</style>
