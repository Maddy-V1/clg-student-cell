/**
 * Search utility functions for client-side filtering
 */

export function searchStudents(students, query) {
  if (!query || query.trim() === '') {
    return [];
  }
  
  const searchTerm = query.trim().toLowerCase();
  
  return students.filter(student => {
    const firstName = (student.firstName || '').toLowerCase();
    const lastName = (student.lastName || '').toLowerCase();
    const fullName = `${firstName} ${lastName}`.trim();
    const nameMatch = firstName.includes(searchTerm) || 
                     lastName.includes(searchTerm) || 
                     fullName.includes(searchTerm) ||
                     (student.name && student.name.toLowerCase().includes(searchTerm));
    const rollMatch = student.roll.toLowerCase().includes(searchTerm);
    const phoneMatch = student.phone.includes(searchTerm);
    const emailMatch = student.email.toLowerCase().includes(searchTerm);
    
    return nameMatch || rollMatch || phoneMatch || emailMatch;
  });
}

export function highlightMatch(text, query) {
  if (!query || !text) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

