# PRD: Learning Hours Dashboard (LMS - Academy Gacoan)

## 1. Purpose
Give Academy stakeholders a fast, visual way to understand how much time participants and instructors spend on learning activities (materi vs test), and to drill down from program-level to individual-user-level insight. Dashboard must feel simple, scannable, and insightful — not a raw data table.

## 2. Users
- **Academy Admin / Product Owner (e.g. Farouq)** — monitors overall engagement, spots drop-offs
- **Training/Sub-Dept Lead** — reviews program & instructor performance
- **Trainer/Instructor** — checks own teaching activity (future scope, out of Phase 1 access control)

## 3. Scope Note
This dashboard is **purely LMS-side**. No dependency on Academy Management ERD (stations, skills, capabilities). Data shape below is LMS-native and will use **mock data** for prototyping.

## 4. Information Architecture — 3 Tabs
1. **Overview** — org-wide learning hours & activity snapshot
2. **Participant** — drill-down: Program → Materi → User
3. **Instructor** — drill-down: Program → Materi → Instructor (with effectiveness)

---

## 5. Tab 1: Overview

### 5.1 Hero Metrics (top row, 4 cards)
| Metric | Description |
|---|---|
| Total Learning Hours | Sum of all hours this period, with % change vs previous period |
| Active Participants | Unique participants with activity this period |
| Active Instructors | Unique instructors with activity this period |
| Materi vs Test Split | % time on materi vs % time on test (shown as small split bar inside card) |

### 5.2 Charts
- **Trend Line Chart**: Learning hours over time (daily/weekly/monthly toggle), two lines — Materi hours vs Test hours (dual-line, distinguishable by solid blue shades: primary blue for Materi, lighter/muted blue for Test)
- **Donut Chart**: Overall time split — Materi vs Test (reinforces the split bar in hero card)
- **Bar Chart (horizontal)**: Top 5 Programs by total learning hours

### 5.3 Filter Bar
- Date range picker (default: last 30 days)
- Program filter (optional, multi-select)

---

## 6. Tab 2: Participant

### 6.1 Drill-down Flow
`Program list → Materi list (within program) → User list (within materi) → User activity detail`

### 6.2 Level: Program
- Table/card grid: Program name, Total hours, Avg hours/participant, Completion rate, Materi vs Test split (mini bar)
- Bar chart: hours by program (click bar → drill into program)

### 6.3 Level: Materi (within selected Program)
- Table: Materi name, Total hours, Avg hours/user, Test pass rate, Materi vs Test split
- Line chart: hours trend for this materi over time

### 6.4 Level: User (within selected Materi, or global user search)
- User activity table: Name, Total hours (materi/test split), Sessions count, Last activity date, Completion status
- Individual user detail panel: activity timeline (chronological log), hours breakdown donut (materi vs test), progress indicator

### 6.5 Filters
- Program, Materi, Date range, Search by user name

---

## 7. Tab 3: Instructor

### 7.1 Drill-down Flow
`Program list → Materi list → Instructor list → Instructor activity detail`

### 7.2 Level: Program
- Table: Program name, Total teaching hours, Active instructors count, Avg participant pass rate (effectiveness signal)
- Bar chart: teaching hours by program

### 7.3 Level: Materi
- Table: Materi name, Total teaching hours, Sessions run, Avg class size, Pass rate of participants taught

### 7.4 Level: Instructor
- Table: Instructor name, Total hours, Sessions/classes run, Participants handled, **Effectiveness score** (pass rate of their participants), Last active date
- Individual instructor detail panel: teaching hours trend line, sessions breakdown by program/materi, effectiveness trend over time

### 7.5 Effectiveness Metric Definition
`Effectiveness = (participants who passed test / total participants taught) × 100%`
Shown as a badge/color indicator (e.g. green ≥80%, blue 60-79%, gray <60% — kept within blue/neutral palette, avoid red/yellow alarm colors per design direction).

---

## 8. Design Direction

