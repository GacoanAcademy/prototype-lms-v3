<script setup lang="ts">
import { computed } from 'vue'
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

const props = withDefaults(
  defineProps<{
    labels: string[]
    data: number[]
    horizontal?: boolean
    hideVerticalLabel?: boolean
  }>(),
  {
    horizontal: false,
    hideVerticalLabel: false,
  },
)

const chartData = computed(() => ({
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
}))

const chartOptions = computed(() => {
  const isHorizontal = props.horizontal
  return {
    indexAxis: (isHorizontal ? 'y' : 'x') as 'x' | 'y',
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
            const val = isHorizontal ? ctx.parsed.x : ctx.parsed.y
            if (val === null) return ''
            return `${val.toFixed(1)}h`
          },
        },
      },
    },
    scales: {
      x: isHorizontal
        ? {
            beginAtZero: true,
            ticks: {
              callback: (v: number | string) => `${v}h`,
              font: { size: 11 },
            },
            grid: { color: '#E2E8F0' },
          }
        : {
            ticks: { font: { size: 11 } },
            grid: { display: false },
          },
      y: isHorizontal
        ? {
            ticks: {
              display: !props.hideVerticalLabel,
              font: { size: 11 },
            },
            grid: { display: false },
          }
        : {
            beginAtZero: true,
            ticks: {
              display: !props.hideVerticalLabel,
              callback: (v: number | string) => `${v}h`,
              font: { size: 11 },
            },
            grid: { color: '#E2E8F0' },
          },
    },
  }
})
</script>

<template>
  <div class="h-72">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
