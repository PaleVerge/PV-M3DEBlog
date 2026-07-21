<template>
  <template v-if="compact">
    <div class="friend-compact" @click="showDialog = true">
      <div class="friend-label">
        <md-icon class="friend-icon">link</md-icon>
        <span>友情链接</span>
      </div>
      <div class="friend-badge">{{ friends.length ? friends.length + ' 个' : '招租中' }}</div>
    </div>

    <md-dialog :open="showDialog" @close="showDialog = false">
      <div slot="headline">友情链接</div>
      <div slot="content">
        <div v-if="friends.length === 0" class="empty-friends">
          <p>虚位以待，广告招租中...</p>
        </div>
        <md-list v-else>
          <md-list-item v-for="(f, i) in friends" :key="i" type="link" :href="f.url" target="_blank">
            <div slot="headline">{{ f.name }}</div>
            <div slot="supporting-text">{{ f.desc }}</div>
            <md-icon slot="end">open_in_new</md-icon>
          </md-list-item>
        </md-list>
      </div>
      <div slot="actions">
        <md-filled-button @click="showDialog = false">关闭</md-filled-button>
      </div>
    </md-dialog>
  </template>

  <template v-else>
    <div class="friend-full">
      <div class="friend-header">
        <md-icon class="friend-icon">link</md-icon>
        <h2>友情链接</h2>
      </div>
      <Divider />
      <div v-if="friends.length === 0" class="empty-friends">
        <p>虚位以待，广告招租中...</p>
      </div>
      <md-list v-else>
        <md-list-item v-for="(f, i) in friends" :key="i" type="link" :href="f.url" target="_blank">
          <div slot="headline">{{ f.name }}</div>
          <div slot="supporting-text">{{ f.desc }}</div>
          <md-icon slot="end">open_in_new</md-icon>
        </md-list-item>
      </md-list>
    </div>
  </template>
</template>

<script setup>
import { ref } from 'vue'
import Divider from './Divider.vue'

defineProps({
  compact: { type: Boolean, default: false }
})

const showDialog = ref(false)
const friends = ref([])
</script>

<style scoped>
.friend-compact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 4px;
  cursor: pointer;
  border-radius: var(--m3-shape-medium);
  transition: background-color 0.2s;
}
.friend-compact:hover {
  background-color: var(--md-sys-color-surface-container-high);
}
.friend-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--md-sys-color-on-surface);
}
.friend-icon {
  font-size: 18px;
  color: var(--md-sys-color-primary);
}
.friend-badge {
  font-size: 0.75rem;
  color: var(--md-sys-color-on-surface-variant);
  background: var(--md-sys-color-surface-container-high);
  padding: 2px 8px;
  border-radius: var(--m3-shape-full);
}

.friend-full {
  max-width: 600px;
  margin: 0 auto;
  padding: 8px 0;
}
.friend-header {
  display: flex;
  align-items: center;
  gap: 8px;
}
.friend-icon {
  font-size: 18px;
  color: var(--md-sys-color-primary);
}
.friend-header h2 {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
}
.empty-friends {
  text-align: center;
  color: var(--md-sys-color-on-surface-variant);
  padding: 16px;
}
</style>
