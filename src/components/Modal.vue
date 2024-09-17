<template>
  <!-- Teleport the modal to the body element -->
  <teleport to="body">
    <div class="fixed inset-0 flex items-center justify-center z-50">
      <!-- Modal Background -->
      <div class="fixed inset-0 bg-black opacity-50" @click="closeModal">AJHSASJHASJSA</div>

      <!-- Modal Content -->
      <div class="bg-white rounded-lg shadow-lg p-6 z-10 max-w-lg w-full">
        <!-- Modal Header -->
        <div class="flex justify-between items-center border-b pb-3">
          <h3 class="text-lg font-semibold">{{ title }}</h3>
          <button class="text-gray-600" @click="closeModal">&times;</button>
        </div>

        <!-- Modal Body -->
        <div class="pt-4">
          <slot></slot>
          <!-- Slot for dynamic content -->
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { defineProps, defineEmits, onMounted } from 'vue'

// Define props for the modal
const props = defineProps({
  title: {
    type: String,
    default: 'Modal Title'
  },
  actionTitle: {
    type: String,
    default: ''
  }
})

// Define emit event for closing the modal
const emit = defineEmits(['close', 'action'])

// Function to emit the close event
const closeModal = () => {
  emit('close')
}

const actionModal = () => {
  emit('action')
}
</script>
