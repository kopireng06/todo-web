<script setup>
import { request } from '../utils/request'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = reactive({
  username: '',
  password: ''
})

const onLogin = async () => {
  try {
    const res = await request('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password
      })
    })
    localStorage.setItem('token', res.token)
    router.push('/')
  } catch (e) {
    alert(JSON.stringify(e?.message, null, 2))
  }
}
</script>

<template>
  <form @submit.prevent="onLogin" class="w-full flex justify-center items-center min-h-dvh">
    <div class="flex flex-col gap-4 rounded-xl border-2 border-gray-200 p-5 lg:w-3/12 md:w-6/12 w-10/12">
      <input
        v-model="formData.username"
        placeholder="Username"
        required
        class="border px-3 min-h-10 border-gray-300 rounded-lg"
        type="text"
      />
      <input
        v-model="formData.password"
        placeholder="Password"
        required
        class="border px-3 min-h-10 border-gray-300 rounded-lg"
        type="text"
      />
      <button type="submit" class="bg-blue-400 text-white py-2 rounded-xl">Login</button>
      <p class="text-sm">
        Dont have an account? <router-link class="text-blue-400 text-sm" to="/register">register</router-link>
      </p>
    </div>
  </form>
</template>
