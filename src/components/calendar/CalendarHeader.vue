<script setup lang="ts">
defineProps<{
  currentMonth: number
  currentYear: number
  isAdmin: boolean
}>()

defineEmits<{
  prev: []
  next: []
  today: []
}>()

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-3">
      <button @click="$emit('prev')" class="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <h2 class="text-lg font-semibold text-gray-800 min-w-[180px] text-center">
        {{ months[currentMonth] }} {{ currentYear }}
      </h2>
      <button @click="$emit('next')" class="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </button>
      <button @click="$emit('today')" class="ml-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
        Today
      </button>
    </div>
    <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
      {{ isAdmin ? 'Admin View' : 'Instructor View' }}
    </span>
  </div>
</template>
