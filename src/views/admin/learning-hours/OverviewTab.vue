<script setup lang="ts">
import { computed } from 'vue'
import type { LHFilters } from '@/types/learningHours'
import {
  lhPrograms,
  lhMateri,
  lhUsers,
  lhActivityLogs,
} from '@/data/learningHoursMock'
import HeroMetricCard from './HeroMetricCard.vue'
import TrendLineChart from '@/components/charts/TrendLineChart.vue'
import DonutChart from '@/components/charts/DonutChart.vue'
import HorizontalBarChart from '@/components/charts/HorizontalBarChart.vue'

const props = defineProps<{ filters: LHFilters }>()

function filterLogs() {
  return lhActivityLogs.filter((log) => {
    if (log.session_date < props.filters.dateFrom || log.session_date > props.filters.dateTo)
      return false
    if (props.filters.programIds.length > 0 && !props.filters.programIds.includes(log.program_id))
      return false
    return true
  })
}

const totalHours = computed(() => {
  const logs = filterLogs()
  return logs.reduce((sum, l) => sum + l.duration_seconds, 0) / 3600
})

const activeParticipants = computed(() => {
  const logs = filterLogs().filter((l) => l.role === 'participant')
  return new Set(logs.map((l) => l.user_id)).size
})

const activeInstructors = computed(() => {
  const logs = filterLogs().filter((l) => l.role === 'instructor')
  return new Set(logs.map((l) => l.user_id)).size
})

const splitData = computed(() => {
  const logs = filterLogs().filter((l) => l.role === 'participant')
  const materiH = logs.filter((l) => l.activity_type === 'MATERI').reduce((s, l) => s + l.duration_seconds, 0) / 3600
  const testH = logs.filter((l) => l.activity_type === 'TEST').reduce((s, l) => s + l.duration_seconds, 0) / 3600
  const total = materiH + testH
  return { materiHours: materiH, testHours: testH, materiPct: total > 0 ? (materiH / total) * 100 : 0 }
})

const trendData = computed(() => {
  const logs = filterLogs().filter((l) => l.role === 'participant')
  const dateMap: Record<string, { materi: number; test: number }> = {}
  for (const log of logs) {
    let dEntry = dateMap[log.session_date]
    if (!dEntry) {
      dEntry = { materi: 0, test: 0 }
      dateMap[log.session_date] = dEntry
    }
    if (log.activity_type === 'MATERI') dEntry.materi += log.duration_seconds / 3600
    else if (log.activity_type === 'TEST') dEntry.test += log.duration_seconds / 3600
  }
  const sorted = Object.keys(dateMap).sort()
  const weeklyMap: Record<string, { materi: number; test: number }> = {}
  for (const d of sorted) {
    const dt = new Date(d)
    const weekStart = new Date(dt)
    weekStart.setDate(dt.getDate() - dt.getDay())
    const key = weekStart.toISOString().slice(0, 10)
    let wEntry = weeklyMap[key]
    if (!wEntry) {
      wEntry = { materi: 0, test: 0 }
      weeklyMap[key] = wEntry
    }
    const dEntry = dateMap[d]
    if (dEntry) {
      wEntry.materi += dEntry.materi
      wEntry.test += dEntry.test
    }
  }
  const weeks = Object.keys(weeklyMap).sort()
  return {
    labels: weeks.map((w) => w.slice(5)),
    materiData: weeks.map((w) => weeklyMap[w]?.materi ?? 0),
    testData: weeks.map((w) => weeklyMap[w]?.test ?? 0),
  }
})

const topPrograms = computed(() => {
  const logs = filterLogs()
  const programMap: Record<string, number> = {}
  for (const log of logs) {
    programMap[log.program_id] = (programMap[log.program_id] || 0) + log.duration_seconds / 3600
  }
  return Object.entries(programMap)
    .map(([id, hours]) => ({
      name: lhPrograms.find((p) => p.program_id === id)?.name || id,
      hours,
    }))
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 5)
})
</script>

<template>
  <div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <HeroMetricCard label="Total Learning Hours" :value="totalHours" unit="hours" />
      <HeroMetricCard label="Active Participants" :value="activeParticipants" unit="people" :decimals="0" />
      <HeroMetricCard label="Active Instructors" :value="activeInstructors" unit="people" :decimals="0" />
      <div class="bg-white p-5 rounded-lg shadow border border-gray-100">
        <p class="text-sm text-gray-500 mb-2">Materi vs Test Split</p>
        <div class="flex items-center gap-3">
          <div class="flex-1 h-3 bg-blue-600 rounded-l" :style="{ width: splitData.materiPct + '%' }"></div>
          <div class="flex-1 h-3 bg-blue-300 rounded-r" :style="{ width: (100 - splitData.materiPct) + '%' }"></div>
        </div>
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span>Materi {{ splitData.materiPct.toFixed(0) }}%</span>
          <span>Test {{ (100 - splitData.materiPct).toFixed(0) }}%</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div class="lg:col-span-2 bg-white p-5 rounded-lg shadow border border-gray-100">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Learning Hours Trend (Weekly)</h3>
        <TrendLineChart
          :labels="trendData.labels"
          :materi-data="trendData.materiData"
          :test-data="trendData.testData"
        />
      </div>
      <div class="bg-white p-5 rounded-lg shadow border border-gray-100">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">Materi vs Test Split</h3>
        <DonutChart :materi-hours="splitData.materiHours" :test-hours="splitData.testHours" />
      </div>
    </div>

    <div class="bg-white p-5 rounded-lg shadow border border-gray-100">
      <h3 class="text-sm font-semibold text-gray-700 mb-3">Top 5 Programs by Learning Hours</h3>
      <HorizontalBarChart
        :labels="topPrograms.map((p) => p.name)"
        :data="topPrograms.map((p) => p.hours)"
        horizontal
      />
    </div>
  </div>
</template>
