import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, X, Search } from 'lucide-react';
import EmailComposer from './EmailComposer.jsx';
import StudentProfileModal from './StudentProfileModal';

export default function StudentsTable({ students }) {
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sortField, setSortField] = useState('roll');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    batch: '',
    branch: '',
    course: '',
    section: ''
  });
  const [showFilters, setShowFilters] = useState(true);

  // Get unique values for filter dropdowns
  const uniqueBatches = useMemo(() => {
    return [...new Set(students.map(s => s.batch).filter(Boolean))].sort();
  }, [students]);

  const uniqueBranches = useMemo(() => {
    return [...new Set(students.map(s => s.branch).filter(Boolean))].sort();
  }, [students]);

  const uniqueCourses = useMemo(() => {
    return ['B.Tech', 'MBA', 'MCA'];
  }, []);

  const uniqueSections = useMemo(() => {
    return [...new Set(students.map(s => s.section).filter(Boolean))].sort();
  }, [students]);

  // Extract course type from full course name
  const getCourseType = (course) => {
    if (!course) return '';
    if (course.includes('B.Tech')) return 'B.Tech';
    if (course.includes('MBA')) return 'MBA';
    if (course.includes('MCA')) return 'MCA';
    return course;
  };

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      if (filters.batch && student.batch !== filters.batch) return false;
      if (filters.branch && student.branch !== filters.branch) return false;
      if (filters.course) {
        const studentCourseType = getCourseType(student.course);
        if (studentCourseType !== filters.course) return false;
      }
      if (filters.section && student.section !== filters.section) return false;
      return true;
    });
  }, [students, filters]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let aVal, bVal;
    
    if (sortField === 'name') {
      aVal = `${a.firstName || ''} ${a.lastName || ''}`.trim() || a.name || '';
      bVal = `${b.firstName || ''} ${b.lastName || ''}`.trim() || b.name || '';
    } else {
      aVal = a[sortField] || '';
      bVal = b[sortField] || '';
    }
    
    if (sortOrder === 'asc') {
      return aVal.localeCompare(bVal);
    } else {
      return bVal.localeCompare(aVal);
    }
  });

  const clearFilters = () => {
    setFilters({
      batch: '',
      branch: '',
      course: '',
      section: ''
    });
  };

  // Require batch, branch, and course to be selected
  const hasRequiredFilters = filters.batch && filters.branch && filters.course;
  const hasActiveFilters = Object.values(filters).some(f => f !== '');
  const hasResults = filteredStudents.length > 0;

  const getStudentName = (student) => {
    if (student.firstName && student.lastName) {
      return `${student.firstName} ${student.lastName}`;
    }
    return student.name || 'N/A';
  };

  // Get headline text
  const getHeadline = () => {
    const courseBranch = `${filters.course || ''}${filters.course && filters.branch ? ' - ' : ''}${filters.branch || ''}`.trim();
    const sectionPart = `Section ${filters.section || 'All'}`;
    const batchPart = `Batch: ${filters.batch || 'All'}`;
    return `${courseBranch} ${courseBranch ? '' : ''}${sectionPart} | ${batchPart}`.trim();
  };

  const selectedStudents = filteredStudents;

  return (
    <>
      <div className="card mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary flex items-center gap-2 ${
                hasActiveFilters ? 'bg-brand text-white hover:bg-opacity-90' : ''
              }`}
            >
              <Filter size={18} />
              {showFilters ? 'Hide' : 'Show'} Filters
              {hasActiveFilters && (
                <span className="bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-sm">
                  {Object.values(filters).filter(f => f !== '').length}
                </span>
              )}
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-base text-muted hover:text-gray-900 flex items-center gap-1"
              >
                <X size={16} />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-sm text-brand hover:underline">
                  Reset
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="label text-sm">Batch *</label>
              <select
                required
                value={filters.batch}
                onChange={(e) => setFilters({ ...filters, batch: e.target.value })}
                className="input-field text-base"
              >
                <option value="">Select Batch</option>
                {uniqueBatches.map(batch => (
                  <option key={batch} value={batch}>{batch}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label text-sm">Branch *</label>
              <select
                required
                value={filters.branch}
                onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
                className="input-field text-base"
              >
                <option value="">Select Branch</option>
                {uniqueBranches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label text-sm">Course *</label>
              <select
                required
                value={filters.course}
                onChange={(e) => setFilters({ ...filters, course: e.target.value })}
                className="input-field text-base"
              >
                <option value="">Select Course</option>
                {uniqueCourses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label text-sm">Section</label>
              <select
                value={filters.section}
                onChange={(e) => setFilters({ ...filters, section: e.target.value })}
                className="input-field text-base"
              >
                <option value="">All Sections</option>
                {uniqueSections.map(section => (
                  <option key={section} value={section}>Section {section}</option>
                ))}
              </select>
            </div>
            </div>
            {hasActiveFilters && (
              <div className="mt-3 flex flex-wrap gap-2">
                {filters.batch && (
                  <span className="px-3 py-1 bg-brand bg-opacity-10 text-brand rounded-full text-sm">Batch: {filters.batch}</span>
                )}
                {filters.branch && (
                  <span className="px-3 py-1 bg-brand bg-opacity-10 text-brand rounded-full text-sm">Branch: {filters.branch}</span>
                )}
                {filters.course && (
                  <span className="px-3 py-1 bg-brand bg-opacity-10 text-brand rounded-full text-sm">Course: {filters.course}</span>
                )}
                {filters.section && (
                  <span className="px-3 py-1 bg-brand bg-opacity-10 text-brand rounded-full text-sm">Section: {filters.section}</span>
                )}
              </div>
            )}
          </div>
        )}

        {!hasRequiredFilters && (
          <div className="text-center py-12">
            <Search size={48} className="mx-auto text-muted mb-4" />
            <p className="text-xl font-semibold text-gray-900 mb-2">
              Select filters to view students
            </p>
            <p className="text-base text-muted">
              Please select Batch, Branch, and Course to see the student list
            </p>
          </div>
        )}
      </div>

      {hasRequiredFilters && hasResults && (
        <>
          {/* Headline */}
          <div className="card mb-4 bg-brand bg-opacity-5 border-l-4 border-brand">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {getHeadline()}
                </h2>
                <p className="text-base text-muted mt-1">
                  Total: {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowEmailComposer(true)}
                  disabled={!hasResults}
                  className={`btn-primary ${!hasResults ? 'opacity-60 cursor-not-allowed' : ''}`}
                  title={!hasResults ? 'No filtered students to email' : 'Email all filtered students'}
                >
                  Email Filtered ({selectedStudents.length})
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-base font-semibold text-gray-900">
                      <button
                        onClick={() => handleSort('sno')}
                        className="flex items-center gap-2 hover:text-brand"
                      >
                        S.No.
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-base font-semibold text-gray-900">
                      <button
                        onClick={() => handleSort('roll')}
                        className="flex items-center gap-2 hover:text-brand"
                      >
                        Roll Number
                        {sortField === 'roll' && (
                          <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-base font-semibold text-gray-900">
                      <button
                        onClick={() => handleSort('name')}
                        className="flex items-center gap-2 hover:text-brand"
                      >
                        Name
                        {sortField === 'name' && (
                          <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-base font-semibold text-gray-900">
                      Batch
                    </th>
                    <th className="px-4 py-3 text-left text-base font-semibold text-gray-900">
                      Course
                    </th>
                    <th className="px-4 py-3 text-left text-base font-semibold text-gray-900">
                      Branch
                    </th>
                    <th className="px-4 py-3 text-left text-base font-semibold text-gray-900">
                      Section
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedStudents.map((student, index) => (
                    <tr
                      key={student.id}
                      onClick={() => navigate(`/admin/students/${student.roll}`)}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 text-base text-gray-700">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-base text-gray-900 font-medium">
                        {student.roll}
                      </td>
                      <td className="px-4 py-3 text-base text-gray-900 font-medium">
                        {getStudentName(student)}
                      </td>
                      <td className="px-4 py-3 text-base text-gray-700">
                        {student.batch || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-base text-gray-700">
                        {student.course || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-base text-gray-700">
                        {student.branch || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-base text-gray-700">
                        {student.section ? `Section ${student.section}` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {hasRequiredFilters && !hasResults && (
        <div className="card text-center py-12">
          <p className="text-base text-muted">No students found matching the selected filters</p>
        </div>
      )}

      {selectedStudent && (
        <StudentProfileModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      {showEmailComposer && (
        <EmailComposer
          onClose={() => setShowEmailComposer(false)}
          students={students}
          selectedStudents={selectedStudents}
          mode="filtered"
        />
      )}
    </>
  );
}
