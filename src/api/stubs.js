/**
 * API stubs for prototype - returns mock data
 * Replace with real API calls in full product
 */

// Load sample students data
let studentsData = null;

async function loadStudentsData() {
  if (!studentsData) {
    const response = await fetch('/sample-students.json');
    const data = await response.json();
    studentsData = data.students;
  }
  return studentsData;
}

// Students API
export async function getStudents(query = '') {
  const students = await loadStudentsData();
  
  if (!query || query.trim() === '') {
    return students;
  }
  
  const searchTerm = query.trim().toLowerCase();
  return students.filter(s => {
    const name = (s.name || '').toLowerCase();
    return name.includes(searchTerm) ||
           s.roll.toLowerCase().includes(searchTerm) ||
           s.phone.includes(searchTerm) ||
           s.email.toLowerCase().includes(searchTerm);
  });
}

export async function getStudentById(id) {
  const students = await loadStudentsData();
  return students.find(s => s.id === id);
}

export async function getStudentByRoll(roll) {
  const students = await loadStudentsData();
  return students.find(s => (s.roll || '').toString() === roll);
}

export async function createStudent(studentData) {
  // In prototype: add to local array
  const students = await loadStudentsData();
  const newStudent = {
    id: `S${Date.now()}${Math.random().toString(36).substr(2, 4)}`,
    ...studentData
  };
  students.push(newStudent);
  return newStudent;
}

export async function updateStudent(roll, studentData) {
  // In prototype: update in local array
  const students = await loadStudentsData();
  const index = students.findIndex(s => (s.roll || '').toString() === roll);
  if (index !== -1) {
    students[index] = { ...students[index], ...studentData };
    return students[index];
  }
  throw new Error('Student not found');
}

export async function deleteStudent(roll) {
  // In prototype: remove from local array
  const students = await loadStudentsData();
  const index = students.findIndex(s => (s.roll || '').toString() === roll);
  if (index !== -1) {
    students.splice(index, 1);
    return { success: true };
  }
  throw new Error('Student not found');
}

export async function bulkImportStudents(studentsArray) {
  // In prototype: add all to local array
  const students = await loadStudentsData();
  students.push(...studentsArray);
  return { success: true, count: studentsArray.length };
}

// Notices API
let noticesData = [
  {
    id: 'N1001',
    title: 'Semester Exam Schedule',
    category: 'Academic',
    description: 'Exams start on 10th Dec. Check hall tickets.',
    publishedAt: new Date().toISOString(),
    expiryAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    pinned: true,
    attachments: []
  }
];

export async function getNotices() {
  // Filter out expired notices
  const now = new Date();
  return noticesData.filter(n => new Date(n.expiryAt) > now);
}

export async function createNotice(noticeData) {
  const newNotice = {
    id: `N${Date.now()}`,
    ...noticeData,
    publishedAt: new Date().toISOString()
  };
  noticesData.push(newNotice);
  return newNotice;
}

export async function deleteNotice(id) {
  noticesData = noticesData.filter(n => n.id !== id);
  return { success: true };
}

// Forms API
let formsData = [
  {
    id: 'F1001',
    title: 'Examination Form',
    category: 'Examination',
    type: 'link',
    url: 'https://forms.google.com/example',
    uploadedAt: new Date().toISOString()
  }
];

export async function getForms() {
  return formsData;
}

export async function createForm(formData) {
  const newForm = {
    id: `F${Date.now()}`,
    ...formData,
    uploadedAt: new Date().toISOString()
  };
  formsData.push(newForm);
  return newForm;
}

// Helpdesk API
let ticketsData = [
  {
    id: 'T2001',
    studentRoll: '2025CS001',
    studentName: 'Ravi Kumar',
    category: 'Certificate',
    description: 'Request for participation certificate.',
    status: 'Pending',
    createdAt: new Date().toISOString(),
    responses: []
  }
];

export async function getTickets() {
  return ticketsData;
}

export async function createTicket(ticketData) {
  const newTicket = {
    id: `T${Date.now()}`,
    ...ticketData,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    responses: []
  };
  ticketsData.push(newTicket);
  return newTicket;
}

export async function updateTicketStatus(id, status, response) {
  const ticket = ticketsData.find(t => t.id === id);
  if (ticket) {
    ticket.status = status;
    if (response) {
      ticket.responses.push({
        message: response,
        respondedAt: new Date().toISOString(),
        respondedBy: 'Admin'
      });
    }
  }
  return ticket;
}

// Email API
export async function sendEmail(emailData) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        messageId: `MSG${Date.now()}`,
        sentAt: new Date().toISOString()
      });
    }, 1000);
  });
}

