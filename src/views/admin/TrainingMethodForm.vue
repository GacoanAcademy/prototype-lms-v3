<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { trainingMethods, trainingMethodTypes, formAssessments, knowledgeTestClasses, tests } from '@/data/mockData'
import type { MethodCategory, TrainingMethodComponent } from '@/types'

const route = useRoute()
const router = useRouter()
const isEdit = !!(route.params.id && route.params.id !== 'new')
const existing = isEdit ? trainingMethods.find((m) => m.id === route.params.id) : null

const title = ref(existing?.title ?? '')
const description = ref(existing?.description ?? '')
const typeId = ref(existing?.typeId ?? trainingMethodTypes[0]?.id ?? '')
const categories = ref<MethodCategory[]>(existing?.categories ?? [])
const knowledgeTestClassId = ref(existing?.knowledgeTestClassId ?? '')
const knowledgeTestWeight = ref<number>(existing?.knowledgeTestWeight ?? 100)

const isKnowledgeTestType = computed(() => typeId.value === 'knowledgeTest')

const typeOptions = computed(() => [
  { id: 'knowledgeTest', name: 'Knowledge Test' },
  ...trainingMethodTypes,
])

const componentMethods = computed(() => trainingMethods.filter((m) => m.id !== route.params.id))

function getTestQuestions(ktId: string) {
  const kt = knowledgeTestClasses.find(k => k.id === ktId)
  if (!kt) return null
  const test = tests.find(t => t.id === kt.testId)
  return test ? { test, knowledgeTestClass: kt } : null
}

function addCategory() {
  categories.value.push({ id: 'mc' + Date.now(), name: '', weight: 0, formAssessmentId: '' })
}
function removeCategory(idx: number) {
  categories.value.splice(idx, 1)
}

function addComponent(cat: MethodCategory) {
  if (!cat.components) cat.components = []
  cat.components.push({
    id: 'tc' + Date.now(),
    order: cat.components.length + 1,
    weight: 0,
    passingScore: 70,
    contentId: '',
  })
}
function removeComponent(cat: MethodCategory, idx: number) {
  cat.components?.splice(idx, 1)
  if (cat.components?.length === 0) cat.components = undefined
}
function moveComponent(cat: MethodCategory, from: number, to: number) {
  if (!cat.components) return
  if (to < 0 || to >= cat.components.length) return
  const a = cat.components[from]
  const b = cat.components[to]
  if (!a || !b) return
  cat.components[from] = b
  cat.components[to] = a
  cat.components.forEach((c, i) => (c.order = i + 1))
}

