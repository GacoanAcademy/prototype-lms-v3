<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  instructorRaports,
  users,
  classes,
  inClasses,
  formAssessments,
  materis,
  inClassActivityCompletions,
  feedbackSubmissions,
  testAttempts,
  lgis,
  curricula,
  programTypes,
} from '@/data/mockData'

const auth = useAuthStore()
const router = useRouter()

// Filter by month/year
const selectedMonth = ref<number>(new Date().getMonth() + 1)
const selectedYear = ref<number>(new Date().getFullYear())

const filteredRaports = computed(() => {
  return instructorRaports.filter((r) => {
    return r.month === selectedMonth.value && r.year === selectedYear.value
  })
})

function calculateCompletionRate(instructorId: string, month: number, year: number): number {
  const targetDate = new Date(year, month - 1, 1)
  const nextMonthDate = new Date(year, month, 1)

  const instructorClasses = classes.filter((c) => {
    const classStartDate = new Date(c.startDate)
    const classEndDate = new Date(c.endDate)
    return (
      c.instructorId === instructorId &&
      classStartDate < nextMonthDate &&
      classEndDate >= targetDate
    )
  })

  let totalParticipants = 0
  let completedParticipants = 0

  for (const cls of instructorClasses) {
    const curriculum = curricula.find((curr) => curr.id === cls.curriculumId)
    if (!curriculum) continue

    totalParticipants += cls.participants.length

    for (const participantId of cls.participants) {
      let allRequiredActivitiesCompleted = true
      const relevantInClassIds: Set<string> = new Set()
      curriculum.items.forEach((item) => {
        if (item.trainingMethodType === 'inClass') relevantInClassIds.add(item.contentId)
      })
      cls.inClassInstructorAssignments?.forEach((assignment) => {
        relevantInClassIds.add(assignment.inClassId)
      })

      for (const inClassId of Array.from(relevantInClassIds)) {
        const ic = inClasses.find((i) => i.id === inClassId)
        if (!ic) continue

        const categoriesInInClass = ic.categories.filter(
          (cat) => cat.preTestId && cat.postTestId && cat.materiIds && cat.materiIds.length > 0,
        )

        for (const category of categoriesInInClass) {
          const participantActivityCompletionsInPeriod = inClassActivityCompletions.filter((a) => {
            const completionDate = new Date(a.completedAt)
            return (
              a.classId === cls.id &&
              a.participantId === participantId &&
              a.inClassId === inClassId &&
              a.categoryId === category.id &&
              completionDate.getMonth() + 1 === month &&
              completionDate.getFullYear() === year
            )
          })

          const participantFeedbackSubmissionsInPeriod = feedbackSubmissions.filter((fs) => {
            const submissionDate = new Date(fs.submittedAt)
            return (
              fs.classId === cls.id &&
              fs.participantId === participantId &&
              fs.inClassId === inClassId &&
              fs.categoryId === category.id &&
              submissionDate.getMonth() + 1 === month &&
              submissionDate.getFullYear() === year
            )
          })

          const hasPreTest = participantActivityCompletionsInPeriod.some(
            (a) => a.activityType === 'preTest' && a.refId === category.preTestId,
          )
          const hasPostTest = participantActivityCompletionsInPeriod.some(
            (a) => a.activityType === 'postTest' && a.refId === category.postTestId,
          )
          const hasFeedback = participantFeedbackSubmissionsInPeriod.some(
            (f) => f.formAssessmentId === category.feedbackFormId,
          )
          const allMateriCompleted = category.materiIds.every((mId) =>
            participantActivityCompletionsInPeriod.some(
              (a) => a.activityType === 'materi' && a.refId === mId,
            ),
          )

          if (!hasPreTest || !hasPostTest || !hasFeedback || !allMateriCompleted) {
            allRequiredActivitiesCompleted = false
            break
          }
        }
        if (!allRequiredActivitiesCompleted) break
      }
      if (allRequiredActivitiesCompleted) completedParticipants++
    }
  }
  return totalParticipants > 0
    ? Math.round((completedParticipants / totalParticipants) * 100 * 100) / 100
    : 0
}

