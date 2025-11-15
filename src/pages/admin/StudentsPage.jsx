import { useState } from 'react';
import { Plus, Upload } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StudentsTable from '../../components/StudentsTable';
import { createStudent } from '../../api/stubs.js';

const branches = ['CSE', 'IT', 'CSE AI', 'CSE DS', 'ECE'];
const batches = ['24-28', '25-29'];
const sections = ['1', '2'];

import BulkUploadPage from './BulkUploadPage.jsx';

export default function StudentsPage() {
  const { students, reloadStudents } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkInsideModal, setShowBulkInsideModal] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate roll number (11 digits)
    if (formData.roll.length !== 11 || !/^\d+$/.test(formData.roll)) {
      alert('Roll number must be exactly 11 digits');
      return;
    }
    
    try {
      await createStudent(formData);
      await reloadStudents();
      setShowAddModal(false);
      setFormData({
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
      alert('Student added successfully!');
    } catch (error) {
      alert('Error adding student');
    }
  };

  // Auto-generate course type based on branch
  const getCourseTypeFromBranch = (branch) => {
    // All branches are B.Tech for now, but can be extended for MBA/MCA
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
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Student Data</h1>
          <p className="text-base text-muted">
            Manage and search student information
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Add Student
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-base text-gray-700">
          Total Students: <span className="font-semibold">{students.length}</span>
        </p>
      </div>

      <StudentsTable students={students} />

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {showBulkInsideModal ? 'Bulk Upload Students' : 'Add New Student'}
              </h2>
              <div className="flex items-center gap-3">
                {!showBulkInsideModal && (
                  <button
                    onClick={() => setShowBulkInsideModal(true)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Upload size={18} />
                    Bulk Upload
                  </button>
                )}
                {showBulkInsideModal && (
                  <button
                    onClick={() => setShowBulkInsideModal(false)}
                    className="btn-secondary"
                  >
                    Add Manually
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowBulkInsideModal(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>
            </div>

            {!showBulkInsideModal ? (
              <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Personal Information Section */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h3>
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
                        placeholder="Enter 11-digit roll number"
                      />
                      <p className="text-sm text-muted mt-1">
                        {formData.roll.length}/11 digits
                      </p>
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
                        placeholder="Enter 10-digit phone number"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="label">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input-field"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Information Section */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Academic Information</h3>
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

                {/* Family Information Section */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Family Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Father Name</label>
                      <input
                        type="text"
                        value={formData.fatherName}
                        onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                        className="input-field"
                        placeholder="Enter father's name"
                      />
                    </div>

                    <div>
                      <label className="label">Mother Name</label>
                      <input
                        type="text"
                        value={formData.motherName}
                        onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                        className="input-field"
                        placeholder="Enter mother's name"
                      />
                    </div>
                  </div>
                </div>

                {/* Remarks Section */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Remarks</h3>
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

                {/* Additional Information */}
                <div>
                  <label className="label">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input-field"
                    rows="3"
                    placeholder="Additional notes about the student"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowBulkInsideModal(false);
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Student
                </button>
              </div>
            </form>
            ) : (
              <div className="p-6">
                <BulkUploadPage />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
