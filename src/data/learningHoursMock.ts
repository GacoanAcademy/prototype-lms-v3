import type {
  LHProgram,
  LHMateri,
  LHUser,
  LHActivityLog,
} from '@/types/learningHours'

export const lhPrograms: LHProgram[] = [
  { program_id: 'p1', name: 'Kitchen Fundamentals' },
  { program_id: 'p2', name: 'Food Safety & Hygiene' },
  { program_id: 'p3', name: 'Customer Service Excellence' },
  { program_id: 'p4', name: 'Leadership Development' },
  { program_id: 'p5', name: 'Inventory Management' },
]

export const lhMateri: LHMateri[] = [
  { materi_id: 'm1', program_id: 'p1', name: 'Knife Handling Basics', estimated_teaching_hours: 1.0 },
  { materi_id: 'm2', program_id: 'p1', name: 'Cooking Techniques', estimated_teaching_hours: 1.5 },
  { materi_id: 'm3', program_id: 'p1', name: 'Kitchen Equipment Safety', estimated_teaching_hours: 1.0 },
  { materi_id: 'm4', program_id: 'p2', name: 'HACCP Fundamentals', estimated_teaching_hours: 2.0 },
  { materi_id: 'm5', program_id: 'p2', name: 'Personal Hygiene Standards', estimated_teaching_hours: 1.0 },
  { materi_id: 'm6', program_id: 'p2', name: 'Allergen Management', estimated_teaching_hours: 1.5 },
  { materi_id: 'm7', program_id: 'p3', name: 'Communication Skills', estimated_teaching_hours: 1.5 },
  { materi_id: 'm8', program_id: 'p3', name: 'Handling Complaints', estimated_teaching_hours: 2.0 },
  { materi_id: 'm9', program_id: 'p3', name: 'Upselling Techniques', estimated_teaching_hours: 1.0 },
  { materi_id: 'm10', program_id: 'p4', name: 'Team Motivation', estimated_teaching_hours: 2.0 },
  { materi_id: 'm11', program_id: 'p4', name: 'Delegation Skills', estimated_teaching_hours: 1.5 },
  { materi_id: 'm12', program_id: 'p5', name: 'Stock Taking Procedures', estimated_teaching_hours: 1.5 },
  { materi_id: 'm13', program_id: 'p5', name: 'Supplier Management', estimated_teaching_hours: 2.0 },
  { materi_id: 'm14', program_id: 'p5', name: 'Waste Reduction', estimated_teaching_hours: 1.0 },
  { materi_id: 'm15', program_id: 'p1', name: 'Plating & Presentation', estimated_teaching_hours: 1.5 },
]

export const lhUsers: LHUser[] = [
  { user_id: 'u1', name: 'Budi Santoso', role: 'participant' },
  { user_id: 'u2', name: 'Siti Rahma', role: 'instructor' },
  { user_id: 'u3', name: 'Andi Wijaya', role: 'participant' },
  { user_id: 'u4', name: 'Rina Susanti', role: 'participant' },
  { user_id: 'u5', name: 'Dedi Kurniawan', role: 'participant' },
  { user_id: 'u6', name: 'Maya Putri', role: 'instructor' },
  { user_id: 'u7', name: 'Rudi Hartono', role: 'participant' },
  { user_id: 'u8', name: 'Dewi Lestari', role: 'instructor' },
  { user_id: 'u9', name: 'Fajar Nugroho', role: 'participant' },
  { user_id: 'u10', name: 'Lisa Agustina', role: 'participant' },
  { user_id: 'u11', name: 'Hendra Gunawan', role: 'instructor' },
  { user_id: 'u12', name: 'Yuni Astuti', role: 'participant' },
  { user_id: 'u13', name: 'Arif Setiawan', role: 'participant' },
  { user_id: 'u14', name: 'Ratna Sari', role: 'participant' },
  { user_id: 'u15', name: 'Bambang Prasetyo', role: 'instructor' },
  { user_id: 'u16', name: 'Citra Dewi', role: 'participant' },
  { user_id: 'u17', name: 'Eko Prasetyo', role: 'participant' },
  { user_id: 'u18', name: 'Fitri Handayani', role: 'participant' },
  { user_id: 'u19', name: 'Gilang Ramadhan', role: 'participant' },
  { user_id: 'u20', name: 'Hanifah Permata', role: 'participant' },
]

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

const rand = seededRandom(42)

function generateActivityLogs(): LHActivityLog[] {
  const logs: LHActivityLog[] = []
  let logId = 1

  const participants = lhUsers.filter((u) => u.role === 'participant')
  const instructors = lhUsers.filter((u) => u.role === 'instructor')

  const startDate = new Date('2026-06-01')
  const endDate = new Date('2026-08-19')
  const dayCount = Math.floor(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  )

  for (const program of lhPrograms) {
    const programMateri = lhMateri.filter(
      (m) => m.program_id === program.program_id,
    )

    for (const materi of programMateri) {
      for (const participant of participants) {
        if (rand() > 0.7) continue

        const sessionCount = Math.floor(rand() * 4) + 1
        for (let s = 0; s < sessionCount; s++) {
          const dayOffset = Math.floor(rand() * dayCount)
          const date = new Date(startDate)
          date.setDate(date.getDate() + dayOffset)
          const dateStr = date.toISOString().slice(0, 10)

          const materiDuration = Math.floor(rand() * 3600) + 600
          logs.push({
            log_id: `log${logId++}`,
            user_id: participant.user_id,
            role: 'participant',
            program_id: program.program_id,
            materi_id: materi.materi_id,
            activity_type: 'MATERI',
            duration_seconds: materiDuration,
            session_date: dateStr,
            completion_status: rand() > 0.3 ? 'COMPLETED' : 'IN_PROGRESS',
          })

          if (rand() > 0.4) {
            const testDuration = Math.floor(rand() * 1800) + 300
            logs.push({
              log_id: `log${logId++}`,
              user_id: participant.user_id,
              role: 'participant',
              program_id: program.program_id,
              materi_id: materi.materi_id,
              activity_type: 'TEST',
              duration_seconds: testDuration,
              session_date: dateStr,
              pass_status: rand() > 0.35 ? 'PASS' : 'FAIL',
            })
          }
        }
      }
    }
  }

  for (const instructor of instructors) {
    for (const program of lhPrograms) {
      if (rand() > 0.6) continue
      const programMateri = lhMateri.filter(
        (m) => m.program_id === program.program_id,
      )

      for (const materi of programMateri) {
        if (rand() > 0.5) continue

        const sessionCount = Math.floor(rand() * 3) + 1
        for (let s = 0; s < sessionCount; s++) {
          const dayOffset = Math.floor(rand() * dayCount)
          const date = new Date(startDate)
          date.setDate(date.getDate() + dayOffset)
          const dateStr = date.toISOString().slice(0, 10)

          const participantsCount = Math.floor(rand() * 10) + 5
          const participantsPassed = Math.floor(
            rand() * participantsCount * 0.4 + participantsCount * 0.5,
          )

          logs.push({
            log_id: `log${logId++}`,
            user_id: instructor.user_id,
            role: 'instructor',
            program_id: program.program_id,
            materi_id: materi.materi_id,
            activity_type: 'TEACHING_SESSION',
            duration_seconds: Math.floor(rand() * 5400) + 1800,
            session_date: dateStr,
            participants_count: participantsCount,
            participants_passed: participantsPassed,
          })
        }
      }
    }
  }

  return logs
}

export const lhActivityLogs: LHActivityLog[] = generateActivityLogs()
