<script setup lang="ts">
import type { Class } from '@/types'

const props = defineProps<{
  classData: Class
  programColor: string
}>()

defineEmits<{
  click: [classId: string]
}>()

const statusOpacity = {
  active: 1,
  completed: 0.5,
  pending: 0.7,
}
</script>

<template>
  <div
    @click.stop="$emit('click', classData.id)"
    class="cursor-pointer rounded px-1.5 py-0.5 text-[10px] font-medium leading-tight truncate shadow-sm hover:shadow transition-all group"
    :style="{
      backgroundColor: programColor,
      opacity: statusOpacity[classData.status as keyof typeof statusOpacity] ?? 1,
    }"
    :title="classData.name"
  >
    <span class="truncate text-white">{{ classData.name }}</span>
  </div>
</template>