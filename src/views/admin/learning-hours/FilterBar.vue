<script setup lang="ts">
import { ref } from 'vue'
import type { LHFilters } from '@/types/learningHours'
import { lhPrograms } from '@/data/learningHoursMock'

const emit = defineEmits<{
  (e: 'update:filters', filters: LHFilters): void
}>()

const dateFrom = ref('2026-07-01')
const dateTo = ref('2026-08-19')
const selectedPrograms = ref<string[]>([])
const searchQuery = ref('')

function applyFilters() {
  emit('update:filters', {
    dateFrom: dateFrom.value,
    dateTo: dateTo.value,
    programIds: selectedPrograms.value,
    searchQuery: searchQuery.value,
  })
}

function toggleProgram(id: string) {
  const idx = selectedPrograms.value.indexOf(id)
  if (idx >= 0) selectedPrograms.value.splice(idx, 1)
  else selectedPrograms.value.push(id)
  applyFilters()
}

function clearPrograms() {
  selectedPrograms.value = []
  applyFilters()
}

applyFilters()
</script>

<template>
  <div class="flex flex-wrap items-end gap-3 mb-6">
    <div>
      <label class="block text-xs text-gray-500 mb-1">From</label>
      <input
        v-model="dateFrom"
        type="date"
        class="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        @change="applyFilters"
      />
    </div>
    <div>
      <label class="block text-xs text-gray-500 mb-1">To</label>
      <input
        v-model="dateTo"
        type="date"
        class="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        @change="applyFilters"
      />
    </div>
    <div class="relative">
      <label class="block text-xs text-gray-500 mb-1">Program</label>
      <div class="flex flex-wrap gap-1">
        <button
          v-for="prog in lhPrograms"
          :key="prog.program_id"
          @click="toggleProgram(prog.program_id)"
          class="px-2 py-1 text-xs rounded border transition-colors"
          :class="
            selectedPrograms.includes(prog.program_id)
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
          "
        >
          {{ prog.name }}
        </button>
        <button
          v-if="selectedPrograms.length > 0"
          @click="clearPrograms"
          class="px-2 py-1 text-xs rounded text-gray-500 hover:text-gray-700"
        >
          Clear
        </button>
      </div>
    </div>
    <div>
      <label class="block text-xs text-gray-500 mb-1">Search User</label>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Name..."
        class="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        @input="applyFilters"
      />
    </div>
  </div>
</template>
