Platform Structure — Phase-1 (Prototype)
Below is the complete implementation structure you can use immediately: sitemap, routes, component tree, file & folder layout, data models (sample), API stubs, state plan, and a prioritized task checklist. This is tailored for a React + Tailwind static prototype (local JSON) with an easy path to full Phase-1 later.
1. Sitemap & Routes
Admin (implemented now)
/admin → Admin dashboard shell (redirect)
/admin/students → Student Data (list + search + profile modal)
/admin/notices → Notices management (create / list / pin / expiry)
/admin/forms → Frequent Forms management (upload / list)
/admin/helpdesk → Helpdesk tickets (list / respond)
/admin/bulk-upload → CSV / Excel upload & mapping
/admin/email → Email broadcast composer + templates
/admin/settings → Roles & small app settings
Student (UI placeholders — Coming Soon)
/student/notices → Notices page (Coming Soon)
/student/forms → Frequent Forms (Coming Soon)
/student/helpdesk → Helpdesk submit/status (Coming Soon)
2. High-level User Flows
Admin login → Dashboard → pick a module from sidebar.
Search in header (any page) → type name/roll/phone → autosuggest → open student profile modal.
Create Notice → add title, description, category, publish date, expiry date, pin option → Save → visible in Notices list, auto-hide after expiry.
Upload Form → choose PDF or link → add category & label → publish → visible under Forms.
Helpdesk → view ticket list → open ticket → change status / add response.
Bulk Upload → upload CSV → preview rows → map columns → import to local JSON (prototype) or POST to API (future).
Email Broadcast → open composer modal → choose recipients (All / by batch) → send test → send (UI simulated).
3. Component Tree (Main components)
App
 ├─ AdminShell (Header, Sidebar, Content)
 │   ├─ Header (SearchBar, Quick Actions)
 │   ├─ Sidebar (NavLinks, UserMenu)
 │   └─ ContentArea (routes)
 │       ├─ StudentsPage
 │       │   ├─ StudentsToolbar (Add, BulkUpload, Export)
 │       │   ├─ StudentSearch (autosuggest)
 │       │   ├─ StudentsTable (list, sort, filters)
 │       │   └─ StudentProfileModal
 │       ├─ NoticesPage
 │       │   ├─ NoticeCreateFormModal
 │       │   └─ NoticesList (NoticeCard)
 │       ├─ FormsPage
 │       │   ├─ FormUploadModal
 │       │   └─ FormsList (FormItem)
 │       ├─ HelpdeskPage
 │       │   ├─ TicketCreateModal
 │       │   └─ TicketsList (TicketItem, TicketDetail)
 │       ├─ BulkUploadPage
 │       │   └─ CSVPreview & FieldMapper
 │       ├─ EmailPage
 │       │   └─ EmailComposerModal
 │       └─ SettingsPage
 └─ StudentShell (ComingSoon)
     └─ ComingSoonCards
