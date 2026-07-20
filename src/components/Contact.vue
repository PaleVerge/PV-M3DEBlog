<template>
  <div class="contact-container">
    <h2>联系作者</h2>
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
        <md-icon slot="end">content_copy</md-icon>
      </md-list-item>
      <Divider />
      <md-list-item type="link" @click="copyWeChat">
        <div slot="headline">微信</div>
        <div slot="supporting-text">distandce</div>
        <md-icon slot="end">content_copy</md-icon>
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
  </div>
</template>

<script setup>
import Divider from './Divider.vue'

function openEmail() {
  navigator.clipboard.writeText('fnme3706679@gmail.com').then(() => {
    alert('邮箱已复制到剪贴板：fnme3706679@gmail.com')
  }).catch(() => {
    alert('邮箱：fnme3706679@gmail.com')
  })
}

function copyQQ() {
  navigator.clipboard.writeText('574746791').then(() => {
    alert('QQ号已复制到剪贴板：574746791\n请打开QQ添加好友')
  }).catch(() => {
    alert('QQ号：574746791')
  })
}

function copyWeChat() {
  navigator.clipboard.writeText('distandce').then(() => {
    alert('微信ID已复制到剪贴板：distandce\n请打开微信添加好友')
  }).catch(() => {
    alert('微信ID：distandce')
  })
}
</script>

<style scoped>
.contact-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 8px 0;
}
</style>
