/**
 * CSV parsing utility for bulk upload
 */

export function parseCSV(csvText) {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  if (lines.length === 0) return { headers: [], rows: [] };
  
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    return row;
  });
  
  return { headers, rows };
}

export function validateStudentRow(row, fieldMapping) {
  const errors = [];
  
  // Check required fields
  const requiredFields = ['roll', 'name', 'phone', 'batch', 'branch'];
  requiredFields.forEach(field => {
    const mappedField = fieldMapping[field];
    if (!mappedField || !row[mappedField] || row[mappedField].trim() === '') {
      errors.push(`${field} is required`);
    }
  });
  
  // Validate roll number (11 digits)
  const rollField = fieldMapping.roll;
  if (rollField && row[rollField]) {
    const roll = row[rollField].replace(/\D/g, '');
    if (roll.length !== 11) {
      errors.push('Roll number must be 11 digits');
    }
  }
  
  // Validate phone number (10 digits)
  const phoneField = fieldMapping.phone;
  if (phoneField && row[phoneField]) {
    const phone = row[phoneField].replace(/\D/g, '');
    if (phone.length !== 10) {
      errors.push('Phone number must be 10 digits');
    }
  }
  
  return errors;
}

export function mapCSVRowToStudent(row, fieldMapping) {
  const branch = row[fieldMapping.branch] || '';
  const courseMap = {
    'CSE': 'B.Tech Computer Science',
    'IT': 'B.Tech Information Technology',
    'CSE AI': 'B.Tech Computer Science (AI)',
    'CSE DS': 'B.Tech Computer Science (Data Science)',
    'ECE': 'B.Tech Electronics'
  };
  
  return {
    id: `S${Date.now()}${Math.random().toString(36).substr(2, 4)}`,
    roll: row[fieldMapping.roll] || '',
    name: row[fieldMapping.name] || '',
    phone: row[fieldMapping.phone] || '',
    email: row[fieldMapping.email] || '',
    batch: row[fieldMapping.batch] || '',
    branch: branch,
    course: row[fieldMapping.course] || courseMap[branch] || '',
    section: row[fieldMapping.section] || '',
    year: parseInt(row[fieldMapping.year]) || 1,
    gender: row[fieldMapping.gender] || '',
    category: row[fieldMapping.category] || '',
    motherName: row[fieldMapping.motherName] || '',
    fatherName: row[fieldMapping.fatherName] || '',
    isLE: row[fieldMapping.isLE] === 'true' || row[fieldMapping.isLE] === true,
    isLeft: row[fieldMapping.isLeft] === 'true' || row[fieldMapping.isLeft] === true,
    isCR: row[fieldMapping.isCR] === 'true' || row[fieldMapping.isCR] === true,
    notes: row[fieldMapping.notes] || ''
  };
}

