import {
  classes,
  inClasses,
  testAttempts,
  inClassActivityCompletions,
  feedbackSubmissions,
  formAssessments,
  materis,
  curricula,
  programTypes,
} from '@/data/mockData'

export function getClassesByInstructorAndMonth(instructorId: string, month: number, year: number) {
  const targetDate = new Date(year, month - 1, 1)
  const nextMonthDate = new Date(year, month, 1)

  return classes.filter((c) => {
    const classStartDate = new Date(c.startDate)
    const classEndDate = new Date(c.endDate)
    return (
      c.instructorId === instructorId &&
      c.status === 'completed' &&
      classStartDate < nextMonthDate &&
      classEndDate >= targetDate
    )
  })
}

function getAllInClassIdsForClasses(classList: typeof classes) {
  const ids = new Set<string>()
  for (const cls of classList) {
    if (cls.curriculumId) {
      const curr = curricula.find((c) => c.id === cls.curriculumId)
      curr?.items.forEach((item) => {
        if (item.trainingMethodType === 'inClass') ids.add(item.contentId)
      })
    }
  }
  return Array.from(ids)
}

function getMonthDateRange(month: number, year: number) {
  const start = new Date(year, month - 1, 1)
  const end = new Date(year, month, 1)
  return { start, end }
}

function isDateInMonth(d: string | Date, month: number, year: number) {
  const date = new Date(d)
  return date.getMonth() + 1 === month && date.getFullYear() === year
}

export function calculateLGI(
  instructorId: string,
  month: number,
  year: number,
): {
  programTypeName: string
  lgiValue: number
  materiLgis: { materiName: string; lgiValue: number; avgPreScore: number; avgPostScore: number }[]
}[] {
  const instructorClasses = getClassesByInstructorAndMonth(instructorId, month, year)
  const inClassIds = getAllInClassIdsForClasses(instructorClasses)

  const classesByProgram: Record<string, typeof classes> = {}
  instructorClasses.forEach((c) => {
    if (!classesByProgram[c.programTypeId]) classesByProgram[c.programTypeId] = []
    classesByProgram[c.programTypeId]!.push(c)
  })

  const result: any[] = []

  for (const [programTypeId, classList] of Object.entries(classesByProgram)) {
    const pTypeName = programTypes.find((pt) => pt.id === programTypeId)?.name || programTypeId
    const materiMap: Record<
      string,
      { materiName: string; preScores: number[]; postScores: number[] }
    > = {}

    for (const cls of classList) {
      for (const inClassId of inClassIds) {
        const ic = inClasses.find((i) => i.id === inClassId)
        if (!ic) continue

        for (const cat of ic.categories) {
          for (const mId of cat.materiIds) {
            if (!materiMap[mId]) {
              const mName = materis.find((m) => m.id === mId)?.title || mId
              materiMap[mId] = { materiName: mName, preScores: [], postScores: [] }
            }

            for (const pId of cls.participants) {
              const preAttempt = testAttempts
                .filter(
                  (ta) =>
                    ta.participantId === pId &&
                    ta.classId === cls.id &&
                    ta.inClassId === inClassId &&
                    ta.categoryId === cat.id &&
                    ta.testType === 'preTest' &&
                    ta.status === 'completed' &&
                    ta.completedAt &&
                    isDateInMonth(ta.completedAt, month, year),
                )
                .sort((a, b) => (b.normalizedScore || 0) - (a.normalizedScore || 0))

              const postAttempt = testAttempts
                .filter(
                  (ta) =>
                    ta.participantId === pId &&
                    ta.classId === cls.id &&
                    ta.inClassId === inClassId &&
                    ta.categoryId === cat.id &&
                    ta.testType === 'postTest' &&
                    ta.status === 'completed' &&
                    ta.completedAt &&
                    isDateInMonth(ta.completedAt, month, year),
                )
                .sort((a, b) => (b.normalizedScore || 0) - (a.normalizedScore || 0))

              if (preAttempt.length > 0 && postAttempt.length > 0) {
                materiMap[mId]!.preScores.push(preAttempt[0]!.normalizedScore || 0)
                materiMap[mId]!.postScores.push(postAttempt[0]!.normalizedScore || 0)
              }
            }
          }
        }
      }
    }

    const materiLgis: any[] = []
    for (const [, data] of Object.entries(materiMap)) {
      if (data.preScores.length === 0) continue
      const avgPre = data.preScores.reduce((a, b) => a + b, 0) / data.preScores.length
      const avgPost = data.postScores.reduce((a, b) => a + b, 0) / data.postScores.length
      const denom = 100 - avgPre
      const lgiVal = denom !== 0 ? (avgPost - avgPre) / denom : 0
      materiLgis.push({
        materiName: data.materiName,
        lgiValue: Math.round(lgiVal * 100) / 100,
        avgPreScore: Math.round(avgPre * 10) / 10,
        avgPostScore: Math.round(avgPost * 10) / 10,
      })
    }

    if (materiLgis.length > 0) {
      const avgLgi = materiLgis.reduce((a, b) => a + b.lgiValue, 0) / materiLgis.length
      result.push({
        programTypeName: pTypeName,
        lgiValue: Math.round(avgLgi * 100) / 100,
        materiLgis,
      })
    }
  }

  return result
}

