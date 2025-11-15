import { useState } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { parseCSV, validateStudentRow, mapCSVRowToStudent } from '../../utils/csvParser.js';
import { bulkImportStudents } from '../../api/stubs.js';
import { useApp } from '../../context/AppContext';

const defaultFieldMapping = {
  roll: 'roll',
  name: 'name',
  phone: 'phone',
  email: 'email',
  batch: 'batch',
  branch: 'branch',
  course: 'course',
  section: 'section',
  year: 'year',
  gender: 'gender',
  category: 'category',
  motherName: 'motherName',
  fatherName: 'fatherName',
  isLE: 'isLE',
  isLeft: 'isLeft',
  isCR: 'isCR',
  notes: 'notes'
};

export default function BulkUploadPage() {
  const { reloadStudents } = useApp();
  const [csvData, setCsvData] = useState(null);
  const [fieldMapping, setFieldMapping] = useState(defaultFieldMapping);
  const [previewRows, setPreviewRows] = useState([]);
  const [errors, setErrors] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const { headers, rows } = parseCSV(text);
      
      setCsvData({ headers, rows });
      setPreviewRows(rows.slice(0, 10)); // Preview first 10 rows
      
      // Auto-map fields if headers match
      const autoMapping = { ...defaultFieldMapping };
      headers.forEach(header => {
        const lowerHeader = header.toLowerCase();
        Object.keys(defaultFieldMapping).forEach(field => {
          if (lowerHeader.includes(field)) {
            autoMapping[field] = header;
          }
        });
      });
      setFieldMapping(autoMapping);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!csvData) return;

    setUploading(true);
    setErrors([]);

    const validationErrors = [];
    const validStudents = [];

    csvData.rows.forEach((row, index) => {
      const rowErrors = validateStudentRow(row, fieldMapping);
      if (rowErrors.length > 0) {
        validationErrors.push({
          row: index + 2, // +2 because of header and 0-index
          errors: rowErrors
        });
      } else {
        validStudents.push(mapCSVRowToStudent(row, fieldMapping));
      }
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setUploading(false);
      alert(`Found ${validationErrors.length} rows with errors. Please fix them before importing.`);
      return;
    }

    try {
      await bulkImportStudents(validStudents);
      await reloadStudents();
      setCsvData(null);
      setPreviewRows([]);
      setErrors([]);
      alert(`Successfully imported ${validStudents.length} students!`);
    } catch (error) {
      alert('Error importing students');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Bulk Upload</h1>
        <p className="text-base text-muted">
          Upload CSV file to import multiple students at once
        </p>
      </div>

      <div className="card mb-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Upload CSV File</h2>
            <p className="text-base text-muted mb-4">
              Your CSV file should contain columns for: Roll Number (11 digits), Name, Phone (10 digits), Email, Batch, Branch, Course, Section, Year, Gender, Category, Mother Name, Father Name, Notes
            </p>
          </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <FileSpreadsheet size={48} className="mx-auto text-muted mb-4" />
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className="btn-primary inline-flex items-center gap-2 cursor-pointer"
          >
            <Upload size={20} />
            Choose CSV File
          </label>
          <p className="text-sm text-muted mt-2">
            Supported format: CSV (Comma-separated values)
          </p>
        </div>
      </div>

      {csvData && (
        <>
          <div className="card mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Field Mapping</h2>
            <p className="text-base text-muted mb-4">
              Map your CSV columns to student data fields
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.keys(defaultFieldMapping).map((field) => (
                <div key={field}>
                  <label className="label capitalize">
                    {field}
                  </label>
                  <select
                    value={fieldMapping[field]}
                    onChange={(e) =>
                      setFieldMapping({ ...fieldMapping, [field]: e.target.value })
                    }
                    className="input-field"
                  >
                    <option value="">Select column...</option>
                    {csvData.headers.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="card mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Preview (First 10 Rows)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left">Roll</th>
                    <th className="px-3 py-2 text-left">Name</th>
                    <th className="px-3 py-2 text-left">Batch</th>
                    <th className="px-3 py-2 text-left">Branch</th>
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="px-3 py-2">{row[fieldMapping.roll] || '-'}</td>
                      <td className="px-3 py-2">{row[fieldMapping.name] || '-'}</td>
                      <td className="px-3 py-2">{row[fieldMapping.batch] || '-'}</td>
                      <td className="px-3 py-2">{row[fieldMapping.branch] || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted mt-2">
              Total rows in file: {csvData.rows.length}
            </p>
          </div>

          {errors.length > 0 && (
            <div className="card mb-6 bg-red-50 border-red-200">
              <h2 className="text-xl font-bold text-red-900 mb-4">Validation Errors</h2>
              <div className="space-y-2">
                {errors.map((error, idx) => (
                  <div key={idx} className="text-base">
                    <strong>Row {error.row}:</strong> {error.errors.join(', ')}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setCsvData(null);
                setPreviewRows([]);
                setErrors([]);
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={uploading}
              className="btn-primary"
            >
              {uploading ? 'Importing...' : `Import ${csvData.rows.length} Students`}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

