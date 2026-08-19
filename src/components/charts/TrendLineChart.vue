<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

const props = defineProps<{
  labels: string[]
  materiData: number[]
  testData: number[]
}>()

const chartData = {
  labels: props.labels,
  datasets: [
    {
      label: 'Materi Hours',
      data: props.materiData,
      borderColor: '#2563EB',
      backgroundColor: '#2563EB',
      borderWidth: 2,
      pointRadius: 3,
      pointBackgroundColor: '#2563EB',
      tension: 0.3,
    },
    {
      label: 'Test Hours',
      data: props.testData,
      borderColor: '#93C5FD',
      backgroundColor: '#93C5FD',
      borderWidth: 2,
      pointRadius: 3,
      pointBackgroundColor: '#93C5FD',
      tension: 0.3,
    },
  ],
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 600, easing: 'easeOutQuart' as const },
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
        label: (ctx: { dataset: { label?: string }; parsed: { y: number | null } }) => {
          const val = ctx.parsed.y
          if (val === null) return ''
          return `${ctx.dataset.label}: ${val.toFixed(1)}h`
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { callback: (v: number | string) => `${v}h`, font: { size: 11 } },
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
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
