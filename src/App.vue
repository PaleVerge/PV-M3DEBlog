<template>
	<div class="app">
		<h1 style="color: black;">Hello, Vue!</h1>
		<Person></Person>
	</div>
</template>

<script lang="ts">
import Person from './components/Person.vue'

export default {
	name: "App",
	components: { Person }
}
</script>

<style>
.app {
	box-shadow: inset 0 0 10px #ae1d5c;
	background-color: palevioletred;
	padding: 15px;
	color: bisque;
	border-radius: 15px;
}
</style>