<script setup>
import TheWelcome from '../components/TheWelcome.vue'
import { onMounted } from 'vue'

onMounted(() => {
  console.log(import.meta.env)
})
</script>

<template>
  <main>
    <TheWelcome />
  </main>
</template>
