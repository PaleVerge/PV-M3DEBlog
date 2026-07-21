<template>
  <div class="contact-container">
    <div class="contact-header">
      <md-icon class="contact-icon">alternate_email</md-icon>
      <h2>联系作者</h2>
    </div>
    <Divider />
    <md-list>
      <md-list-item type="link" @click="openEmail">
        <div slot="headline">邮箱</div>
        <div slot="supporting-text">fnme3706679@gmail.com</div>
        <md-icon slot="end">email</md-icon>
      </md-list-item>
      <Divider />
      <md-list-item type="link" @click="copyQQ">
        <div slot="headline">QQ</div>
        <div slot="supporting-text">574746791</div>
        <md-icon slot="end">forum</md-icon>
      </md-list-item>
      <Divider />
      <md-list-item type="link" @click="copyWeChat">
        <div slot="headline">微信</div>
        <div slot="supporting-text">distandce</div>
        <md-icon slot="end">sms</md-icon>
      </md-list-item>
      <Divider />
      <md-list-item type="link" href="https://x.com/qing1435" target="_blank">
        <div slot="headline">X</div>
        <div slot="supporting-text">跳转到其他标签栏打开</div>
        <md-icon slot="end">open_in_new</md-icon>
      </md-list-item>
      <Divider />
      <md-list-item type="link" href="https://github.com/paleverge" target="_blank">
        <div slot="headline">Github</div>
        <div slot="supporting-text">跳转到其他标签栏打开</div>
        <md-icon slot="end">open_in_new</md-icon>
      </md-list-item>
    </md-list>

    <md-dialog :open="showToast" @close="showToast = false">
      <div slot="content" class="toast-content">
        <md-icon class="toast-icon">check_circle</md-icon>
        <span>{{ toastMsg }}</span>
      </div>
      <div slot="actions">
        <md-filled-button @click="showToast = false">好的</md-filled-button>
      </div>
    </md-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Divider from './Divider.vue'

const showToast = ref(false)
const toastMsg = ref('')

function showCopyToast(msg) {
  toastMsg.value = msg
  showToast.value = true
}

function openEmail() {
  navigator.clipboard.writeText('fnme3706679@gmail.com').then(() => {
    showCopyToast('邮箱已复制')
  }).catch(() => {
    showCopyToast('fnme3706679@gmail.com')
  })
}

function copyQQ() {
  navigator.clipboard.writeText('574746791').then(() => {
    showCopyToast('QQ号已复制')
  }).catch(() => {
    showCopyToast('574746791')
  })
}

function copyWeChat() {
  navigator.clipboard.writeText('distandce').then(() => {
    showCopyToast('微信ID已复制')
  }).catch(() => {
    showCopyToast('distandce')
  })
}
</script>

<style scoped>
.contact-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 8px 0;
}
.contact-header {
  display: flex;
  align-items: center;
  gap: 8px;
}
.contact-icon {
  color: var(--md-sys-color-primary);
  font-size: 18px;
}
.contact-header h2 {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
}
.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 8px;
  font-size: 1rem;
  line-height: 1;
}
.toast-icon {
  color: var(--md-sys-color-primary);
  font-size: 24px;
}
</style>
