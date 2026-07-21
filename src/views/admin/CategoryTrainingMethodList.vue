<script setup lang="ts">
import { trainingMethodTypes } from '@/data/mockData'
import { useRouter } from 'vue-router'
const router = useRouter()

const hardcodedTypes: Record<string, string> = {
  knowledgeTest: 'Knowledge Test',
}

function typeName(typeId: string) {
  if (hardcodedTypes[typeId]) return hardcodedTypes[typeId]
  const t = trainingMethodTypes.find(t => t.id === typeId)
  return t ? t.name : typeId
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Training Method Types</h2>
      <button @click="router.push('/admin/category-training-method/new')" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ New Type</button>
    </div>
    <div class="bg-white rounded shadow overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-100 text-left">
          <tr>
            <th class="px-4 py-3">Name</th>
            <th class="px-4 py-3">Description</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in trainingMethodTypes" :key="t.id" class="border-t hover:bg-gray-50">
            <td class="px-4 py-3 font-medium">{{ t.name }}</td>
            <td class="px-4 py-3 text-gray-500">{{ t.description }}</td>
            <td class="px-4 py-3">
              <button @click="router.push('/admin/category-training-method/' + t.id)" class="text-blue-600 hover:underline text-sm">Edit</button>
            </td>
          </tr>
          <tr v-if="trainingMethodTypes.length === 0">
            <td colspan="3" class="text-center text-gray-400 py-8">No types yet</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>