function save() {
  alert('Training method saved (mock)')
  router.push('/admin/training-method')
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">
      {{ isEdit ? 'Edit Training Method' : 'New Training Method' }}
    </h2>
    <div class="bg-white p-6 rounded shadow space-y-4 max-w-4xl">
      <div>
        <label class="block text-sm font-medium mb-1">Title</label
        ><input v-model="title" class="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Type</label>
        <select v-model="typeId" class="w-full border rounded px-3 py-2">
          <option v-for="t in typeOptions" :key="t.id" :value="t.id">{{ t.name }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Description</label
        ><textarea v-model="description" class="w-full border rounded px-3 py-2" />
      </div>

      <div v-if="isKnowledgeTestType">
        <div class="border rounded p-4 bg-blue-50 border-blue-200">
          <h3 class="font-semibold text-blue-800 mb-3">Knowledge Test Selection</h3>
          <div class="grid grid-cols-3 gap-3 mb-3">
            <div class="col-span-2">
              <label class="text-xs font-medium text-gray-600">Select Knowledge Test Class</label>
              <select v-model="knowledgeTestClassId" class="w-full border rounded px-3 py-2 text-sm">
                <option value="">-- Select Knowledge Test --</option>
                <option v-for="kt in knowledgeTestClasses" :key="kt.id" :value="kt.id">
                  {{ kt.name }} (Pass: {{ kt.passingScore }}%, Max: {{ kt.maxParticipants }})
                </option>
              </select>
            </div>
            <div>
              <label class="text-xs font-medium text-gray-600">Weight (%)</label>
              <input
                v-model.number="knowledgeTestWeight"
                type="number"
                min="0"
                max="100"
                class="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>
          <p class="text-xs text-gray-500 mb-2">
            The Knowledge Test score contributes <span class="font-semibold">{{ knowledgeTestWeight }}%</span> to this training method's total score.
          </p>

          <div
            v-if="knowledgeTestClassId && getTestQuestions(knowledgeTestClassId)"
            class="p-3 bg-white border border-blue-200 rounded"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-semibold text-blue-700">
                {{ getTestQuestions(knowledgeTestClassId)?.test.title }}
              </span>
              <span class="text-xs text-blue-500">
                {{ getTestQuestions(knowledgeTestClassId)?.test.questions.length }} questions
                &middot; {{ getTestQuestions(knowledgeTestClassId)?.test.timeLimit }} min
                &middot; {{ getTestQuestions(knowledgeTestClassId)?.test.randomize ? 'Randomized' : 'Fixed order' }}
              </span>
            </div>
            <p class="text-xs text-gray-500 mb-2">
              {{ getTestQuestions(knowledgeTestClassId)?.test.description }}
            </p>
            <div class="border-t pt-2 mt-2">
              <h4 class="text-xs font-semibold uppercase text-gray-500 mb-2">Questions</h4>
              <ol class="list-decimal list-inside space-y-2">
                <li
                  v-for="q in getTestQuestions(knowledgeTestClassId)?.test.questions"
                  :key="q.id"
                  class="text-xs text-gray-700"
                >
                  <div class="flex items-start gap-2">
                    <span class="font-medium flex-1">{{ q.text }}</span>
                    <span
                      class="text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap"
                      :class="{
                        'bg-green-100 text-green-700': q.type === 'mcq',
                        'bg-purple-100 text-purple-700': q.type === 'essay',
                        'bg-yellow-100 text-yellow-700': q.type === 'fillBlank',
                        'bg-orange-100 text-orange-700': q.type === 'dragDrop',
                      }"
                    >
                      {{ q.type }}
                    </span>
                    <span class="text-gray-400 whitespace-nowrap">{{ q.points }}pts</span>
                  </div>
                  <div v-if="q.options?.length" class="ml-4 mt-1 space-y-0.5">
                    <div
                      v-for="opt in q.options"
                      :key="opt.id"
                      class="text-[11px]"
                      :class="opt.isCorrect ? 'text-green-600 font-medium' : 'text-gray-400'"
                    >
                      {{ opt.isCorrect ? '\u2713' : '\u25CB' }} {{ opt.text }}
                    </div>
                  </div>
                  <div v-if="q.correctAnswer" class="ml-4 mt-0.5 text-[11px] text-green-600">
                    Answer: {{ q.correctAnswer }}
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <div>
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-semibold">Training Methods</h3>
            <button
              @click="addCategory"
              class="text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
            >
              + Training Method
            </button>
          </div>
          <div
            v-for="(cat, ci) in categories"
            :key="cat.id"
            class="border rounded p-4 mb-4 bg-gray-50"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium">Training Method {{ ci + 1 }}</span
              ><button @click="removeCategory(ci)" class="text-red-500 text-sm">Remove</button>
            </div>
            <div class="grid grid-cols-3 gap-3 mb-2">
              <div>
                <label class="text-xs">Name</label
                ><input v-model="cat.name" class="w-full border rounded px-2 py-1 text-sm" />
              </div>
              <div>
                <label class="text-xs">Weight (%)</label
                ><input
                  v-model.number="cat.weight"
                  type="number"
                  class="w-full border rounded px-2 py-1 text-sm"
                />
              </div>
              <div v-if="cat.components?.length">
                <label class="text-xs">Training Method Type</label>
                <select v-model="cat.typeId" class="w-full border rounded px-2 py-1 text-sm">
                  <option value="">-- Tag --</option>
                  <option v-for="t in trainingMethodTypes" :key="t.id" :value="t.id">
                    {{ t.name }}
                  </option>
                </select>
              </div>
              <div v-else>
                <label class="text-xs">Form Assessment</label>
                <select
                  v-model="cat.formAssessmentId"
                  class="w-full border rounded px-2 py-1 text-sm"
                  :disabled="!!cat.knowledgeTestClassId"
                  :class="{ 'bg-gray-100 text-gray-400': !!cat.knowledgeTestClassId }"
                >
                  <option value="">-- Select --</option>
                  <option v-for="f in formAssessments" :key="f.id" :value="f.id">
                    {{ f.title }}
                  </option>
                </select>
                <p v-if="cat.knowledgeTestClassId" class="text-[10px] text-orange-500 mt-0.5">
                  Disabled: Knowledge Test is selected
                </p>
              </div>
            </div>

            <div class="mb-2">
              <label class="text-xs font-medium text-gray-600">Knowledge Test Class (Optional)</label>
              <select v-model="cat.knowledgeTestClassId" class="w-full border rounded px-2 py-1 text-sm">
                <option value="">-- None --</option>
                <option v-for="kt in knowledgeTestClasses" :key="kt.id" :value="kt.id">
                  {{ kt.name }} (Pass: {{ kt.passingScore }}%)
                </option>
              </select>
            </div>

            <div
              v-if="cat.knowledgeTestClassId && getTestQuestions(cat.knowledgeTestClassId)"
              class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-semibold text-blue-700">
                  Test: {{ getTestQuestions(cat.knowledgeTestClassId)?.test.title }}
                </span>
                <span class="text-xs text-blue-500">
                  {{ getTestQuestions(cat.knowledgeTestClassId)?.test.questions.length }} questions
                  &middot; {{ getTestQuestions(cat.knowledgeTestClassId)?.test.timeLimit }} min
                </span>
              </div>
              <ol class="list-decimal list-inside space-y-1">
                <li
                  v-for="q in getTestQuestions(cat.knowledgeTestClassId)?.test.questions"
                  :key="q.id"
                  class="text-xs text-gray-700"
                >
                  <span class="font-medium">{{ q.text }}</span>
                  <span
                    class="ml-1 text-[10px] px-1 py-0.5 rounded"
                    :class="{
                      'bg-green-100 text-green-700': q.type === 'mcq',
                      'bg-purple-100 text-purple-700': q.type === 'essay',
                      'bg-yellow-100 text-yellow-700': q.type === 'fillBlank',
                      'bg-orange-100 text-orange-700': q.type === 'dragDrop',
                    }"
                  >
                    {{ q.type }}
                  </span>
                  <span class="text-gray-400 ml-1">({{ q.points }}pts)</span>
                </li>
              </ol>
            </div>

            <div v-if="cat.components?.length" class="mt-3 border-t pt-3">
              <div class="flex items-center justify-between mb-2">
                <h4 class="text-xs font-semibold uppercase text-gray-500">Components</h4>
                <button
                  @click="addComponent(cat)"
                  class="text-xs bg-gray-200 px-2 py-0.5 rounded hover:bg-gray-300"
                >
                  + Component
                </button>
              </div>
              <div
                v-for="(comp, cj) in cat.components"
                :key="comp.id"
                class="border rounded p-3 mb-2 bg-white"
              >
                <div class="flex items-center justify-between mb-2">
                  <div class="flex gap-1">
                    <button
                      @click="moveComponent(cat, cj, cj - 1)"
                      :disabled="cj === 0"
                      class="text-xs px-1"
                      :class="cj === 0 ? 'text-gray-300' : 'hover:bg-gray-200'"
                    >
                      ▲
                    </button>
                    <button
                      @click="moveComponent(cat, cj, cj + 1)"
                      :disabled="cj === (cat.components?.length ?? 0) - 1"
                      class="text-xs px-1"
                      :class="
                        cj === (cat.components?.length ?? 0) - 1
                          ? 'text-gray-300'
                          : 'hover:bg-gray-200'
                      "
                    >
                      ▼
                    </button>
                  </div>
                  <span class="text-xs font-medium">Component {{ cj + 1 }}</span>
                  <button @click="removeComponent(cat, cj)" class="text-red-500 text-xs">
                    Remove
                  </button>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <div class="col-span-1">
                    <label class="text-xs">Form Assessment</label>
                    <select
                      v-model="comp.contentId"
                      class="w-full border rounded px-2 py-1 text-sm"
                      :disabled="!!comp.knowledgeTestClassId"
                      :class="{ 'bg-gray-100 text-gray-400': !!comp.knowledgeTestClassId }"
                    >
                      <option value="">-- Select --</option>
                      <option v-for="cm in componentMethods" :key="cm.id" :value="cm.id">
                        {{ cm.title }}
                      </option>
                    </select>
                    <p v-if="comp.knowledgeTestClassId" class="text-[10px] text-orange-500 mt-0.5">
                      Disabled: Knowledge Test is selected
                    </p>
                  </div>
                  <div>
                    <label class="text-xs">Weight (%)</label
                    ><input
                      v-model.number="comp.weight"
                      type="number"
                      class="w-full border rounded px-2 py-1 text-sm"
                    />
                  </div>
                  <div>
                    <label class="text-xs">Passing Score</label
                    ><input
                      v-model.number="comp.passingScore"
                      type="number"
                      class="w-full border rounded px-2 py-1 text-sm"
                    />
                  </div>
                </div>
                <div class="mt-2">
                  <label class="text-xs font-medium text-gray-600">Knowledge Test Class (Optional)</label>
                  <select v-model="comp.knowledgeTestClassId" class="w-full border rounded px-2 py-1 text-sm">
                    <option value="">-- None --</option>
                    <option v-for="kt in knowledgeTestClasses" :key="kt.id" :value="kt.id">
                      {{ kt.name }} (Pass: {{ kt.passingScore }}%)
                    </option>
                  </select>
                </div>
                <div
                  v-if="comp.knowledgeTestClassId && getTestQuestions(comp.knowledgeTestClassId)"
                  class="mt-2 p-2 bg-blue-50 border border-blue-200 rounded"
                >
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs font-semibold text-blue-700">
                      Test: {{ getTestQuestions(comp.knowledgeTestClassId)?.test.title }}
                    </span>
                    <span class="text-[10px] text-blue-500">
                      {{ getTestQuestions(comp.knowledgeTestClassId)?.test.questions.length }} questions
                      &middot; {{ getTestQuestions(comp.knowledgeTestClassId)?.test.timeLimit }} min
                    </span>
                  </div>
                  <ol class="list-decimal list-inside space-y-1">
                    <li
                      v-for="q in getTestQuestions(comp.knowledgeTestClassId)?.test.questions"
                      :key="q.id"
                      class="text-xs text-gray-700"
                    >
                      <span class="font-medium">{{ q.text }}</span>
                      <span
                        class="ml-1 text-[10px] px-1 py-0.5 rounded"
                        :class="{
                          'bg-green-100 text-green-700': q.type === 'mcq',
                          'bg-purple-100 text-purple-700': q.type === 'essay',
                          'bg-yellow-100 text-yellow-700': q.type === 'fillBlank',
                          'bg-orange-100 text-orange-700': q.type === 'dragDrop',
                        }"
                      >
                        {{ q.type }}
                      </span>
                      <span class="text-gray-400 ml-1">({{ q.points }}pts)</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
            <div v-else class="mt-2">
              <button
                @click="addComponent(cat)"
                class="text-xs bg-gray-200 px-2 py-0.5 rounded hover:bg-gray-300"
              >
                + Component
              </button>
            </div>
          </div>
        </div>
      </div>

      <button @click="save" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        Save
      </button>
    </div>
  </div>
</template>
