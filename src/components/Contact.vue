<template>
    <md-list >
        <md-list-item>
            <h3>别来无恙</h3>
        </md-list-item>

        <divider/>

        <md-list-item>
            <div slot="headline">微信</div>
            <div slot="supporting-text">distandce</div>
        </md-list-item>
        <divider/>
        <md-list-item>
            <div slot="headline">QQ</div>
            <div slot="supporting-text">574746791</div>
        </md-list-item>
        <divider/>
        <md-list-item>
            <div slot="headline">邮箱</div>
            <div slot="supporting-text">fnme3706679@gmail.com</div>
        </md-list-item>
        <divider/>
        <md-list-item
            type="link"
            href="https://x.com/qing1435"
            target="_blank">
            <div slot="headline">X</div>
            <div slot="supporting-text">跳转到其他标签栏打开</div>
            <md-icon slot="end">open_in_new</md-icon>
        </md-list-item>
        <divider/>
        <md-list-item
            type="link"
            href="https://github.com/paleverge"
            target="_blank">
            <div slot="headline">Github</div>
            <div slot="supporting-text">跳转到其他标签栏打开</div>
            <md-icon slot="end">open_in_new</md-icon>
        </md-list-item>

    </md-list>
</template>


<script setup>
    import Divider from './Divider.vue';
</script>

<style></style>