export function calculateCompletionRate(instructorId: string, month: number, year: number): number {
  const instructorClasses = getClassesByInstructorAndMonth(instructorId, month, year)
  let total = 0
  let completed = 0

  for (const cls of instructorClasses) {
    total += cls.participants.length

    for (const pId of cls.participants) {
      let allDone = true
      const inClassIds = getAllInClassIdsForClasses([cls])

      for (const inClassId of inClassIds) {
        const ic = inClasses.find((i) => i.id === inClassId)
        if (!ic) continue

        for (const cat of ic.categories) {
          if (!cat.preTestId || !cat.postTestId || cat.materiIds.length === 0) continue

          const completionsInPeriod = inClassActivityCompletions.filter(
            (a) =>
              a.participantId === pId &&
              a.classId === cls.id &&
              a.inClassId === inClassId &&
              a.categoryId === cat.id &&
              isDateInMonth(a.completedAt, month, year),
          )

          const fbInPeriod = feedbackSubmissions.filter(
            (fs) =>
              fs.participantId === pId &&
              fs.classId === cls.id &&
              fs.inClassId === inClassId &&
              fs.categoryId === cat.id &&
              isDateInMonth(fs.submittedAt, month, year),
          )

          const hasPre = completionsInPeriod.some((a) => a.activityType === 'preTest')
          const hasPost = completionsInPeriod.some((a) => a.activityType === 'postTest')
          const allMateri = cat.materiIds.every((mId) =>
            completionsInPeriod.some((a) => a.activityType === 'materi' && a.refId === mId),
          )
          const hasFb = cat.feedbackFormId
            ? fbInPeriod.some((f) => f.formAssessmentId === cat.feedbackFormId)
            : true

          if (!hasPre || !hasPost || !allMateri || !hasFb) {
            allDone = false
            break
          }
        }
        if (!allDone) break
      }
      if (allDone) completed++
    }
  }

  return total > 0 ? Math.round((completed / total) * 100 * 100) / 100 : 0
}