### 8.1 Visual Style
- **Color palette**: Blue-dominant, solid colors (no gradients). Primary blue for main data, muted/lighter blue tints for secondary series. Neutral grays for backgrounds/borders. Avoid multi-color rainbow charts — keep it monochrome-blue for cohesion.
- **Layout**: Card-based KPI row at top of each tab → chart section below → drill-down table/list at bottom
- **Typography**: Clean sans-serif, clear hierarchy (large numbers for hero metrics, smaller labels)
- **Tab navigation**: Simple horizontal tabs at top, persistent across scroll

### 8.2 Chart Types Used
- Line chart (trends over time)
- Horizontal/vertical bar chart (comparisons across programs/materi/instructors)
- Donut chart (materi vs test split)
- Simple progress/split bars inside cards

### 8.3 Animation Behavior (subtle, not flashy)
- **Number count-up**: hero metric numbers animate from 0 to value on load/tab switch (~600-800ms ease-out)
- **Chart draw-in**: line charts draw left-to-right; bar charts grow from baseline; donut fills clockwise (~500-700ms)
- **Tab transition**: smooth fade/slide when switching tabs (~200ms)
- **Drill-down transition**: slide-in effect when navigating Program → Materi → User (breadcrumb stays visible, back navigation supported)
- **Hover states**: tooltips on charts show exact values, subtle scale/highlight on hover for bars/cards
- Keep all animations fast and non-blocking — prioritize perceived speed over decoration

---

## 9. Mock Data Shape

```json
{
  "programs": [
    { "program_id": "p1", "name": "Kitchen Fundamentals" }
  ],
  "materi": [
    { "materi_id": "m1", "program_id": "p1", "name": "Knife Handling Basics" }
  ],
  "users": [
    { "user_id": "u1", "name": "Budi Santoso", "role": "participant" },
    { "user_id": "u2", "name": "Siti Rahma", "role": "instructor" }
  ],
  "activity_logs": [
    {
      "log_id": "log1",
      "user_id": "u1",
      "role": "participant",
      "program_id": "p1",
      "materi_id": "m1",
      "activity_type": "MATERI",
      "duration_seconds": 1800,
      "session_date": "2026-08-10",
      "completion_status": "COMPLETED"
    },
    {
      "log_id": "log2",
      "user_id": "u1",
      "role": "participant",
      "program_id": "p1",
      "materi_id": "m1",
      "activity_type": "TEST",
      "duration_seconds": 600,
      "session_date": "2026-08-10",
      "pass_status": "PASS"
    },
    {
      "log_id": "log3",
      "user_id": "u2",
      "role": "instructor",
      "program_id": "p1",
      "materi_id": "m1",
      "activity_type": "TEACHING_SESSION",
      "duration_seconds": 3600,
      "session_date": "2026-08-10",
      "participants_count": 12,
      "participants_passed": 10
    }
  ]
}
```

**Field notes:**
- `activity_type`: `MATERI | TEST` (participant), `TEACHING_SESSION` (instructor)
- Effectiveness = `participants_passed / participants_count` aggregated per instructor
- All hours/durations stored in seconds, converted to hours for display

---

## 10. Acceptance Criteria
- [ ] Overview tab shows 4 hero metrics + trend line + donut + top-5 program bar chart
- [ ] Participant tab supports 3-level drill-down (Program → Materi → User) with breadcrumb navigation
- [ ] Instructor tab supports 3-level drill-down with effectiveness metric visible at each level
- [ ] Materi vs Test time split visible in Overview and Participant tabs
- [ ] All charts use blue solid-color palette (no gradients, no rainbow colors)
- [ ] Number count-up, chart draw-in, and tab-switch animations implemented and performant (no jank)
- [ ] Dashboard functional with mock JSON data (no backend dependency required for prototype)
- [ ] Responsive layout (desktop-first, acceptable on tablet width)

## 11. Out of Scope (Phase 1 Prototype)
- Real LMS backend integration
- Authentication/role-based data filtering
- Export/reporting functionality
- Cross-reference to Academy Management station/skill data
