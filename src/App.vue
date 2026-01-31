<template>
	<var-app-bar title="PaleVerge 's Blog" title-position="center" />
	<md-outlined-button>Back</md-outlined-button>
	<md-filled-button>Complete</md-filled-button>
	<Person />
</template>

<script lang="ts">
import Person from './components/Person.vue'

export default {
	name: "App",
	components: { Person }
}

</script>


<style></style>
