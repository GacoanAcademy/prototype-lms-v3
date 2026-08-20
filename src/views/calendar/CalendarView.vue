<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { classes, users, programTypes } from '@/data/mockData'
import CalendarHeader from '@/components/calendar/CalendarHeader.vue'
import CalendarFilters from '@/components/calendar/CalendarFilters.vue'
import CalendarMonthGrid from '@/components/calendar/CalendarMonthGrid.vue'

const auth = useAuthStore()
const router = useRouter()

const isAdmin = computed(() => auth.userRole === 'admin')

const filters = ref({
  search: '',
  status: [] as string[],
  programTypeIds: [] as string[],
  instructorId: '',
})

const now = new Date()
const currentMonth = ref(now.getMonth())
const currentYear = ref(now.getFullYear())

const today = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})

const visibleClasses = computed(() => {
  let result = classes

  if (!isAdmin.value) {
    result = result.filter(c =>
      c.instructorId === auth.userId ||
      (c.inClassInstructorAssignments ?? []).some(a => a.instructorId === auth.userId)
    )
  }

  if (filters.value.status.length > 0) {
    result = result.filter(c => filters.value.status.includes(c.status))
  }

  if (filters.value.programTypeIds.length > 0) {
    result = result.filter(c => filters.value.programTypeIds.includes(c.programTypeId))
  }

  if (isAdmin.value && filters.value.instructorId) {
    result = result.filter(c =>
      c.instructorId === filters.value.instructorId ||
      (c.inClassInstructorAssignments ?? []).some(a => a.instructorId === filters.value.instructorId)
    )
  }

  if (filters.value.search) {
    const q = filters.value.search.toLowerCase()
    result = result.filter(c => c.name.toLowerCase().includes(q))
  }

  return result
})

const instructors = computed(() =>
  users.filter(u => u.role === 'instructor')
)

function programTypeName(id: string) {
  return programTypes.find(p => p.id === id)?.name ?? id
}

function instructorName(id: string) {
  return users.find(u => u.id === id)?.name ?? id
}

function goToToday() {
  const d = new Date()
  currentMonth.value = d.getMonth()
  currentYear.value = d.getFullYear()
}

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

function goToClass(classId: string) {
  const prefix = isAdmin.value ? '/admin' : '/instructor'
  router.push(`${prefix}/classes/${classId}`)
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-800">Training Calendar</h1>
      <p class="text-sm text-gray-500 mt-1">
        {{ isAdmin ? 'Visualize all scheduled training classes across the organization' : 'View your assigned training classes' }}
      </p>
    </div>

    <CalendarHeader
      :current-month="currentMonth"
      :current-year="currentYear"
      :is-admin="isAdmin"
      @prev="prevMonth"
      @next="nextMonth"
      @today="goToToday"
    />

    <CalendarFilters
      :filters="filters"
      :is-admin="isAdmin"
      :instructors="instructors"
      @update:search="filters.search = $event"
      @update:status="filters.status = $event"
      @update:program-type-ids="filters.programTypeIds = $event"
      @update:instructor-id="filters.instructorId = $event"
    />

    <CalendarMonthGrid
      :current-month="currentMonth"
      :current-year="currentYear"
      :classes="visibleClasses"
      :today="today"
      :is-admin="isAdmin"
      :program-types="programTypes"
      @select-class="goToClass"
    />

    <div class="flex items-center justify-between text-sm text-gray-600 bg-white rounded-lg border border-gray-200 px-4 py-3">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-sm bg-blue-600"></span>
          <span>Active</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-sm bg-gray-400"></span>
          <span>Completed</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-sm bg-blue-300"></span>
          <span>Pending</span>
        </div>
      </div>
      <span class="font-medium">Total: {{ visibleClasses.length }} classes shown</span>
    </div>
  </div>
</template>
