<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formAssessments, trainingMethodTypes, sectionTypes } from '@/data/mockData'
import type { FormSection, FormSectionItem, FormItemType } from '@/types'

const route = useRoute()
const router = useRouter()

const isEdit = !!(route.params.id && route.params.id !== 'new')
const existing = isEdit ? formAssessments.find((f) => f.id === route.params.id) : null

// ── Top-level form fields ──
const title = ref(existing?.title ?? '')
const description = ref(existing?.description ?? '')
const typeId = ref(existing?.typeId ?? '')

// ── Section types ──
const sectionTypeOptions = computed(() => sectionTypes.map((s) => ({ value: s.id, label: s.name })))

// ── Item type config ──
const itemTypeOptions: { value: FormItemType; label: string; icon: string }[] = [
  { value: 'multiple_choice', label: 'Multiple Choice', icon: '☑' },
  { value: 'true_false', label: 'True / False', icon: '◑' },
  { value: 'scale', label: 'Scale', icon: '⊟' },
  { value: 'free_text', label: 'Free Text', icon: '✎' },
]
function itemTypeIcon(t: FormItemType) {
  return itemTypeOptions.find((o) => o.value === t)?.icon ?? '?'
}

// ── Sections state ──
function createSection(index: number): FormSection {
  return {
    id: crypto.randomUUID(),
    title: `Section ${index}`,
    sectionTypeId: sectionTypes[0]?.id ?? '',
    weight: 0,
    items: [],
  }
}

function createItem(): FormSectionItem {
  return { id: crypto.randomUUID(), label: '', itemType: 'free_text', weight: 0, point: 0 }
}

const initialSections: FormSection[] =
  existing?.sections && existing.sections.length > 0 ? existing.sections : [createSection(1)]

const sections = ref<FormSection[]>(initialSections)
const activeIndex = ref(0)
const slideDirection = ref<'left' | 'right'>('right')
const isAnimating = ref(false)

const totalWeight = computed(() => sections.value.reduce((sum, s) => sum + (s.weight || 0), 0))
const activeSection = computed(() => sections.value[activeIndex.value])

// ── Navigation ──
function goTo(index: number) {
  if (index === activeIndex.value || isAnimating.value) return
  slideDirection.value = index > activeIndex.value ? 'right' : 'left'
  isAnimating.value = true
  activeIndex.value = index
  setTimeout(() => {
    isAnimating.value = false
  }, 320)
}
function goPrev() {
  if (activeIndex.value > 0) goTo(activeIndex.value - 1)
}
function goNext() {
  if (activeIndex.value < sections.value.length - 1) goTo(activeIndex.value + 1)
}

function addSection() {
  sections.value.push(createSection(sections.value.length + 1))
  goTo(sections.value.length - 1)
}
function removeSection(index: number) {
  if (sections.value.length <= 1) return
  sections.value.splice(index, 1)
  if (activeIndex.value >= sections.value.length) activeIndex.value = sections.value.length - 1
}

function addItem(section: FormSection) {
  section.items.push(createItem())
}
function removeItem(section: FormSection, idx: number) {
  section.items.splice(idx, 1)
}

// ── Item type change: reset type-specific fields ──
function onItemTypeChange(item: FormSectionItem) {
  item.options = undefined
  item.correctOption = undefined
  item.correctTrueFalse = undefined
  item.scaleMin = undefined
  item.scaleMax = undefined
  item.scaleStep = undefined
  if (item.itemType === 'multiple_choice') {
    item.options = ['', '']
    item.correctOption = 0
  } else if (item.itemType === 'true_false') {
    item.correctTrueFalse = true
  } else if (item.itemType === 'scale') {
    item.scaleMin = 1
    item.scaleMax = 5
    item.scaleStep = 1
  }
}

function addOption(item: FormSectionItem) {
  if (!item.options) item.options = []
  item.options.push('')
}
function removeOption(item: FormSectionItem, idx: number) {
  if (!item.options) return
  item.options.splice(idx, 1)
  if ((item.correctOption ?? 0) >= item.options.length)
    item.correctOption = Math.max(0, item.options.length - 1)
}

