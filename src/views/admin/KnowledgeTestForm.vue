<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { knowledgeTestClasses, tests } from '@/data/mockData'

const route = useRoute()
const router = useRouter()
const isEdit = !!(route.params.id && route.params.id !== 'new')
const existing = isEdit ? knowledgeTestClasses.find((kt) => kt.id === route.params.id) : null

const name = ref(existing?.name ?? '')
const testId = ref(existing?.testId ?? '')
const passingScore = ref(existing?.passingScore ?? 70)
const maxParticipants = ref(existing?.maxParticipants ?? 100)

function save() {
  alert('Knowledge Test saved (mock)')
  router.push('/admin/knowledge-tests')
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">{{ isEdit ? 'Edit' : 'New' }} Knowledge Test</h2>
    <div class="bg-white p-6 rounded shadow space-y-4 max-w-lg">
      <div>
        <label class="block text-sm font-medium mb-1">Name</label
        ><input v-model="name" class="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Test</label
        ><select v-model="testId" class="w-full border rounded px-3 py-2">
          <option value="">--</option>
          <option v-for="t in tests" :key="t.id" :value="t.id">{{ t.title }}</option>
        </select>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Pass Score</label
          ><input
            v-model.number="passingScore"
            type="number"
            class="w-full border rounded px-3 py-2"
          />
        </div>
      </div>
      <button @click="save" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        Save
      </button>
    </div>
  </div>
</template>
