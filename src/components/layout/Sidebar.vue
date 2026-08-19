<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ref, computed } from 'vue'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const assessmentMethodsOpen = ref(true)

interface NavItem {
  label: string
  to: string
  icon: string
}
interface NavGroup {
  label: string
  icon: string
  children: NavItem[]
}

type MenuEntry = NavItem | NavGroup

const navItems = computed<MenuEntry[]>(() => {
  const role = auth.userRole
  if (role === 'admin') {
    return [
      { label: 'Dashboard', to: '/admin/dashboard', icon: '📊' },
      { label: 'Learning Hours', to: '/admin/learning-hours', icon: '⏱️' },
      { label: 'Test Bank', to: '/admin/tests', icon: '📝' },
      { label: 'Materi Bank', to: '/admin/materi', icon: '📚' },
      { label: 'Materi Types', to: '/admin/materi-type', icon: '📦' },
      { label: 'In-Class', to: '/admin/inclass', icon: '🏫' },
      { label: 'Test Retake', to: '/admin/test-retake', icon: '🔁' },
      { label: 'InClass Tokens', to: '/admin/inclass-tokens', icon: '🔑' },
      { label: 'Form Builder', to: '/admin/form-builder', icon: '📋' },
      { label: 'Section Types', to: '/admin/section-types', icon: '🗂️' },
      { label: 'Program Categories', to: '/admin/program-category', icon: '📂' },
      { label: 'Program Types', to: '/admin/program-type', icon: '📁' },
      { label: 'Training Method Types', to: '/admin/category-training-method', icon: '🏷️' },
      { label: 'Training Methods', to: '/admin/training-method', icon: '⚙️' },
      { label: 'Curriculum', to: '/admin/curriculum', icon: '🎯' },
      { label: 'Knowledge Test', to: '/admin/knowledge-tests', icon: '🔬' },
      { label: 'Classes', to: '/admin/classes', icon: '👥' },
      { label: 'Users', to: '/admin/users', icon: '👤' },
      { label: 'Uploads', to: '/admin/uploads', icon: '📤' },
      { label: 'Feedback', to: '/admin/feedback', icon: '💬' },
      { label: 'Instructor Raport', to: '/admin/instructor-raport', icon: '📈' },
      { label: 'Audit Log', to: '/admin/audit', icon: '📜' },
    ]
  }
  if (role === 'instructor') {
    return [
      { label: 'Dashboard', to: '/instructor/dashboard', icon: '📊' },
      { label: 'My Classes', to: '/instructor/classes', icon: '👥' },
      { label: 'KHS (Transcript)', to: '/instructor/khs', icon: '🎓' },
      { label: 'LGI (Progress)', to: '/instructor/lgi', icon: '📈' },
      { label: 'Instructor Raport', to: '/instructor/raport', icon: '📋' },
      { label: 'Uploads', to: '/instructor/uploads', icon: '📤' },
    ]
  }
  if (role === 'participant') {
    return [
      { label: 'Dashboard', to: '/participant/dashboard', icon: '📊' },
      { label: 'My Tests', to: '/participant/tests', icon: '📝' },
      { label: 'Progress', to: '/participant/progress', icon: '📈' },
      { label: 'Transcript', to: '/participant/transcript', icon: '🎓' },
      { label: 'Upload File', to: '/participant/uploads', icon: '📤' },
    ]
  }
  if (role === 'rater') {
    return [
      { label: 'Dashboard', to: '/rater/dashboard', icon: '📊' },
      { label: 'Assessments', to: '/rater/assessments', icon: '📋' },
    ]
  }
  if (role === 'supervisor') {
    return [
      { label: 'Dashboard', to: '/supervisor/dashboard', icon: '📊' },
      { label: 'Classes', to: '/supervisor/classes', icon: '👥' },
      { label: 'Audit Log', to: '/supervisor/audit', icon: '📜' },
      { label: 'Remedial', to: '/supervisor/remedial', icon: '🔄' },
    ]
  }
  return []
})

function isActive(to: string) {
  return route.path.startsWith(to)
}

function isNavGroup(item: MenuEntry): item is NavGroup {
  return 'children' in item
}
function goTo(to: string) {
  router.push(to)
}
</script>

<template>
  <aside class="w-64 bg-gray-900 text-white flex flex-col h-full">
    <div class="p-4 border-b border-gray-700">
      <h2 class="text-lg font-bold">LMS Gacoan</h2>
      <p class="text-sm text-gray-400 capitalize">{{ auth.userRole }}</p>
    </div>
    <nav class="flex-1 p-2 space-y-1 overflow-y-auto">
      <template v-for="item in navItems" :key="isNavGroup(item) ? item.label : item.to">
        <button
          v-if="!isNavGroup(item)"
          @click="goTo(item.to)"
          class="w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 transition-colors"
          :class="isActive(item.to) ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'"
        >
          <span>{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </button>
        <div v-else>
          <button
            @click="assessmentMethodsOpen = !assessmentMethodsOpen"
            class="w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            <span>{{ item.icon }}</span>
            <span class="flex-1">{{ item.label }}</span>
            <span
              class="text-xs transition-transform"
              :class="assessmentMethodsOpen ? 'rotate-90' : ''"
              >▶</span
            >
          </button>
          <div v-show="assessmentMethodsOpen" class="ml-3 space-y-1 mt-1">
            <button
              v-for="child in item.children"
              :key="child.to"
              @click="goTo(child.to)"
              class="w-full text-left px-3 py-1.5 rounded-md text-xs flex items-center gap-2 transition-colors"
              :class="
                isActive(child.to) ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'
              "
            >
              <span>{{ child.icon }}</span>
              <span>{{ child.label }}</span>
            </button>
          </div>
        </div>
      </template>
    </nav>
    <div class="p-4 border-t border-gray-700">
      <p class="text-sm text-gray-400 truncate">{{ auth.userName }}</p>
    </div>
  </aside>
</template>
