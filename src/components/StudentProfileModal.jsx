import { X, Phone, Mail, GraduationCap, Calendar, User, Hash } from 'lucide-react';

export default function StudentProfileModal({ student, onClose }) {
  if (!student) return null;

  const getStudentName = () => {
    return student.name || 'N/A';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Student Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="bg-brand bg-opacity-10 w-20 h-20 rounded-full flex items-center justify-center mb-4">
              <User size={40} className="text-brand" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {getStudentName()}
            </h3>
            <p className="text-lg text-muted">Roll: {student.roll}</p>
          </div>

          {/* Personal Information */}
          <div className="mb-6">
            <h4 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <User size={20} className="text-brand mt-1" />
                <div>
                  <p className="text-sm text-muted mb-1">Name</p>
                  <p className="text-base font-medium text-gray-900">
                    {student.name || '-'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={20} className="text-brand mt-1" />
                <div>
                  <p className="text-sm text-muted mb-1">Phone Number</p>
                  <p className="text-base font-medium text-gray-900">
                    {student.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail size={20} className="text-brand mt-1" />
                <div>
                  <p className="text-sm text-muted mb-1">Email</p>
                  <p className="text-base font-medium text-gray-900">
                    {student.email || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar size={20} className="text-brand mt-1" />
                <div>
                  <p className="text-sm text-muted mb-1">Date of Birth</p>
                  <p className="text-base font-medium text-gray-900">
                    {student.dob ? new Date(student.dob).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="mb-6">
            <h4 className="text-xl font-bold text-gray-900 mb-4">Academic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Calendar size={20} className="text-brand mt-1" />
                <div>
                  <p className="text-sm text-muted mb-1">Batch</p>
                  <p className="text-base font-medium text-gray-900">
                    {student.batch || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Hash size={20} className="text-brand mt-1" />
                <div>
                  <p className="text-sm text-muted mb-1">Branch</p>
                  <p className="text-base font-medium text-gray-900">
                    {student.branch || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <GraduationCap size={20} className="text-brand mt-1" />
                <div>
                  <p className="text-sm text-muted mb-1">Course</p>
                  <p className="text-base font-medium text-gray-900">
                    {student.course || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User size={20} className="text-brand mt-1" />
                <div>
                  <p className="text-sm text-muted mb-1">Section</p>
                  <p className="text-base font-medium text-gray-900">
                    {student.section === 'No Sections' ? 'No Sections' : student.section ? `Section ${student.section}` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {student.notes && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-muted mb-2">Notes</p>
              <p className="text-base text-gray-900">{student.notes}</p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