export function calculatePassRate(instructorId: string, month: number, year: number): number {
  const instructorClasses = getClassesByInstructorAndMonth(instructorId, month, year)
  let passed = 0
  let totalCompleted = 0

  for (const cls of instructorClasses) {
    const curr = curricula.find((c) => c.id === cls.curriculumId)
    if (!curr) continue

    for (const item of curr.items) {
      if (item.trainingMethodType !== 'inClass') continue
      const ic = inClasses.find((i) => i.id === item.contentId)
      if (!ic) continue

      for (const cat of ic.categories) {
        for (const pId of cls.participants) {
          const completionsInPeriod = inClassActivityCompletions.filter(
            (a) =>
              a.participantId === pId &&
              a.classId === cls.id &&
              a.inClassId === ic.id &&
              a.categoryId === cat.id &&
              isDateInMonth(a.completedAt, month, year),
          )

          const fbInPeriod = feedbackSubmissions.filter(
            (fs) =>
              fs.participantId === pId &&
              fs.classId === cls.id &&
              fs.inClassId === ic.id &&
              fs.categoryId === cat.id &&
              isDateInMonth(fs.submittedAt, month, year),
          )

          const hasPre = completionsInPeriod.some((a) => a.activityType === 'preTest')
          const hasPost = completionsInPeriod.some((a) => a.activityType === 'postTest')
          const allMateri = cat.materiIds.every((mId) =>
            completionsInPeriod.some((a) => a.activityType === 'materi' && a.refId === mId),
          )
          const hasFb = cat.feedbackFormId
            ? fbInPeriod.some((f) => f.formAssessmentId === cat.feedbackFormId)
            : true

          if (hasPre && hasPost && allMateri && hasFb) {
            totalCompleted++
            const postTests = testAttempts.filter(
              (ta) =>
                ta.participantId === pId &&
                ta.classId === cls.id &&
                ta.inClassId === ic.id &&
                ta.categoryId === cat.id &&
                ta.testType === 'postTest' &&
                ta.status === 'completed',
            )
            if (postTests.length > 0) {
              const best = Math.max(...postTests.map((t) => t.normalizedScore || 0))
              if (best >= item.passingScore) passed++
            }
          }
        }
      }
    }
  }

  return totalCompleted > 0 ? Math.round((passed / totalCompleted) * 100 * 100) / 100 : 0
}

export function calculateFeedbackAverage(
  instructorId: string,
  month: number,
  year: number,
): { sectionName: string; averageScore: number }[] {
  const instructorClasses = getClassesByInstructorAndMonth(instructorId, month, year)
  const scoresBySection: Record<string, number[]> = {}

  for (const cls of instructorClasses) {
    const inClassIds = getAllInClassIdsForClasses([cls])

    for (const inClassId of inClassIds) {
      const ic = inClasses.find((i) => i.id === inClassId)
      if (!ic) continue

      for (const cat of ic.categories) {
        if (!cat.feedbackFormId) continue

        const submissions = feedbackSubmissions.filter(
          (fs) =>
            fs.participantId &&
            cls.participants.includes(fs.participantId) &&
            fs.classId === cls.id &&
            fs.inClassId === inClassId &&
            fs.categoryId === cat.id &&
            fs.formAssessmentId === cat.feedbackFormId &&
            isDateInMonth(fs.submittedAt, month, year),
        )

        if (submissions.length === 0) continue

        const form = formAssessments.find((f) => f.id === cat.feedbackFormId)
        if (!form) continue

        for (const sub of submissions) {
          // Handle sections-based forms (new: fbf4-fbf7)
          if (form.sections && form.sections.length > 0) {
            for (const section of form.sections) {
              const sectionName = section.title
              for (const answer of sub.answers) {
                const item = section.items.find((it) => it.id === answer.fieldId)
                if (item && item.itemType === 'scale') {
                  if (!scoresBySection[sectionName]) scoresBySection[sectionName] = []
                  scoresBySection[sectionName]!.push(Number(answer.value))
                }
              }
            }
          }
          // Handle fields-based forms (legacy: fbf1-fbf3)
          if (form.fields && form.fields.length > 0) {
            for (const answer of sub.answers) {
              const field = form.fields.find((f) => f.id === answer.fieldId)
              if (!field || field.type !== 'rating') continue
              if (!scoresBySection[field.label]) scoresBySection[field.label] = []
              scoresBySection[field.label]!.push(Number(answer.value))
            }
          }
        }
      }
    }
  }

  const result = Object.entries(scoresBySection).map(([label, scores]) => ({
    sectionName: label,
    averageScore: scores.length > 0
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
      : 0,
  }))

  while (result.length < 6) {
    result.push({ sectionName: '', averageScore: 0 })
  }

  if (result.length > 6) result.length = 6

  return result.map((s, i) => ({
    sectionName: s.sectionName || `Aspect ${i + 1}`,
    averageScore: s.averageScore,
  }))
}
