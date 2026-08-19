<script setup lang="ts">
import { computed, ref } from 'vue'
import type { LHFilters, LHInstructorSummary } from '@/types/learningHours'
import {
  lhPrograms,
  lhMateri,
  lhUsers,
  lhActivityLogs,
} from '@/data/learningHoursMock'

const props = defineProps<{ filters: LHFilters }>()

type DrillLevel = 'program' | 'materi' | 'instructor' | 'detail'
const level = ref<DrillLevel>('program')
const selectedProgramId = ref<string | null>(null)
const selectedMateriId = ref<string | null>(null)
const selectedInstructorId = ref<string | null>(null)

function filterInstructorLogs() {
  return lhActivityLogs.filter((log) => {
    if (log.role !== 'instructor') return false
    if (log.session_date < props.filters.dateFrom || log.session_date > props.filters.dateTo) return false
    if (props.filters.programIds.length > 0 && !props.filters.programIds.includes(log.program_id)) return false
    return true
  })
}

const programs = computed(() => {
  const logs = filterInstructorLogs()
  const map: Record<string, {
    program_id: string; name: string; total_hours: number;
    instructors: Set<string>; avg_pass_rate: number
  }> = {}
  for (const log of logs) {
    let entry = map[log.program_id]
    if (!entry) {
      entry = {
        program_id: log.program_id,
        name: lhPrograms.find((p) => p.program_id === log.program_id)?.name || log.program_id,
        total_hours: 0,
        instructors: new Set(),
        avg_pass_rate: 0,
      }
      map[log.program_id] = entry
    }
    entry.total_hours += log.duration_seconds / 3600
    entry.instructors.add(log.user_id)
  }
  for (const prog of Object.values(map)) {
    const progLogs = logs.filter((l) => l.program_id === prog.program_id)
    const totalP = progLogs.reduce((s, l) => s + (l.participants_count || 0), 0)
    const totalPassed = progLogs.reduce((s, l) => s + (l.participants_passed || 0), 0)
    prog.avg_pass_rate = totalP > 0 ? (totalPassed / totalP) * 100 : 0
  }
  return Object.values(map)
    .map((p) => ({ ...p, instructor_count: p.instructors.size }))
    .sort((a, b) => b.total_hours - a.total_hours)
})

const materiList = computed(() => {
  if (!selectedProgramId.value) return []
  const logs = filterInstructorLogs().filter((l) => l.program_id === selectedProgramId.value)
  const map: Record<string, {
    materi_id: string; name: string; total_teaching_hours: number;
    estimated_teaching_hours: number; calculated_teaching_hours: number;
    percentage_teaching: number; sessions_run: number; avg_class_size: number; pass_rate: number
  }> = {}
  for (const log of logs) {
    let entry = map[log.materi_id]
    if (!entry) {
      const materi = lhMateri.find((m) => m.materi_id === log.materi_id)
      const est = materi?.estimated_teaching_hours ?? 1.0
      entry = {
        materi_id: log.materi_id,
        name: materi?.name || log.materi_id,
        total_teaching_hours: 0,
        estimated_teaching_hours: est,
        calculated_teaching_hours: 0,
        percentage_teaching: 0,
        sessions_run: 0,
        avg_class_size: 0,
        pass_rate: 0,
      }
      map[log.materi_id] = entry
    }
    entry.total_teaching_hours += log.duration_seconds / 3600
    entry.sessions_run++
  }
  for (const m of Object.values(map)) {
    const mLogs = logs.filter((l) => l.materi_id === m.materi_id)
    const totalP = mLogs.reduce((s, l) => s + (l.participants_count || 0), 0)
    const totalPassed = mLogs.reduce((s, l) => s + (l.participants_passed || 0), 0)
    m.avg_class_size = mLogs.length > 0 ? totalP / mLogs.length : 0
    m.pass_rate = totalP > 0 ? (totalPassed / totalP) * 100 : 0
    m.calculated_teaching_hours = m.estimated_teaching_hours * m.sessions_run
    m.percentage_teaching = m.calculated_teaching_hours > 0 ? (m.total_teaching_hours / m.calculated_teaching_hours) * 100 : 0
  }
  return Object.values(map).sort((a, b) => b.total_teaching_hours - a.total_teaching_hours)
})

