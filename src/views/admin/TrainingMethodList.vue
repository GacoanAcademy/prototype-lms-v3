<script setup lang="ts">
import { trainingMethods, trainingMethodTypes } from '@/data/mockData'
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
      <h2 class="text-2xl font-bold">Training Methods</h2>
      <button @click="router.push('/admin/training-method/new')" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ New Method</button>
    </div>
    <div class="bg-white rounded shadow overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-100 text-left">
          <tr>
            <th class="px-4 py-3">Title</th>
            <th class="px-4 py-3">Type</th>
            <th class="px-4 py-3">Categories</th>
            <th class="px-4 py-3">Description</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in trainingMethods" :key="m.id" class="border-t hover:bg-gray-50">
            <td class="px-4 py-3 font-medium">{{ m.title }}</td>
            <td class="px-4 py-3">
              <span class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{{ typeName(m.typeId) }}</span>
            </td>
            <td class="px-4 py-3 text-gray-500">{{ m.categories.length }}</td>
            <td class="px-4 py-3 text-gray-500">{{ m.description }}</td>
            <td class="px-4 py-3">
              <button @click="router.push('/admin/training-method/' + m.id)" class="text-blue-600 hover:underline text-sm">Edit</button>
            </td>
          </tr>
          <tr v-if="trainingMethods.length === 0">
            <td colspan="5" class="text-center text-gray-400 py-8">No training methods yet</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>