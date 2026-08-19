export interface LHProgram {
  program_id: string
  name: string
}

export interface LHMateri {
  materi_id: string
  program_id: string
  name: string
  estimated_teaching_hours?: number
}

export interface LHUser {
  user_id: string
  name: string
  role: 'participant' | 'instructor'
}

export type LHActivityType = 'MATERI' | 'TEST' | 'TEACHING_SESSION'
export type LHCompletionStatus = 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED'
export type LHPassStatus = 'PASS' | 'FAIL'

export interface LHActivityLog {
  log_id: string
  user_id: string
  role: 'participant' | 'instructor'
  program_id: string
  materi_id: string
  activity_type: LHActivityType
  duration_seconds: number
  session_date: string
  completion_status?: LHCompletionStatus
  pass_status?: LHPassStatus
  participants_count?: number
  participants_passed?: number
}

export interface LHFilters {
  dateFrom: string
  dateTo: string
  programIds: string[]
  searchQuery: string
}

export interface LHProgramSummary {
  program_id: string
  name: string
  total_hours: number
  avg_hours_per_participant: number
  completion_rate: number
  materi_hours: number
  test_hours: number
}

export interface LHMateriSummary {
  materi_id: string
  name: string
  program_id: string
  total_hours: number
  avg_hours_per_user: number
  test_pass_rate: number
  materi_hours: number
  test_hours: number
}

export interface LHUserSummary {
  user_id: string
  name: string
  total_hours: number
  materi_hours: number
  test_hours: number
  sessions_count: number
  last_activity_date: string
  completion_status: LHCompletionStatus
}

export interface LHInstructorSummary {
  user_id: string
  name: string
  total_hours: number
  teaching_hours: number
  percentage_teaching: number
  avg_actual_hours_per_materi: number
  materis_count: number
  sessions_count: number
  participants_handled: number
  effectiveness_score: number
  last_active_date: string
}

export interface LHInstructorMateriSummary {
  materi_id: string
  name: string
  total_teaching_hours: number
  sessions_run: number
  avg_class_size: number
  pass_rate: number
}
