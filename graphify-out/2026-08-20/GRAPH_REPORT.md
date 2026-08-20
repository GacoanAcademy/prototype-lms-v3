# Graph Report - prototype-lms-v3  (2026-08-19)

## Corpus Check
- 104 files · ~57,195 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 998 nodes · 961 edges · 94 communities (73 shown, 21 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fca2605e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- types/index.ts
- ClassForm.vue
- ClassProgressView.vue
- InClassRetakeView.vue
- InClassView.vue
- PRD: Learning Hours Dashboard (LMS - Academy Gacoan)
- mockData.ts
- FormAssessmentForm.vue
- devDependencies
- participant/FeedbackView.vue
- package.json
- admin/FeedbackView.vue
- Sidebar.vue
- mockRaportData.ts
- admin/InstructorRaportDetail.vue
- CurriculumForm.vue
- ScoreView.vue
- InClassTokenView.vue
- AssessmentForm.vue
- TestTakerView.vue
- TestForm.vue
- TrainingMethodForm.vue
- instructor/InstructorRaportDetail.vue
- tsconfig.app.json
- admin/ClassDetail.vue
- InClassForm.vue
- instructor/UploadsView.vue
- TestListView.vue
- InstructorRaportList.vue
- admin/UploadsView.vue
- UploadFileView.vue
- prototype
- App.vue
- raportCalculator.ts
- KnowledgeTestForm.vue
- KnowledgeTestResult.vue
- MateriForm.vue
- SectionTypeForm.vue
- AssessmentList.vue
- SubmissionView.vue
- ProgramTypeForm.vue
- instructor/ClassDetail.vue
- LoginView.vue
- admin/AuditLogView.vue
- CategoryTrainingMethodForm.vue
- MateriTypeForm.vue
- ProgramCategoryForm.vue
- audit/AuditLogView.vue
- ParticipantDashboard.vue
- TranscriptView.vue
- .prettierrc.json
- admin/ClassList.vue
- FormAssessmentList.vue
- SectionTypeList.vue
- InstructorRaportView.vue
- TestResultView.vue
- SpiderChart.vue
- CurriculumList.vue
- RaterDashboard.vue
- instructor/ClassList.vue
- KHSView.vue
- LGIView.vue
- ParticipantProgress.vue
- RemedialView.vue
- ProgramTypeList.vue
- TrainingMethodList.vue
- classMgmt/ClassList.vue
- tsconfig.json
- auth.ts
- CategoryTrainingMethodList.vue
- InClassList.vue
- KnowledgeTestList.vue
- MateriList.vue
- MateriTypeList.vue
- ProgramCategoryList.vue
- TestList.vue
- AdminDashboard.vue
- InstructorDashboard.vue
- SupervisorDashboard.vue
- ParticipantTab.vue
- learningHours.ts
- InstructorTab.vue
- learningHoursMock.ts
- DonutChart.vue
- HorizontalBarChart.vue
- TrendLineChart.vue
- graphify.js
- AGENTS.md

## God Nodes (most connected - your core abstractions)
1. `PRD: Learning Hours Dashboard (LMS - Academy Gacoan)` - 12 edges
2. `scripts` - 7 edges
3. `prototype` - 6 edges
4. `6. Tab 2: Participant` - 6 edges
5. `7. Tab 3: Instructor` - 6 edges
6. `getClassesByInstructorAndMonth()` - 5 edges
7. `isDateInMonth()` - 5 edges
8. `isActivityDone()` - 5 edges
9. `actLabel()` - 5 edges
10. `getAllInClassIdsForClasses()` - 4 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (94 total, 21 thin omitted)

### Community 0 - "types/index.ts"
Cohesion: 0.04
Nodes (55): Answer, Assessment, AuditLogEntry, Class, ClassStatus, Curriculum, CurriculumItem, DragDropItem (+47 more)

### Community 1 - "ClassForm.vue"
Cohesion: 0.04
Nodes (34): activeJourneyIndex, activeJourneyItem, assessmentAssessorAssignments, assessorSearchQueries, assessorTypes, AssignLeaf, categoryClass, completedAssessmentTestClasses (+26 more)

### Community 2 - "ClassProgressView.vue"
Cohesion: 0.05
Nodes (22): auth, bestAttemptScore(), classIdParam, cls, curriculum, expandedSteps, getTestAttempts(), ladder (+14 more)

### Community 3 - "InClassRetakeView.vue"
Cohesion: 0.07
Nodes (24): auth, classActivityTests, classOptions, getAttempts(), getClassActivityAttempts(), inClassOptions, logAttempts, logTitle (+16 more)

### Community 4 - "InClassView.vue"
Cohesion: 0.09
Nodes (25): activeCategory, activeCatIndex, actLabel(), auth, buildActivities(), catProgress(), classId, cls (+17 more)

### Community 5 - "PRD: Learning Hours Dashboard (LMS - Academy Gacoan)"
Cohesion: 0.07
Nodes (28): 10. Acceptance Criteria, 11. Out of Scope (Phase 1 Prototype), 1. Purpose, 2. Users, 3. Scope Note, 4. Information Architecture — 3 Tabs, 5.1 Hero Metrics (top row, 4 cards), 5.2 Charts (+20 more)

### Community 6 - "mockData.ts"
Cohesion: 0.07
Nodes (27): assessments, auditLogs, classes, curricula, feedbackSubmissions, formAssessments, inClassActivityCompletions, inClasses (+19 more)

### Community 7 - "FormAssessmentForm.vue"
Cohesion: 0.08
Nodes (20): activeIndex, activeSection, addItem(), addSection(), createItem(), createSection(), description, goNext() (+12 more)

### Community 8 - "devDependencies"
Cohesion: 0.07
Nodes (27): autoprefixer, npm-run-all2, devDependencies, autoprefixer, npm-run-all2, postcss, prettier, tailwindcss (+19 more)

### Community 9 - "participant/FeedbackView.vue"
Cohesion: 0.10
Nodes (15): answers, AnswerValue, auth, category, cls, existing, form, formId (+7 more)

### Community 10 - "package.json"
Cohesion: 0.08
Nodes (24): chart.js, dependencies, chart.js, pinia, vue, vue-chartjs, vue-router, engines (+16 more)

### Community 11 - "admin/FeedbackView.vue"
Cohesion: 0.11
Nodes (10): classesWithFeedback, expandedClasses, expandedParticipants, FeedbackTarget, getFeedbackTargets(), getSubmissionsForTarget(), selectedForm, selectedSubmission (+2 more)

### Community 12 - "Sidebar.vue"
Cohesion: 0.11
Nodes (11): sidebarOpen, auth, router, assessmentMethodsOpen, auth, MenuEntry, NavGroup, NavItem (+3 more)

### Community 13 - "mockRaportData.ts"
Cohesion: 0.11
Nodes (15): applyRaportMockData(), classDefs, materiLabels, mediaTypes, namePool, newClasses, newCurricula, newFormAssessments (+7 more)

### Community 14 - "admin/InstructorRaportDetail.vue"
Cohesion: 0.13
Nodes (16): auth, expandedPrograms, feedbackAspects, getProgramTrend(), getTrend(), logActivity(), overallFeedbackAvg, prevRaport (+8 more)

### Community 15 - "CurriculumForm.vue"
Cohesion: 0.11
Nodes (11): description, items, methodTypes, passingThreshold, programTypeId, route, router, selectedCategoryName (+3 more)

### Community 16 - "ScoreView.vue"
Cohesion: 0.11
Nodes (11): assignedMateriIds, auth, cls, curriculum, participantUsers, route, selectedEntity, selectedInClass (+3 more)

### Community 17 - "InClassTokenView.vue"
Cohesion: 0.13
Nodes (9): auth, copiedId, generateToken(), issueToken(), selectedClassId, selectedInClass, selectedInClassId, tokenForCategory() (+1 more)

### Community 18 - "AssessmentForm.vue"
Cohesion: 0.13
Nodes (11): auth, classId, cls, curriculum, FormBlock, formBlocks, item, methodId (+3 more)

### Community 19 - "TestTakerView.vue"
Cohesion: 0.13
Nodes (8): answers, auth, previousAttemptCount, route, router, submitted, test, timeRemaining

### Community 20 - "TestForm.vue"
Cohesion: 0.14
Nodes (8): description, pickCount, questions, randomize, route, router, timeLimit, title

### Community 21 - "TrainingMethodForm.vue"
Cohesion: 0.14
Nodes (7): categories, componentMethods, description, route, router, title, typeId

### Community 22 - "instructor/InstructorRaportDetail.vue"
Cohesion: 0.15
Nodes (11): auth, expandedPrograms, feedbackAspects, getProgramTrend(), getTrend(), overallFeedbackAvg, prevRaport, raport (+3 more)

### Community 23 - "tsconfig.app.json"
Cohesion: 0.15
Nodes (12): env.d.ts, src/**/*, src/**/__tests__/*, src/**/*.vue, @vue/tsconfig/tsconfig.dom.json, compilerOptions, noUncheckedIndexedAccess, paths (+4 more)

### Community 24 - "admin/ClassDetail.vue"
Cohesion: 0.17
Nodes (8): cls, curriculumDetail, participantDetails, programTypeDetail, raterDetails, route, router, uploadFileItems

### Community 25 - "InClassForm.vue"
Cohesion: 0.17
Nodes (6): categories, description, feedbackForms, route, router, title

### Community 26 - "instructor/UploadsView.vue"
Cohesion: 0.20
Nodes (7): auth, expandedClasses, expandedParticipants, getUploadFileItems(), hasUploadForTask(), myClassesWithUploadFile, uploadedTaskCount()

### Community 27 - "TestListView.vue"
Cohesion: 0.17
Nodes (7): auth, completedAttempts, curriculumTests, InClassTestEntry, inClassTests, myClasses, router

### Community 28 - "InstructorRaportList.vue"
Cohesion: 0.18
Nodes (8): auth, filteredRaports, instructorList, revision, router, selectedInstructorId, selectedMonth, selectedYear

### Community 29 - "admin/UploadsView.vue"
Cohesion: 0.22
Nodes (6): classesWithUploadFile, expandedClasses, expandedParticipants, getUploadFileItems(), hasUploadForTask(), uploadedTaskCount()

### Community 30 - "UploadFileView.vue"
Cohesion: 0.18
Nodes (6): auth, forms, myClasses, myUploads, pendingUploads, UploadForm

### Community 31 - "prototype"
Cohesion: 0.22
Nodes (8): Compile and Hot-Reload for Development, Customize configuration, Project Setup, prototype, Recommended Browser Setup, Recommended IDE Setup, Type-Check, Compile and Minify for Production, Type Support for `.vue` Imports in TS

### Community 32 - "App.vue"
Cohesion: 0.25
Nodes (6): auth, isLoginPage, route, app, router, routes

### Community 33 - "raportCalculator.ts"
Cohesion: 0.53
Nodes (7): calculateCompletionRate(), calculateFeedbackAverage(), calculateLGI(), calculatePassRate(), getAllInClassIdsForClasses(), getClassesByInstructorAndMonth(), isDateInMonth()

### Community 34 - "KnowledgeTestForm.vue"
Cohesion: 0.25
Nodes (6): maxParticipants, name, passingScore, route, router, testId

### Community 35 - "KnowledgeTestResult.vue"
Cohesion: 0.25
Nodes (6): attempts, kt, passedCount, results, route, router

### Community 36 - "MateriForm.vue"
Cohesion: 0.25
Nodes (6): description, embedUrl, route, router, title, type

### Community 37 - "SectionTypeForm.vue"
Cohesion: 0.29
Nodes (7): description, errors, name, route, router, save(), validate()

### Community 38 - "AssessmentList.vue"
Cohesion: 0.25
Nodes (6): auth, formMethodTypes, myClasses, pending, PendingItem, router

### Community 39 - "SubmissionView.vue"
Cohesion: 0.25
Nodes (6): auth, forms, myClasses, mySubmissions, pendingMethods, SubmissionForm

### Community 40 - "ProgramTypeForm.vue"
Cohesion: 0.29
Nodes (5): description, name, programCategoryId, route, router

### Community 41 - "instructor/ClassDetail.vue"
Cohesion: 0.29
Nodes (6): auth, cls, curriculumDetail, participantDetails, route, router

### Community 42 - "LoginView.vue"
Cohesion: 0.29
Nodes (5): auth, email, error, password, router

### Community 43 - "admin/AuditLogView.vue"
Cohesion: 0.33
Nodes (5): actions, filterAction, filtered, filterRole, roles

### Community 44 - "CategoryTrainingMethodForm.vue"
Cohesion: 0.33
Nodes (4): description, name, route, router

### Community 45 - "MateriTypeForm.vue"
Cohesion: 0.33
Nodes (4): description, name, route, router

### Community 46 - "ProgramCategoryForm.vue"
Cohesion: 0.33
Nodes (4): description, name, route, router

### Community 47 - "audit/AuditLogView.vue"
Cohesion: 0.33
Nodes (5): actions, filterAction, filtered, filterRole, roles

### Community 48 - "ParticipantDashboard.vue"
Cohesion: 0.33
Nodes (5): auth, myAttempts, myClasses, myInClassSessions, router

### Community 49 - "TranscriptView.vue"
Cohesion: 0.33
Nodes (3): auth, myClasses, transcripts

### Community 50 - ".prettierrc.json"
Cohesion: 0.40
Nodes (4): printWidth, $schema, semi, singleQuote

### Community 53 - "SectionTypeList.vue"
Cohesion: 0.40
Nodes (3): filtered, router, search

### Community 54 - "InstructorRaportView.vue"
Cohesion: 0.40
Nodes (3): auth, myRaports, router

### Community 55 - "TestResultView.vue"
Cohesion: 0.40
Nodes (4): attempt, route, router, test

### Community 56 - "SpiderChart.vue"
Cohesion: 0.50
Nodes (3): path, points, props

### Community 58 - "RaterDashboard.vue"
Cohesion: 0.50
Nodes (3): auth, myAssessments, myClasses

### Community 59 - "instructor/ClassList.vue"
Cohesion: 0.50
Nodes (3): auth, myClasses, router

### Community 60 - "KHSView.vue"
Cohesion: 0.50
Nodes (3): auth, myClasses, transcripts

### Community 61 - "LGIView.vue"
Cohesion: 0.50
Nodes (3): auth, myClasses, tableData

### Community 62 - "ParticipantProgress.vue"
Cohesion: 0.50
Nodes (3): auth, myClasses, myProgress

### Community 85 - "ParticipantTab.vue"
Cohesion: 0.05
Nodes (29): applyFilters(), clearPrograms(), dateFrom, dateTo, emit, searchQuery, selectedPrograms, toggleProgram() (+21 more)

### Community 86 - "learningHours.ts"
Cohesion: 0.14
Nodes (13): LHActivityLog, LHActivityType, LHCompletionStatus, LHFilters, LHInstructorMateriSummary, LHInstructorSummary, LHMateri, LHMateriSummary (+5 more)

### Community 87 - "InstructorTab.vue"
Cohesion: 0.11
Nodes (10): DrillLevel, instructorDetail, instructorList, level, materiList, programs, props, selectedInstructorId (+2 more)

### Community 88 - "learningHoursMock.ts"
Cohesion: 0.29
Nodes (6): generateActivityLogs(), lhActivityLogs, lhMateri, lhPrograms, lhUsers, rand

### Community 89 - "DonutChart.vue"
Cohesion: 0.50
Nodes (3): chartData, chartOptions, props

### Community 90 - "HorizontalBarChart.vue"
Cohesion: 0.50
Nodes (3): chartData, chartOptions, props

### Community 91 - "TrendLineChart.vue"
Cohesion: 0.50
Nodes (3): chartData, chartOptions, props

## Knowledge Gaps
- **613 isolated node(s):** `$schema`, `semi`, `singleQuote`, `printWidth`, `name` (+608 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._
- **What connects `$schema`, `semi`, `singleQuote` to the rest of the system?**
  _613 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `types/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.03571428571428571 - nodes in this community are weakly interconnected._
- **Should `ClassForm.vue` be split into smaller, more focused modules?**
  _Cohesion score 0.044326241134751775 - nodes in this community are weakly interconnected._
- **Should `ClassProgressView.vue` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._
- **Should `InClassRetakeView.vue` be split into smaller, more focused modules?**
  _Cohesion score 0.07096774193548387 - nodes in this community are weakly interconnected._
- **Should `InClassView.vue` be split into smaller, more focused modules?**
  _Cohesion score 0.08817204301075268 - nodes in this community are weakly interconnected._