<template>
  <div class="search-container">
    <md-outlined-text-field
      label="搜索"
      :value="query"
      @input="onInput"
      placeholder="搜索文章、留言..."
    >
      <md-icon slot="leading-icon">search</md-icon>
    </md-outlined-text-field>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])
const query = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  query.value = val
})

function onInput(e) {
  query.value = e.target.value
  emit('update:modelValue', query.value)
}
</script>

<style scoped>
.search-container {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.search-container md-outlined-text-field {
  width: 100%;
}
</style>
