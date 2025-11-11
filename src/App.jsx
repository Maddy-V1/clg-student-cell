import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AdminShell from './components/AdminShell';
import StudentsPage from './pages/admin/StudentsPage';
import NoticesPage from './pages/admin/NoticesPage';
import FormsPage from './pages/admin/FormsPage';
import HelpdeskPage from './pages/admin/HelpdeskPage';
import BulkUploadPage from './pages/admin/BulkUploadPage';
import EmailPage from './pages/admin/EmailPage';
import SettingsPage from './pages/admin/SettingsPage';
import StudentDetailPage from './pages/admin/StudentDetailPage.jsx';
import ComingSoon from './pages/student/ComingSoon';
import './styles/index.css';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<AdminShell />}>
            <Route index element={<Navigate to="/admin/students" replace />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="students/:roll" element={<StudentDetailPage />} />
            <Route path="notices" element={<NoticesPage />} />
            <Route path="forms" element={<FormsPage />} />
            <Route path="helpdesk" element={<HelpdeskPage />} />
            <Route path="bulk-upload" element={<BulkUploadPage />} />
            <Route path="email" element={<EmailPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="/student" element={<ComingSoon />} />
          <Route path="/student/notices" element={<ComingSoon />} />
          <Route path="/student/forms" element={<ComingSoon />} />
          <Route path="/student/helpdesk" element={<ComingSoon />} />
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

