<template>
  <div class="project-btn" @click="openProject">
    <div class="project-label">
      <md-icon class="project-icon">code</md-icon>
      <span>我的项目</span>
    </div>
  </div>

  <md-dialog :open="showDialog" @close="showDialog = false; emit('update:open', false)" class="project-dialog">
    <div slot="headline">我的项目</div>
    <div slot="content" class="dialog-body" v-html="renderedContent"></div>
    <div slot="actions">
      <md-filled-button @click="showDialog = false; emit('update:open', false)">关闭</md-filled-button>
    </div>
  </md-dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  open: { type: Boolean, default: false }
})

const emit = defineEmits(['update:open'])
const showDialog = ref(false)
const renderedContent = ref('')

watch(() => props.open, (val) => {
  if (val) {
    showDialog.value = true
    emit('update:open', false)
  }
})

onMounted(async () => {
  try {
    const res = await fetch('/content/myproject.md')
    const md = await res.text()
    renderedContent.value = marked.parse(md)
  } catch {
    renderedContent.value = '<p>加载中...</p>'
  }
})

function openProject() {
  showDialog.value = true
}
</script>

<style scoped>
.project-btn {
  display: flex;
  align-items: center;
  padding: 0 4px;
  cursor: pointer;
  border-radius: var(--m3-shape-medium);
  transition: background-color 0.2s;
  height: 100%;
  width: 100%;
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

.dialog-body :deep(ul) {
  padding-left: 20px;
}

.project-dialog {
  min-width: min(90vw, 480px);
}
</style>
