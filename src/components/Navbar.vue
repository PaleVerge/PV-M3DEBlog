<script lang="ts" setup>
    import { ref, computed } from 'vue'
    import Home from './Home.vue'
    import Article from './Article.vue'
    import Friend from './Friend.vue'
    import Contact from './Contact.vue'
import Messages from './Messages.vue'
import Settings from './Settings.vue'

    const activeIndex=ref(0);

    const handleTabChange = (event: Event) => {
  const tabsElement = event.target as any
  activeIndex.value = tabsElement.activeTabIndex
}















const currentComponent = computed(() => {
  switch (activeIndex.value) {
    case 0:
      return Home
    case 1:
      return Article
    case 2:
      return Friend 
    case 3:
      return Contact
    case 4:
      return Messages
    case 5:
      return Settings
    default:
      return Home
  }
})

</script>

<template>
    <md-tabs :active-tab-index="activeIndex" @change="handleTabChange">
        <md-primary-tab >主页</md-primary-tab>
        <md-primary-tab >文章</md-primary-tab>
        <md-primary-tab >友情链接</md-primary-tab>
        <md-primary-tab >联系作者</md-primary-tab>
        <md-primary-tab >留言</md-primary-tab>
        <md-primary-tab >设置</md-primary-tab>
    </md-tabs>




  <div class="content-container">
        <Transition name="fade" mode="out-in">
          <component :is="currentComponent" :key="activeIndex" />
        </Transition>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
