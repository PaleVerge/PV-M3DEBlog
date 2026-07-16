<template>
  <div>
    <h1>Welcome to PV's M3DEBlog!</h1>
    <br />
  </div>

  <var-app-bar title="PaleVerge 's Blog" title-position="center" />

  <div>
    <br />
    <Person />
  </div>

  <div>
    <md-outlined-button>Back</md-outlined-button>
    <md-filled-button>Complete</md-filled-button>
  </div>
</template>

<script lang="ts">
import Person from './components/Person.vue'

export default {
  name: 'App',
  components: { Person },
}
</script>

<style></style>
