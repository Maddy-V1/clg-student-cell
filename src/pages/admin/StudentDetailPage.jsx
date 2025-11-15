import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, GraduationCap, Calendar, Hash, Edit2, Trash2, Save, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { updateStudent, deleteStudent } from '../../api/stubs.js';

const branches = ['CSE', 'IT', 'CSE AI', 'CSE DS', 'ECE'];
const batches = ['24-28', '25-29', '26-28', '25-27'];
const sections = ['1', '2', '3', 'A', 'B'];

export default function StudentDetailPage() {
  const { roll } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { students, reloadStudents } = useApp();
  const [isEditMode, setIsEditMode] = useState(false);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Preserve filter params in back link
  const backUrl = useMemo(() => {
    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
      params.set(key, value);
    });
    const queryString = params.toString();
    return `/admin/students${queryString ? `?${queryString}` : ''}`;
  }, [searchParams]);

  const student = useMemo(() => {
    return students.find(s => (s.roll || '').toString() === roll);
  }, [students, roll]);

  const [formData, setFormData] = useState({
    roll: '',
    name: '',
    phone: '',
    email: '',
    batch: '',
    branch: '',
    course: '',
    section: '',
    year: 1,
    gender: '',
    category: '',
    motherName: '',
    fatherName: '',
    isLE: false,
    isLeft: false,
    isCR: false,
    notes: ''
  });

  // Initialize form data when student loads
  useEffect(() => {
    if (student) {
      setFormData({
        roll: student.roll || '',
        name: student.name || '',
        phone: student.phone || '',
        email: student.email || '',
        batch: student.batch || '',
        branch: student.branch || '',
        course: student.course || '',
        section: student.section || '',
        year: student.year || 1,
        gender: student.gender || '',
        category: student.category || '',
        motherName: student.motherName || '',
        fatherName: student.fatherName || '',
        isLE: student.isLE || false,
        isLeft: student.isLeft || false,
        isCR: student.isCR || false,
        notes: student.notes || ''
      });
    }
  }, [student]);

  if (!student) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Student not found</h1>
          <Link to={backUrl} className="btn-secondary inline-flex items-center gap-2">
            <ArrowLeft size={18} />
            Back to Students
          </Link>
        </div>
        <p className="text-base text-muted">No student exists with roll number {roll}.</p>
      </div>
    );
  }

  const fullName = student.name || 'N/A';

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Validate roll number (11 digits)
      if (formData.roll.length !== 11 || !/^\d+$/.test(formData.roll)) {
        alert('Roll number must be exactly 11 digits');
        setIsSaving(false);
        return;
      }

      await updateStudent(roll, formData);
      await reloadStudents();
      setIsEditMode(false);
      alert('Student updated successfully!');
    } catch (error) {
      alert('Error updating student: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteStudent(roll);
      await reloadStudents();
      navigate(backUrl);
      alert('Student deleted successfully!');
    } catch (error) {
      alert('Error deleting student: ' + error.message);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original student data
    if (student) {
      setFormData({
        roll: student.roll || '',
        name: student.name || '',
        phone: student.phone || '',
        email: student.email || '',
        batch: student.batch || '',
        branch: student.branch || '',
        course: student.course || '',
        section: student.section || '',
        year: student.year || 1,
        gender: student.gender || '',
        category: student.category || '',
        motherName: student.motherName || '',
        fatherName: student.fatherName || '',
        isLE: student.isLE || false,
        isLeft: student.isLeft || false,
        isCR: student.isCR || false,
        notes: student.notes || ''
      });
    }
    setIsEditMode(false);
  };

  // Get course type from branch
  const getCourseTypeFromBranch = (branch) => {
    if (branch === 'MBA') return 'MBA';
    if (branch === 'MCA') return 'MCA';
    return 'B.Tech';
  };

  const handleBranchChange = (branch) => {
    setFormData({
      ...formData,
      branch,
      course: getCourseTypeFromBranch(branch)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-brand bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center">
            <User size={32} className="text-brand" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
              {/* Remarks Badges */}
              <div className="flex gap-2">
                {student.isCR && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">CR</span>
                )}
                {student.isLE && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">LE</span>
                )}
                {student.isLeft && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">Left</span>
                )}
              </div>
            </div>
            <p className="text-base text-muted">Roll: {student.roll}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isEditMode ? (
            <>
              <button
                onClick={() => setIsEditMode(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Edit2 size={18} />
                Edit
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="btn-secondary inline-flex items-center gap-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="btn-secondary inline-flex items-center gap-2"
                disabled={isSaving}
              >
                <X size={18} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn-primary inline-flex items-center gap-2"
                disabled={isSaving}
              >
                <Save size={18} />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </>
          )}
          <Link to={backUrl} className="btn-secondary inline-flex items-center gap-2">
            <ArrowLeft size={18} />
            Back
          </Link>
        </div>
      </div>

      {isEditMode ? (
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="label">Roll Number (11 digits) *</label>
                    <input
                      type="text"
                      required
                      maxLength={11}
                      value={formData.roll}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                        setFormData({ ...formData, roll: value });
                      }}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setFormData({ ...formData, phone: value });
                      }}
                      className="input-field"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="label">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Select Category</option>
                      <option value="GEN">GEN</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="EWS">EWS</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Academic Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Batch *</label>
                    <select
                      required
                      value={formData.batch}
                      onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Select Batch</option>
                      {batches.map(batch => (
                        <option key={batch} value={batch}>{batch}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Course *</label>
                    <select
                      required
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Select Course</option>
                      <option value="B.Tech">B.Tech</option>
                      <option value="MBA">MBA</option>
                      <option value="MCA">MCA</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Branch *</label>
                    <select
                      required
                      value={formData.branch}
                      onChange={(e) => handleBranchChange(e.target.value)}
                      className="input-field"
                    >
                      <option value="">Select Branch</option>
                      {branches.map(branch => (
                        <option key={branch} value={branch}>{branch}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Section</label>
                    <select
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Select Section</option>
                      {sections.map(section => (
                        <option key={section} value={section}>Section {section}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Year</label>
                    <input
                      type="number"
                      min="1"
                      max="4"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 1 })}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Remarks</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isLE}
                  onChange={(e) => setFormData({ ...formData, isLE: e.target.checked })}
                  className="w-5 h-5 text-brand border-gray-300 rounded focus:ring-brand"
                />
                <span className="text-base text-gray-900">LE Student (Leave of Absence/Lateral Entry)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isLeft}
                  onChange={(e) => setFormData({ ...formData, isLeft: e.target.checked })}
                  className="w-5 h-5 text-brand border-gray-300 rounded focus:ring-brand"
                />
                <span className="text-base text-gray-900">Left Student (Discontinued)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isCR}
                  onChange={(e) => setFormData({ ...formData, isCR: e.target.checked })}
                  className="w-5 h-5 text-brand border-gray-300 rounded focus:ring-brand"
                />
                <span className="text-base text-gray-900">Class Representative (CR)</span>
              </label>
            </div>
          </div>

          <div className="card">
            <label className="label">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field"
              rows="3"
            />
          </div>
        </form>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <User size={20} className="text-brand mt-1" />
                  <div>
                    <p className="text-sm text-muted mb-1">Name</p>
                    <p className="text-base font-medium text-gray-900">{student.name || '-'}</p>
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
                <div className="flex items-start gap-3">
                  <User size={20} className="text-brand mt-1" />
                  <div>
                    <p className="text-sm text-muted mb-1">Gender</p>
                    <p className="text-base font-medium text-gray-900">{student.gender || '-'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User size={20} className="text-brand mt-1" />
                  <div>
                    <p className="text-sm text-muted mb-1">Category</p>
                    <p className="text-base font-medium text-gray-900">{student.category || '-'}</p>
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

          <div className="card">
            <button
              onClick={() => setShowMoreDetails(!showMoreDetails)}
              className="w-full flex items-center justify-between text-xl font-bold text-gray-900 mb-4"
            >
              <span>More Details</span>
              {showMoreDetails ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
            {showMoreDetails && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Family Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <User size={20} className="text-brand mt-1" />
                      <div>
                        <p className="text-sm text-muted mb-1">Father Name</p>
                        <p className="text-base font-medium text-gray-900">{student.fatherName || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User size={20} className="text-brand mt-1" />
                      <div>
                        <p className="text-sm text-muted mb-1">Mother Name</p>
                        <p className="text-base font-medium text-gray-900">{student.motherName || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
                  <p className="text-base text-gray-900">{student.notes || '-'}</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Delete Student</h2>
            <p className="text-base text-gray-700 mb-6">
              Are you sure you want to delete <strong>{fullName}</strong> (Roll: {student.roll})? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn-primary bg-red-600 hover:bg-red-700 text-white"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
