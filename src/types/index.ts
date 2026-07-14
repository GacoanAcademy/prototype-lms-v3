export type Role = 'participant' | 'instructor' | 'rater' | 'supervisor' | 'admin'

export interface User {
  id: string
  nip?: string
  email: string
  password: string
  name: string
  role: Role
}

// ── Question / Test Engine ──
export type QuestionType = 'mcq' | 'essay' | 'fillBlank' | 'dragDrop'

export interface MCQOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface DragDropItem {
  id: string
  text: string
  correctOrder: number
}

export interface Question {
  id: string
  type: QuestionType
  text: string
  points: number
  options?: MCQOption[]
  correctAnswer?: string
  items?: DragDropItem[]
}

export interface Test {
  id: string
  title: string
  description: string
  questions: Question[]
  timeLimit: number
  randomize: boolean
  pickCount?: number
  createdBy: string
  createdAt: string
}

// ── Materi Library ──
export type MateriMediaType = 'pdf' | 'slide' | 'video' | 'h5p'

export interface Materi {
  id: string
  title: string
  type: MateriMediaType
  embedUrl: string
  description?: string
  createdBy: string
  createdAt: string
}

// ── Materi Type ──
export interface MateriType {
  id: string
  name: string
  description: string
  createdBy: string
  createdAt: string
}

// ── In-Class ──
export interface MateriCategory {
  id: string
  name: string
  weight: number
  inClassId: string
  materiTypeId?: string
  preTestId: string
  postTestId: string
  materiIds: string[]
  feedbackFormId?: string
}

export interface InClass {
  id: string
  title: string
  description: string
  categories: MateriCategory[]
  createdBy: string
  createdAt: string
}

// ── InClass ordered progression tracking ──
export type InClassActivityType = 'preTest' | 'materi' | 'postTest' | 'feedback'

export interface InClassActivity {
  type: InClassActivityType
  refId: string // testId for pre/post, materiId for materi
  order: number // 0-based position in the sequence
}

// Records completion of a single in-class activity (pre-test, materi view, post-test)
export interface InClassActivityCompletion {
  id: string
  participantId: string
  classId: string
  inClassId: string
  categoryId: string
  activityType: InClassActivityType
  refId: string
  completedAt: string
}

// Admin-issued token that unlocks a whole MateriCategory for ALL participants in the class.
// Lock is per MateriType (category). One token is shared with the entire class.
export interface MateriAccessToken {
  id: string
  token: string // e.g. "TK-A4F2" — admin shares this code with the class
  classId: string
  inClassId: string
  categoryId: string // the MateriCategory.id (which has a materiTypeId) being unlocked
  issuedBy: string // admin userId
  issuedAt: string
  note?: string
  // Tracking who first redeemed it (token stays active for all after first redemption)
  firstRedeemedAt?: string
  firstRedeemedBy?: string // participantId
}

// ── Training Method ──
export interface TrainingMethodComponent {
  id: string
  order: number
  weight: number
  passingScore: number
  contentId: string
  knowledgeTestClassId?: string
}

export interface MethodCategory {
  id: string
  name: string
  weight: number
  formAssessmentId: string
  typeId?: string
  knowledgeTestClassId?: string
  components?: TrainingMethodComponent[]
}

export interface TrainingMethod {
  id: string
  title: string
  description: string
  typeId: string
  categories: MethodCategory[]
  createdBy: string
  createdAt: string
}

export interface TrainingMethodType {
  id: string
  name: string
  description: string
  createdBy: string
  createdAt: string
}

// ── Form Builder (Google Forms-style) ──
export type FormFieldType = 'mcq' | 'essay' | 'trueFalse' | 'rating'

export interface FormField {
  id: string
  type: FormFieldType
  label: string
  required: boolean
  points: number
  options?: string[]
  ratingMin?: number
  ratingMax?: number
}

// ── Section Type (user-managed, replaces the hardcoded SectionType union) ──
export interface SectionTypeEntity {
  id: string
  name: string
  description: string
  createdBy: string
  createdAt: string
}

// ── Form Section System ──
export type FormItemType = 'multiple_choice' | 'true_false' | 'scale' | 'free_text'

export interface FormSectionItem {
  id: string
  label: string
  itemType: FormItemType
  weight: number
  point: number
  // multiple_choice options
  options?: string[]
  correctOption?: number // index into options
  // scale config
  scaleMin?: number
  scaleMax?: number
  scaleStep?: number
  // true_false correct answer
  correctTrueFalse?: boolean
}

export interface FormSection {
  id: string
  title: string
  sectionTypeId: string // references SectionTypeEntity.id
  weight: number
  items: FormSectionItem[]
}

export interface FormAssessment {
  id: string
  title: string
  description: string
  fields: FormField[]
  sections?: FormSection[]
  typeId?: string
  createdBy: string
  createdAt: string
  clonedFrom?: string
}

// ── Program Category & Type ──
export interface ProgramCategory {
  id: string
  name: string
  description: string
  createdBy: string
  createdAt: string
}

export interface ProgramType {
  id: string
  name: string
  description: string
  programCategoryId: string
  createdBy: string
  createdAt: string
}

// ── Curriculum ──
export interface CurriculumItem {
  id: string
  order: number
  trainingMethodType: string
  contentId: string
  weight: number
  passingScore: number
}

export interface Curriculum {
  id: string
  title: string
  description: string
  programTypeId: string
  passingThreshold: number
  immutable: boolean
  items: CurriculumItem[]
  createdBy: string
  createdAt: string
}

// ── Class ──
export type ClassStatus = 'pending' | 'active' | 'completed'

