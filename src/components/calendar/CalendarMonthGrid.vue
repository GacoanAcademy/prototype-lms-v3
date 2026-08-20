<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Class, ProgramType } from '@/types'
import { users, programTypes } from '@/data/mockData'
import EventBar from './EventBar.vue'

const props = defineProps<{
  currentMonth: number
  currentYear: number
  classes: Class[]
  today: string
  isAdmin: boolean
  programTypes: ProgramType[]
}>()

const emit = defineEmits<{
  selectClass: [classId: string]
}>()

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface DayCell {
  date: string
  day: number
  isCurrentMonth: boolean
}

const grid = computed<DayCell[]>(() => {
  const firstDay = new Date(props.currentYear, props.currentMonth, 1)
  const lastDay = new Date(props.currentYear, props.currentMonth + 1, 0)
  const daysInMonth = lastDay.getDate()

  let startDow = firstDay.getDay()
  if (startDow === 0) startDow = 7
  startDow--

  const cells: DayCell[] = []

  const prevMonthLastDay = new Date(props.currentYear, props.currentMonth, 0).getDate()
  for (let i = startDow - 1; i >= 0; i--) {
    const d = prevMonthLastDay - i
    const m = props.currentMonth === 0 ? 12 : props.currentMonth
    const y = props.currentMonth === 0 ? props.currentYear - 1 : props.currentYear
    cells.push({
      date: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      day: d,
      isCurrentMonth: false,
    })
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      date: `${props.currentYear}-${String(props.currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      day: d,
      isCurrentMonth: true,
    })
  }

  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    const m = props.currentMonth + 2 > 12 ? 1 : props.currentMonth + 2
    const y = props.currentMonth + 2 > 12 ? props.currentYear + 1 : props.currentYear
    cells.push({
      date: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      day: d,
      isCurrentMonth: false,
    })
  }

  return cells
})

function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

// Group events by date
const eventsByDate = computed<Record<string, Class[]>>(() => {
  const map: Record<string, Class[]> = {}
  for (const cls of props.classes) {
    const start = parseDate(cls.startDate)
    const end = parseDate(cls.endDate)
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().slice(0, 10)
      if (!map[key]) map[key] = []
      map[key].push(cls)
    }
  }
  return map
})

function getEventsForDate(date: string): Class[] {
  return eventsByDate.value[date] || []
}

function getProgramColor(programTypeId: string): string {
  return props.programTypes.find(p => p.id === programTypeId)?.color ?? '#6B7280'
}

function instructorName(id: string) {
  return users.find(u => u.id === id)?.name ?? id
}

function programTypeName(id: string) {
  return props.programTypes.find(p => p.id === id)?.name ?? id
}

// Popover state
const popoverDate = ref<string | null>(null)
const popoverEvents = ref<Class[]>([])

function openPopover(date: string) {
  popoverDate.value = date
  popoverEvents.value = getEventsForDate(date)
}

function closePopover() {
  popoverDate.value = null
  popoverEvents.value = []
}
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div class="grid grid-cols-7 border-b border-gray-200">
      <div
        v-for="day in weekdays"
        :key="day"
        class="px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide border-r last:border-r-0 border-gray-100"
      >
        {{ day }}
      </div>
    </div>

    <div class="grid grid-cols-7">
      <template v-for="(cell, idx) in grid" :key="cell.date">
        <div
          class="relative border-r border-b border-gray-100 last:border-r-0 min-h-[84px] p-1"
          :class="{ 'bg-gray-50/50': !cell.isCurrentMonth }"
          @click="openPopover(cell.date)"
        >
          <!-- Day number - top-left, no overlap with events -->
          <span
            class="absolute top-1 left-1 z-10 w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium"
            :class="{
              'bg-blue-600 text-white': cell.date === today,
              'text-gray-800': cell.isCurrentMonth && cell.date !== today,
              'text-gray-400': !cell.isCurrentMonth,
            }"
          >
            {{ cell.day }}
          </span>

          <!-- Events container -->
          <div class="absolute top-8 left-1 right-1 bottom-1 flex flex-col gap-0.5 overflow-hidden">
            <template v-if="getEventsForDate(cell.date).length > 0">
              <EventBar
                v-for="(evt, evtIdx) in getEventsForDate(cell.date).slice(0, 3)"
                :key="evt.id + '-' + evtIdx"
                :class-data="evt"
                :program-color="getProgramColor(evt.programTypeId)"
                @click="emit('selectClass', evt.id)"
              />
              <button
                v-if="getEventsForDate(cell.date).length > 3"
                @click.stop="openPopover(cell.date)"
                class="text-[9px] text-gray-500 hover:text-gray-700 truncate px-1 py-0.5"
              >
                +{{ getEventsForDate(cell.date).length - 3 }} more
              </button>
            </template>
          </div>

          <!-- Popover for "+N more" -->
          <div
            v-if="popoverDate === cell.date"
            class="absolute z-50 top-8 left-1 right-1 bg-white border border-gray-300 rounded-lg shadow-lg py-1 min-w-[200px] max-w-xs"
            @click.stop
          >
            <div class="px-2 py-1 text-xs font-medium text-gray-500 uppercase border-b border-gray-100">
              {{ popoverEvents.length }} events on {{ popoverDate }}
            </div>
            <div class="max-h-48 overflow-y-auto">
              <div
                v-for="evt in popoverEvents"
                :key="evt.id"
                class="px-2 py-1.5 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 border-gray-100"
                @click="emit('selectClass', evt.id); closePopover()"
              >
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: getProgramColor(evt.programTypeId) }"></span>
                  <span class="text-xs font-medium text-gray-800 truncate flex-1">{{ evt.name }}</span>
                  <span class="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{{ programTypeName(evt.programTypeId) }}</span>
                </div>
                <div class="flex items-center gap-2 text-[9px] text-gray-500 mt-0.5">
                  <span>{{ evt.startDate }} → {{ evt.endDate }}</span>
                  <span class="capitalize">{{ evt.status }}</span>
                  <span>{{ instructorName(evt.instructorId) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Close popover when clicking outside -->
    <div v-if="popoverDate" class="fixed inset-0 z-40" @click="closePopover" />
  </div>
</template>