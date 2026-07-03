import type {
  User,
  Test,
  Question,
  Materi,
  MateriMediaType,
  FormAssessment,
  FormField,
  FormSection,
  FormSectionItem,
  InClass,
  MateriCategory,
  Curriculum,
  CurriculumItem,
  Class,
  TestAttempt,
  Answer,
  InClassActivityCompletion,
  FeedbackSubmission,
  FeedbackAnswer,
  InstructorRaport,
  ProgramType,
} from '@/types'

// ── 80 New Participants (u30-u109) ──
export const newUsers: User[] = []
const namePool = [
  'Agus Wijaya', 'Dewi Sartika', 'Eko Susanto', 'Fitri Handayani', 'Gunawan Prasetyo',
  'Hesti Purnama', 'Irfan Maulana', 'Juwita Sari', 'Kurniawan Saputra', 'Lestari Dewi',
  'Mulyono Setiawan', 'Nurul Hidayah', 'Oki Permana', 'Putri Utami', 'Qori Aisyah',
  'Rizki Firmansyah', 'Sri Wahyuni', 'Teguh Santoso', 'Umi Kalsum', 'Vina Agustina',
  'Wahyu Pratama', 'Yuni Astuti', 'Zainal Arifin', 'Bambang Supriyadi', 'Cici Rahmawati',
  'Doni Setiawan', 'Endang Sulastri', 'Fajar Nurdiansyah', 'Gita Pramesti', 'Hendra Lesmana',
  'Indah Permata', 'Joko Purwanto', 'Karina Adista', 'Lukman Hakim', 'Mega Susanti',
  'Novi Andriani', 'Otto Hidayat', 'Puji Lestari', 'Rama Dhanu', 'Siska Wulandari',
  'Taufik Nugroho', 'Utami Dewi', 'Vicky Pratama', 'Winda Permata', 'Xaverius Rudi',
  'Yoga Saputra', 'Zahra Alfira', 'Adi Purnomo', 'Bella Safitri', 'Candra Wijaya',
  'Dina Marlina', 'Edi Kusnadi', 'Fara Diba', 'Gilang Ramadhan', 'Hana Safira',
  'Intan Nuraini', 'Jefri Ardiansyah', 'Kiki Amalia', 'Leonardo Situmorang', 'Mira Wati',
  'Nanda Pratama', 'Olivia Hernanda', 'Prayoga Adi', 'Ratna Sari', 'Sandy Gunawan',
  'Tiara Maharani', 'Ujang Kosasih', 'Vera Octaviani', 'Wildan Fauzi', 'Yanti Susilowati',
  'Arif Rachman', 'Berliana Putri', 'Cahyo Nugroho', 'Dian Kurniawan', 'Eka Pratiwi',
  'Farhan Syahputra', 'Galuh Puspita', 'Haris Munandar', 'Ika Rahmawati', 'Jaka Sulistyo',
]
for (let i = 0; i < 80; i++) {
  const id = `u${30 + i}`
  const name = namePool[i] || `Participant ${id}`
  newUsers.push({
    id,
    email: `${id}@gacoan.id`,
    password: 'password123',
    name,
    role: 'participant',
  })
}

// ── Tests ──
// ic_mar (TOS, Communication Basics): t30-t37 (4 cats × 2)
// ic_apr (SOS, Leadership): t38-t45
// ic_may (SJPH, Financial Reporting): t46-t53
// ic_jun (TOS, Advanced Communication): t54-t61

function makeQuestions(label: string): Question[] {
  return [
    { id: `${label}_q1`, type: 'mcq' as const, text: `Question 1 for ${label}`, points: 10,
      options: [{ id: `${label}_q1a`, text: 'Option A', isCorrect: true }, { id: `${label}_q1b`, text: 'Option B', isCorrect: false }, { id: `${label}_q1c`, text: 'Option C', isCorrect: false }] },
    { id: `${label}_q2`, type: 'mcq' as const, text: `Question 2 for ${label}`, points: 10,
      options: [{ id: `${label}_q2a`, text: 'Option X', isCorrect: false }, { id: `${label}_q2b`, text: 'Option Y', isCorrect: true }, { id: `${label}_q2c`, text: 'Option Z', isCorrect: false }] },
    { id: `${label}_q3`, type: 'mcq' as const, text: `Question 3 for ${label}`, points: 10,
      options: [{ id: `${label}_q3a`, text: 'Option P', isCorrect: false }, { id: `${label}_q3b`, text: 'Option Q', isCorrect: false }, { id: `${label}_q3c`, text: 'Option R', isCorrect: true }] },
  ]
}

