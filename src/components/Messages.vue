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

    <div class="sort-bar" v-if="messages.length > 1">
      <span class="sort-label">排序：</span>
      <md-filled-tonal-button :class="{ active: sortBy === 'time' }" @click="sortBy = 'time'">
        <md-icon slot="icon">schedule</md-icon>
        最新
      </md-filled-tonal-button>
      <md-filled-tonal-button :class="{ active: sortBy === 'hot' }" @click="sortBy = 'hot'">
        <md-icon slot="icon">local_fire_department</md-icon>
        热门
      </md-filled-tonal-button>
    </div>

    <div class="message-list">
      <div v-for="msg in sortedMessages" :key="msg.id" class="message-item">
        <div class="message-header">
          <span class="nickname">{{ msg.nickname }}</span>
          <div class="header-right">
            <span class="time">{{ msg.time }}</span>
            <template v-if="msg.nickname === currentNickname">
              <md-icon-button v-if="editingId !== msg.id" @click="startEdit(msg)" class="action-btn edit-btn">
                <md-icon>edit</md-icon>
              </md-icon-button>
              <md-icon-button @click="deleteMessage(msg.id)" class="action-btn delete-btn">
                <md-icon>delete</md-icon>
              </md-icon-button>
            </template>
          </div>
        </div>

        <template v-if="editingId === msg.id">
          <div class="edit-form">
            <md-outlined-text-field label="编辑留言" :value="editContent" @input="editContent = $event.target.value" type="textarea" rows="3"></md-outlined-text-field>
            <div class="edit-actions">
              <md-filled-tonal-button @click="cancelEdit">取消</md-filled-tonal-button>
              <md-filled-button @click="saveEdit(msg.id)" :disabled="!editContent">保存</md-filled-button>
            </div>
          </div>
        </template>
        <template v-else>
          <p class="message-content">{{ msg.content }}</p>
        </template>

        <div class="message-actions">
          <md-icon-button @click="toggleLike(msg)" class="action-btn" :class="{ liked: isLiked(msg) }">
            <md-icon>{{ isLiked(msg) ? 'favorite' : 'favorite_border' }}</md-icon>
          </md-icon-button>
          <span class="like-count">{{ msg.likes || 0 }}</span>
          <md-icon-button @click="toggleReply(msg)" class="action-btn reply-btn">
            <md-icon>reply</md-icon>
          </md-icon-button>
          <span class="reply-count">{{ (msg.replies || []).length }}</span>
        </div>

        <div v-if="replyingTo === msg.id" class="reply-form">
          <md-outlined-text-field label="回复内容" :value="replyContent" @input="replyContent = $event.target.value" placeholder="写点回复..." type="textarea" rows="2"></md-outlined-text-field>
          <div class="edit-actions">
            <md-filled-tonal-button @click="cancelReply">取消</md-filled-tonal-button>
            <md-filled-button @click="submitReply(msg.id)" :disabled="!replyContent">回复</md-filled-button>
          </div>
        </div>

        <div v-if="msg.replies && msg.replies.length > 0" class="reply-list">
          <div v-for="(reply, rIndex) in msg.replies" :key="reply.id" class="reply-item">
            <div class="reply-header">
              <span class="reply-nickname">{{ reply.nickname }}</span>
              <span class="reply-time">{{ reply.time }}</span>
            </div>
            <p class="reply-content">{{ reply.content }}</p>
          </div>
        </div>

        <Divider />
      </div>
    </div>
    <p v-if="messages.length === 0" class="empty-tip">暂无留言，快来发表第一条吧！</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Divider from './Divider.vue'
import { getMessages, saveMessages, addMessage } from '../api/index'

const NICKNAME_KEY = 'm3eblog_nickname'

const nickname = ref('')
const content = ref('')
const messages = ref([])
const currentNickname = ref('')
const editingId = ref(null)
const editContent = ref('')
const sortBy = ref('time')
const replyingTo = ref(null)
const replyContent = ref('')

onMounted(async () => {
  messages.value = await getMessages()
  
  const savedNickname = sessionStorage.getItem(NICKNAME_KEY)
  if (savedNickname) {
    currentNickname.value = savedNickname
    nickname.value = savedNickname
  }
})