export interface InClassMateriInstructorAssignment {
  trainingMethodId: string
  inClassId: string
  categoryId: string
  materiId: string
  instructorId: string
}

export interface ParticipantAssessorAssignment {
  trainingMethodId: string
  participantId: string
  raterIds: string[]
  raterWeights?: Record<string, number>
}

export interface Submission {
  id: string
  trainingMethodId: string
  participantId: string
  classId: string
  fileUrl: string
  description: string
  submittedAt: string
}

export interface Class {
  id: string
  name: string
  programTypeId: string
  curriculumId: string
  knowledgeTestClassId?: string
  instructorId: string
  startDate: string
  endDate: string
  status: ClassStatus
  participants: string[]
  raters: string[]
  inClassInstructorAssignments?: InClassMateriInstructorAssignment[]
  assessmentAssessorAssignments?: ParticipantAssessorAssignment[]
  createdBy: string
  createdAt: string
}

// ── Knowledge Test (screening entity) ──
export interface KnowledgeTestClass {
  id: string
  name: string
  testId: string
  passingScore: number
  maxParticipants: number
  participants: string[]
  createdBy: string
  createdAt: string
}

// ── Test Attempt ──
export interface Answer {
  questionId: string
  value: string | string[]
}

export interface TestAttempt {
  id: string
  testId: string
  participantId: string
  classId: string
  inClassId?: string // which InClass this belongs to (for pre/post tests)
  categoryId?: string // which MateriCategory this belongs to
  testType?: 'preTest' | 'postTest' | 'knowledgeTest' | 'remedial' // context of the attempt
  attemptNumber?: number // 1 = original, 2+ = retake
  answers: Answer[]
  score: number
  totalPoints: number
  normalizedScore: number
  startedAt: string
  completedAt?: string
  status: 'inProgress' | 'completed' | 'expired'
}

// ── Test Retake Permission ──
export interface InClassRetakePermission {
  id: string
  classId: string
  inClassId?: string
  categoryId?: string
  participantId: string
  testId: string
  testType: 'preTest' | 'postTest' | 'knowledgeTest'
  grantedBy: string // admin userId
  grantedAt: string
  usedAt?: string // set when the participant actually retakes
  note?: string
}

// ── Scoring Contract ──
export interface ScoreMetadata {
  rawScore: any
  calculation: string
  evaluatedAt: string
  evaluator: string
}

export interface ScoreOutput {
  trainingMethodId: string
  participantScore: number
  passStatus: 'pass' | 'fail' | 'pending'
  metadata: ScoreMetadata
}

// ── Multirater / Form-based Assessments ──
export interface FormScoreEntry {
  fieldId: string
  value: string | number
}

// ── Feedback (post-test feedback by participant) ──
export interface FeedbackAnswer {
  fieldId: string
  value: string | number
}

export interface FeedbackSubmission {
  id: string
  classId: string
  inClassId: string
  categoryId: string
  formAssessmentId: string
  participantId: string
  answers: FeedbackAnswer[]
  submittedAt: string
}

export interface Assessment {
  id: string
  classId: string
  trainingMethodId: string
  methodEntityId?: string
  categoryId?: string
  raterId: string
  participantId: string
  formAssessmentId: string
  testId?: string
  scores: FormScoreEntry[]
  notes: string
  normalizedScore: number
  createdAt: string
  completedAt?: string
}

// ── Progress ──
export interface LGI {
  participantId: string
  inClassId: string
  preTestScore: number
  postTestScore: number
  lgiValue: number
}

export interface InstructorRaport {
  id: string
  instructorId: string
  month: number // 1-12
  year: number
  status: 'draft' | 'published'
  publishedAt?: string
  publishedBy?: string
  qualitativeAnalysis: string
  quantitativeData: {
    lgi: {
      programTypeName: string
      lgiValue: number // Average LGI of all materis in this program type
       materiLgis: {
         materiName: string
         lgiValue: number
         avgPreScore: number
         avgPostScore: number
       }[]

    }[]
    completionRate: number // percentage
    passRate: number // percentage
    feedbackAverage: {
      sectionName: string
      averageScore: number
    }[] // exactly 6 sections
  }
  createdAt: string
  createdBy: string
}

export interface ParticipantProgress {
  participantId: string
  classId: string
  methodId: string
  methodType: string
  status: 'pending' | 'inProgress' | 'completed' | 'passed' | 'failed' | 'remedial'
  score?: number
}

// ── Transcript ──
export interface TranscriptEntry {
  methodTitle: string
  methodType: string
  weight: number
  score: number
  weightedScore: number
  passStatus: string
}

export interface Transcript {
  participantId: string
  classId: string
  entries: TranscriptEntry[]
  totalWeightedScore: number
  overallPassStatus: 'pass' | 'fail'
}

// ── Remedial ──
export interface Remedial {
  id: string
  participantId: string
  classId: string
  trainingMethodId: string
  methodType: string
  status: 'assigned' | 'inProgress' | 'completed'
  score?: number
  assignedAt: string
  completedAt?: string
}

// ── Uploaded Files ──
export type UploadFileType = 'slide' | 'pdf' | 'video' | 'link' | 'other'

export interface UploadedFile {
  id: string
  curriculumItemId: string
  participantId: string
  classId: string
  fileType: UploadFileType
  fileName: string
  fileUrl: string
  description: string
  submittedAt: string
}

// ── Audit Log ──
export interface AuditLogEntry {
  id: string
  userId: string
  userName: string
  userRole: Role
  action: string
  resource: string
  resourceId: string
  details: string
  timestamp: string
}
