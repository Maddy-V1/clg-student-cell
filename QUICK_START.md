# Quick Start Guide

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   The app will automatically open at `http://localhost:3000`

## First Steps

1. Navigate to `/admin/students` to see the student data
2. Try the search bar in the header - search by name, roll number, or phone
3. Click "Create Notice" to add a new notice
4. Explore all admin features from the sidebar

## Key Features to Test

### Student Management
- Search students using the header search bar
- View student profiles by clicking search results
- Add new students manually
- Bulk upload CSV file (see sample format below)

### Notices
- Create notices with expiry dates
- Pin important notices
- Verify expired notices auto-hide
- Filter by category

### Forms
- Upload forms (links or files)
- Categorize forms
- View all active forms

### Helpdesk
- View helpdesk tickets
- Update ticket status
- Add responses to tickets

### Email
- Compose email broadcasts
- Use email templates
- Send to all students or specific batches

## Sample CSV Format for Bulk Upload

```csv
roll,name,phone,email,course,batch,section,year,gender,notes
2025CS005,John Doe,9876543220,john.doe@example.com,B.Tech Computer Science,2022-26,A,3,Male,Active student
2025CS006,Jane Smith,9876543221,jane.smith@example.com,B.Tech Computer Science,2022-26,B,3,Female,
```

## Troubleshooting

**Issue:** Dependencies not installing
- Solution: Make sure you have Node.js 16+ installed

**Issue:** Port 3000 already in use
- Solution: Change port in `vite.config.js` or kill the process using port 3000

**Issue:** Data not persisting after refresh
- Expected: This is a prototype - data is stored in memory only

## Next Steps

- Read `DEVELOPER_HANDOFF.md` for detailed technical information
- Read `IMPLEMENTATION_PLAN.md` for complete project structure
- Review `Readme.md` for project overview

---

**Need Help?** Check the documentation files or review the code comments.

