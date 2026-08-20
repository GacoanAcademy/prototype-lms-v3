<script setup lang="ts">
import { computed, ref } from 'vue'
import { programTypes } from '@/data/mockData'
import type { User } from '@/types'

const props = defineProps<{
  filters: {
    search: string
    status: string[]
    programTypeIds: string[]
    instructorId: string
  }
  isAdmin: boolean
  instructors: User[]
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:status': [value: string[]]
  'update:program-type-ids': [value: string[]]
  'update:instructor-id': [value: string]
}>()

const statusOptions = [
  { value: 'active', label: 'Active', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'completed', label: 'Completed', color: 'bg-gray-100 text-gray-800 border-gray-200' },
  { value: 'pending', label: 'Pending', color: 'bg-blue-50 text-blue-600 border-blue-100' },
]

function toggleStatus(status: string) {
  const current = [...props.filters.status]
  const idx = current.indexOf(status)
  if (idx >= 0) {
    current.splice(idx, 1)
  } else {
    current.push(status)
  }
  emit('update:status', current)
}

function toggleProgramType(ptId: string) {
  const current = [...props.filters.programTypeIds]
  const idx = current.indexOf(ptId)
  if (idx >= 0) {
    current.splice(idx, 1)
  } else {
    current.push(ptId)
  }
  emit('update:program-type-ids', current)
}

const activeFilters = computed(() => {
  let count = 0
  if (props.filters.status.length > 0) count++
  if (props.filters.programTypeIds.length > 0) count++
  if (props.filters.instructorId) count++
  if (props.filters.search) count++
  return count
})

const showProgramLegend = ref(false)
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
    <div class="flex items-center gap-3">
      <div class="relative flex-1 max-w-xs">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          :value="filters.search"
          @input="emit('update:search', ($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="Search class name..."
          class="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <span v-if="activeFilters > 0" class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
        {{ activeFilters }} filter{{ activeFilters > 1 ? 's' : '' }} active
      </span>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <div class="flex items-center gap-2">
        <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Status:</span>
        <div class="flex gap-1">
          <button
            v-for="opt in statusOptions"
            :key="opt.value"
            @click="toggleStatus(opt.value)"
            class="px-2.5 py-1 text-xs font-medium rounded-full border transition-colors"
            :class="filters.status.includes(opt.value) ? opt.color : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <div class="h-4 w-px bg-gray-200"></div>

      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1 relative">
          <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Program:</span>
          <div
            class="relative"
            @mouseenter="showProgramLegend = true"
            @mouseleave="showProgramLegend = false"
          >
            <button
              type="button"
              class="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </button>
            <div
              v-if="showProgramLegend"
              class="absolute z-50 left-full top-1/2 -translate-y-1/2 ml-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[180px]"
            >
              <div class="text-xs font-medium text-gray-700 mb-2">Program Type Colors</div>
              <div class="space-y-1.5">
                <div v-for="pt in programTypes" :key="pt.id" class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: pt.color || '#6B7280' }"></span>
                  <span class="text-xs text-gray-600">{{ pt.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex gap-1">
          <button
            v-for="pt in programTypes"
            :key="pt.id"
            @click="toggleProgramType(pt.id)"
            class="px-2.5 py-1 text-xs font-medium rounded-full border transition-colors"
            :class="filters.programTypeIds.includes(pt.id) ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'"
            :style="filters.programTypeIds.includes(pt.id) ? { borderColor: pt.color || '#8B5CF6', backgroundColor: `${pt.color || '#8B5CF6'}20`, color: pt.color || '#8B5CF6' } : ''"
          >
            {{ pt.name }}
          </button>
        </div>
      </div>

      <template v-if="isAdmin">
        <div class="h-4 w-px bg-gray-200"></div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Instructor:</span>
          <select
            :value="filters.instructorId"
            @change="emit('update:instructor-id', ($event.target as HTMLSelectElement).value)"
            class="px-2.5 py-1 text-xs font-medium border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option v-for="inst in instructors" :key="inst.id" :value="inst.id">{{ inst.name }}</option>
          </select>
        </div>
      </template>
    </div>
  </div>
</template>
