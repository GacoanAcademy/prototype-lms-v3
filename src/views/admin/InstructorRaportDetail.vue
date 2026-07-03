<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SpiderChart from '@/components/SpiderChart.vue'
import MetricBarChart from '@/components/MetricBarChart.vue'
import {
  instructorRaports,
  users,
  auditLogs,
} from '@/data/mockData'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const raportId = route.params.id as string
const raport = computed(() => instructorRaports.find(r => r.id === raportId))

const feedbackAspects = computed(() => raport.value?.quantitativeData.feedbackAverage ?? [])

const overallFeedbackAvg = computed(() => {
  const fa = feedbackAspects.value.filter(s => s.averageScore > 0)
  if (fa.length === 0) return 0
  return fa.reduce((sum, s) => sum + s.averageScore, 0) / fa.length
})

const qualitativeInput = ref('')
const expandedPrograms = ref<Record<string, boolean>>({})

// --- Comparison Logic ---
const prevRaport = computed(() => {
  if (!raport.value) return null
  const prevMonth = raport.value.month === 1 ? 12 : raport.value.month - 1
  const prevYear = raport.value.month === 1 ? raport.value.year - 1 : raport.value.year
  return instructorRaports.find(r => 
    r.instructorId === raport.value?.instructorId && 
    r.month === prevMonth && 
    r.year === prevYear
  )
})

function getTrend(current: number, previous: number | undefined) {
  if (previous === undefined) return { value: 0, direction: 'stable', icon: '—', color: 'text-gray-400' }
  const diff = current - previous
  if (diff > 0) return { value: diff, direction: 'up', icon: '▲', color: 'text-emerald-600' }
  if (diff < 0) return { value: Math.abs(diff), direction: 'down', icon: '▼', color: 'text-red-600' }
  return { value: 0, direction: 'stable', icon: '—', color: 'text-gray-400' }
}

function getProgramTrend(programName: string, currentLgi: number) {
  if (!prevRaport.value) return getTrend(currentLgi, undefined)
  const prevProg = prevRaport.value.quantitativeData.lgi.find(p => p.programTypeName === programName)
  return getTrend(currentLgi, prevProg?.lgiValue)
}
// ------------------------

onMounted(() => {
  if (raport.value) {
    qualitativeInput.value = raport.value.qualitativeAnalysis || ''
    raport.value.quantitativeData.lgi.forEach(item => {
      expandedPrograms.value[item.programTypeName] = true
    })
  }
})

function toggleProgram(programTypeName: string) {
  expandedPrograms.value[programTypeName] = !expandedPrograms.value[programTypeName]
}

function logActivity(action: string, resourceId: string, details: string) {
  const newLog: any = {
    id: 'al' + Date.now(),
    userId: auth.userId,
    userName: auth.userName || 'Administrator',
    userRole: auth.userRole,
    action: action,
    resource: 'InstructorRaport',
    resourceId: resourceId,
    details: details,
    timestamp: new Date().toISOString(),
  }
  auditLogs.push(newLog)
  console.log('Audit Log Saved:', newLog)
}

function saveQualitativeAnalysis() {
  if (!raport.value || raport.value.status !== 'draft') return
  const index = instructorRaports.findIndex(r => r.id === raportId)
  if (index !== -1) {
    const rObj = instructorRaports[index]
    if (rObj) {
      rObj.qualitativeAnalysis = qualitativeInput.value
      alert('Qualitative analysis saved successfully!')
      logActivity('UPDATE', raportId, `Updated qualitative analysis by admin ${auth.userId}`)
    }
  }
}

function publishRaport() {
  if (!raport.value) return
  const index = instructorRaports.findIndex(r => r.id === raportId)
  if (index !== -1) {
    const rObj = instructorRaports[index]
    if (rObj) {
      const oldStatus = rObj.status
      rObj.status = 'published'
      rObj.publishedAt = new Date().toISOString()
      rObj.publishedBy = auth.userId
      alert('Raport published successfully!')
      logActivity('RAPORT_STATUS_CHANGE', raportId, `Changed status from ${oldStatus} to published by ${auth.userId}`)
    }
  }
}