const instructorList = computed<LHInstructorSummary[]>(() => {
  let logs = filterInstructorLogs()
  if (selectedProgramId.value) logs = logs.filter((l) => l.program_id === selectedProgramId.value)
  if (selectedMateriId.value) logs = logs.filter((l) => l.materi_id === selectedMateriId.value)
  const map: Record<string, LHInstructorSummary> = {}
  const materiSetMap: Record<string, Set<string>> = {}
  for (const log of logs) {
    let entry = map[log.user_id]
    let materiSet = materiSetMap[log.user_id]
    if (!entry) {
      entry = {
        user_id: log.user_id,
        name: lhUsers.find((u) => u.user_id === log.user_id)?.name || log.user_id,
        total_hours: 0,
        teaching_hours: 0,
        percentage_teaching: 0,
        avg_actual_hours_per_materi: 0,
        materis_count: 0,
        sessions_count: 0,
        participants_handled: 0,
        effectiveness_score: 0,
        last_active_date: log.session_date,
      }
      map[log.user_id] = entry
      materiSet = new Set()
      materiSetMap[log.user_id] = materiSet
    }
    entry.total_hours += log.duration_seconds / 3600
    entry.sessions_count++
    entry.participants_handled += log.participants_count || 0

    const materi = lhMateri.find((m) => m.materi_id === log.materi_id)
    const est = materi?.estimated_teaching_hours ?? 1.0
    entry.teaching_hours += est

    if (materiSet) {
      materiSet.add(log.materi_id)
    }

    if (log.session_date > entry.last_active_date) entry.last_active_date = log.session_date
  }
  for (const inst of Object.values(map)) {
    const instLogs = logs.filter((l) => l.user_id === inst.user_id)
    const totalP = instLogs.reduce((s, l) => s + (l.participants_count || 0), 0)
    const totalPassed = instLogs.reduce((s, l) => s + (l.participants_passed || 0), 0)
    inst.effectiveness_score = totalP > 0 ? (totalPassed / totalP) * 100 : 0
    inst.percentage_teaching = inst.teaching_hours > 0 ? (inst.total_hours / inst.teaching_hours) * 100 : 0
    inst.materis_count = materiSetMap[inst.user_id]?.size ?? 0
    inst.avg_actual_hours_per_materi = inst.materis_count > 0 ? inst.total_hours / inst.materis_count : 0
  }
  return Object.values(map).sort((a, b) => b.total_hours - a.total_hours)
})

const instructorDetail = computed(() => {
  if (!selectedInstructorId.value) return null
  const inst = lhUsers.find((u) => u.user_id === selectedInstructorId.value)
  if (!inst) return null

  // Show all materis taught by this instructor
  const logs = filterInstructorLogs().filter((l) => l.user_id === selectedInstructorId.value)

  const materiMap: Record<string, {
    materi_id: string
    name: string
    program_name: string
    estimated_teaching_hours: number
    sessions_run: number
    teaching_hours: number
    total_hours: number
    percentage_teaching: number
    participants_count: number
    participants_passed: number
    pass_rate: number
  }> = {}

  for (const log of logs) {
    let entry = materiMap[log.materi_id]
    if (!entry) {
      const materi = lhMateri.find((m) => m.materi_id === log.materi_id)
      const prog = lhPrograms.find((p) => p.program_id === log.program_id)
      const est = materi?.estimated_teaching_hours ?? 1.0
      entry = {
        materi_id: log.materi_id,
        name: materi?.name || log.materi_id,
        program_name: prog?.name || log.program_id,
        estimated_teaching_hours: est,
        sessions_run: 0,
        teaching_hours: 0,
        total_hours: 0,
        percentage_teaching: 0,
        participants_count: 0,
        participants_passed: 0,
        pass_rate: 0,
      }
      materiMap[log.materi_id] = entry
    }
    entry.sessions_run++
    entry.total_hours += log.duration_seconds / 3600
    entry.participants_count += log.participants_count || 0
    entry.participants_passed += log.participants_passed || 0
  }

  let grandTotalActual = 0
  let grandTotalTeaching = 0
  let grandParticipants = 0
  let grandPassed = 0

  const materis = Object.values(materiMap).map((m) => {
    m.teaching_hours = m.estimated_teaching_hours * m.sessions_run
    m.percentage_teaching = m.teaching_hours > 0 ? (m.total_hours / m.teaching_hours) * 100 : 0
    m.pass_rate = m.participants_count > 0 ? (m.participants_passed / m.participants_count) * 100 : 0

    grandTotalActual += m.total_hours
    grandTotalTeaching += m.teaching_hours
    grandParticipants += m.participants_count
    grandPassed += m.participants_passed

    return m
  }).sort((a, b) => b.total_hours - a.total_hours)

  const overallPct = grandTotalTeaching > 0 ? (grandTotalActual / grandTotalTeaching) * 100 : 0
  const overallEffectiveness = grandParticipants > 0 ? (grandPassed / grandParticipants) * 100 : 0
  const avgActualHoursPerMateri = materis.length > 0 ? grandTotalActual / materis.length : 0

  return {
    instructor: inst,
    materis,
    totalActualHours: grandTotalActual,
    totalTeachingHours: grandTotalTeaching,
    percentageTeaching: overallPct,
    totalSessions: logs.length,
    effectivenessScore: overallEffectiveness,
    avgActualHoursPerMateri,
    materisCount: materis.length,
  }
})