function calculatePassRate(instructorId: string, month: number, year: number): number {
  const targetDate = new Date(year, month - 1, 1)
  const nextMonthDate = new Date(year, month, 1)

  const instructorClasses = classes.filter((c) => {
    const classStartDate = new Date(c.startDate)
    const classEndDate = new Date(c.endDate)
    return (
      c.instructorId === instructorId &&
      classStartDate < nextMonthDate &&
      classEndDate >= targetDate
    )
  })

  let totalPassed = 0
  let totalCompleted = 0

  for (const cls of instructorClasses) {
    const curriculum = curricula.find((curr) => curr.id === cls.curriculumId)
    if (!curriculum) continue

    for (const item of curriculum.items) {
      if (item.trainingMethodType !== 'inClass') continue
      const ic = inClasses.find((i) => i.id === item.contentId)
      if (!ic) continue

      for (const category of ic.categories) {
        for (const participantId of cls.participants) {
          const participantActivityCompletionsInPeriod = inClassActivityCompletions.filter((a) => {
            const completionDate = new Date(a.completedAt)
            return (
              a.classId === cls.id &&
              a.participantId === participantId &&
              a.inClassId === ic.id &&
              a.categoryId === category.id &&
              completionDate.getMonth() + 1 === month &&
              completionDate.getFullYear() === year
            )
          })

          const participantFeedbackSubmissionsInPeriod = feedbackSubmissions.filter((fs) => {
            const submissionDate = new Date(fs.submittedAt)
            return (
              fs.classId === cls.id &&
              fs.participantId === participantId &&
              fs.inClassId === ic.id &&
              fs.categoryId === category.id &&
              submissionDate.getMonth() + 1 === month &&
              submissionDate.getFullYear() === year
            )
          })

          const hasPreTest = participantActivityCompletionsInPeriod.some(
            (a) => a.activityType === 'preTest' && a.refId === category.preTestId,
          )
          const hasPostTest = participantActivityCompletionsInPeriod.some(
            (a) => a.activityType === 'postTest' && a.refId === category.postTestId,
          )
          const hasFeedback = participantFeedbackSubmissionsInPeriod.some(
            (f) => f.formAssessmentId === category.feedbackFormId,
          )
          const allMateriCompleted = category.materiIds.every((mId) =>
            participantActivityCompletionsInPeriod.some(
              (a) => a.activityType === 'materi' && a.refId === mId,
            ),
          )

          if (hasPreTest && hasPostTest && hasFeedback && allMateriCompleted) {
            totalCompleted++
            const postTests = testAttempts.filter(
              (ta) =>
                ta.participantId === participantId &&
                ta.classId === cls.id &&
                ta.inClassId === ic.id &&
                ta.categoryId === category.id &&
                ta.testType === 'postTest' &&
                ta.status === 'completed',
            )
            if (postTests.length > 0) {
              const bestScore = Math.max(...postTests.map((t) => t.normalizedScore))
              if (bestScore >= item.passingScore) totalPassed++
            }
          }
        }
      }
    }
  }
  return totalCompleted > 0 ? Math.round((totalPassed / totalCompleted) * 100 * 100) / 100 : 0
}

function calculateFeedbackAverage(
  inClassId: string,
): { sectionName: string; averageScore: number }[] {
  const feedbacks = feedbackSubmissions.filter((fb) => fb.inClassId === inClassId)
  const aspectScores: Record<string, { total: number; count: number }> = {}

  for (const feedback of feedbacks) {
    const form = formAssessments.find((f) => f.id === feedback.formAssessmentId)
    if (!form) continue

    for (const field of form.fields) {
      if (field.type === 'rating') {
        const answers = feedback.answers.filter((a) => a.fieldId === field.id)
        for (const answer of answers) {
          const score = Number(answer.value)
          if (!aspectScores[field.label]) aspectScores[field.label] = { total: 0, count: 0 }
          const scoreData = aspectScores[field.label]
          if (scoreData) {
            scoreData.total += score
            scoreData.count += 1
          }
        }
      }
    }
  }

  return Object.entries(aspectScores).map(([sectionName, data]) => ({
    sectionName,
    averageScore: Math.round((data.total / data.count) * 10) / 10,
  }))
}

