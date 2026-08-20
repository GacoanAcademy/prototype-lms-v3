<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { programTypes, programCategories } from '@/data/mockData'

const route = useRoute()
const router = useRouter()
const isEdit = !!(route.params.id && route.params.id !== 'new')
const existing = isEdit ? programTypes.find(t => t.id === route.params.id) : null

const name = ref(existing?.name ?? '')
const description = ref(existing?.description ?? '')
const programCategoryId = ref(existing?.programCategoryId ?? '')
const color = ref(existing?.color ?? '#3B82F6')

const presetColors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#84CC16']

function save() {
  if (!programCategoryId.value) {
    alert('Please select a program category')
    return
  }
  alert('Program type saved (mock)')
  router.push('/admin/program-type')
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">{{ isEdit ? 'Edit Program Type' : 'New Program Type' }}</h2>
    <div class="bg-white p-6 rounded shadow space-y-4 max-w-2xl">
      <div>
        <label class="block text-sm font-medium mb-1">Name</label>
        <input v-model="name" class="w-full border rounded px-3 py-2" placeholder="e.g. Frontliner Excellence" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Program Category</label>
        <select v-model="programCategoryId" class="w-full border rounded px-3 py-2">
          <option value="">-- Select Category --</option>
          <option v-for="c in programCategories" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Color</label>
        <div class="flex items-center gap-3">
          <input
            v-model="color"
            type="color"
            class="w-10 h-10 rounded border cursor-pointer"
            title="Pick a color"
          />
          <input
            v-model="color"
            type="text"
            class="w-24 border rounded px-2 py-1 text-sm font-mono"
            placeholder="#RRGGBB"
            @input="color.value = $event.target.value"
          />
        </div>
        <div class="flex flex-wrap gap-1.5 mt-2">
          <button
            v-for="c in presetColors"
            :key="c"
            type="button"
            @click="color = c"
            class="w-6 h-6 rounded border-2 cursor-pointer transition-transform hover:scale-110"
            :style="{ backgroundColor: c }"
            :class="color === c ? 'border-blue-600' : 'border-transparent'"
            :title="c"
          />
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Description</label>
        <textarea v-model="description" class="w-full border rounded px-3 py-2" rows="3" />
      </div>
      <button @click="save" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Save</button>
    </div>
  </div>
</template>
