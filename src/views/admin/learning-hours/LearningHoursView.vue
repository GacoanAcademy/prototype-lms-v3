<script setup lang="ts">
import { ref, computed } from 'vue'
import type { LHFilters, LHActivityLog } from '@/types/learningHours'
import { lhActivityLogs } from '@/data/learningHoursMock'
import OverviewTab from './OverviewTab.vue'
import ParticipantTab from './ParticipantTab.vue'
import InstructorTab from './InstructorTab.vue'
import FilterBar from './FilterBar.vue'

const activeTab = ref<'overview' | 'participant' | 'instructor'>('overview')

const filters = ref<LHFilters>({
  dateFrom: '2026-07-01',
  dateTo: '2026-08-19',
  programIds: [],
  searchQuery: '',
})

function onFilterUpdate(f: LHFilters) {
  filters.value = { ...f }
}

const filteredLogs = computed<LHActivityLog[]>(() => {
  return lhActivityLogs.filter((log) => {
    if (log.session_date < filters.value.dateFrom || log.session_date > filters.value.dateTo)
      return false
    if (filters.value.programIds.length > 0 && !filters.value.programIds.includes(log.program_id))
      return false
    return true
  })
})

const tabs = [
  { key: 'overview' as const, label: 'Overview' },
  { key: 'participant' as const, label: 'Participant' },
  { key: 'instructor' as const, label: 'Instructor' },
]
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-900 mb-1">Learning Hours Dashboard</h2>
    <p class="text-sm text-gray-500 mb-6">Monitor engagement across programs, participants, and instructors</p>

    <FilterBar @update:filters="onFilterUpdate" />

    <div class="flex gap-1 border-b border-gray-200 mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        class="px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px"
        :class="
          activeTab === tab.key
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        "
      >
        {{ tab.label }}
      </button>
    </div>

    <Transition name="fade" mode="out-in">
      <OverviewTab
        v-if="activeTab === 'overview'"
        :logs="filteredLogs"
        :filters="filters"
        key="overview"
      />
      <ParticipantTab
        v-else-if="activeTab === 'participant'"
        :filters="filters"
        key="participant"
      />
      <InstructorTab
        v-else
        :filters="filters"
        key="instructor"
      />
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
