<template>
  <div v-if="!hideButton" class="project-btn" @click="openProject">
    <div class="project-label">
      <md-icon class="project-icon">code</md-icon>
      <span>我的项目</span>
    </div>
  </div>

  <md-dialog :open="showDialog" @close="showDialog = false" class="project-dialog">
    <div slot="headline">我的项目</div>
    <div slot="content" class="dialog-body" v-html="renderedContent"></div>
    <div slot="actions">
      <md-filled-button @click="showDialog = false">关闭</md-filled-button>
    </div>
  </md-dialog>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { marked } from 'marked'

defineProps({ hideButton: { type: Boolean, default: false } })

const showDialog = ref(false)
const renderedContent = ref('')

function closeDialog() { showDialog.value = false }

onMounted(async () => {
  window.addEventListener('close-all-dialogs', closeDialog)
  try {
    const res = await fetch('/content/myproject.md')
    if (!res.ok) { renderedContent.value = '<p>文件加载失败</p>'; return }
    const md = await res.text()
    let html = marked.parse(md)
    html = html.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ')
    renderedContent.value = html
  } catch {
    renderedContent.value = '<p>加载失败，请检查网络或文件是否存在</p>'
  }
})

onUnmounted(() => window.removeEventListener('close-all-dialogs', closeDialog))

function openProject() {
  showDialog.value = true
}

defineExpose({ openProject })
</script>

<style scoped>
.project-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  padding: 0 12px;
  cursor: pointer;
  border-radius: var(--m3-shape-medium);
  transition: background-color 0.2s;
}

.project-btn:hover {
  background-color: var(--md-sys-color-surface-container-high);
}

.project-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--md-sys-color-on-surface);
}

.project-icon {
  font-size: 18px;
  color: var(--md-sys-color-primary);
}

.dialog-body {
  max-height: 55vh;
  overflow-y: auto;
  min-height: 120px;
  line-height: 1.7;
  color: var(--md-sys-color-on-surface);
  font-size: 0.9rem;
}

.dialog-body :deep(h1) {
  font-size: 1.3rem;
  font-weight: 500;
  margin: 16px 0 8px;
  color: var(--md-sys-color-on-surface);
}

.dialog-body :deep(h2) {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 12px 0 6px;
  color: var(--md-sys-color-primary);
}

.dialog-body :deep(p) {
  margin: 6px 0;
}

.dialog-body :deep(a) {
  color: var(--md-sys-color-primary);
  text-decoration: none;
}

.dialog-body :deep(a:hover) {
  text-decoration: underline;
}

.dialog-body :deep(ul) {
  padding-left: 20px;
}

.project-dialog {
  min-width: min(90vw, 480px);
}
</style>
