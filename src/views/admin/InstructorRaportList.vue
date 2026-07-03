<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  instructorRaports,
  users,
  auditLogs,
} from '@/data/mockData'
import {
  calculateLGI,
  calculateCompletionRate,
  calculatePassRate,
  calculateFeedbackAverage,
} from '@/utils/raportCalculator'

const auth = useAuthStore()
const router = useRouter()

// Filter by period and instructor
const selectedMonth = ref<number>(new Date().getMonth() + 1)
const selectedYear = ref<number>(new Date().getFullYear())
const selectedInstructorId = ref<string>('')

// Revision counter to force reactivity on the plain module-level array
const revision = ref(0)

const filteredRaports = computed(() => {
  revision.value // track revisions to re-evaluate
  return instructorRaports.filter((r) => {
    return r.month === selectedMonth.value && r.year === selectedYear.value
  })
})

const instructorList = computed(() => {
  return users.filter((u) => u.role === 'instructor')
})

function viewDetail(id: string) {
  router.push(`/admin/instructor-raport/${id}`)
}

async function generateRaport() {
  if (!selectedInstructorId.value) {
    alert('Please select an instructor first.')
    return
  }

  const existingRaport = instructorRaports.find(
    (r) =>
      r.month === selectedMonth.value &&
      r.year === selectedYear.value &&
      r.instructorId === selectedInstructorId.value,
  )
  if (existingRaport && existingRaport.status === 'draft') {
    alert('A draft raport already exists for this period. Please complete it first.')
    return
  }

  const lgiData = calculateLGI(selectedInstructorId.value, selectedMonth.value, selectedYear.value)
  const completionRate = calculateCompletionRate(selectedInstructorId.value, selectedMonth.value, selectedYear.value)
  const passRate = calculatePassRate(selectedInstructorId.value, selectedMonth.value, selectedYear.value)
  const feedbackData = calculateFeedbackAverage(selectedInstructorId.value, selectedMonth.value, selectedYear.value)

  if (lgiData.length > 0 || completionRate > 0 || passRate > 0) {
    const newRaport: any = {
      id: 'ir' + Date.now(),
      instructorId: selectedInstructorId.value,
      month: selectedMonth.value,
      year: selectedYear.value,
      status: 'draft' as const,
      publishedAt: undefined,
      publishedBy: undefined,
      qualitativeAnalysis: '',
      quantitativeData: {
        lgi: lgiData,
        completionRate: completionRate,
        passRate: passRate,
        feedbackAverage: feedbackData,
      },
      createdAt: new Date().toISOString(),
      createdBy: auth.userId,
    }
    instructorRaports.push(newRaport)
    revision.value++
    alert('Raport generated successfully!')

    const newLog: any = {
      id: 'al' + Date.now(),
      userId: auth.userId,
      userName: auth.userName || 'Administrator',
      userRole: auth.userRole,
      action: 'GENERATE_RAPORT',
      resource: 'InstructorRaport',
      resourceId: newRaport.id,
      details: `Generated report for ${selectedInstructorId.value} - ${selectedMonth.value}/${selectedYear.value}`,
      timestamp: new Date().toISOString(),
    }
    auditLogs.push(newLog)
  } else {
    alert('No relevant data found for this period to generate a raport.')
  }
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Instructor Raport Management</h2>

    <div class="bg-white rounded shadow p-6 mb-6">
      <h3 class="text-lg font-medium mb-4">Filter &amp; Generate</h3>
      <div class="flex gap-4 flex-wrap items-end">
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Instructor</label>
          <select v-model="selectedInstructorId" class="border rounded px-3 py-2 min-w-[200px]">
            <option value="" disabled>Select instructor...</option>
            <option v-for="inst in instructorList" :key="inst.id" :value="inst.id">
              {{ inst.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Month</label>
          <select v-model.number="selectedMonth" class="border rounded px-3 py-2">
            <option v-for="m in 12" :key="m" :value="m">
              {{ new Date(2026, m - 1).toLocaleString('default', { month: 'long' }) }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Year</label>
          <select v-model.number="selectedYear" class="border rounded px-3 py-2">
            <option v-for="y in [2026, 2025, 2024]" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
        <button
          @click="generateRaport"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Generate Raport
        </button>
      </div>
    </div>

    <div class="bg-white rounded shadow overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-50 text-gray-600 text-sm">
          <tr>
            <th class="p-4 border-b">Instructor</th>
            <th class="p-4 border-b">Period</th>
            <th class="p-4 border-b">Status</th>
            <th class="p-4 border-b text-right">Action</th>
          </tr>
        </thead>
        <tbody class="text-sm">
          <tr v-for="raport in filteredRaports" :key="raport.id" class="hover:bg-gray-50 border-b">
            <td class="p-4 font-medium">
              {{ users.find((u) => u.id === raport.instructorId)?.name || raport.instructorId }}
            </td>
            <td class="p-4">
              {{ new Date(2026, raport.month - 1).toLocaleString('default', { month: 'long' }) }}
              {{ raport.year }}
            </td>
            <td class="p-4">
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-semibold uppercase',
                  raport.status === 'published'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800',
                ]"
              >
                {{ raport.status }}
              </span>
            </td>
            <td class="p-4 text-right">
              <button
                @click="viewDetail(raport.id)"
                class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded font-medium transition"
              >
                View Detail &rarr;
              </button>
            </td>
          </tr>
          <tr v-if="filteredRaports.length === 0">
            <td colspan="4" class="p-8 text-center text-gray-400">
              No raports found for the selected period.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