export const newTests: Test[] = []
const testLabels = [
  // ic_mar: 4 categories × 2 = 8 tests
  'mar_cat1_pre', 'mar_cat1_post', 'mar_cat2_pre', 'mar_cat2_post',
  'mar_cat3_pre', 'mar_cat3_post', 'mar_cat4_pre', 'mar_cat4_post',
  // ic_apr: 8 tests
  'apr_cat1_pre', 'apr_cat1_post', 'apr_cat2_pre', 'apr_cat2_post',
  'apr_cat3_pre', 'apr_cat3_post', 'apr_cat4_pre', 'apr_cat4_post',
  // ic_may: 8 tests
  'may_cat1_pre', 'may_cat1_post', 'may_cat2_pre', 'may_cat2_post',
  'may_cat3_pre', 'may_cat3_post', 'may_cat4_pre', 'may_cat4_post',
  // ic_jun: 8 tests
  'jun_cat1_pre', 'jun_cat1_post', 'jun_cat2_pre', 'jun_cat2_post',
  'jun_cat3_pre', 'jun_cat3_post', 'jun_cat4_pre', 'jun_cat4_post',
]
testLabels.forEach((label, idx) => {
  newTests.push({
    id: `t${30 + idx}`,
    title: `Test - ${label}`,
    description: `Auto-generated test for ${label}`,
    timeLimit: 30,
    randomize: false,
    questions: makeQuestions(`t${30 + idx}`),
    createdBy: 'u5',
    createdAt: `2026-03-01T08:00:00Z`,
  })
})

// ── Materi ──
export const newMateris: Materi[] = []
const materiLabels = [
  'mar_m1', 'mar_m2', 'mar_m3', 'mar_m4', 'mar_m5', 'mar_m6', 'mar_m7', 'mar_m8',
  'apr_m1', 'apr_m2', 'apr_m3', 'apr_m4', 'apr_m5', 'apr_m6', 'apr_m7', 'apr_m8',
  'may_m1', 'may_m2', 'may_m3', 'may_m4', 'may_m5', 'may_m6', 'may_m7', 'may_m8',
  'jun_m1', 'jun_m2', 'jun_m3', 'jun_m4', 'jun_m5', 'jun_m6', 'jun_m7', 'jun_m8',
]
const mediaTypes: MateriMediaType[] = ['pdf', 'slide', 'video', 'h5p']
materiLabels.forEach((label, idx) => {
  newMateris.push({
    id: `m${30 + idx}`,
    title: `Materi - ${label}`,
    type: mediaTypes[idx % 4]!,
    embedUrl: `https://example.com/${label}`,
    description: `Description for ${label}`,
    createdBy: 'u5',
    createdAt: '2026-03-01T08:00:00Z',
  })
})

// ── Feedback Forms (sections-based) ──
const sectionRefs = [
  { stId: 'st1', name: 'Communication' },
  { stId: 'st2', name: 'Time Management' },
  { stId: 'st3', name: 'Data Analyst' },
  { stId: 'st4', name: 'Presentation' },
  { stId: 'st5', name: 'Food Safety/CAPA' },
]

function makeFeedbackForm(id: string, title: string): FormAssessment {
  const sections: FormSection[] = sectionRefs.map((sr, si) => {
    const items: FormSectionItem[] = []
    for (let qi = 0; qi < 7; qi++) {
      const itemId = `${id}_${sr.stId}_q${qi + 1}`
      items.push({
        id: itemId,
        label: `${sr.name} - Question ${qi + 1}`,
        itemType: 'scale',
        weight: 1,
        point: 5,
        scaleMin: 1,
        scaleMax: 5,
        scaleStep: 1,
      })
    }
    return {
      id: `${id}_sec${si + 1}`,
      title: sr.name,
      sectionTypeId: sr.stId,
      weight: 1,
      items,
    }
  })

  return {
    id,
    title,
    description: `Feedback form for ${title}`,
    fields: [],
    sections,
    typeId: 'tmt10',
    createdBy: 'u5',
    createdAt: '2026-03-01T08:00:00Z',
  }
}

