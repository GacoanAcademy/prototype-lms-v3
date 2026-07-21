<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { classes, curricula, knowledgeTestClasses, testAttempts, assessments, trainingMethods } from '@/data/mockData'

const auth = useAuthStore()
const myClasses = computed(() => classes.filter(c => c.participants.includes(auth.userId)))

function getMethodTitle(contentId: string, type?: string): string {
  if (type === 'knowledgeTest') {
    const kt = knowledgeTestClasses.find(k => k.id === contentId)
    if (kt) return kt.name
  }
  const m = trainingMethods.find(tm => tm.id === contentId)
  return m ? m.title : contentId
}

function getTrainingMethodScore(item: { id: string; contentId: string }, cls: typeof classes[number], pid: string): number {
  const method = trainingMethods.find(m => m.id === item.contentId)
  if (!method) return 0

  // Handle knowledge test as a standalone training method
  if (method.typeId === 'knowledgeTest') {
    const kt = knowledgeTestClasses.find(k => k.id === method.knowledgeTestClassId)
    if (!kt) return 0
    const atts = testAttempts.filter(a => a.participantId === pid && a.classId === cls.id && a.testId === kt.testId)
    // Apply knowledge test weight to the score
    return Math.round(atts.length > 0 ? atts.reduce((s, a) => s + a.normalizedScore, 0) / atts.length * (method.knowledgeTestWeight || 100) / 100 : 0)
  }

  const cats = method.categories ?? []
  const totalWeight = cats.reduce((s: number, c: any) => s + c.weight, 0) || 1
  let weightedSum = 0
  cats.forEach((cat: any) => {
    weightedSum += computeCategoryScore(item, cls, pid, cat) * (cat.weight / totalWeight)
  })
  return Math.round(weightedSum)
}

function computeCategoryScore(item: { id: string; contentId: string }, cls: typeof classes[number], pid: string, cat: any): number {
  const components = cat.components ?? []
  if (components.length === 0) {
    const ass = assessments.filter(a => a.participantId === pid && a.classId === cls.id && a.trainingMethodId === item.id && a.categoryId === cat.id)
    if (ass.length === 0) return 0
    const clsObj = classes.find(c => c.id === cls.id)
    const assign = clsObj?.assessmentAssessorAssignments?.find(a => a.trainingMethodId === item.id && a.participantId === pid)
    const weights = assign?.raterWeights
    if (!weights || Object.keys(weights).length === 0) {
      return ass.reduce((s, a) => s + a.normalizedScore, 0) / ass.length
    }
    const totalWeight = Object.values(weights).reduce((s: number, w) => s + w, 0) || 100
    let weightedSum = 0
    ass.forEach(a => {
      const w = weights[a.raterId] ?? 0
      weightedSum += a.normalizedScore * (w / totalWeight)
    })
    return weightedSum
  }
  const compTotalWeight = components.reduce((s: number, c: any) => s + c.weight, 0) || 1
  let compWeightedSum = 0
  components.forEach((comp: any) => {
    const compMethod = trainingMethods.find(m => m.id === comp.contentId)
    if (!compMethod) return
    const subCats = compMethod.categories ?? []
    const subTotalWeight = subCats.reduce((s: number, sc: any) => s + sc.weight, 0) || 1
    let subWeightedSum = 0
    subCats.forEach((sc: any) => {
      subWeightedSum += computeCategoryScore(item, cls, pid, sc) * (sc.weight / subTotalWeight)
    })
    compWeightedSum += Math.round(subWeightedSum) * (comp.weight / compTotalWeight)
  })
  return compWeightedSum
}

const transcripts = computed(() => myClasses.value.map(cls => {
  const curriculum = curricula.find(c => c.id === cls.curriculumId)
  const entries = curriculum?.items.map(item => {
    let score = 0
    if (item.trainingMethodType === 'inClass' || item.trainingMethodType === 'knowledgeTest') {
      const atts = testAttempts.filter(a => a.participantId === auth.userId && a.classId === cls.id)
      score = atts.length > 0 ? Math.round(atts.reduce((s, a) => s + a.normalizedScore, 0) / atts.length) : 0
    } else {
      const method = trainingMethods.find(m => m.id === item.contentId)
      if (method?.typeId === 'knowledgeTest') {
        const kt = knowledgeTestClasses.find(k => k.id === method.knowledgeTestClassId)
        if (!kt) {
          score = 0
        } else {
          const atts = testAttempts.filter(a => a.participantId === auth.userId && a.classId === cls.id && a.testId === kt.testId)
          score = atts.length > 0 ? Math.round(atts.reduce((s, a) => s + a.normalizedScore, 0) / atts.length) : 0
        }
      } else {
        const scoreFromTrainingMethod = getTrainingMethodScore(item, cls, auth.userId)
        score = scoreFromTrainingMethod
      }
    }
    const passStatus = score >= item.passingScore ? 'pass' : 'fail'
    const title = getMethodTitle(item.contentId, item.trainingMethodType)
    return { methodTitle: title, methodType: item.trainingMethodType, weight: item.weight, score, weightedScore: Math.round((item.weight / 100) * score), passStatus }
  }) ?? []
  const total = entries.reduce((s, e) => s + e.weightedScore, 0)
  return { className: cls.name, entries, totalScore: total, pass: total >= (curriculum?.passingThreshold ?? 75) }
}))
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Transcript (KHS)</h2>
    <div v-for="t in transcripts" :key="t.className" class="bg-white rounded shadow p-4 mb-6">
      <h3 class="font-semibold mb-3">{{ t.className }}</h3>
      <table class="w-full text-left">
        <thead class="bg-gray-50 text-gray-600 text-sm"><tr><th class="p-2">Method</th><th class="p-2">Weight</th><th class="p-2">Score</th><th class="p-2">Weighted</th><th class="p-2">Status</th></tr></thead>
        <tbody>
          <tr v-for="e in t.entries" :key="e.methodTitle" class="border-t text-sm">
            <td class="p-2 capitalize">{{ e.methodTitle }}</td><td class="p-2">{{ e.weight }}%</td><td class="p-2">{{ e.score }}</td><td class="p-2">{{ e.weightedScore }}</td>
            <td class="p-2"><span class="text-xs px-2 py-0.5 rounded" :class="e.passStatus === 'pass' ? 'bg-green-100' : 'bg-red-100'">{{ e.passStatus }}</span></td>
          </tr>
        </tbody>
        <tfoot class="border-t font-semibold">
          <tr><td colspan="3" class="p-2">Total</td><td class="p-2">{{ t.totalScore }}</td><td class="p-2"><span class="text-xs px-2 py-0.5 rounded" :class="t.pass ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">{{ t.pass ? 'Pass' : 'Fail' }}</span></td></tr>
        </tfoot>
      </table>
    </div>
    <div v-if="transcripts.length === 0" class="text-center py-12 text-gray-400">No transcript data</div>
  </div>
</template>
