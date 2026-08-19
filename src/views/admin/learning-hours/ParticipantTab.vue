<script setup lang="ts">
import { computed, ref } from 'vue'
import type { LHFilters, LHProgramSummary, LHMateriSummary, LHUserSummary } from '@/types/learningHours'
import {
  lhPrograms,
  lhMateri,
  lhUsers,
  lhActivityLogs,
} from '@/data/learningHoursMock'

const props = defineProps<{ filters: LHFilters }>()

type DrillLevel = 'program' | 'materi' | 'user'
const level = ref<DrillLevel>('program')
const selectedProgramId = ref<string | null>(null)
const selectedMateriId = ref<string | null>(null)

function filterParticipantLogs() {
  return lhActivityLogs.filter((log) => {
    if (log.role !== 'participant') return false
    if (log.session_date < props.filters.dateFrom || log.session_date > props.filters.dateTo) return false
    if (props.filters.programIds.length > 0 && !props.filters.programIds.includes(log.program_id)) return false
    return true
  })
}

const programs = computed<LHProgramSummary[]>(() => {
  const logs = filterParticipantLogs()
  const map: Record<string, LHProgramSummary> = {}
  for (const log of logs) {
    if (!map[log.program_id]) {
      map[log.program_id] = {
        program_id: log.program_id,
        name: lhPrograms.find((p) => p.program_id === log.program_id)?.name || log.program_id,
        total_hours: 0,
        avg_hours_per_participant: 0,
        completion_rate: 0,
        materi_hours: 0,
        test_hours: 0,
      }
    }
    const entry = map[log.program_id]
    entry.total_hours += log.duration_seconds / 3600
    if (log.activity_type === 'MATERI') entry.materi_hours += log.duration_seconds / 3600
    else if (log.activity_type === 'TEST') entry.test_hours += log.duration_seconds / 3600
  }
  for (const prog of Object.values(map)) {
    const progLogs = logs.filter((l) => l.program_id === prog.program_id)
    const uniqueUsers = new Set(progLogs.map((l) => l.user_id))
    prog.avg_hours_per_participant = uniqueUsers.size > 0 ? prog.total_hours / uniqueUsers.size : 0
    const completed = progLogs.filter((l) => l.completion_status === 'COMPLETED').length
    prog.completion_rate = progLogs.length > 0 ? (completed / progLogs.length) * 100 : 0
  }
  return Object.values(map).sort((a, b) => b.total_hours - a.total_hours)
})

const materiList = computed<LHMateriSummary[]>(() => {
  if (!selectedProgramId.value) return []
  const logs = filterParticipantLogs().filter((l) => l.program_id === selectedProgramId.value)
  const map: Record<string, LHMateriSummary> = {}
  for (const log of logs) {
    if (!map[log.materi_id]) {
      map[log.materi_id] = {
        materi_id: log.materi_id,
        name: lhMateri.find((m) => m.materi_id === log.materi_id)?.name || log.materi_id,
        program_id: log.program_id,
        total_hours: 0,
        avg_hours_per_user: 0,
        test_pass_rate: 0,
        materi_hours: 0,
        test_hours: 0,
      }
    }
    const entry = map[log.materi_id]
    entry.total_hours += log.duration_seconds / 3600
    if (log.activity_type === 'MATERI') entry.materi_hours += log.duration_seconds / 3600
    else if (log.activity_type === 'TEST') entry.test_hours += log.duration_seconds / 3600
  }
  for (const m of Object.values(map)) {
    const mLogs = logs.filter((l) => l.materi_id === m.materi_id)
    const uniqueUsers = new Set(mLogs.map((l) => l.user_id))
    m.avg_hours_per_user = uniqueUsers.size > 0 ? m.total_hours / uniqueUsers.size : 0
    const tests = mLogs.filter((l) => l.activity_type === 'TEST')
    const passed = tests.filter((l) => l.pass_status === 'PASS').length
    m.test_pass_rate = tests.length > 0 ? (passed / tests.length) * 100 : 0
  }
  return Object.values(map).sort((a, b) => b.total_hours - a.total_hours)
})