function revertRaport() {
  if (!raport.value) return
  const index = instructorRaports.findIndex(r => r.id === raportId)
  if (index !== -1) {
    const rObj = instructorRaports[index]
    if (rObj) {
      const oldStatus = rObj.status
      rObj.status = 'draft'
      rObj.publishedAt = undefined
      rObj.publishedBy = undefined
      alert('Raport reverted to draft successfully!')
      logActivity('RAPORT_STATUS_CHANGE', raportId, `Reverted status from ${oldStatus} to draft by ${auth.userId}`)
    }
  }
}

function goBack() {
  router.push('/admin/instructor-raport')
}
</script>

<template>
  <div v-if="raport">
    <div class="flex items-center justify-between mb-6">
      <button @click="goBack" class="text-sm text-gray-500 hover:text-gray-700 font-medium">
        &larr; Back to Raport List
      </button>
      <div class="flex gap-2">
        <span :class="[
          'px-3 py-1.5 rounded-lg text-xs font-semibold uppercase flex items-center',
          raport.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        ]">
          {{ raport.status }}
        </span>
        <button v-if="raport.status === 'draft'" @click="publishRaport" class="px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow">
          Publish Report
        </button>
        <button v-if="raport.status === 'published'" @click="revertRaport" class="px-4 py-2 rounded-lg text-sm bg-yellow-600 hover:bg-yellow-700 text-white font-semibold shadow">
          Revert to Draft
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow p-6 mb-6">
      <div class="border-b border-gray-100 pb-4 mb-6">
        <h2 class="text-xl font-bold text-gray-900">
          Monthly Instructor Rapport Detail
        </h2>
        <p class="text-sm text-gray-500 mt-1">
          Instructor: <span class="font-semibold text-gray-700">{{ users.find(u => u.id === raport?.instructorId)?.name || raport?.instructorId }}</span> · 
          Period: <span class="font-semibold text-gray-700">{{ new Date(2026, raport?.month - 1).toLocaleString('default', { month: 'long' }) }} {{ raport?.year }}</span>
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left panel: LGI per Program Type and Materi -->
        <div class="space-y-6">
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h3 class="text-sm font-bold text-slate-800 mb-4">LGI Achievement by Program Type & Materi</h3>
            <div v-for="item in raport.quantitativeData.lgi" :key="item.programTypeName" class="bg-white rounded-lg border border-slate-200 mb-3 overflow-hidden">
              <button @click="toggleProgram(item.programTypeName)" class="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 text-left">
                <div>
                  <span class="text-xs font-bold text-blue-600 uppercase tracking-wider">Program Type</span>
                  <h4 class="font-bold text-slate-900 mt-0.5">{{ item.programTypeName }}</h4>
                </div>
                <div class="flex items-center gap-3">
                  <div class="flex items-center gap-1.5 text-sm font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                    <span>Avg LGI: {{ item.lgiValue.toFixed(2) }}</span>
                    <span :class="['text-[10px]', getProgramTrend(item.programTypeName, item.lgiValue).color]">
                      {{ getProgramTrend(item.programTypeName, item.lgiValue).icon }} {{ getProgramTrend(item.programTypeName, item.lgiValue).value.toFixed(2) }}
                    </span>
                  </div>
                  <span class="text-xs transition-transform" :class="expandedPrograms[item.programTypeName] ? 'rotate-90' : ''">▶</span>
                </div>
              </button>

              <div v-show="expandedPrograms[item.programTypeName]" class="border-t border-slate-100 px-4 py-3 bg-slate-50/50">
                <table class="w-full text-xs text-left">
                  <thead>
                    <tr class="text-slate-500 font-semibold border-b border-slate-100">
                      <th class="pb-2">Materi Name</th>
                      <th class="pb-2 text-right">LGI Performance (Pre | Post | LGI)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="m in item.materiLgis" :key="m.materiName" class="border-b border-slate-100/50 last:border-b-0">
                      <td class="py-3 font-medium text-slate-700 w-1/3">{{ m.materiName }}</td>
                      <td class="py-3 text-right">
                        <div class="flex justify-end">
                          <MetricBarChart :pre="m.avgPreScore" :post="m.avgPostScore" :lgi="m.lgiValue" />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Completion and Pass Rates -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completion Rate</p>
              <div class="flex items-center justify-center gap-2 mt-2">
                <h4 class="text-2xl font-bold text-slate-900">
                  {{ raport.quantitativeData.completionRate.toFixed(1) }}%
                </h4>
                <span v-if="prevRaport" :class="['text-xs font-bold', getTrend(raport.quantitativeData.completionRate, prevRaport.quantitativeData.completionRate).color]">
                  {{ getTrend(raport.quantitativeData.completionRate, prevRaport.quantitativeData.completionRate).icon }} 
                  {{ getTrend(raport.quantitativeData.completionRate, prevRaport.quantitativeData.completionRate).value.toFixed(1) }}%
                </span>
                <span v-else class="text-xs text-gray-400 italic">No previous data</span>
              </div>
              <p class="text-[10px] text-slate-400 mt-1">Activities fully completed</p>
            </div>
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pass Rate</p>
              <div class="flex items-center justify-center gap-2 mt-2">
                <h4 class="text-2xl font-bold text-emerald-600">
                  {{ raport.quantitativeData.passRate.toFixed(1) }}%
                </h4>
                <span v-if="prevRaport" :class="['text-xs font-bold', getTrend(raport.quantitativeData.passRate, prevRaport.quantitativeData.passRate).color]">
                  {{ getTrend(raport.quantitativeData.passRate, prevRaport.quantitativeData.passRate).icon }} 
                  {{ getTrend(raport.quantitativeData.passRate, prevRaport.quantitativeData.passRate).value.toFixed(1) }}%
                </span>
                <span v-else class="text-xs text-gray-400 italic">No previous data</span>
              </div>
              <p class="text-[10px] text-slate-400 mt-1">Passing standard achieved</p>
            </div>
          </div>
        </div>

        <!-- Right panel: Spider Graph and Qualitative Feedback -->
        <div class="space-y-6">
          <div class="bg-slate-50 p-5 rounded-xl border border-slate-100">
            <h3 class="text-sm font-bold text-slate-800 mb-4">Feedback Analysis</h3>
            <div class="flex flex-col items-center justify-center">
              <SpiderChart :data="feedbackAspects" />
              <div v-if="feedbackAspects.length > 0" class="grid grid-cols-2 gap-3 w-full mt-6 text-[10px] text-slate-600">
                <div v-for="sect in feedbackAspects" :key="sect.sectionName" class="flex items-center gap-1.5">
                  <span class="h-2 w-2 rounded-full bg-blue-500"></span>
                  <span class="truncate" :title="sect.sectionName">{{ sect.sectionName }}: <strong>{{ sect.averageScore }}</strong></span>
                </div>
              </div>
              <div v-if="overallFeedbackAvg > 0" class="mt-4 pt-3 border-t border-slate-200 text-center">
                <span class="text-xs text-slate-500">Overall Average Feedback</span>
                <p class="text-lg font-bold text-blue-700">{{ overallFeedbackAvg.toFixed(1) }} / 5.0</p>
              </div>
              <div v-if="feedbackAspects.length === 0" class="mt-4 text-xs text-slate-400 italic text-center">No feedback data available</div>
            </div>
          </div>

          <!-- Qualitative Analysis Section -->
          <div class="bg-slate-50 p-5 rounded-xl border border-slate-100">
            <h3 class="text-sm font-bold text-slate-800 mb-2">Qualitative Performance Analysis</h3>
            <p class="text-xs text-slate-400 mb-3" v-if="raport.status === 'draft'">Input free-text analysis describing overall class engagement, learning growth, and feedback.</p>
            
            <textarea
              v-if="raport.status === 'draft'"
              v-model="qualitativeInput"
              rows="6"
              class="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="Provide comments on LGI, feedback, and key strengths/areas of improvement..."
            ></textarea>
            <div v-else class="p-4 bg-white rounded-lg border border-slate-200 text-sm text-slate-700 min-h-[120px] whitespace-pre-line">
              {{ raport.qualitativeAnalysis || 'No qualitative analysis available.' }}
            </div>

            <div v-if="raport.status === 'draft'" class="flex justify-end mt-4">
              <button @click="saveQualitativeAnalysis" class="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition">
                Save Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-12 text-gray-400">
    Report not found.
  </div>
</template>
