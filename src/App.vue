<template>
  <Navbar />
  <md-fab class="back-to-top" aria-label="Back to top" @click="scrollToTop">
    <md-icon slot="icon">arrow_upward</md-icon>
  </md-fab>
</template>

<script lang="ts" setup>
import Navbar from './components/Navbar.vue'
import '@material/web/fab/fab.js'
import '@material/web/icon/icon.js'

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;
}
</style>