4. File & Folder Structure (React + Tailwind)
/project-root
├─ /public
│   └─ sample-students.json
├─ /src
│   ├─ /api
│   │   └─ stubs.ts                # API stubs / fetch wrappers
│   ├─ /assets
│   ├─ /components
│   │   ├─ AdminShell.jsx
│   │   ├─ Header.jsx
│   │   ├─ Sidebar.jsx
│   │   ├─ SearchBar.jsx
│   │   ├─ StudentProfileModal.jsx
│   │   ├─ StudentsTable.jsx
│   │   ├─ NoticesList.jsx
│   │   ├─ NoticeCard.jsx
│   │   ├─ FormsList.jsx
│   │   ├─ HelpdeskList.jsx
│   │   └─ EmailComposer.jsx
│   ├─ /pages
│   │   ├─ admin/StudentsPage.jsx
│   │   ├─ admin/NoticesPage.jsx
│   │   ├─ admin/FormsPage.jsx
│   │   ├─ admin/HelpdeskPage.jsx
│   │   ├─ admin/BulkUploadPage.jsx
│   │   ├─ admin/EmailPage.jsx
│   │   └─ student/ComingSoon.jsx
│   ├─ /context
│   │   ├─ AppContext.jsx           # user, roles, sample-data store
│   ├─ /utils
│   │   ├─ csvParser.js
│   │   ├─ dateUtils.js
│   │   └─ searchUtils.js
│   ├─ /styles
│   │   └─ tailwind.css
│   ├─ App.jsx
│   ├─ index.jsx
│   └─ routes.jsx
├─ package.json
└─ README.md
5. Sample Data Model (client-side JSON shape)
Student object (sample-students.json)
{
  "students": [
    {
      "id": "S1001",
      "roll": "2025CS001",
      "name": "Ravi Kumar",
      "phone": "9876543210",
      "email": "ravi.kumar@example.com",
      "course": "B.Tech Computer Science",
      "batch": "2022-26",
      "section": "A",
      "year": 3,
      "gender": "Male",
      "notes": "CR candidate"
    }
    // ... 9 more
  ]
}
Notice object
{
  "id": "N1001",
  "title": "Semester Exam Schedule",
  "category": "Academic",
  "description": "Exams start on 10th Dec. Check hall tickets.",
  "publishedAt": "2025-11-01T09:00:00Z",
  "expiryAt": "2025-12-15T23:59:59Z",
  "pinned": true,
  "attachments": []
}
Helpdesk ticket
{
  "id": "T2001",
  "studentRoll": "2025CS001",
  "category": "Certificate",
  "description": "Request for participation certificate.",
  "status": "Pending",
  "createdAt": "2025-11-10T10:10:00Z",
  "responses": []
}
6. API Stubs (for future backend integration)
Implement these as local src/api/stubs.ts returning Promise-resolved sample data in prototype.
GET /api/students?query= → list (filter client-side)
GET /api/students/:id → student object
POST /api/students → create (prototype: update local JSON in memory)
POST /api/students/bulk → accept CSV mapping payload → return imported rows
GET /api/notices → list notices
POST /api/notices → create notice
DELETE /api/notices/:id → delete notice
GET /api/forms → list forms
POST /api/forms → upload form metadata (file stored later)
GET /api/helpdesk → list tickets
POST /api/helpdesk → create ticket
POST /api/email/send → send email (prototype: simulate success)
Request/response shape: match the JSON models above (IDs, timestamps ISO strings).
7. State Management Plan
Use React Context for global app state (user, roles, UI toggles).
Use local component state + hooks for page-level state (tables, filters).
For future extensibility: isolate API calls in /src/api and state syncing in a small store (Zustand) if app scales.
Store sample data in /public/sample-students.json and load on app start (fetch once, cache in Context).
Example: AppContext holds { user, role, students, notices, forms, tickets, reload() }.
8. UI & Design Tokens (Tailwind theme suggestions)
Base font size: text-base = 16px (set html { font-size: 16px })
Headings: h1: text-2xl (24px), h2: text-xl (20px), h3: text-lg (18px)
Line height: leading-relaxed
Spacing: Use p-4 / p-6 large paddings
Min button size: h-11 (44px) and px-4
Colors (neutral, professional):
--brand (accent): #1E4B8B (deep blue)
--bg: #F8FAFC (very light gray)
--card: #FFFFFF
--muted: #6B7280
Tailwind config highlights:
// tailwind.config.js (excerpt)
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: '#1E4B8B',
        muted: '#6B7280'
      },
      fontSize: {
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px'
      }
    }
  }
}
9. Accessibility & Usability Notes (for 40+ admin users)
Text: readable sizes (16–18px body), clear labels.
Contrast: minimum WCAG AA for text/background (brand on white OK).
Controls: large clickable areas (44px), plenty of spacing.
Forms: clear inline validation messages, confirm dialogs for deletes.
Keyboard: focus outlines visible, tab order logical.
Alerts: use both toast and modal confirmations for important actions (e.g., bulk import).
Language: simple wording (no jargon), buttons labeled plainly: Upload Notice, Send Email, Add Student.
10. Prioritized Implementation Checklist (Phase-1 prototype)
Sprint 0 — Setup (0.5 day)
Initialize Vite/CRA + Tailwind, set Tailwind config.
Add sample JSON under /public.
Sprint 1 — Core Shell & Search (1–2 days)
Implement AdminShell (Header + Sidebar).
Implement SearchBar with autosuggest (client-side filtering).
Implement AppContext load of sample JSON.
Sprint 2 — Students Page (1–2 days)
Students list table + filters.
StudentProfileModal opens from search result.
CSV bulk upload page shell (preview only).
Sprint 3 — Notices & Forms (1–2 days)
NoticesPage: create modal, list, pin, expiry auto-hide.
FormsPage: upload modal (accept link or file metadata), list UI.
Sprint 4 — Helpdesk & Email (1–2 days)
Helpdesk list + ticket modal.
EmailComposer modal (UI only + simulated send).
Sprint 5 — Polish & Handoff (0.5–1 day)
Accessibility checks, confirm responsive, fix UI for older users.
README + developer handoff doc.
Total estimate: 6–9 working days for a polished prototype UI.
11. Developer Handoff (one-page summary)
Start: npm install → npm run dev (or npm start)
Key files:
public/sample-students.json — mock data.
src/context/AppContext.jsx — load & provide sample data.
src/pages/admin/StudentsPage.jsx — students UI.
src/components/SearchBar.jsx — autosuggest & open-profile.
src/api/stubs.ts — simulated API; update later to real endpoints.
Next steps for full product:
Replace api/stubs.ts with real API client.
Persist data to DB (MongoDB/Postgres) via backend.
Add Auth (faculty/admin roles), secure endpoints.
Testing: Manual test cases listed in README (search, create notice, expiry, upload).
12. Small copy for Coming Soon student pages (to show in prototype)
Student Portal — Coming Soon
Student-facing pages (Notices, Frequent Forms, Helpdesk) are under development and will be available shortly.
If you need any form or notice urgently, please contact Student Cell at: studentcell@college.edu or call 01234-567890.
Quick Extras (copy-paste snippets you’ll want)
Sample student JSON path: /public/sample-students.json
API stub example (in src/api/stubs.ts):
export async function getStudents(query = '') {
  const res = await fetch('/sample-students.json');
  const data = await res.json();
  const q = query.trim().toLowerCase();
  if (!q) return data.students;
  return data.students.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.roll.toLowerCase().includes(q) ||
    s.phone.includes(q)
  );
}