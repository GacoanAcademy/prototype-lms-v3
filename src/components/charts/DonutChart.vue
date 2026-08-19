<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{
  materiHours: number
  testHours: number
}>()

const chartData = {
  labels: ['Materi', 'Test'],
  datasets: [
    {
      data: [props.materiHours, props.testHours],
      backgroundColor: ['#2563EB', '#93C5FD'],
      borderColor: ['#2563EB', '#93C5FD'],
      borderWidth: 2,
      hoverOffset: 6,
    },
  ],
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  animation: { duration: 700, easing: 'easeOutQuart' as const },
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: { usePointStyle: true, padding: 16, font: { size: 12 } },
    },
    tooltip: {
      backgroundColor: '#1E293B',
      titleFont: { size: 13 },
      bodyFont: { size: 12 },
      padding: 10,
      cornerRadius: 6,
      callbacks: {
        label: (ctx: { label: string; parsed: number; dataset: { data: number[] } }) => {
          const total = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : '0'
          return `${ctx.label}: ${ctx.parsed.toFixed(1)}h (${pct}%)`
        },
      },
    },
  },
}
</script>

<template>
  <div class="h-64 flex items-center justify-center">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>
