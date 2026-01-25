<template>
    <div class="person">
        <h2>姓名：{{ name }}</h2>
        <h2>年龄：{{ age }}</h2>
        <button @click="changename">显示中文名</button>
        <button @click="showtel">显示电话</button>
    </div>
</template>

<script>
export default {
    name: "Person",
    data() {
        return {
            name: 'vhsj',
            age: '18',
            tel: '188999999999'
        }
    },
    methods: {
        showtel() {
            alert(this.tel);
        },
        changename() {
            this.name = '张三';
        }
    }
}
</script>

<style>
button {
    margin: 0 15px;
    border-radius: 15px;
    background-color: lightblue;
}
</style>
