<script setup>
import { request } from '@/utils/request'
import { ref, computed, watch } from 'vue'
import Modal from '@/components/Modal.vue'
import { useRouter, useRoute } from 'vue-router'

const defaultForm = {
  id: 0,
  title: '',
  due_date: null,
  status: '',
  note: ''
}

const router = useRouter()
const route = useRoute()

const tasks = ref([])
const form = ref(defaultForm)
const openModal = ref(false)

const setQueryParams = (props) => {
  router.replace({
    path: route.path,
    query: { ...route.query, ...props }
  })
}

const getTasks = async () => {
  try {
    const res = await request('/task', {
      method: 'GET',
      params: {
        ...route.query
      }
    })
    tasks.value = res
  } catch (e) {
    alert(JSON.stringify(e?.message, null, 2))
  }
}

const createTask = async () => {
  try {
    await request('/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...form.value,
        due_date: form.value.due_date ? new Date(form.value.due_date).toISOString() : null
      })
    })
    await getTasks()
    onCloseTask()
  } catch (e) {
    alert(JSON.stringify(e, null, 2))
  }
}

const editTask = async () => {
  try {
    await request(`/task/${form.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...form.value,
        due_date: form.value.due_date ? new Date(form.value.due_date).toISOString() : null
      })
    })
    await getTasks()
    onCloseTask()
  } catch (e) {
    alert(JSON.stringify(e, null, 2))
  }
}

const deleteTask = async () => {
  try {
    await request(`/task/${form.value.id}`, {
      method: 'DELETE'
    })
    await getTasks()
    onCloseTask()
  } catch (e) {
    alert(JSON.stringify(e, null, 2))
  }
}

const toggleOpenModal = () => {
  openModal.value = !openModal.value
}

const onClickTask = (task) => {
  toggleOpenModal()
  form.value = { ...task, due_date: formatDate(task.due_date) }
}

const onCloseTask = () => {
  toggleOpenModal()
  form.value = { ...defaultForm }
}

const formatDate = (timestamp) => {
  if (!timestamp) return

  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const handleSubmit = () => {
  form.value.id ? editTask() : createTask()
}

const onLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

const getBgStatus = (status) => {
  const defaultClass = `text-xs px-2 py-1 rounded-lg`

  switch (status) {
    case 'pending':
      return `${defaultClass} bg-yellow-400`
    case 'in-progress':
      return `${defaultClass} bg-blue-400`
    case 'completed':
      return `${defaultClass} bg-green-400`
  }
}

const getDueDateMessage = (timestamp) => {
  const dueDate = new Date(timestamp) // Convert the due date string to a Date object
  const currentDate = new Date() // Get the current date

  // Calculate the difference in milliseconds
  const timeDifference = currentDate - dueDate

  // Convert milliseconds to days
  const daysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24))

  // Determine the message based on the days left
  if (daysLeft > 1) {
    return {
      color: 'text-red-300',
      message: `${daysLeft} days left`
    }
  } else if (daysLeft === 1) {
    return {
      color: 'text-red-400',
      message: '1 day left'
    }
  } else if (daysLeft === 0) {
    return {
      color: 'text-red-500',
      message: 'Due today'
    }
  } else {
    return {
      color: 'text-red-600',
      message: `${Math.abs(daysLeft)} days overdue`
    }
  }
}

const isSelectedTask = computed(() => !!form.value.id)
const titleModal = computed(() => (isSelectedTask.value ? 'Edit task' : 'Add task'))

watch(() => route.query, getTasks, {
  immediate: true
})
</script>

<template>
  <main class="px-5 max-w-7xl w-full mx-auto py-10">
    <button class="ml-auto block mb-4 bg-red-500 text-white px-2 py-1 rounded-lg text-sm" @click="onLogout">
      Logout
    </button>
    <div class="w-full flex flex-col gap-5 items-start">
      <div class="w-full flex justify-between md:items-center md:flex-row flex-col gap-5">
        <div class="flex gap-2 items-center">
          <h1>My Tasks</h1>
          <button @click="toggleOpenModal" class="bg-blue-600 text-sm text-white px-3 py-1 rounded-lg">
            Add new task +
          </button>
        </div>
        <div class="flex gap-2 items-center">
          <input
            :value="route.query.title"
            @change="(e) => setQueryParams({ title: e.target.value })"
            type="text"
            placeholder="filter title"
            class="border border-gray-300 p-1 rounded-lg w-20"
          />
          <select
            :value="route.query.status"
            @change="(e) => setQueryParams({ status: e.target.value === 'all' ? undefined : e.target.value })"
            class="border border-gray-300 rounded-lg p-1 w-16"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <div class="flex gap-2 items-center flex-shrink-0">
            <input
              :checked="route.query.sort_by"
              @change="setQueryParams({ sort_by: route.query.sort_by ? undefined : 'due_date' })"
              type="checkbox"
              class="md:w-6 md:h-6 w-4 h-4"
              id="sort_by"
            />
            <label for="sort_by" class="text-sm text-gray-700"> Sort by due date </label>
          </div>
        </div>
      </div>
      <ul class="w-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
        <li
          class="cursor-pointer rounded-lg border-2 border-gray-200 p-4"
          v-for="task in tasks"
          @click="onClickTask(task)"
          :key="task.id"
        >
          <div class="flex justify-between items-center w-full">
            <span class="font-semibold">{{ task.title }}</span>
            <span v-if="task.status" :class="getBgStatus(task.status)"> {{ task.status }}</span>
          </div>
          <div v-if="task.due_date && task.status !== 'completed'" :class="getDueDateMessage(task.due_date).color">
            {{ getDueDateMessage(task.due_date).message }}
          </div>
        </li>
      </ul>
    </div>
  </main>
  <Modal v-if="openModal" :title="titleModal" @close="onCloseTask">
    <form @submit.prevent="() => {}">
      <!-- Name Field -->
      <div class="mb-4">
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          v-model="form.title"
          id="title"
          type="text"
          class="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter task title"
          required
        />
      </div>

      <!-- Due Date Field -->
      <div class="mb-4">
        <label for="due_date" class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
        <input
          v-model="form.due_date"
          id="due_date"
          type="date"
          class="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <!-- Status Dropdown -->
      <div class="mb-4">
        <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          v-model="form.status"
          id="status"
          class="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="" disabled>Select status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <!-- Note Field -->
      <div class="mb-4">
        <label for="note" class="block text-sm font-medium text-gray-700 mb-1">Note</label>
        <textarea
          v-model="form.note"
          id="note"
          rows="4"
          class="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter additional note here"
        ></textarea>
      </div>

      <!-- Footer -->
      <div class="flex justify-end mt-4 gap-3">
        <button
          v-if="isSelectedTask"
          class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          @click="deleteTask"
        >
          Delete
        </button>
        <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-gray-700" @click="handleSubmit">Submit</button>
      </div>
    </form>
  </Modal>
</template>