export const newFormAssessments: FormAssessment[] = [
  makeFeedbackForm('fbf4', 'Communication Basics Feedback'),
  makeFeedbackForm('fbf5', 'Leadership Skills Feedback'),
  makeFeedbackForm('fbf6', 'Financial Reporting Feedback'),
  makeFeedbackForm('fbf7', 'Advanced Communication Feedback'),
]

// ── InClasses ──
const testIdBase = 30
const materiIdBase = 30
const formIdBase = 4

function makeInClass(
  id: string,
  title: string,
  description: string,
  cats: { name: string; weight: number; mtId: string }[],
  catOffset: number,
): InClass {
  const categories: MateriCategory[] = cats.map((cat, ci) => {
    const catIdx = catOffset + ci
    const preTestId = `t${testIdBase + catIdx * 2}`
    const postTestId = `t${testIdBase + catIdx * 2 + 1}`
    const m1 = `m${materiIdBase + catIdx * 2}`
    const m2 = `m${materiIdBase + catIdx * 2 + 1}`
    return {
      id: `${id}_cat${ci + 1}`,
      name: cat.name,
      weight: cat.weight,
      inClassId: id,
      materiTypeId: cat.mtId,
      preTestId,
      postTestId,
      materiIds: [m1, m2],
      feedbackFormId: `fbf${formIdBase + catOffset / 4}`,
    }
  })

  return {
    id,
    title,
    description,
    categories,
    createdBy: 'u5',
    createdAt: '2026-03-01T08:00:00Z',
  }
}

export const newInClasses: InClass[] = [
  makeInClass('ic4', 'Communication Basics', 'Basic communication skills module', [
    { name: 'Verbal Communication', weight: 30, mtId: 'mt1' },
    { name: 'Written Communication', weight: 25, mtId: 'mt1' },
    { name: 'Interpersonal Skills', weight: 25, mtId: 'mt2' },
    { name: 'Presentation Basics', weight: 20, mtId: 'mt1' },
  ], 0),
  makeInClass('ic5', 'Leadership Skills', 'Core leadership and management skills', [
    { name: 'Vision & Direction', weight: 30, mtId: 'mt1' },
    { name: 'Delegation', weight: 25, mtId: 'mt2' },
    { name: 'Mentoring', weight: 25, mtId: 'mt2' },
    { name: 'Conflict Resolution', weight: 20, mtId: 'mt2' },
  ], 4),
  makeInClass('ic6', 'Financial Reporting', 'Financial statement analysis and reporting', [
    { name: 'Data Analysis', weight: 30, mtId: 'mt3' },
    { name: 'Financial Statements', weight: 25, mtId: 'mt3' },
    { name: 'Reporting Tools', weight: 25, mtId: 'mt3' },
    { name: 'Compliance', weight: 20, mtId: 'mt2' },
  ], 8),
  makeInClass('ic7', 'Advanced Communication', 'Advanced negotiation and persuasion', [
    { name: 'Negotiation', weight: 30, mtId: 'mt1' },
    { name: 'Public Speaking', weight: 25, mtId: 'mt1' },
    { name: 'Persuasion', weight: 25, mtId: 'mt1' },
    { name: 'Facilitation', weight: 20, mtId: 'mt2' },
  ], 12),
]

