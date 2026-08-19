<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
  label: string
  value: number
  unit?: string
  change?: number
  decimals?: number
}>()

const displayValue = ref(0)
const decimals = props.decimals ?? 1

function animateCountUp(target: number) {
  const duration = 700
  const start = performance.now()
  const from = 0

  function tick(now: number) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    displayValue.value = from + (target - from) * eased
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

onMounted(() => animateCountUp(props.value))
watch(() => props.value, (v) => animateCountUp(v))
</script>

<template>
  <div class="bg-white p-5 rounded-lg shadow border border-gray-100">
    <p class="text-sm text-gray-500 mb-1">{{ label }}</p>
    <div class="flex items-baseline gap-2">
      <span class="text-3xl font-bold text-gray-900">{{
        displayValue.toFixed(decimals)
      }}</span>
      <span v-if="unit" class="text-sm text-gray-500">{{ unit }}</span>
    </div>
    <p v-if="change !== undefined" class="text-xs mt-2" :class="change >= 0 ? 'text-blue-600' : 'text-gray-500'">
      {{ change >= 0 ? '+' : '' }}{{ change.toFixed(1) }}% vs previous period
    </p>
  </div>
</template>
