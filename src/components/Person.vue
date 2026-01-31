<template>
    <div class="persons">
        <var-card>姓名：{{ name }}</var-card>
        <var-card>年龄：{{ age }}</var-card>
        <md-outlined-button @click="changename">显示中文名</md-outlined-button>
        <md-outlined-button @click="showtel">显示电话</md-outlined-button>
        <md-outlined-button @click="changeage">增加年龄</md-outlined-button>
    </div>
</template>

<script lang="ts">
export default {
    name: "Person",
}
</script>

<script lang="ts" setup>
import { ref } from "vue";
let name = ref('vhsj')
let age = ref(18)
let tel = '188999999999'

function changename() {
    name.value = '张三';
    console.log(1);
}
function changeage() {
    age.value++;
    console.log(2);
}
function showtel() {
    alert(tel);
    console.log(3);
}
</script>


<style></style>