function drillIntoProgram(programId: string) {
  selectedProgramId.value = programId
  level.value = 'materi'
}

function drillIntoMateri(materiId: string) {
  selectedMateriId.value = materiId
  level.value = 'instructor'
}

function drillIntoInstructor(userId: string) {
  selectedInstructorId.value = userId
  level.value = 'detail'
}

function goBack() {
  if (level.value === 'detail') {
    selectedInstructorId.value = null
    level.value = 'instructor'
  } else if (level.value === 'instructor') {
    selectedMateriId.value = null
    level.value = 'materi'
  } else {
    selectedProgramId.value = null
    level.value = 'program'
  }
}

function formatHours(v: number) { return v.toFixed(1) }

function effectivenessClass(score: number) {
  if (score >= 80) return 'bg-blue-100 text-blue-700'
  if (score >= 60) return 'bg-blue-50 text-blue-600'
  return 'bg-gray-100 text-gray-500'
}
</script>

<template>
  <div>
    <nav class="flex items-center gap-1 text-xs text-gray-500 mb-4">
      <button
        class="hover:text-blue-600 transition-colors"
        :class="{ 'text-blue-600 font-medium': level === 'program' }"
        @click="level = 'program'; selectedProgramId = null; selectedMateriId = null; selectedInstructorId = null"
      >
        Programs
      </button>
      <template v-if="selectedProgramId">
        <span>/</span>
        <button
          class="hover:text-blue-600 transition-colors"
          :class="{ 'text-blue-600 font-medium': level === 'materi' }"
          @click="selectedMateriId = null; selectedInstructorId = null; level = 'materi'"
        >
          {{ programs.find((p) => p.program_id === selectedProgramId)?.name }}
        </button>
      </template>
      <template v-if="selectedMateriId">
        <span>/</span>
        <button
          class="hover:text-blue-600 transition-colors"
          :class="{ 'text-blue-600 font-medium': level === 'instructor' }"
          @click="selectedInstructorId = null; level = 'instructor'"
        >
          {{ materiList.find((m) => m.materi_id === selectedMateriId)?.name }}
        </button>
      </template>
      <template v-if="selectedInstructorId && instructorDetail">
        <span>/</span>
        <span class="text-blue-600 font-medium">
          {{ instructorDetail.instructor.name }}
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

    <!-- Level 1: Programs -->
    <div v-if="level === 'program'" class="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-left">
          <tr>
            <th class="px-4 py-3 font-medium text-gray-600">Program</th>
            <th class="px-4 py-3 font-medium text-gray-600 text-right">Actual Hours</th>
            <th class="px-4 py-3 font-medium text-gray-600 text-right">Instructors</th>
            <th class="px-4 py-3 font-medium text-gray-600 text-right">Avg Pass Rate</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="prog in programs"
            :key="prog.program_id"
            class="hover:bg-gray-50 cursor-pointer"
            @click="drillIntoProgram(prog.program_id)"
          >
            <td class="px-4 py-3 font-medium text-gray-800">{{ prog.name }}</td>
            <td class="px-4 py-3 text-right">{{ formatHours(prog.total_hours) }}h</td>
            <td class="px-4 py-3 text-right">{{ prog.instructor_count }}</td>
            <td class="px-4 py-3 text-right">
              <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="effectivenessClass(prog.avg_pass_rate)">
                {{ prog.avg_pass_rate.toFixed(0) }}%
              </span>
            </td>
            <td class="px-4 py-3 text-blue-600 text-xs">&rarr;</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Level 2: Materi -->
    <div v-else-if="level === 'materi'" class="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-left">
          <tr>
            <th class="px-4 py-3 font-medium text-gray-600">Materi</th>
            <th class="px-4 py-3 font-medium text-gray-600 text-right">Est. Duration/Session</th>
            <th class="px-4 py-3 font-medium text-gray-600 text-right">Sessions</th>
            <th class="px-4 py-3 font-medium text-gray-600 text-right">Teaching Hours</th>
            <th class="px-4 py-3 font-medium text-gray-600 text-right">Actual Hours</th>
            <th class="px-4 py-3 font-medium text-gray-600 text-right">% Actual / Teaching</th>
            <th class="px-4 py-3 font-medium text-gray-600 text-right">Pass Rate</th>
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
            <td class="px-4 py-3 font-medium text-gray-800">{{ m.name }}</td>
            <td class="px-4 py-3 text-right text-gray-500">{{ formatHours(m.estimated_teaching_hours) }}h</td>
            <td class="px-4 py-3 text-right">{{ m.sessions_run }}</td>
            <td class="px-4 py-3 text-right font-medium text-blue-700">{{ formatHours(m.calculated_teaching_hours) }}h</td>
            <td class="px-4 py-3 text-right">{{ formatHours(m.total_teaching_hours) }}h</td>
            <td class="px-4 py-3 text-right font-medium" :class="m.percentage_teaching >= 100 ? 'text-blue-600' : 'text-gray-600'">
              {{ m.percentage_teaching.toFixed(1) }}%
            </td>
            <td class="px-4 py-3 text-right">
              <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="effectivenessClass(m.pass_rate)">
                {{ m.pass_rate.toFixed(0) }}%
              </span>
            </td>
            <td class="px-4 py-3 text-blue-600 text-xs">&rarr;</td>
          </tr>
        </tbody>
      </table>
    </div>

