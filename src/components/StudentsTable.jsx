import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Filter, X, Search, Download, FileText, FileSpreadsheet } from 'lucide-react';
import EmailComposer from './EmailComposer.jsx';
import StudentProfileModal from './StudentProfileModal';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

// Import jspdf-autotable - it extends jsPDF prototype
// Must be imported after jsPDF to extend the prototype
import 'jspdf-autotable';

export default function StudentsTable({ students }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sortField, setSortField] = useState('roll');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf'); // 'pdf' or 'excel'
  const [selectedColumns, setSelectedColumns] = useState({
    roll: true,
    name: true,
    fatherName: true,
    motherName: true,
    gender: true,
    category: true,
    email: true,
    phone: true,
    batch: true,
    course: true,
    branch: true,
    section: true,
    year: true,
    isLE: false,
    isCR: false,
    isLeft: false
  });
  
  // Initialize filters from URL params
  const [filters, setFilters] = useState({
    batch: searchParams.get('batch') || '',
    branch: searchParams.get('branch') || '',
    course: searchParams.get('course') || '',
    section: searchParams.get('section') || '',
    remarks: searchParams.get('remarks') || ''
  });
  const [showFilters, setShowFilters] = useState(true);
  const isUpdatingFromFilters = useRef(false);

  // Sync filters to URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.batch) params.set('batch', filters.batch);
    if (filters.branch) params.set('branch', filters.branch);
    if (filters.course) params.set('course', filters.course);
    if (filters.section) params.set('section', filters.section);
    if (filters.remarks) params.set('remarks', filters.remarks);
    
    const newParams = params.toString();
    const currentParams = searchParams.toString();
    
    // Only update if params actually changed to avoid infinite loop
    if (currentParams !== newParams) {
      isUpdatingFromFilters.current = true;
      setSearchParams(params, { replace: true });
    }
  }, [filters, setSearchParams, searchParams]);

  // Sync URL params to filters when URL changes (e.g., navigating back)
  useEffect(() => {
    // Skip if we just updated from filters to avoid loop
    if (isUpdatingFromFilters.current) {
      isUpdatingFromFilters.current = false;
      return;
    }
    
    setFilters({
      batch: searchParams.get('batch') || '',
      branch: searchParams.get('branch') || '',
      course: searchParams.get('course') || '',
      section: searchParams.get('section') || '',
      remarks: searchParams.get('remarks') || ''
    });
  }, [searchParams]);

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
      if (filters.remarks) {
        if (filters.remarks === 'LE' && !student.isLE) return false;
        if (filters.remarks === 'Left' && !student.isLeft) return false;
        if (filters.remarks === 'CR' && !student.isCR) return false;
      }
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
      aVal = a.name || '';
      bVal = b.name || '';
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
      section: '',
      remarks: ''
    });
  };

  // Require batch, branch, and course to be selected
  const hasRequiredFilters = filters.batch && filters.branch && filters.course;
  const hasActiveFilters = Object.values(filters).some(f => f !== '');
  const hasResults = filteredStudents.length > 0;

  const getStudentName = (student) => {
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

  const handleExport = () => {
    if (exportFormat === 'pdf') {
      alert('PDF export is coming soon! Please use Excel export for now.');
      return;
    } else {
      exportToExcel();
    }
    setShowExportModal(false);
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF('landscape', 'mm', 'a4');
      
      // Title
      doc.setFontSize(16);
      doc.text('Student List', 14, 15);
      doc.setFontSize(10);
      doc.text(`Total Students: ${filteredStudents.length}`, 14, 22);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 27);
      
      // Prepare table data
      const tableData = filteredStudents.map(student => {
        const row = [];
        if (selectedColumns.roll) row.push(student.roll || '-');
        if (selectedColumns.name) row.push(student.name || '-');
        if (selectedColumns.fatherName) row.push(student.fatherName || '-');
        if (selectedColumns.motherName) row.push(student.motherName || '-');
        if (selectedColumns.gender) row.push(student.gender || '-');
        if (selectedColumns.category) row.push(student.category || '-');
        if (selectedColumns.email) row.push(student.email || '-');
        if (selectedColumns.phone) row.push(student.phone || '-');
        if (selectedColumns.batch) row.push(student.batch || '-');
        if (selectedColumns.course) row.push(student.course || '-');
        if (selectedColumns.branch) row.push(student.branch || '-');
        if (selectedColumns.section) row.push(student.section || '-');
        if (selectedColumns.year) row.push(student.year || '-');
        if (selectedColumns.isLE) row.push(student.isLE ? 'Yes' : 'No');
        if (selectedColumns.isCR) row.push(student.isCR ? 'Yes' : 'No');
        if (selectedColumns.isLeft) row.push(student.isLeft ? 'Yes' : 'No');
        return row;
      });

      // Prepare headers
      const headers = [];
      if (selectedColumns.roll) headers.push('Roll No.');
      if (selectedColumns.name) headers.push('Name');
      if (selectedColumns.fatherName) headers.push('Father Name');
      if (selectedColumns.motherName) headers.push('Mother Name');
      if (selectedColumns.gender) headers.push('Gender');
      if (selectedColumns.category) headers.push('Category');
      if (selectedColumns.email) headers.push('Email');
      if (selectedColumns.phone) headers.push('Phone');
      if (selectedColumns.batch) headers.push('Batch');
      if (selectedColumns.course) headers.push('Course');
      if (selectedColumns.branch) headers.push('Branch');
      if (selectedColumns.section) headers.push('Section');
      if (selectedColumns.year) headers.push('Year');
      if (selectedColumns.isLE) headers.push('LE Student');
      if (selectedColumns.isCR) headers.push('Class Rep');
      if (selectedColumns.isLeft) headers.push('Left Student');

      // Check if we have any columns selected
      if (headers.length === 0) {
        alert('Please select at least one column to export');
        return;
      }

      // Add table - jspdf-autotable extends jsPDF prototype
      // The autoTable method is added to jsPDF instances by the plugin
      if (!doc.autoTable) {
        throw new Error('autoTable is not available. Please ensure jspdf-autotable is properly imported.');
      }
      
      doc.autoTable({
        head: [headers],
        body: tableData,
        startY: 32,
        styles: { 
          fontSize: 7,
          cellPadding: 2,
          overflow: 'linebreak'
        },
        headStyles: { 
          fillColor: [59, 130, 246],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: { 
          fillColor: [245, 247, 250] 
        },
        margin: { top: 32, left: 14, right: 14 },
        tableWidth: 'auto',
        columnStyles: {}
      });

      // Save PDF
      doc.save(`students_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const exportToExcel = () => {
    try {
      // Prepare data
      const excelData = filteredStudents.map(student => {
        const row = {};
        if (selectedColumns.roll) row['Roll No.'] = student.roll || '-';
        if (selectedColumns.name) row['Name'] = student.name || '-';
        if (selectedColumns.fatherName) row['Father Name'] = student.fatherName || '-';
        if (selectedColumns.motherName) row['Mother Name'] = student.motherName || '-';
        if (selectedColumns.gender) row['Gender'] = student.gender || '-';
        if (selectedColumns.category) row['Category'] = student.category || '-';
        if (selectedColumns.email) row['Email'] = student.email || '-';
        if (selectedColumns.phone) row['Phone'] = student.phone || '-';
        if (selectedColumns.batch) row['Batch'] = student.batch || '-';
        if (selectedColumns.course) row['Course'] = student.course || '-';
        if (selectedColumns.branch) row['Branch'] = student.branch || '-';
        if (selectedColumns.section) row['Section'] = student.section || '-';
        if (selectedColumns.year) row['Year'] = student.year || '-';
        if (selectedColumns.isLE) row['LE Student'] = student.isLE ? 'Yes' : 'No';
        if (selectedColumns.isCR) row['Class Rep'] = student.isCR ? 'Yes' : 'No';
        if (selectedColumns.isLeft) row['Left Student'] = student.isLeft ? 'Yes' : 'No';
        return row;
      });

      // Check if we have any columns selected
      if (excelData.length > 0 && Object.keys(excelData[0]).length === 0) {
        alert('Please select at least one column to export');
        return;
      }

      // Create workbook and worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Students');

      // Set column widths
      const colWidths = [];
      if (selectedColumns.roll) colWidths.push({ wch: 15 });
      if (selectedColumns.name) colWidths.push({ wch: 25 });
      if (selectedColumns.fatherName) colWidths.push({ wch: 20 });
      if (selectedColumns.motherName) colWidths.push({ wch: 20 });
      if (selectedColumns.gender) colWidths.push({ wch: 10 });
      if (selectedColumns.category) colWidths.push({ wch: 10 });
      if (selectedColumns.email) colWidths.push({ wch: 30 });
      if (selectedColumns.phone) colWidths.push({ wch: 15 });
      if (selectedColumns.batch) colWidths.push({ wch: 12 });
      if (selectedColumns.course) colWidths.push({ wch: 15 });
      if (selectedColumns.branch) colWidths.push({ wch: 15 });
      if (selectedColumns.section) colWidths.push({ wch: 10 });
      if (selectedColumns.year) colWidths.push({ wch: 8 });
      if (selectedColumns.isLE) colWidths.push({ wch: 12 });
      if (selectedColumns.isCR) colWidths.push({ wch: 12 });
      if (selectedColumns.isLeft) colWidths.push({ wch: 12 });
      ws['!cols'] = colWidths;

      // Save file
      XLSX.writeFile(wb, `students_${new Date().getTime()}.xlsx`);
    } catch (error) {
      console.error('Error generating Excel:', error);
      alert('Error generating Excel file. Please try again.');
    }
  };

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

            <div>
              <label className="label text-sm">Remarks</label>
              <select
                value={filters.remarks}
                onChange={(e) => setFilters({ ...filters, remarks: e.target.value })}
                className="input-field text-base"
              >
                <option value="">All</option>
                <option value="LE">LE Students</option>
                <option value="Left">Left Students</option>
                <option value="CR">Class Representatives</option>
              </select>
            </div>
            </div>
            {hasActiveFilters && (
              <div className="mt-3 flex flex-wrap gap-2">
                {filters.batch && (
                  <span className="px-3 py-1 bg-brand bg-opacity-10 text-brand rounded-full text-sm">Batch: {filters.batch}</span>
                )}
                {filters.course && (
                  <span className="px-3 py-1 bg-brand bg-opacity-10 text-brand rounded-full text-sm">Course: {filters.course}</span>
                )}
                {filters.branch && (
                  <span className="px-3 py-1 bg-brand bg-opacity-10 text-brand rounded-full text-sm">Branch: {filters.branch}</span>
                )}
                {filters.section && (
                  <span className="px-3 py-1 bg-brand bg-opacity-10 text-brand rounded-full text-sm">Section: {filters.section}</span>
                )}
                {filters.remarks && (
                  <span className="px-3 py-1 bg-brand bg-opacity-10 text-brand rounded-full text-sm">
                    {filters.remarks === 'LE' ? 'LE Students' : filters.remarks === 'Left' ? 'Left Students' : 'Class Representatives'}
                  </span>
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
                <button
                  onClick={() => setShowExportModal(true)}
                  disabled={!hasResults}
                  className={`btn-secondary flex items-center gap-2 ${!hasResults ? 'opacity-60 cursor-not-allowed' : ''}`}
                  title={!hasResults ? 'No filtered students to export' : 'Export filtered students'}
                >
                  <Download size={18} />
                  Export ({selectedStudents.length})
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
                    <th className="px-4 py-3 text-left text-base font-semibold text-gray-900">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedStudents.map((student, index) => (
                    <tr
                      key={student.id}
                      onClick={() => {
                        const params = new URLSearchParams();
                        if (filters.batch) params.set('batch', filters.batch);
                        if (filters.branch) params.set('branch', filters.branch);
                        if (filters.course) params.set('course', filters.course);
                        if (filters.section) params.set('section', filters.section);
                        if (filters.remarks) params.set('remarks', filters.remarks);
                        navigate(`/admin/students/${student.roll}?${params.toString()}`);
                      }}
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
                      <td className="px-4 py-3 text-base text-gray-700">
                        <div className="flex gap-1 flex-wrap">
                          {student.isCR && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">CR</span>
                          )}
                          {student.isLE && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">LE</span>
                          )}
                          {student.isLeft && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-semibold">Left</span>
                          )}
                          {!student.isCR && !student.isLE && !student.isLeft && (
                            <span className="text-gray-400 text-xs">-</span>
                          )}
                        </div>
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

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Export Students</h2>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Format Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Format</h3>
                <div className="flex gap-4">
                  <label className="flex items-center gap-3 cursor-pointer p-4 border-2 rounded-lg border-gray-200 hover:border-brand transition-colors flex-1 relative">
                    <input
                      type="radio"
                      name="exportFormat"
                      value="pdf"
                      checked={exportFormat === 'pdf'}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="w-5 h-5 text-brand"
                    />
                    <FileText size={24} className="text-brand" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">PDF</p>
                        <span className="px-2 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded">
                          Coming Soon
                        </span>
                      </div>
                      <p className="text-sm text-muted">Portable Document Format</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-4 border-2 rounded-lg border-gray-200 hover:border-brand transition-colors flex-1">
                    <input
                      type="radio"
                      name="exportFormat"
                      value="excel"
                      checked={exportFormat === 'excel'}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="w-5 h-5 text-brand"
                    />
                    <FileSpreadsheet size={24} className="text-brand" />
                    <div>
                      <p className="font-medium text-gray-900">Excel</p>
                      <p className="text-sm text-muted">Microsoft Excel (.xlsx)</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Column Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Columns to Include</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      checked={selectedColumns.roll}
                      onChange={(e) => setSelectedColumns({ ...selectedColumns, roll: e.target.checked })}
                      className="w-5 h-5 text-brand border-gray-300 rounded focus:ring-brand"
                    />
                    <span className="text-base text-gray-900">Roll Number / Enrollment Number</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      checked={selectedColumns.name}
                      onChange={(e) => setSelectedColumns({ ...selectedColumns, name: e.target.checked })}
                      className="w-5 h-5 text-brand border-gray-300 rounded focus:ring-brand"
                    />
                    <span className="text-base text-gray-900">Name</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      checked={selectedColumns.fatherName}
                      onChange={(e) => setSelectedColumns({ ...selectedColumns, fatherName: e.target.checked })}
                      className="w-5 h-5 text-brand border-gray-300 rounded focus:ring-brand"
                    />
                    <span className="text-base text-gray-900">Father Name</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      checked={selectedColumns.motherName}
                      onChange={(e) => setSelectedColumns({ ...selectedColumns, motherName: e.target.checked })}
                      className="w-5 h-5 text-brand border-gray-300 rounded focus:ring-brand"
                    />
                    <span className="text-base text-gray-900">Mother Name</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      checked={selectedColumns.gender}
                      onChange={(e) => setSelectedColumns({ ...selectedColumns, gender: e.target.checked })}
                      className="w-5 h-5 text-brand border-gray-300 rounded focus:ring-brand"
                    />
                    <span className="text-base text-gray-900">Gender</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      checked={selectedColumns.category}
                      onChange={(e) => setSelectedColumns({ ...selectedColumns, category: e.target.checked })}
                      className="w-5 h-5 text-brand border-gray-300 rounded focus:ring-brand"
                    />
                    <span className="text-base text-gray-900">Category</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      checked={selectedColumns.email}
                      onChange={(e) => setSelectedColumns({ ...selectedColumns, email: e.target.checked })}
                      className="w-5 h-5 text-brand border-gray-300 rounded focus:ring-brand"
                    />
                    <span className="text-base text-gray-900">Email</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      checked={selectedColumns.phone}
                      onChange={(e) => setSelectedColumns({ ...selectedColumns, phone: e.target.checked })}
                      className="w-5 h-5 text-brand border-gray-300 rounded focus:ring-brand"
                    />
                    <span className="text-base text-gray-900">Phone Number</span>
                  </label>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Academic Details:</p>
                    <div className="space-y-2 pl-4">
                      <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          checked={selectedColumns.batch}
                          onChange={(e) => setSelectedColumns({ ...selectedColumns, batch: e.target.checked })}
                          className="w-5 h-5 text-brand border-gray-300 rounded focus:ring-brand"
                        />
                        <span className="text-base text-gray-900">Batch</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          checked={selectedColumns.course}
                          onChange={(e) => setSelectedColumns({ ...selectedColumns, course: e.target.checked })}
                          className="w-5 h-5 text-brand border-gray-300 rounded focus:ring-brand"
                        />
                        <span className="text-base text-gray-900">Course</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          checked={selectedColumns.branch}
                          onChange={(e) => setSelectedColumns({ ...selectedColumns, branch: e.target.checked })}
                          className="w-5 h-5 text-brand border-gray-300 rounded focus:ring-brand"
                        />
                        <span className="text-base text-gray-900">Branch</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          checked={selectedColumns.section}
                          onChange={(e) => setSelectedColumns({ ...selectedColumns, section: e.target.checked })}
                          className="w-5 h-5 text-brand border-gray-300 rounded focus:ring-brand"
                        />
                        <span className="text-base text-gray-900">Section</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          checked={selectedColumns.year}
                          onChange={(e) => setSelectedColumns({ ...selectedColumns, year: e.target.checked })}
                          className="w-5 h-5 text-brand border-gray-300 rounded focus:ring-brand"
                        />
                        <span className="text-base text-gray-900">Year</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Remarks Section */}
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Remarks:</p>
                    <div className="space-y-2 pl-4">
                      <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          checked={selectedColumns.isLE}
                          onChange={(e) => setSelectedColumns({ ...selectedColumns, isLE: e.target.checked })}
                          className="w-5 h-5 text-brand border-gray-300 rounded focus:ring-brand"
                        />
                        <span className="text-base text-gray-900">LE Student (Leave of Absence/Lateral Entry)</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          checked={selectedColumns.isCR}
                          onChange={(e) => setSelectedColumns({ ...selectedColumns, isCR: e.target.checked })}
                          className="w-5 h-5 text-brand border-gray-300 rounded focus:ring-brand"
                        />
                        <span className="text-base text-gray-900">Class Representative (CR)</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          checked={selectedColumns.isLeft}
                          onChange={(e) => setSelectedColumns({ ...selectedColumns, isLeft: e.target.checked })}
                          className="w-5 h-5 text-brand border-gray-300 rounded focus:ring-brand"
                        />
                        <span className="text-base text-gray-900">Left Student (Discontinued)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>{filteredStudents.length}</strong> student(s) will be exported as <strong>{exportFormat.toUpperCase()}</strong> with <strong>{Object.values(selectedColumns).filter(Boolean).length}</strong> column(s) selected.
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={Object.values(selectedColumns).every(v => !v) || exportFormat === 'pdf'}
                className={`btn-primary flex items-center gap-2 ${Object.values(selectedColumns).every(v => !v) || exportFormat === 'pdf' ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <Download size={18} />
                {exportFormat === 'pdf' ? 'Coming Soon' : `Export ${exportFormat.toUpperCase()}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