// ── Curricula ──
export const newCurricula: Curriculum[] = [
  {
    id: 'c_mar',
    title: 'Communication Fundamentals Program',
    description: 'TOS program covering communication basics and advanced communication',
    programTypeId: 'pt1',
    passingThreshold: 70,
    immutable: true,
    items: [
      { id: 'ci_mar', order: 1, trainingMethodType: 'inClass', contentId: 'ic4', weight: 100, passingScore: 70 },
    ],
    createdBy: 'u5',
    createdAt: '2026-03-01T08:00:00Z',
  },
  {
    id: 'c_apr',
    title: 'Leadership Development Program',
    description: 'SOS program for leadership skills',
    programTypeId: 'pt2',
    passingThreshold: 70,
    immutable: true,
    items: [
      { id: 'ci_apr', order: 1, trainingMethodType: 'inClass', contentId: 'ic5', weight: 100, passingScore: 70 },
    ],
    createdBy: 'u5',
    createdAt: '2026-04-01T08:00:00Z',
  },
  {
    id: 'c_may',
    title: 'Financial Reporting Program',
    description: 'SJPH program for financial analysis and reporting',
    programTypeId: 'pt3',
    passingThreshold: 70,
    immutable: true,
    items: [
      { id: 'ci_may', order: 1, trainingMethodType: 'inClass', contentId: 'ic6', weight: 100, passingScore: 70 },
    ],
    createdBy: 'u5',
    createdAt: '2026-05-01T08:00:00Z',
  },
  {
    id: 'c_jun',
    title: 'Advanced Communication Program',
    description: 'TOS program for advanced communication skills',
    programTypeId: 'pt1',
    passingThreshold: 70,
    immutable: true,
    items: [
      { id: 'ci_jun', order: 1, trainingMethodType: 'inClass', contentId: 'ic7', weight: 100, passingScore: 70 },
    ],
    createdBy: 'u5',
    createdAt: '2026-06-01T08:00:00Z',
  },
]

// ── Classes (8 completed) ──
const classDefs: {
  id: string; instructorId: string; currId: string; ptId: string;
  month: number; participants: string[]
}[] = [
  { id: 'cl_mar_u2',  instructorId: 'u2',  currId: 'c_mar', ptId: 'pt1', month: 3, participants: [] },
  { id: 'cl_mar_u13', instructorId: 'u13', currId: 'c_mar', ptId: 'pt1', month: 3, participants: [] },
  { id: 'cl_apr_u2',  instructorId: 'u2',  currId: 'c_apr', ptId: 'pt2', month: 4, participants: [] },
  { id: 'cl_apr_u13', instructorId: 'u13', currId: 'c_apr', ptId: 'pt2', month: 4, participants: [] },
  { id: 'cl_may_u2',  instructorId: 'u2',  currId: 'c_may', ptId: 'pt3', month: 5, participants: [] },
  { id: 'cl_may_u13', instructorId: 'u13', currId: 'c_may', ptId: 'pt3', month: 5, participants: [] },
  { id: 'cl_jun_u2',  instructorId: 'u2',  currId: 'c_jun', ptId: 'pt1', month: 6, participants: [] },
  { id: 'cl_jun_u13', instructorId: 'u13', currId: 'c_jun', ptId: 'pt1', month: 6, participants: [] },
]

let pIdx = 0
for (const def of classDefs) {
  for (let i = 0; i < 10; i++) {
    def.participants.push(`u${30 + pIdx++}`)
  }
}

export const newClasses: Class[] = classDefs.map((def) => {
  const monthStr = String(def.month).padStart(2, '0')
  return {
    id: def.id,
    name: `Completed Class - ${def.id}`,
    programTypeId: def.ptId,
    curriculumId: def.currId,
    instructorId: def.instructorId,
    startDate: `2026-${monthStr}-01`,
    endDate: `2026-${monthStr}-28`,
    status: 'completed',
    participants: def.participants,
    raters: [],
    createdBy: 'u5',
    createdAt: `2026-${monthStr}-01T08:00:00Z`,
  }
})

// Seeded random generator for deterministic values
let seed = 42
function seededRandom(): number {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}

