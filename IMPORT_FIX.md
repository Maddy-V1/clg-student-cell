# Import Path Fix

## Issue
Vite requires explicit file extensions for `.js` files when using ES modules (`"type": "module"` in package.json).

## Root Cause
The project uses ES modules (`"type": "module"` in package.json), which requires explicit file extensions for JavaScript imports. React component imports (`.jsx` files) don't need extensions because Vite's React plugin handles them automatically, but `.js` files do.

## Files Fixed

### API Stubs Imports (`.js` files need extension)
- ✅ `src/components/NoticesList.jsx`
- ✅ `src/components/EmailComposer.jsx`
- ✅ `src/context/AppContext.jsx`
- ✅ `src/pages/admin/StudentsPage.jsx`
- ✅ `src/pages/admin/NoticesPage.jsx`
- ✅ `src/pages/admin/FormsPage.jsx`
- ✅ `src/pages/admin/HelpdeskPage.jsx`
- ✅ `src/pages/admin/BulkUploadPage.jsx`

### Utility Imports (`.js` files need extension)
- ✅ `src/components/NoticeCard.jsx`
- ✅ `src/components/SearchBar.jsx`
- ✅ `src/pages/admin/BulkUploadPage.jsx`
- ✅ `src/pages/admin/HelpdeskPage.jsx`
- ✅ `src/pages/admin/FormsPage.jsx`

## Rule
- **`.js` files**: Must include `.js` extension in imports
- **`.jsx` files**: Don't need extension (handled by Vite React plugin)

## Example

**Before (incorrect):**
```javascript
import { deleteNotice } from '../../api/stubs';
import { formatDate } from '../utils/dateUtils';
```

**After (correct):**
```javascript
import { deleteNotice } from '../../api/stubs.js';
import { formatDate } from '../utils/dateUtils.js';
```

## Verification
All imports have been fixed. The application should now run without import resolution errors.