const sortedMessages = computed(() => {
  const list = [...messages.value]
  if (sortBy.value === 'hot') {
    list.sort((a, b) => (b.likes || 0) - (a.likes || 0))
  }
  return list
})

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

const submitMessage = async () => {
  if (!nickname.value || !content.value) return
  const msg = {
    id: generateId(),
    nickname: nickname.value,
    content: content.value,
    time: new Date().toLocaleString(),
    likes: 0,
    likedBy: [],
    replies: []
  }
  await addMessage(msg)
  messages.value = await getMessages() // Refresh from API
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

async function saveEdit(id) {
  if (!editContent.value) return
  const msg = messages.value.find(m => m.id === id)
  if (msg) {
    msg.content = editContent.value
    msg.time = new Date().toLocaleString() + ' (已编辑)'
    await saveMessages(messages.value)
  }
  editingId.value = null
  editContent.value = ''
}

async function deleteMessage(id) {
  const index = messages.value.findIndex(m => m.id === id)
  if (index !== -1) {
    messages.value.splice(index, 1)
    await saveMessages(messages.value)
  }
}

function isLiked(msg) {
  return (msg.likedBy || []).includes(currentNickname.value)
}

async function toggleLike(msg) {
  if (!currentNickname.value) {
    alert('请先输入昵称')
    return
  }
  if (!msg.likedBy) msg.likedBy = []
  if (!msg.likes) msg.likes = 0

  const idx = msg.likedBy.indexOf(currentNickname.value)
  if (idx === -1) {
    msg.likedBy.push(currentNickname.value)
    msg.likes++
  } else {
    msg.likedBy.splice(idx, 1)
    msg.likes--
  }
  await saveMessages(messages.value)
}

function toggleReply(msg) {
  if (replyingTo.value === msg.id) {
    replyingTo.value = null
    replyContent.value = ''
  } else {
    replyingTo.value = msg.id
    replyContent.value = ''
  }
}

function cancelReply() {
  replyingTo.value = null
  replyContent.value = ''
}

async function submitReply(msgId) {
  if (!replyContent.value) return
  if (!currentNickname.value) {
    alert('请先输入昵称')
    return
  }
  const msg = messages.value.find(m => m.id === msgId)
  if (msg) {
    if (!msg.replies) msg.replies = []
    msg.replies.push({
      id: generateId(),
      nickname: currentNickname.value,
      content: replyContent.value,
      time: new Date().toLocaleString()
    })
    await saveMessages(messages.value)
  }
  replyingTo.value = null
  replyContent.value = ''
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
.sort-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
}
.sort-label {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.875rem;
}
.sort-bar md-filled-tonal-button {
  --md-filled-tonal-button-container-color: var(--md-sys-color-surface-container-high);
  --md-filled-tonal-button-label-text-color: var(--md-sys-color-on-surface-variant);
}
.sort-bar md-filled-tonal-button.active {
  --md-filled-tonal-button-container-color: var(--md-sys-color-primary-container);
  --md-filled-tonal-button-label-text-color: var(--md-sys-color-on-primary-container);
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
.message-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
}
.like-count, .reply-count {
  font-size: 0.8rem;
  color: var(--md-sys-color-on-surface-variant);
  min-width: 16px;
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
.reply-btn {
  --md-icon-button-icon-color: var(--md-sys-color-on-surface-variant);
}
.liked {
  --md-icon-button-icon-color: #E91E63;
  opacity: 1;
}
.edit-form, .reply-form {
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
.reply-list {
  margin-top: 8px;
  padding-left: 16px;
  border-left: 2px solid var(--md-sys-color-outline-variant);
}
.reply-item {
  padding: 8px 0;
}
.reply-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.reply-nickname {
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--md-sys-color-on-surface);
}
.reply-time {
  font-size: 0.7rem;
  color: var(--md-sys-color-on-surface-variant);
}
.reply-content {
  margin: 0;
  font-size: 0.875rem;
  color: var(--md-sys-color-on-surface-variant);
  white-space: pre-wrap;
}
.empty-tip {
  text-align: center;
  color: var(--md-sys-color-on-surface-variant);
  padding: 24px;
}
</style>
