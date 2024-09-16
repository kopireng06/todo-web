<script setup>
import { request } from '../utils/request'
import { reactive } from 'vue'

const formData = reactive({
  username: '',
  password: ''
})

const onRegister = async () => {
  try {
    await request('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password
      })
    })
    alert('SUKSES')
  } catch (e) {
    alert(JSON.stringify(e, null, 2))
  }
}
</script>

<template>
  <form @submit.prevent="onRegister">
    <input v-model="formData.username" placeholder="Username" required class="border-2 border-red-100" type="text" />
    <input v-model="formData.password" placeholder="Password" required class="border-2 border-red-100" type="text" />
    <button type="submit">Register</button>
  </form>
</template>