function getInstructorClasses(instructorId: string) {
  return classes.filter((c) => c.instructorId === instructorId)
}

function viewDetail(id: string) {
  router.push(`/admin/instructor-raport/${id}`)
}

async function generateRaport() {
  const existingRaport = instructorRaports.find(
    (r) =>
      r.month === selectedMonth.value &&
      r.year === selectedYear.value &&
      r.instructorId === auth.userId,
  )
  if (existingRaport && existingRaport.status === 'draft') {
    alert('A draft raport already exists for this period. Please complete it first.')
    return
  }

  const instructorClasses = getInstructorClasses(auth.userId)
  const lgiByProgram: any[] = []

  // Group classes by program type first
  const classesByProgram: Record<string, typeof classes> = {}
  instructorClasses.forEach((c) => {
    if (!classesByProgram[c.programTypeId]) classesByProgram[c.programTypeId] = []
    classesByProgram[c.programTypeId]?.push(c)
  })

  for (const [programTypeId, classList] of Object.entries(classesByProgram)) {
    const pTypeName = programTypes.find((pt: any) => pt.id === programTypeId)?.name || programTypeId
    const materiLgis: { materiName: string; lgiValue: number }[] = []

    // Collect all unique materis from all classes in this program type
    const uniqueMateris: Set<string> = new Set()
    const materiToCategoryMap: Record<string, { categoryId: string; inClassId: string }> = {}

    classList.forEach((cls) => {
      const relevantInClassIds: Set<string> = new Set()
      if (cls.knowledgeTestClassId) relevantInClassIds.add(cls.knowledgeTestClassId)
      if (cls.curriculumId) {
        const curriculum = curricula.find((curr) => curr.id === cls.curriculumId)
        curriculum?.items.forEach((item) => {
          if (item.trainingMethodType === 'inClass') relevantInClassIds.add(item.contentId)
        })
      }

      Array.from(relevantInClassIds).forEach((inClassId) => {
        const ic = inClasses.find((i) => i.id === inClassId)
        if (!ic) return
        ic.categories.forEach((cat) => {
          cat.materiIds.forEach((mId) => {
            uniqueMateris.add(mId)
            materiToCategoryMap[mId] = { categoryId: cat.id, inClassId }
          })
        })
      })
    })

    // Compute LGI value for each materi based on testAttempts
    uniqueMateris.forEach((mId) => {
      const mapInfo = materiToCategoryMap[mId]
      if (!mapInfo) return
      const { categoryId, inClassId } = mapInfo

      // Gather pre and post attempts for this category across all participants in these classes
      const allPreScores: number[] = []
      const allPostScores: number[] = []

      classList.forEach((cls) => {
        cls.participants.forEach((pId) => {
          // Pre-test attempt
          const preAttempts = testAttempts.filter(
            (ta) =>
              ta.participantId === pId &&
              ta.classId === cls.id &&
              ta.inClassId === inClassId &&
              ta.categoryId === categoryId &&
              ta.testType === 'preTest' &&
              ta.status === 'completed',
          )
          // Post-test attempt
          const postAttempts = testAttempts.filter(
            (ta) =>
              ta.participantId === pId &&
              ta.classId === cls.id &&
              ta.inClassId === inClassId &&
              ta.categoryId === categoryId &&
              ta.testType === 'postTest' &&
              ta.status === 'completed',
          )

          if (preAttempts.length > 0 && postAttempts.length > 0) {
            const preScore = Math.max(...preAttempts.map((a) => a.normalizedScore))
            const postScore = Math.max(...postAttempts.map((a) => a.normalizedScore))
            allPreScores.push(preScore)
            allPostScores.push(postScore)
          }
        })
      })

      // Calculate aggregate LGI for this Materi
      if (allPreScores.length > 0) {
        const avgPre = allPreScores.reduce((a, b) => a + b, 0) / allPreScores.length
        const avgPost = allPostScores.reduce((a, b) => a + b, 0) / allPostScores.length
        const denominator = 100 - avgPre
        const lgiVal = denominator !== 0 ? (avgPost - avgPre) / denominator : 0
        const mName = materis.find((m) => m.id === mId)?.title || mId
        materiLgis.push({
          materiName: mName,
          lgiValue: Math.round(lgiVal * 100) / 100,
        })
      }
    })

    if (materiLgis.length > 0) {
      const avgProgramLgi = materiLgis.reduce((a, b) => a + b.lgiValue, 0) / materiLgis.length
      lgiByProgram.push({
        programTypeName: pTypeName,
        lgiValue: Math.round(avgProgramLgi * 100) / 100,
        materiLgis,
      })
    }
  }

  const allInClassIds = instructorClasses
    .map((c) => c.knowledgeTestClassId)
    .filter(Boolean) as string[]
  const combinedFeedback: Record<string, { total: number; count: number }> = {}
  for (const icId of allInClassIds) {
    const feedback = calculateFeedbackAverage(icId)
    for (const item of feedback) {
      if (!combinedFeedback[item.sectionName])
        combinedFeedback[item.sectionName] = { total: 0, count: 0 }
      const scoreData = combinedFeedback[item.sectionName]
      if (scoreData) {
        scoreData.total += item.averageScore
        scoreData.count += 1
      }
    }
  }

  const finalFeedback: { sectionName: string; averageScore: number }[] = Object.entries(
    combinedFeedback,
  ).map(([sectionName, data]) => ({
    sectionName,
    averageScore: Math.round((data.total / data.count) * 10) / 10,
  }))
  const defaultFeedbackSections = [
    'Communication',
    'Time Management',
    'Data Analyst',
    'Presentation',
    'Food Safety/CAPA',
    'Kemampuan mentoring',
  ]
  const finalFeedbackWithSixSections = defaultFeedbackSections.map((sectionName) => {
    const existing = finalFeedback.find((f) => f.sectionName === sectionName)
    return existing || { sectionName, averageScore: 0 }
  })

  const completionRate = calculateCompletionRate(
    auth.userId,
    selectedMonth.value,
    selectedYear.value,
  )
  const passRate = calculatePassRate(auth.userId, selectedMonth.value, selectedYear.value)

  if (lgiByProgram.length > 0 || completionRate > 0 || passRate > 0) {
    const newRaport: any = {
      id: 'ir' + Date.now(),
      instructorId: auth.userId,
      month: selectedMonth.value,
      year: selectedYear.value,
      status: 'draft' as const,
      publishedAt: undefined,
      publishedBy: undefined,
      qualitativeAnalysis: '',
      quantitativeData: {
        lgi: lgiByProgram,
        completionRate: completionRate,
        passRate: passRate,
        feedbackAverage: finalFeedbackWithSixSections,
      },
      createdAt: new Date().toISOString(),
      createdBy: auth.userId,
    }
    instructorRaports.push(newRaport)
    alert('Raport generated successfully!')
  } else {
    alert('No relevant data found for this period to generate a raport.')
  }
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Instructor Raport Management</h2>

    <div class="bg-white rounded shadow p-6 mb-6">
      <h3 class="text-lg font-medium mb-4">Filter by Period</h3>
      <div class="flex gap-4">
        <select v-model.number="selectedMonth" class="border rounded px-3 py-2">
          <option v-for="m in 12" :key="m" :value="m">
            {{ new Date(2026, m - 1).toLocaleString('default', { month: 'long' }) }}
          </option>
        </select>
        <select v-model.number="selectedYear" class="border rounded px-3 py-2">
          <option v-for="y in [2026, 2025, 2024]" :key="y" :value="y">{{ y }}</option>
        </select>
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
