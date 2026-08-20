import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { Role } from '@/types'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { guest: true },
  },
  // ── Admin (super admin — all CRUD) ──
  {
    path: '/admin',
    meta: { role: 'admin' as Role },
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('@/views/dashboard/AdminDashboard.vue'),
      },
      {
        path: 'learning-hours',
        name: 'admin-learning-hours',
        component: () => import('@/views/admin/learning-hours/LearningHoursView.vue'),
      },
      { path: 'tests', name: 'admin-tests', component: () => import('@/views/admin/TestList.vue') },
      {
        path: 'tests/new',
        name: 'admin-test-new',
        component: () => import('@/views/admin/TestForm.vue'),
      },
      {
        path: 'tests/:id',
        name: 'admin-test-edit',
        component: () => import('@/views/admin/TestForm.vue'),
      },
      {
        path: 'materi',
        name: 'admin-materi',
        component: () => import('@/views/admin/MateriList.vue'),
      },
      {
        path: 'materi/new',
        name: 'admin-materi-new',
        component: () => import('@/views/admin/MateriForm.vue'),
      },
      {
        path: 'materi/:id',
        name: 'admin-materi-edit',
        component: () => import('@/views/admin/MateriForm.vue'),
      },
      {
        path: 'materi-type',
        name: 'admin-materi-type',
        component: () => import('@/views/admin/MateriTypeList.vue'),
      },
      {
        path: 'materi-type/new',
        name: 'admin-materi-type-new',
        component: () => import('@/views/admin/MateriTypeForm.vue'),
      },
      {
        path: 'materi-type/:id',
        name: 'admin-materi-type-edit',
        component: () => import('@/views/admin/MateriTypeForm.vue'),
      },
      {
        path: 'inclass',
        name: 'admin-inclass',
        component: () => import('@/views/admin/InClassList.vue'),
      },
      {
        path: 'inclass/new',
        name: 'admin-inclass-new',
        component: () => import('@/views/admin/InClassForm.vue'),
      },
      {
        path: 'inclass/:id',
        name: 'admin-inclass-edit',
        component: () => import('@/views/admin/InClassForm.vue'),
      },
      {
        path: 'form-builder',
        name: 'admin-form-builder',
        component: () => import('@/views/admin/FormAssessmentList.vue'),
      },
      {
        path: 'form-builder/new',
        name: 'admin-form-builder-new',
        component: () => import('@/views/admin/FormAssessmentForm.vue'),
      },
      {
        path: 'form-builder/:id',
        name: 'admin-form-builder-edit',
        component: () => import('@/views/admin/FormAssessmentForm.vue'),
      },
      {
        path: 'section-types',
        name: 'admin-section-types',
        component: () => import('@/views/admin/SectionTypeList.vue'),
      },
      {
        path: 'section-types/new',
        name: 'admin-section-type-new',
        component: () => import('@/views/admin/SectionTypeForm.vue'),
      },
      {
        path: 'section-types/:id',
        name: 'admin-section-type-edit',
        component: () => import('@/views/admin/SectionTypeForm.vue'),
      },
      {
        path: 'category-training-method',
        name: 'admin-category-training-method',
        component: () => import('@/views/admin/CategoryTrainingMethodList.vue'),
      },
      {
        path: 'category-training-method/new',
        name: 'admin-category-training-method-new',
        component: () => import('@/views/admin/CategoryTrainingMethodForm.vue'),
      },
      {
        path: 'category-training-method/:id',
        name: 'admin-category-training-method-edit',
        component: () => import('@/views/admin/CategoryTrainingMethodForm.vue'),
      },
      {
        path: 'program-category',
        name: 'admin-program-category',
        component: () => import('@/views/admin/ProgramCategoryList.vue'),
      },
      {
        path: 'program-category/new',
        name: 'admin-program-category-new',
        component: () => import('@/views/admin/ProgramCategoryForm.vue'),
      },
      {
        path: 'program-category/:id',
        name: 'admin-program-category-edit',
        component: () => import('@/views/admin/ProgramCategoryForm.vue'),
      },
      {
        path: 'program-type',
        name: 'admin-program-type',
        component: () => import('@/views/admin/ProgramTypeList.vue'),
      },
      {
        path: 'program-type/new',
        name: 'admin-program-type-new',
        component: () => import('@/views/admin/ProgramTypeForm.vue'),
      },
      {
        path: 'program-type/:id',
        name: 'admin-program-type-edit',
        component: () => import('@/views/admin/ProgramTypeForm.vue'),
      },
      {
        path: 'training-method',
        name: 'admin-training-method',
        component: () => import('@/views/admin/TrainingMethodList.vue'),
      },
      {
        path: 'training-method/new',
        name: 'admin-training-method-new',
        component: () => import('@/views/admin/TrainingMethodForm.vue'),
      },
      {
        path: 'training-method/:id',
        name: 'admin-training-method-edit',
        component: () => import('@/views/admin/TrainingMethodForm.vue'),
      },
      {
        path: 'curriculum',
        name: 'admin-curriculum',
        component: () => import('@/views/admin/CurriculumList.vue'),
      },
      {
        path: 'curriculum/new',
        name: 'admin-curriculum-new',
        component: () => import('@/views/admin/CurriculumForm.vue'),
      },
      {
        path: 'curriculum/:id',
        name: 'admin-curriculum-edit',
        component: () => import('@/views/admin/CurriculumForm.vue'),
      },
      {
        path: 'classes',
        name: 'admin-classes',
        component: () => import('@/views/admin/ClassList.vue'),
      },
      {
        path: 'classes/new',
        name: 'admin-class-new',
        component: () => import('@/views/admin/ClassForm.vue'),
      },
      {
        path: 'classes/:id/edit',
        name: 'admin-class-edit',
        component: () => import('@/views/admin/ClassForm.vue'),
      },
      {
        path: 'classes/:id',
        name: 'admin-class-detail',
        component: () => import('@/views/admin/ClassDetail.vue'),
      },
      {
        path: 'classes/:id/progress',
        name: 'admin-class-progress',
        component: () => import('@/views/progress/ClassProgressView.vue'),
      },
      {
        path: 'knowledge-tests',
        name: 'admin-knowledge-tests',
        component: () => import('@/views/admin/KnowledgeTestList.vue'),
      },
      {
        path: 'knowledge-tests/new',
        name: 'admin-knowledge-test-new',
        component: () => import('@/views/admin/KnowledgeTestForm.vue'),
      },
      {
        path: 'knowledge-tests/:id',
        name: 'admin-knowledge-test-edit',
        component: () => import('@/views/admin/KnowledgeTestForm.vue'),
      },
      {
        path: 'knowledge-tests/:id/results',
        name: 'admin-knowledge-test-results',
        component: () => import('@/views/admin/KnowledgeTestResult.vue'),
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('@/views/admin/UserManagement.vue'),
      },
       {
         path: 'audit',
         name: 'admin-audit',
         component: () => import('@/views/admin/AuditLogView.vue'),
       },
       {
         path: 'feedback',
         name: 'admin-feedback',
         component: () => import('@/views/admin/FeedbackView.vue'),
       },
       {
         path: 'uploads',
         name: 'admin-uploads',
         component: () => import('@/views/admin/UploadsView.vue'),
       },

      {
        path: 'test-retake',
        name: 'admin-test-retake',
        component: () => import('@/views/admin/InClassRetakeView.vue'),
      },
      {
        path: 'inclass-retake',
        redirect: '/admin/test-retake',
      },
      {
        path: 'inclass-tokens',
        name: 'admin-inclass-tokens',
        component: () => import('@/views/admin/InClassTokenView.vue'),
      },
        {
          path: 'instructor-raport',
          name: 'admin-instructor-raport',
          component: () => import('@/views/admin/InstructorRaportList.vue'),
        },
       {
         path: 'instructor-raport/:id',
         name: 'admin-instructor-raport-detail',
         component: () => import('@/views/admin/InstructorRaportDetail.vue'),
       },
      {
        path: 'calendar',
        name: 'admin-calendar',
        component: () => import('@/views/calendar/CalendarView.vue'),
      },

    ],
  },
  // ── Instructor (read-only + scoring) ──
  {
    path: '/instructor',
    meta: { role: 'instructor' as Role },
    children: [
      {
        path: 'dashboard',
        name: 'instructor-dashboard',
        component: () => import('@/views/dashboard/InstructorDashboard.vue'),
      },
      {
        path: 'classes',
        name: 'instructor-classes',
        component: () => import('@/views/instructor/ClassList.vue'),
      },
      {
        path: 'classes/:id',
        name: 'instructor-class-detail',
        component: () => import('@/views/instructor/ClassDetail.vue'),
      },
      {
        path: 'classes/:id/scores',
        name: 'instructor-class-scores',
        component: () => import('@/views/instructor/ScoreView.vue'),
      },
      {
        path: 'khs',
        name: 'instructor-khs',
        component: () => import('@/views/instructor/KHSView.vue'),
      },
        {
          path: 'raport',
          name: 'instructor-raport',
          component: () => import('@/views/instructor/InstructorRaportView.vue'),
        },
      {
        path: 'raport/:id',
        name: 'instructor-raport-detail',
        component: () => import('@/views/instructor/InstructorRaportDetail.vue'),
      },

      {
        path: 'calendar',
        name: 'instructor-calendar',
        component: () => import('@/views/calendar/CalendarView.vue'),
      },

      {
        path: 'uploads',
        name: 'instructor-uploads',
        component: () => import('@/views/instructor/UploadsView.vue'),
      },
    ],
  },
  // ── Participant ──
  {
    path: '/participant',
    meta: { role: 'participant' as Role },
    children: [
      {
        path: 'dashboard',
        name: 'participant-dashboard',
        component: () => import('@/views/dashboard/ParticipantDashboard.vue'),
      },
      {
        path: 'tests',
        name: 'participant-tests',
        component: () => import('@/views/testTaker/TestListView.vue'),
      },
      {
        path: 'tests/:id/take',
        name: 'participant-test-take',
        component: () => import('@/views/testTaker/TestTakerView.vue'),
      },
      {
        path: 'tests/:id/result',
        name: 'participant-test-result',
        component: () => import('@/views/testTaker/TestResultView.vue'),
      },
      {
        path: 'progress',
        name: 'participant-progress',
        component: () => import('@/views/progress/ClassProgressView.vue'),
      },
      {
        path: 'inclass/:classId/:inClassId',
        name: 'participant-inclass',
        component: () => import('@/views/participant/InClassView.vue'),
      },
      {
        path: 'feedback/:formId',
        name: 'participant-feedback',
        component: () => import('@/views/participant/FeedbackView.vue'),
      },
      {
        path: 'transcript',
        name: 'participant-transcript',
        component: () => import('@/views/transcript/TranscriptView.vue'),
      },
      {
        path: 'uploads',
        name: 'participant-uploads',
        component: () => import('@/views/participant/UploadFileView.vue'),
      },
    ],
  },
  // ── Rater ──
  {
    path: '/rater',
    meta: { role: 'rater' as Role },
    children: [
      {
        path: 'dashboard',
        name: 'rater-dashboard',
        component: () => import('@/views/dashboard/RaterDashboard.vue'),
      },
      {
        path: 'assessments',
        name: 'rater-assessments',
        component: () => import('@/views/assessment/AssessmentList.vue'),
      },
      {
        path: 'assessments/:id',
        name: 'rater-assessment-form',
        component: () => import('@/views/assessment/AssessmentForm.vue'),
      },
    ],
  },
  // ── Supervisor ──
  {
    path: '/supervisor',
    meta: { role: 'supervisor' as Role },
    children: [
      {
        path: 'dashboard',
        name: 'supervisor-dashboard',
        component: () => import('@/views/dashboard/SupervisorDashboard.vue'),
      },
      {
        path: 'classes',
        name: 'supervisor-classes',
        component: () => import('@/views/classMgmt/ClassList.vue'),
      },
      {
        path: 'audit',
        name: 'supervisor-audit',
        component: () => import('@/views/audit/AuditLogView.vue'),
      },
      {
        path: 'remedial',
        name: 'supervisor-remedial',
        component: () => import('@/views/remedial/RemedialView.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  auth.init()

  if (to.meta.role) {
    if (!auth.isAuthenticated) {
      next('/login')
    } else if (auth.userRole !== to.meta.role) {
      next(`/${auth.userRole}/dashboard`)
    } else {
      next()
    }
  } else if (to.meta.guest) {
    if (auth.isAuthenticated) {
      next(`/${auth.userRole}/dashboard`)
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