<!-- Level 3: Instructors List -->
    <div v-else-if="level === 'instructor'" class="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-left">
          <tr>
            <th class="px-4 py-3 font-medium text-gray-600">Instructor</th>
            <th class="px-4 py-3 font-medium text-gray-600 text-right">Avg Actual Hours / Materi</th>
            <th class="px-4 py-3 font-medium text-gray-600 text-right">Actual Hours</th>
            <th class="px-4 py-3 font-medium text-gray-600 text-right">% Actual / Teaching</th>
            <th class="px-4 py-3 font-medium text-gray-600 text-right">Sessions</th>
            <th class="px-4 py-3 font-medium text-gray-600 text-right">Participants</th>
            <th class="px-4 py-3 font-medium text-gray-600 text-right">Effectiveness</th>
            <th class="px-4 py-3 font-medium text-gray-600 text-right">Last Active</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="inst in instructorList"
            :key="inst.user_id"
            class="hover:bg-gray-50 cursor-pointer"
            @click="drillIntoInstructor(inst.user_id)"
          >
            <td class="px-4 py-3 font-medium text-gray-800">{{ inst.name }}</td>
            <td class="px-4 py-3 text-right font-semibold text-purple-700">{{ formatHours(inst.avg_actual_hours_per_materi) }}h <span class="text-xs text-gray-400 font-normal">({{ inst.materis_count }} materis)</span></td>
            <td class="px-4 py-3 text-right">{{ formatHours(inst.total_hours) }}h</td>
            <td class="px-4 py-3 text-right font-semibold" :class="inst.percentage_teaching >= 100 ? 'text-blue-600' : 'text-gray-600'">
              {{ inst.percentage_teaching.toFixed(1) }}%
            </td>
            <td class="px-4 py-3 text-right">{{ inst.sessions_count }}</td>
            <td class="px-4 py-3 text-right">{{ inst.participants_handled }}</td>
            <td class="px-4 py-3 text-right">
              <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="effectivenessClass(inst.effectiveness_score)">
                {{ inst.effectiveness_score.toFixed(0) }}%
              </span>
            </td>
            <td class="px-4 py-3 text-right text-gray-500 text-xs">{{ inst.last_active_date }}</td>
            <td class="px-4 py-3 text-blue-600 text-xs">&rarr;</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Level 4: Instructor Detail View -->
    <div v-else-if="level === 'detail' && instructorDetail" class="space-y-6">
      <div class="bg-white p-5 rounded-lg shadow border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-bold text-gray-900">{{ instructorDetail.instructor.name }}</h3>
            <p class="text-xs text-gray-500">Instructor Learning Hours Breakdown</p>
          </div>
          <button
            @click="goBack"
            class="px-3 py-1.5 text-xs font-medium rounded border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Back to List
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p class="text-xs text-blue-600 font-medium mb-1">Teaching Hours (Target)</p>
            <p class="text-2xl font-bold text-blue-900">{{ formatHours(instructorDetail.totalTeachingHours) }}h</p>
            <p class="text-xs text-blue-700 mt-1">{{ instructorDetail.totalSessions }} sessions (Est. Duration x Sessions)</p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p class="text-xs text-gray-500 font-medium mb-1">Total Actual Hours</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatHours(instructorDetail.totalActualHours) }}h</p>
            <p class="text-xs text-gray-500 mt-1">Logged activity duration</p>
          </div>

          <div class="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <p class="text-xs text-purple-700 font-medium mb-1">Avg Actual Hours / Materi</p>
            <p class="text-2xl font-bold text-purple-900">{{ formatHours(instructorDetail.avgActualHoursPerMateri) }}h</p>
            <p class="text-xs text-purple-700 mt-1">Across {{ instructorDetail.materisCount }} materis taught</p>
          </div>

          <div class="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
            <p class="text-xs text-emerald-700 font-medium mb-1">% Actual / Teaching Hours</p>
            <p class="text-2xl font-bold text-emerald-900">{{ instructorDetail.percentageTeaching.toFixed(1) }}%</p>
            <p class="text-xs text-emerald-700 mt-1">Ratio of actual vs teaching target</p>
          </div>

          <div class="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <p class="text-xs text-indigo-700 font-medium mb-1">Effectiveness Score</p>
            <p class="text-2xl font-bold text-indigo-900">{{ instructorDetail.effectivenessScore.toFixed(0) }}%</p>
            <p class="text-xs text-indigo-700 mt-1">Participants pass rate</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
        <div class="p-4 border-b border-gray-100">
          <h4 class="text-sm font-semibold text-gray-800">Materi Taught Breakdown</h4>
        </div>
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-left">
            <tr>
              <th class="px-4 py-3 font-medium text-gray-600">Materi</th>
              <th class="px-4 py-3 font-medium text-gray-600">Program</th>
              <th class="px-4 py-3 font-medium text-gray-600 text-right">Est. Duration/Session</th>
              <th class="px-4 py-3 font-medium text-gray-600 text-right">Sessions Run</th>
              <th class="px-4 py-3 font-medium text-gray-600 text-right">Teaching Hours</th>
              <th class="px-4 py-3 font-medium text-gray-600 text-right">Actual Hours</th>
              <th class="px-4 py-3 font-medium text-gray-600 text-right">Avg Actual Hours / Materi</th>
              <th class="px-4 py-3 font-medium text-gray-600 text-right">% Actual / Teaching</th>
              <th class="px-4 py-3 font-medium text-gray-600 text-right">Pass Rate</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="m in instructorDetail.materis" :key="m.materi_id" class="hover:bg-gray-50">
              <td class="px-4 py-3 font-medium text-gray-800">{{ m.name }}</td>
              <td class="px-4 py-3 text-gray-500">{{ m.program_name }}</td>
              <td class="px-4 py-3 text-right text-gray-500">{{ formatHours(m.estimated_teaching_hours) }}h</td>
              <td class="px-4 py-3 text-right font-medium">{{ m.sessions_run }}</td>
              <td class="px-4 py-3 text-right font-semibold text-blue-700">{{ formatHours(m.teaching_hours) }}h</td>
              <td class="px-4 py-3 text-right">{{ formatHours(m.total_hours) }}h</td>
              <td class="px-4 py-3 text-right font-semibold text-purple-700">{{ formatHours(m.sessions_run > 0 ? m.total_hours / m.sessions_run : 0) }}h</td>
              <td class="px-4 py-3 text-right font-medium" :class="m.percentage_teaching >= 100 ? 'text-blue-600' : 'text-gray-600'">
                {{ m.percentage_teaching.toFixed(1) }}%
              </td>
              <td class="px-4 py-3 text-right">
                <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="effectivenessClass(m.pass_rate)">
                  {{ m.pass_rate.toFixed(0) }}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