function save() {
  if (!title.value.trim()) {
    alert('Form title is required')
    return
  }
  alert('Form saved (mock)')
  router.push('/admin/form-builder')
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">{{ isEdit ? 'Edit Form' : 'New Form' }}</h2>
      <div class="flex gap-2">
        <button
          @click="router.push('/admin/form-builder')"
          class="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          @click="save"
          class="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Form
        </button>
      </div>
    </div>

    <!-- Form metadata -->
    <div class="bg-white rounded-xl shadow p-6 mb-6 space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Form Title</label>
        <input
          v-model="title"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. Multirater - Kompetensi Karyawan"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          v-model="description"
          rows="2"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Form description..."
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Training Method Type</label>
        <select
          v-model="typeId"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select Type --</option>
          <option v-for="t in trainingMethodTypes" :key="t.id" :value="t.id">{{ t.name }}</option>
        </select>
      </div>
    </div>

    <!-- Section builder -->
    <div class="bg-white rounded-xl shadow overflow-hidden">
      <!-- Section tabs -->
      <div
        class="border-b border-gray-200 bg-gray-50 px-4 pt-3 pb-0 flex items-end gap-2 overflow-x-auto"
      >
        <button
          v-for="(section, idx) in sections"
          :key="section.id"
          @click="goTo(idx)"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-t-lg border border-b-0 transition-colors whitespace-nowrap',
            activeIndex === idx
              ? 'bg-white border-gray-200 text-blue-700 -mb-px z-10'
              : 'bg-gray-100 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-200',
          ]"
        >
          {{ section.title || `Section ${idx + 1}` }}
        </button>
        <button
          @click="addSection"
          class="px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-t-lg border border-transparent whitespace-nowrap flex items-center gap-1 self-end"
        >
          <span class="text-lg leading-none">+</span><span>Add Section</span>
        </button>
      </div>

      <!-- Section viewport with slide transition -->
      <div class="relative overflow-hidden">
        <button
          @click="goPrev"
          :disabled="activeIndex === 0"
          :class="[
            'absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full shadow bg-white border border-gray-200 transition',
            activeIndex === 0
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:bg-gray-100 cursor-pointer',
          ]"
        >
          ←
        </button>
        <button
          @click="goNext"
          :disabled="activeIndex === sections.length - 1"
          :class="[
            'absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full shadow bg-white border border-gray-200 transition',
            activeIndex === sections.length - 1
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:bg-gray-100 cursor-pointer',
          ]"
        >
          →
        </button>

        <div class="overflow-hidden">
          <Transition
            :name="slideDirection === 'right' ? 'slide-left' : 'slide-right'"
            mode="out-in"
          >
            <div v-if="activeSection" :key="activeSection.id" class="px-10 py-6">
              <!-- Section header row -->
              <div class="flex items-center justify-between mb-5">
                <h3 class="text-base font-semibold text-gray-700">
                  Section {{ activeIndex + 1 }} of {{ sections.length }}
                </h3>
                <button
                  v-if="sections.length > 1"
                  @click="removeSection(activeIndex)"
                  class="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1 rounded-lg transition"
                >
                  Remove Section
                </button>
              </div>

              <!-- Section fields -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Section Name</label>
                  <input
                    v-model="activeSection.title"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Reading Comprehension"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Section Weight</label>
                  <input
                    v-model.number="activeSection.weight"
                    type="number"
                    min="0"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 40"
                  />
                </div>
              </div>

              <!-- Items list -->
              <div>
                <div class="flex items-center justify-between mb-3">
                  <h4 class="text-sm font-semibold text-gray-600">Items</h4>
                  <button
                    @click="addItem(activeSection)"
                    class="text-xs bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
                  >
                    + Add Item
                  </button>
                </div>

                <div
                  v-if="activeSection.items.length === 0"
                  class="text-sm text-gray-400 italic py-6 text-center border border-dashed border-gray-200 rounded-lg"
                >
                  No items yet. Click "Add Item" to get started.
                </div>

                <!-- ── Item card ── -->
                <div
                  v-for="(item, itemIdx) in activeSection.items"
                  :key="item.id"
                  class="border border-gray-200 rounded-xl p-4 mb-3 bg-gray-50 hover:bg-white transition"
                >
                  <!-- Item header: number + type picker + remove -->
                  <div class="flex items-center justify-between mb-3 gap-2">
                    <span
                      class="text-xs font-semibold text-gray-400 uppercase tracking-wide shrink-0"
                      >Item {{ itemIdx + 1 }}</span
                    >

                    <!-- Item type segmented picker -->
                    <div class="flex items-center gap-1 flex-wrap">
                      <button
                        v-for="opt in itemTypeOptions"
                        :key="opt.value"
                        @click="
                          () => {
                            item.itemType = opt.value
                            onItemTypeChange(item)
                          }
                        "
                        :class="[
                          'text-xs px-2.5 py-1 rounded-full border transition font-medium flex items-center gap-1',
                          item.itemType === opt.value
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600',
                        ]"
                      >
                        <span>{{ opt.icon }}</span>
                        <span>{{ opt.label }}</span>
                      </button>
                    </div>

                    <button
                      @click="removeItem(activeSection, itemIdx)"
                      class="text-xs text-red-400 hover:text-red-600 transition shrink-0"
                    >
                      Remove
                    </button>
                  </div>

                  <!-- Question label + weight/point -->
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div class="md:col-span-3">
                      <label class="block text-xs font-medium text-gray-600 mb-1"
                        >Question / Label</label
                      >
                      <input
                        v-model="item.label"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter question or label..."
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-600 mb-1">Weight</label>
                      <input
                        v-model.number="item.weight"
                        type="number"
                        min="0"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-600 mb-1">Point</label>
                      <input
                        v-model.number="item.point"
                        type="number"
                        min="0"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                    <div class="flex items-end">
                      <div
                        class="w-full bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 text-xs text-blue-700 font-medium"
                      >
                        Weighted:
                        {{
                          item.weight && item.point
                            ? ((item.weight * item.point) / 100).toFixed(2)
                            : '—'
                        }}
                      </div>
                    </div>
                  </div>

                  <!-- ── Type-specific config ── -->

                  <!-- Multiple Choice -->
                  <div
                    v-if="item.itemType === 'multiple_choice'"
                    class="border border-gray-200 rounded-lg p-3 bg-white space-y-2"
                  >
                    <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Answer Options
                    </p>
                    <div
                      v-for="(opt, oi) in item.options ?? []"
                      :key="oi"
                      class="flex items-center gap-2"
                    >
                      <!-- correct radio -->
                      <button
                        @click="item.correctOption = oi"
                        :class="[
                          'w-4 h-4 rounded-full border-2 shrink-0 transition',
                          item.correctOption === oi
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300 hover:border-green-400',
                        ]"
                        title="Mark as correct"
                      />
                      <input
                        :value="opt"
                        @input="
                          (e) => {
                            if (item.options)
                              item.options[oi] = (e.target as HTMLInputElement).value
                          }
                        "
                        class="flex-1 border border-gray-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        :placeholder="`Option ${oi + 1}`"
                      />
                      <button
                        @click="removeOption(item, oi)"
                        class="text-gray-300 hover:text-red-400 transition text-base leading-none shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                    <button
                      @click="addOption(item)"
                      class="text-xs text-blue-600 hover:text-blue-800 border border-dashed border-blue-200 hover:border-blue-400 px-3 py-1.5 rounded-lg w-full transition"
                    >
                      + Add Option
                    </button>
                    <p class="text-xs text-gray-400">
                      Click the circle to mark the correct answer.
                    </p>
                  </div>

                  <!-- True / False -->
                  <div
                    v-else-if="item.itemType === 'true_false'"
                    class="border border-gray-200 rounded-lg p-3 bg-white"
                  >
                    <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Correct Answer
                    </p>
                    <div class="flex gap-3">
                      <button
                        @click="item.correctTrueFalse = true"
                        :class="[
                          'flex-1 py-2 rounded-lg border-2 text-sm font-medium transition',
                          item.correctTrueFalse === true
                            ? 'bg-green-50 border-green-500 text-green-700'
                            : 'border-gray-200 text-gray-500 hover:border-green-300',
                        ]"
                      >
                        ✓ True
                      </button>
                      <button
                        @click="item.correctTrueFalse = false"
                        :class="[
                          'flex-1 py-2 rounded-lg border-2 text-sm font-medium transition',
                          item.correctTrueFalse === false
                            ? 'bg-red-50 border-red-400 text-red-700'
                            : 'border-gray-200 text-gray-500 hover:border-red-300',
                        ]"
                      >
                        ✕ False
                      </button>
                    </div>
                  </div>

                  <!-- Scale -->
                  <div
                    v-else-if="item.itemType === 'scale'"
                    class="border border-gray-200 rounded-lg p-3 bg-white"
                  >
                    <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Scale Config
                    </p>
                    <div class="grid grid-cols-3 gap-3">
                      <div>
                        <label class="block text-xs text-gray-500 mb-1">Min</label>
                        <input
                          v-model.number="item.scaleMin"
                          type="number"
                          class="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="1"
                        />
                      </div>
                      <div>
                        <label class="block text-xs text-gray-500 mb-1">Max</label>
                        <input
                          v-model.number="item.scaleMax"
                          type="number"
                          class="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="5"
                        />
                      </div>
                    </div>
                    <!-- Preview -->
                    <div class="mt-3 flex items-center gap-2 flex-wrap">
                      <span class="text-xs text-gray-400">Preview:</span>
                      <template
                        v-for="n in Math.min(
                          10,
                          Math.floor(
                            ((item.scaleMax ?? 5) - (item.scaleMin ?? 1)) / (item.scaleStep ?? 1),
                          ) + 1,
                        )"
                        :key="n"
                      >
                        <span
                          class="w-8 h-8 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center text-xs text-gray-600"
                        >
                          {{ (item.scaleMin ?? 1) + (n - 1) * (item.scaleStep ?? 1) }}
                        </span>
                      </template>
                      <span
                        v-if="
                          Math.floor(
                            ((item.scaleMax ?? 5) - (item.scaleMin ?? 1)) / (item.scaleStep ?? 1),
                          ) +
                            1 >
                          10
                        "
                        class="text-xs text-gray-400"
                        >…</span
                      >
                    </div>
                  </div>

                  <!-- Free Text -->
                  <div
                    v-else-if="item.itemType === 'free_text'"
                    class="border border-dashed border-gray-200 rounded-lg p-3 bg-white"
                  >
                    <p class="text-xs text-gray-400 italic flex items-center gap-1.5">
                      <span>✎</span> Respondent will type a free-text answer. No extra config
                      needed.
                    </p>
                  </div>
                </div>
                <!-- /item card -->

                <!-- Items summary -->
                <div
                  v-if="activeSection.items.length > 0"
                  class="mt-2 flex gap-4 text-xs text-gray-500"
                >
                  <span>{{ activeSection.items.length }} item(s)</span>
                  <span
                    >Total weight:
                    <strong
                      :class="
                        activeSection.items.reduce((s, i) => s + (i.weight || 0), 0) === 100
                          ? 'text-green-600'
                          : 'text-orange-500'
                      "
                    >
                      {{ activeSection.items.reduce((s, i) => s + (i.weight || 0), 0) }}%
                    </strong>
                  </span>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Footer -->
      <div class="border-t border-gray-100 bg-gray-50 px-6 py-4 flex flex-wrap items-center gap-4">
        <div class="flex gap-1.5">
          <button
            v-for="(_, idx) in sections"
            :key="idx"
            @click="goTo(idx)"
            :class="[
              'w-2.5 h-2.5 rounded-full transition-all',
              activeIndex === idx ? 'bg-blue-600 scale-125' : 'bg-gray-300 hover:bg-gray-400',
            ]"
          />
        </div>
        <div class="flex-1" />
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600">Total Form Weight:</span>
          <span
            :class="[
              'text-sm font-bold px-3 py-1 rounded-full',
              totalWeight === 100
                ? 'bg-green-100 text-green-700'
                : totalWeight > 100
                  ? 'bg-red-100 text-red-700'
                  : 'bg-orange-100 text-orange-700',
            ]"
          >
            {{ totalWeight }}%
            <span v-if="totalWeight === 100">✓</span>
            <span v-else-if="totalWeight > 100">↑ over</span>
            <span v-else>↓ under</span>
          </span>
        </div>
        <div class="w-full mt-1 flex flex-wrap gap-2">
          <div
            v-for="(section, idx) in sections"
            :key="section.id"
            @click="goTo(idx)"
            :class="[
              'text-xs px-2.5 py-1 rounded-full border cursor-pointer transition',
              activeIndex === idx
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300',
            ]"
          >
            {{ section.title || `Section ${idx + 1}` }}: {{ section.weight }}%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition:
    transform 0.28s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.28s ease;
  position: relative;
}
.slide-left-enter-from {
  transform: translateX(60px);
  opacity: 0;
}
.slide-left-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-left-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-left-leave-to {
  transform: translateX(-60px);
  opacity: 0;
}
.slide-right-enter-from {
  transform: translateX(-60px);
  opacity: 0;
}
.slide-right-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-right-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-right-leave-to {
  transform: translateX(60px);
  opacity: 0;
}
</style>