const userList = computed<LHUserSummary[]>(() => {
  let logs = filterParticipantLogs()
  if (selectedProgramId.value) logs = logs.filter((l) => l.program_id === selectedProgramId.value)
  if (selectedMateriId.value) logs = logs.filter((l) => l.materi_id === selectedMateriId.value)
  if (props.filters.searchQuery) {
    const q = props.filters.searchQuery.toLowerCase()
    logs = logs.filter((l) => {
      const user = lhUsers.find((u) => u.user_id === l.user_id)
      return user?.name.toLowerCase().includes(q)
    })
  }
  const map: Record<string, LHUserSummary> = {}
  for (const log of logs) {
    if (!map[log.user_id]) {
      map[log.user_id] = {
        user_id: log.user_id,
        name: lhUsers.find((u) => u.user_id === log.user_id)?.name || log.user_id,
        total_hours: 0,
        materi_hours: 0,
        test_hours: 0,
        sessions_count: 0,
        last_activity_date: log.session_date,
        completion_status: 'NOT_STARTED',
      }
    }
    const entry = map[log.user_id]
    entry.total_hours += log.duration_seconds / 3600
    if (log.activity_type === 'MATERI') entry.materi_hours += log.duration_seconds / 3600
    else if (log.activity_type === 'TEST') entry.test_hours += log.duration_seconds / 3600
    entry.sessions_count++
    if (log.session_date > entry.last_activity_date) entry.last_activity_date = log.session_date
    if (log.completion_status === 'COMPLETED') entry.completion_status = 'COMPLETED'
    else if (log.completion_status === 'IN_PROGRESS') entry.completion_status = 'IN_PROGRESS'
  }
  return Object.values(map).sort((a, b) => b.total_hours - a.total_hours)
})

function drillIntoProgram(programId: string) {
  selectedProgramId.value = programId
  level.value = 'materi'
}

function drillIntoMateri(materiId: string) {
  selectedMateriId.value = materiId
  level.value = 'user'
}

function goBack() {
  if (level.value === 'user') {
    selectedMateriId.value = null
    level.value = 'materi'
  } else {
    selectedProgramId.value = null
    level.value = 'program'
  }
}

function formatHours(v: number) {
  return v.toFixed(1)
}
</script>

