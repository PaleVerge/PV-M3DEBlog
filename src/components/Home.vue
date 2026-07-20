<template>
  <div class="home-container">
    <div v-html="renderedContent" class="markdown-body"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { marked } from 'marked'

const renderedContent = ref('')

onMounted(async () => {
  const response = await fetch('/content/home.md')
  const markdown = await response.text()
  renderedContent.value = marked.parse(markdown)
})
</script>

<style scoped>
.home-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 8px 0;
}

.markdown-body :deep(h1) {
  color: var(--md-sys-color-on-surface);
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0 0 8px;
}

.markdown-body :deep(h2) {
  color: var(--md-sys-color-primary);
  font-size: 1.1rem;
  font-weight: 500;
  margin: 24px 0 8px;
}

.markdown-body :deep(h3) {
  color: var(--md-sys-color-on-surface);
  font-size: 1rem;
  font-weight: 500;
  margin: 16px 0 4px;
}

.markdown-body :deep(p) {
  margin: 8px 0;
  color: var(--md-sys-color-on-surface-variant);
}

.markdown-body :deep(ul) {
  padding-left: 24px;
  margin: 8px 0;
}

.markdown-body :deep(li) {
  margin: 4px 0;
  color: var(--md-sys-color-on-surface-variant);
}

.markdown-body :deep(hr) {
  border: none;
  border-top: 1px solid var(--md-sys-color-outline-variant);
  margin: 16px 0;
}
</style>