export function applyRaportMockData(
  usersArr: User[],
  testsArr: Test[],
  materisArr: Materi[],
  formAssessmentsArr: FormAssessment[],
  inClassesArr: InClass[],
  curriculaArr: Curriculum[],
  classesArr: Class[],
  instructorRaportsArr: InstructorRaport[],
  testAttemptsArr: TestAttempt[],
  activityCompletionsArr: InClassActivityCompletion[],
  feedbackSubmissionsArr: FeedbackSubmission[],
  programTypesArr: ProgramType[],
): void {
  // Push infrastructure data
  usersArr.push(...newUsers)
  testsArr.push(...newTests)
  materisArr.push(...newMateris)
  formAssessmentsArr.push(...newFormAssessments)
  inClassesArr.push(...newInClasses)
  curriculaArr.push(...newCurricula)
  classesArr.push(...newClasses)

  // Clear pre-seeded reports — they will be regenerated below
  instructorRaportsArr.length = 0

  // Generate transactional data
  const allInClasses = [...inClassesArr]
  const allCurricula = [...curriculaArr]
  const allForms = [...formAssessmentsArr]
  const allProgramTypes = [...programTypesArr]

  for (const cls of newClasses) {
    const curr = allCurricula.find((c) => c.id === cls.curriculumId)
    if (!curr) continue

    const start = new Date(cls.startDate)
    const month = start.getMonth() + 1
    const year = start.getFullYear()

    for (const currItem of curr.items) {
      if (currItem.trainingMethodType !== 'inClass') continue
      const ic = allInClasses.find((i) => i.id === currItem.contentId)
      if (!ic) continue

      for (const cat of ic.categories) {
        for (const pId of cls.participants) {
          // --- Test Attempts ---
          const preScore = Math.floor(seededRandom() * 50) + 40
          const postScore = Math.min(95, preScore + Math.floor(seededRandom() * 30) + 10)

          const preDay = Math.floor(seededRandom() * 5) + 3
          const postDay = Math.floor(seededRandom() * 5) + 15
          const m1Day = Math.floor(seededRandom() * 3) + preDay + 1
          const m2Day = Math.floor(seededRandom() * 3) + m1Day + 1
          const fbDay = Math.floor(seededRandom() * 3) + 22

          const fmt = (d: number) =>
            `${year}-${String(month).padStart(2, '0')}-${String(Math.min(d, 28)).padStart(2, '0')}`

          const preDate = `${fmt(preDay)}T09:00:00Z`
          const postDate = `${fmt(postDay)}T09:00:00Z`

          testAttemptsArr.push({
            id: `ta_${cls.id}_${pId}_${cat.id}_pre`,
            testId: cat.preTestId,
            participantId: pId,
            classId: cls.id,
            inClassId: ic.id,
            categoryId: cat.id,
            testType: 'preTest',
            attemptNumber: 1,
            answers: [],
            score: preScore,
            totalPoints: 30,
            normalizedScore: preScore,
            startedAt: preDate,
            completedAt: preDate,
            status: 'completed',
          })

          testAttemptsArr.push({
            id: `ta_${cls.id}_${pId}_${cat.id}_post`,
            testId: cat.postTestId,
            participantId: pId,
            classId: cls.id,
            inClassId: ic.id,
            categoryId: cat.id,
            testType: 'postTest',
            attemptNumber: 1,
            answers: [],
            score: postScore,
            totalPoints: 30,
            normalizedScore: postScore,
            startedAt: postDate,
            completedAt: postDate,
            status: 'completed',
          })

          // --- Activity Completions ---
          const m1Date = `${fmt(m1Day)}T09:00:00Z`
          const m2Date = `${fmt(m2Day)}T09:00:00Z`

          activityCompletionsArr.push(
            { id: `iac_${cls.id}_${pId}_${cat.id}_pre`, participantId: pId, classId: cls.id, inClassId: ic.id, categoryId: cat.id, activityType: 'preTest', refId: cat.preTestId!, completedAt: preDate },
            { id: `iac_${cls.id}_${pId}_${cat.id}_m1`, participantId: pId, classId: cls.id, inClassId: ic.id, categoryId: cat.id, activityType: 'materi', refId: cat.materiIds[0]!, completedAt: m1Date },
            { id: `iac_${cls.id}_${pId}_${cat.id}_m2`, participantId: pId, classId: cls.id, inClassId: ic.id, categoryId: cat.id, activityType: 'materi', refId: cat.materiIds[1]!, completedAt: m2Date },
            { id: `iac_${cls.id}_${pId}_${cat.id}_post`, participantId: pId, classId: cls.id, inClassId: ic.id, categoryId: cat.id, activityType: 'postTest', refId: cat.postTestId!, completedAt: postDate },
          )

          // --- Feedback Submission ---
          if (cat.feedbackFormId) {
            const fbDate = `${fmt(fbDay)}T10:00:00Z`
            const form = allForms.find((f) => f.id === cat.feedbackFormId)
            if (form && form.sections) {
              const answers: FeedbackAnswer[] = []
              for (const section of form.sections) {
                for (const item of section.items) {
                  answers.push({ fieldId: item.id, value: Math.floor(seededRandom() * 3) + 3 })
                }
              }
              feedbackSubmissionsArr.push({
                id: `fb_${cls.id}_${pId}_${cat.id}`,
                classId: cls.id,
                inClassId: ic.id,
                categoryId: cat.id,
                formAssessmentId: cat.feedbackFormId,
                participantId: pId,
                answers,
                submittedAt: fbDate,
              })
            }
          }
        }
      }
    }
  }

  // ── Auto-generate reports from calculated data ──
  function dimDate(d: string, m: number, y: number): boolean {
    const dt = new Date(d)
    return dt.getMonth() + 1 === m && dt.getFullYear() === y
  }

  function getClasses(instId: string, m: number, y: number): Class[] {
    const target = new Date(y, m - 1, 1)
    const nextM = new Date(y, m, 1)
    return classesArr.filter((c) =>
      c.instructorId === instId &&
      c.status === 'completed' &&
      new Date(c.startDate) < nextM &&
      new Date(c.endDate) >= target
    )
  }

  function calcLGI(instId: string, m: number, y: number) {
    const clsList = getClasses(instId, m, y)
    const inClsIds: string[] = []
    for (const cl of clsList) {
      const cur = curriculaArr.find((cu) => cu.id === cl.curriculumId)
      cur?.items.forEach((it) => { if (it.trainingMethodType === 'inClass') inClsIds.push(it.contentId) })
    }
    const byProg: Record<string, Class[]> = {}
    clsList.forEach((c) => { if (!byProg[c.programTypeId]) byProg[c.programTypeId] = []; byProg[c.programTypeId]!.push(c) })

    const result: any[] = []
    for (const [ptId, pCls] of Object.entries(byProg)) {
      const ptName = allProgramTypes.find((p) => p.id === ptId)?.name || ptId
      const mMaps: Record<string, { name: string; pre: number[]; post: number[] }> = {}

      for (const cl of pCls) {
        for (const icId of inClsIds) {
          const ic = inClassesArr.find((i) => i.id === icId)
          if (!ic) continue
          for (const cat of ic.categories) {
            for (const mId of cat.materiIds) {
              if (!mMaps[mId]) {
                mMaps[mId] = { name: materisArr.find((m) => m.id === mId)?.title || mId, pre: [], post: [] }
              }
              for (const pId of cl.participants) {
                const pre = testAttemptsArr.filter((t) => t.participantId === pId && t.classId === cl.id && t.inClassId === icId && t.categoryId === cat.id && t.testType === 'preTest' && t.status === 'completed' && t.completedAt && dimDate(t.completedAt, m, y)).sort((a, b) => (b.normalizedScore || 0) - (a.normalizedScore || 0))
                const post = testAttemptsArr.filter((t) => t.participantId === pId && t.classId === cl.id && t.inClassId === icId && t.categoryId === cat.id && t.testType === 'postTest' && t.status === 'completed' && t.completedAt && dimDate(t.completedAt, m, y)).sort((a, b) => (b.normalizedScore || 0) - (a.normalizedScore || 0))
                if (pre.length > 0 && post.length > 0) {
                  mMaps[mId]!.pre.push(pre[0]!.normalizedScore || 0)
                  mMaps[mId]!.post.push(post[0]!.normalizedScore || 0)
                }
              }
            }
          }
        }
      }

      const mlgis: any[] = []
      for (const [, d] of Object.entries(mMaps)) {
        if (d.pre.length === 0) continue
        const avgPre = d.pre.reduce((a, b) => a + b, 0) / d.pre.length
        const avgPost = d.post.reduce((a, b) => a + b, 0) / d.post.length
        const denom = 100 - avgPre
        mlgis.push({
          materiName: d.name,
          lgiValue: denom !== 0 ? Math.round(((avgPost - avgPre) / denom) * 100) / 100 : 0,
          avgPreScore: Math.round(avgPre * 10) / 10,
          avgPostScore: Math.round(avgPost * 10) / 10,
        })
      }
      if (mlgis.length > 0) {
        const avg = mlgis.reduce((a, b) => a + b.lgiValue, 0) / mlgis.length
        result.push({ programTypeName: ptName, lgiValue: Math.round(avg * 100) / 100, materiLgis: mlgis })
      }
    }
    return result
  }

  function calcCompletion(instId: string, m: number, y: number): number {
    const clsList = getClasses(instId, m, y)
    let total = 0, done = 0
    for (const cl of clsList) {
      total += cl.participants.length
      for (const pId of cl.participants) {
        let allOk = true
        const inClsIds: string[] = []
        const cur = curriculaArr.find((cu) => cu.id === cl.curriculumId)
        cur?.items.forEach((it) => { if (it.trainingMethodType === 'inClass') inClsIds.push(it.contentId) })
        for (const icId of inClsIds) {
          const ic = inClassesArr.find((i) => i.id === icId)
          if (!ic) continue
          for (const cat of ic.categories) {
            if (!cat.preTestId || !cat.postTestId || cat.materiIds.length === 0) continue
            const comps = activityCompletionsArr.filter((a) => a.participantId === pId && a.classId === cl.id && a.inClassId === icId && a.categoryId === cat.id && dimDate(a.completedAt, m, y))
            const fbs = feedbackSubmissionsArr.filter((fs) => fs.participantId === pId && fs.classId === cl.id && fs.inClassId === icId && fs.categoryId === cat.id && dimDate(fs.submittedAt, m, y))
            const hasPre = comps.some((a) => a.activityType === 'preTest')
            const hasPost = comps.some((a) => a.activityType === 'postTest')
            const allMat = cat.materiIds.every((mid) => comps.some((a) => a.activityType === 'materi' && a.refId === mid))
            const hasFb = cat.feedbackFormId ? fbs.some((f) => f.formAssessmentId === cat.feedbackFormId) : true
            if (!hasPre || !hasPost || !allMat || !hasFb) { allOk = false; break }
          }
          if (!allOk) break
        }
        if (allOk) done++
      }
    }
    return total > 0 ? Math.round((done / total) * 100 * 100) / 100 : 0
  }

  function calcPass(instId: string, m: number, y: number): number {
    const clsList = getClasses(instId, m, y)
    let passed = 0, completed = 0
    for (const cl of clsList) {
      const cur = curriculaArr.find((c) => c.id === cl.curriculumId)
      if (!cur) continue
      for (const item of cur.items) {
        if (item.trainingMethodType !== 'inClass') continue
        const ic = inClassesArr.find((i) => i.id === item.contentId)
        if (!ic) continue
        for (const cat of ic.categories) {
          for (const pId of cl.participants) {
            const comps = activityCompletionsArr.filter((a) => a.participantId === pId && a.classId === cl.id && a.inClassId === ic.id && a.categoryId === cat.id && dimDate(a.completedAt, m, y))
            const fbs = feedbackSubmissionsArr.filter((fs) => fs.participantId === pId && fs.classId === cl.id && fs.inClassId === ic.id && fs.categoryId === cat.id && dimDate(fs.submittedAt, m, y))
            const hasPre = comps.some((a) => a.activityType === 'preTest')
            const hasPost = comps.some((a) => a.activityType === 'postTest')
            const allMat = cat.materiIds.every((mid) => comps.some((a) => a.activityType === 'materi' && a.refId === mid))
            const hasFb = cat.feedbackFormId ? fbs.some((f) => f.formAssessmentId === cat.feedbackFormId) : true
            if (hasPre && hasPost && allMat && hasFb) {
              completed++
              const posts = testAttemptsArr.filter((t) => t.participantId === pId && t.classId === cl.id && t.inClassId === ic.id && t.categoryId === cat.id && t.testType === 'postTest' && t.status === 'completed')
              if (posts.length > 0 && Math.max(...posts.map((t) => t.normalizedScore || 0)) >= item.passingScore) passed++
            }
          }
        }
      }
    }
    return completed > 0 ? Math.round((passed / completed) * 100 * 100) / 100 : 0
  }

  function calcFeedbackAvg(instId: string, m: number, y: number): { sectionName: string; averageScore: number }[] {
    const clsList = getClasses(instId, m, y)
    const bySectionName: Record<string, number[]> = {}

    for (const cl of clsList) {
      const inClsIds: string[] = []
      const cur = curriculaArr.find((cu) => cu.id === cl.curriculumId)
      cur?.items.forEach((it) => { if (it.trainingMethodType === 'inClass') inClsIds.push(it.contentId) })
      for (const icId of inClsIds) {
        const ic = inClassesArr.find((i) => i.id === icId)
        if (!ic) continue
        for (const cat of ic.categories) {
          if (!cat.feedbackFormId) continue
          const subs = feedbackSubmissionsArr.filter((fs) => fs.participantId && cl.participants.includes(fs.participantId) && fs.classId === cl.id && fs.inClassId === icId && fs.categoryId === cat.id && fs.formAssessmentId === cat.feedbackFormId && dimDate(fs.submittedAt, m, y))
          if (subs.length === 0) continue
          const form = formAssessmentsArr.find((f) => f.id === cat.feedbackFormId)
          if (!form) continue
          for (const sub of subs) {
            // Handle sections-based forms (new)
            if (form.sections && form.sections.length > 0) {
              for (const section of form.sections) {
                const sectName = section.title
                for (const answer of sub.answers) {
                  const item = section.items.find((it) => it.id === answer.fieldId)
                  if (item && (item.itemType === 'scale')) {
                    if (!bySectionName[sectName]) bySectionName[sectName] = []
                    bySectionName[sectName]!.push(Number(answer.value))
                  }
                }
              }
            }
            // Handle fields-based forms (legacy)
            if (form.fields && form.fields.length > 0) {
              for (const answer of sub.answers) {
                const field = form.fields.find((f) => f.id === answer.fieldId)
                if (field && field.type === 'rating') {
                  if (!bySectionName[field.label]) bySectionName[field.label] = []
                  bySectionName[field.label]!.push(Number(answer.value))
                }
              }
            }
          }
        }
      }
    }

    const result = Object.entries(bySectionName).map(([name, vals]) => ({
      sectionName: name,
      averageScore: vals.length > 0 ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10 : 0,
    }))
    while (result.length < 6) result.push({ sectionName: '', averageScore: 0 })
    if (result.length > 6) result.length = 6
    return result.map((s, i) => ({ sectionName: s.sectionName || `Aspect ${i + 1}`, averageScore: s.averageScore }))
  }

  const raportInstructors = ['u2', 'u13']
  const raportMonths = [3, 4, 5, 6]
  for (const instId of raportInstructors) {
    for (const rm of raportMonths) {
      const lgi = calcLGI(instId, rm, 2026)
      const cr = calcCompletion(instId, rm, 2026)
      const pr = calcPass(instId, rm, 2026)
      const fb = calcFeedbackAvg(instId, rm, 2026)
      if (lgi.length > 0 || cr > 0 || pr > 0) {
        instructorRaportsArr.push({
          id: `ir_${instId}_${rm}_2026`,
          instructorId: instId,
          month: rm,
          year: 2026,
          status: 'published',
          publishedAt: `2026-${String(rm).padStart(2, '0')}-28T23:59:59Z`,
          publishedBy: 'u5',
          qualitativeAnalysis: `Auto-generated report for ${instId} - ${String(rm).padStart(2, '0')}/2026`,
          quantitativeData: { lgi, completionRate: cr, passRate: pr, feedbackAverage: fb },
          createdAt: `2026-${String(rm).padStart(2, '0')}-01T08:00:00Z`,
          createdBy: 'u5',
        })
      }
    }
  }
}