<template>
  <div>
    <nav class="flex items-center gap-1 text-xs text-gray-500 mb-4">
      <button
        class="hover:text-blue-600 transition-colors"
        :class="{ 'text-blue-600 font-medium': level === 'program' }"
        @click="level = 'program'; selectedProgramId = null; selectedMateriId = null"
      >
        Programs
      </button>
      <template v-if="selectedProgramId">
        <span>/</span>
        <button
          class="hover:text-blue-600 transition-colors"
          :class="{ 'text-blue-600 font-medium': level === 'materi' }"
          @click="selectedMateriId = null; level = 'materi'"
        >
          {{ programs.find((p) => p.program_id === selectedProgramId)?.name }}
        </button>
      </template>
      <template v-if="selectedMateriId">
        <span>/</span>
        <span class="text-blue-600 font-medium">
          {{ materiList.find((m) => m.materi_id === selectedMateriId)?.name }}
        </span>
      </template>
    </nav>

    <button
      v-if="level !== 'program'"
      @click="goBack"
      class="text-xs text-blue-600 hover:underline mb-3 inline-block"
    >
      &larr; Back
    </button>

    <div v-if="level === 'program'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <button
        v-for="prog in programs"
        :key="prog.program_id"
        @click="drillIntoProgram(prog.program_id)"
        class="bg-white p-4 rounded-lg shadow border border-gray-100 text-left hover:shadow-md transition-shadow"
      >
        <p class="text-sm font-semibold text-gray-800 mb-2">{{ prog.name }}</p>
        <div class="space-y-1 text-xs text-gray-500">
          <p>Total Hours: <span class="font-medium text-gray-700">{{ formatHours(prog.total_hours) }}h</span></p>
          <p>Avg/Participant: <span class="font-medium text-gray-700">{{ formatHours(prog.avg_hours_per_participant) }}h</span></p>
          <p>Completion: <span class="font-medium text-gray-700">{{ prog.completion_rate.toFixed(0) }}%</span></p>
        </div>
        <div class="mt-3 flex items-center gap-1">
          <div class="flex-1 h-2 bg-blue-600 rounded-l" :style="{ width: (prog.materi_hours / (prog.materi_hours + prog.test_hours) * 100) + '%' }"></div>
          <div class="flex-1 h-2 bg-blue-300 rounded-r" :style="{ width: (prog.test_hours / (prog.materi_hours + prog.test_hours) * 100) + '%' }"></div>
        </div>
      </button>
    </div>

    <div v-else-if="level === 'materi'" class="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-left">
          <tr>
            <th class="px-4 py-3 font-medium text-gray-600">Materi</th>
            <th class="px-4 py-3 font-medium text-gray-600 text-right">Total Hours</th>
            <th class="px-4 py-3 font-medium text-gray-600 text-right">Avg/User</th>
            <th class="px-4 py-3 font-medium text-gray-600 text-right">Test Pass Rate</th>
            <th class="px-4 py-3 font-medium text-gray-600">Materi/Test</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="m in materiList"
            :key="m.materi_id"
            class="hover:bg-gray-50 cursor-pointer"
            @click="drillIntoMateri(m.materi_id)"
          >
            <td class="px-4 py-3">{{ m.name }}</td>
            <td class="px-4 py-3 text-right">{{ formatHours(m.total_hours) }}h</td>
            <td class="px-4 py-3 text-right">{{ formatHours(m.avg_hours_per_user) }}h</td>
            <td class="px-4 py-3 text-right">{{ m.test_pass_rate.toFixed(0) }}%</td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-1 w-24">
                <div class="flex-1 h-2 bg-blue-600 rounded-l" :style="{ width: (m.materi_hours / (m.materi_hours + m.test_hours) * 100) + '%' }"></div>
                <div class="flex-1 h-2 bg-blue-300 rounded-r" :style="{ width: (m.test_hours / (m.materi_hours + m.test_hours) * 100) + '%' }"></div>
              </div>
            </td>
            <td class="px-4 py-3 text-blue-600 text-xs">&rarr;</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-left">
          <tr>
            <th class="px-4 py-3 font-medium text-gray-600">Name</th>
            <th class="px-4 py-3 font-medium text-gray-600 text-right">Total Hours</th>
            <th class="px-4 py-3 font-medium text-gray-600 text-right">Materi</th>
            <th class="px-4 py-3 font-medium text-gray-600 text-right">Test</th>
            <th class="px-4 py-3 font-medium text-gray-600 text-right">Sessions</th>
            <th class="px-4 py-3 font-medium text-gray-600 text-right">Last Activity</th>
            <th class="px-4 py-3 font-medium text-gray-600">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="u in userList" :key="u.user_id" class="hover:bg-gray-50">
            <td class="px-4 py-3">{{ u.name }}</td>
            <td class="px-4 py-3 text-right">{{ formatHours(u.total_hours) }}h</td>
            <td class="px-4 py-3 text-right">{{ formatHours(u.materi_hours) }}h</td>
            <td class="px-4 py-3 text-right">{{ formatHours(u.test_hours) }}h</td>
            <td class="px-4 py-3 text-right">{{ u.sessions_count }}</td>
            <td class="px-4 py-3 text-right">{{ u.last_activity_date }}</td>
            <td class="px-4 py-3">
              <span
                class="px-2 py-0.5 rounded-full text-xs font-medium"
                :class="{
                  'bg-blue-100 text-blue-700': u.completion_status === 'COMPLETED',
                  'bg-gray-100 text-gray-600': u.completion_status === 'IN_PROGRESS',
                  'bg-gray-50 text-gray-400': u.completion_status === 'NOT_STARTED',
                }"
              >
                {{ u.completion_status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
