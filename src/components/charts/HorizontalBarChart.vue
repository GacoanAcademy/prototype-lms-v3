<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const props = defineProps<{
  labels: string[]
  data: number[]
  horizontal?: boolean
}>()

const chartData = {
  labels: props.labels,
  datasets: [
    {
      label: 'Learning Hours',
      data: props.data,
      backgroundColor: '#2563EB',
      borderColor: '#1D4ED8',
      borderWidth: 1,
      borderRadius: 4,
      barThickness: props.horizontal ? 20 : undefined,
    },
  ],
}

const chartOptions = {
  indexAxis: (props.horizontal ? 'y' : 'x') as 'x' | 'y',
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 600, easing: 'easeOutQuart' as const },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1E293B',
      titleFont: { size: 13 },
      bodyFont: { size: 12 },
      padding: 10,
      cornerRadius: 6,
      callbacks: {
        label: (ctx: { parsed: { x: number | null; y: number | null } }) => {
          const val = props.horizontal ? ctx.parsed.x : ctx.parsed.y
          if (val === null) return ''
          return `${val.toFixed(1)}h`
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (v: number | string) => `${v}h`,
        font: { size: 11 },
      },
      grid: { color: '#E2E8F0' },
    },
    x: {
      ticks: { font: { size: 11 } },
      grid: { display: false },
    },
  },
}
</script>

<template>
  <div class="h-72">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
