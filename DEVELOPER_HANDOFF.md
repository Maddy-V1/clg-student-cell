# Developer Handoff Document

## Project Overview

This is a **Phase-1 Prototype** of the Student Cell Management Platform. The prototype includes fully functional admin features with a static frontend (local JSON data). Student-facing pages are "Coming Soon" placeholders.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

The application will be available at `http://localhost:3000`

## Key Files & Structure

### Data & Configuration
- `public/sample-students.json` - Mock student data (10 Indian student records)
- `src/api/stubs.js` - API stub functions (replace with real API calls in full product)
- `tailwind.config.js` - Tailwind CSS configuration with design tokens

### State Management
- `src/context/AppContext.jsx` - Global app state (students, notices, forms, tickets)
- Loads sample data on app initialization
- Provides `reloadStudents()`, `reloadNotices()`, etc. for data refresh

### Core Components
- `src/components/AdminShell.jsx` - Main admin layout (header, sidebar, content)
- `src/components/Header.jsx` - Top navigation with search bar
- `src/components/Sidebar.jsx` - Left navigation menu
- `src/components/SearchBar.jsx` - Global search with autosuggest
- `src/components/StudentProfileModal.jsx` - Student profile view modal

### Admin Pages
- `src/pages/admin/StudentsPage.jsx` - Student data management
- `src/pages/admin/NoticesPage.jsx` - Notice creation and management
- `src/pages/admin/FormsPage.jsx` - Form upload and listing
- `src/pages/admin/HelpdeskPage.jsx` - Ticket management
- `src/pages/admin/BulkUploadPage.jsx` - CSV bulk import
- `src/pages/admin/EmailPage.jsx` - Email broadcast composer
- `src/pages/admin/SettingsPage.jsx` - Settings and role management

### Student Pages
- `src/pages/student/ComingSoon.jsx` - Placeholder for student portal

### Utilities
- `src/utils/searchUtils.js` - Client-side student search
- `src/utils/dateUtils.js` - Date formatting and expiry checks
- `src/utils/csvParser.js` - CSV parsing for bulk upload

## Design System

### Colors
- **Brand:** `#1E4B8B` (deep blue)
- **Background:** `#F8FAFC` (very light gray)
- **Card:** `#FFFFFF` (white)
- **Muted:** `#6B7280` (gray)

### Typography
- Base font size: 16px
- Headings: 20-28px
- Line height: relaxed (1.625)

### Components
- Buttons: Minimum 44px height (WCAG AA compliant)
- Inputs: Minimum 44px height
- Cards: White background with subtle shadow
- Focus states: Visible ring for keyboard navigation

## API Integration (Next Steps)

All API calls are currently stubbed in `src/api/stubs.js`. To integrate with a real backend:

1. Replace stub functions with actual HTTP calls (fetch/axios)
2. Update endpoints to match your backend API
3. Handle authentication tokens
4. Add error handling and loading states
5. Update data models if backend structure differs

### API Endpoints to Implement

```
GET    /api/students?query=     - Search students
GET    /api/students/:id        - Get student by ID
POST   /api/students            - Create student
POST   /api/students/bulk       - Bulk import
GET    /api/notices             - List notices
POST   /api/notices             - Create notice
DELETE /api/notices/:id         - Delete notice
GET    /api/forms               - List forms
POST   /api/forms               - Upload form
GET    /api/helpdesk            - List tickets
POST   /api/helpdesk            - Create ticket
POST   /api/helpdesk/:id/status - Update ticket status
POST   /api/email/send          - Send email broadcast
```

## Testing Checklist

### Admin Features
- [ ] Search students by name, roll, phone
- [ ] View student profile from search results
- [ ] Add new student manually
- [ ] Create notice with expiry date
- [ ] Pin/unpin notices
- [ ] Verify expired notices auto-hide
- [ ] Upload form (link or file)
- [ ] View helpdesk tickets
- [ ] Update ticket status and add response
- [ ] Bulk upload CSV with field mapping
- [ ] Compose and send email (simulated)

### UI/UX
- [ ] All buttons meet 44px minimum height
- [ ] Text is readable (16px+ base)
- [ ] Focus states visible for keyboard navigation
- [ ] Modals accessible and closable
- [ ] Responsive on mobile/tablet
- [ ] High contrast for text/background

## Known Limitations (Prototype)

1. **No Backend:** All data is stored in memory (lost on refresh)
2. **No Authentication:** No login system implemented
3. **No File Upload:** PDF uploads are UI-only
4. **No Real Email:** Email sending is simulated
5. **No Persistence:** Data doesn't persist between sessions
6. **Student Portal:** Only placeholder pages

## Next Steps for Full Product

1. **Backend Development**
   - Set up database (MongoDB/PostgreSQL)
   - Implement REST API endpoints
   - Add file storage (S3/local)
   - Set up email service (SendGrid/SES)

2. **Authentication**
   - Implement login system
   - Role-based access control (RBAC)
   - Session management
   - Password reset flow

3. **Student Portal**
   - Student login/registration
   - Notices viewing with filters
   - Forms download/access
   - Helpdesk ticket submission
   - Profile management

4. **Additional Features**
   - Email notifications
   - SMS integration (optional)
   - Analytics dashboard
   - Export reports (PDF/Excel)
   - Audit logs

5. **Deployment**
   - Set up production environment
   - Configure CI/CD pipeline
   - Set up monitoring and logging
   - SSL certificates and security headers

## Support & Contact

For questions or issues during development:
- Review the main README.md for project overview
- Check component documentation in code comments
- Refer to Tailwind CSS docs for styling: https://tailwindcss.com/docs

---

**Last Updated:** Phase-1 Prototype (November 2024)

