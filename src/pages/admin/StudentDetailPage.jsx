import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, GraduationCap, Calendar, Hash } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export default function StudentDetailPage() {
  const { roll } = useParams();
  const { students } = useApp();

  const student = useMemo(() => {
    return students.find(s => (s.roll || '').toString() === roll);
  }, [students, roll]);

  if (!student) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Student not found</h1>
          <Link to="/admin/students" className="btn-secondary inline-flex items-center gap-2">
            <ArrowLeft size={18} />
            Back to Students
          </Link>
        </div>
        <p className="text-base text-muted">No student exists with roll number {roll}.</p>
      </div>
    );
  }

  const fullName = student.firstName && student.lastName
    ? `${student.firstName} ${student.lastName}`
    : (student.name || 'N/A');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-brand bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center">
            <User size={32} className="text-brand" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
            <p className="text-base text-muted">Roll: {student.roll}</p>
          </div>
        </div>
        <Link to="/admin/students" className="btn-secondary inline-flex items-center gap-2">
          <ArrowLeft size={18} />
          Back to Students
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <User size={20} className="text-brand mt-1" />
              <div>
                <p className="text-sm text-muted mb-1">First Name</p>
                <p className="text-base font-medium text-gray-900">{student.firstName || '-'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User size={20} className="text-brand mt-1" />
              <div>
                <p className="text-sm text-muted mb-1">Last Name</p>
                <p className="text-base font-medium text-gray-900">{student.lastName || '-'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={20} className="text-brand mt-1" />
              <div>
                <p className="text-sm text-muted mb-1">Phone Number</p>
                <p className="text-base font-medium text-gray-900">{student.phone || '-'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail size={20} className="text-brand mt-1" />
              <div>
                <p className="text-sm text-muted mb-1">Email</p>
                <p className="text-base font-medium text-gray-900">{student.email || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Academic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Calendar size={20} className="text-brand mt-1" />
              <div>
                <p className="text-sm text-muted mb-1">Batch</p>
                <p className="text-base font-medium text-gray-900">{student.batch || '-'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <GraduationCap size={20} className="text-brand mt-1" />
              <div>
                <p className="text-sm text-muted mb-1">Course</p>
                <p className="text-base font-medium text-gray-900">{student.course || '-'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Hash size={20} className="text-brand mt-1" />
              <div>
                <p className="text-sm text-muted mb-1">Branch</p>
                <p className="text-base font-medium text-gray-900">{student.branch || '-'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User size={20} className="text-brand mt-1" />
              <div>
                <p className="text-sm text-muted mb-1">Section</p>
                <p className="text-base font-medium text-gray-900">{student.section ? `Section ${student.section}` : '-'}</p>
              </div>
            </div>
            {student.year && (
              <div className="flex items-start gap-3">
                <Calendar size={20} className="text-brand mt-1" />
                <div>
                  <p className="text-sm text-muted mb-1">Year</p>
                  <p className="text-base font-medium text-gray-900">{student.year}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {student.notes && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Notes</h2>
          <p className="text-base text-gray-900">{student.notes}</p>
        </div>
      )}
    </div>
  );
}


