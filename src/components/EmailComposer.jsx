import { useState } from 'react';
import { X, Send, Mail } from 'lucide-react';
import { sendEmail } from '../api/stubs.js';

const emailTemplates = [
  {
    name: 'General Announcement',
    subject: 'Important Announcement',
    body: 'Dear Students,\n\nThis is to inform you that...\n\nThank you,\nStudent Cell'
  },
  {
    name: 'Event Notification',
    subject: 'Upcoming Event',
    body: 'Dear Students,\n\nWe are pleased to announce an upcoming event...\n\nDate: [Date]\nTime: [Time]\nVenue: [Venue]\n\nThank you,\nStudent Cell'
  },
  {
    name: 'Examination Notice',
    subject: 'Examination Schedule',
    body: 'Dear Students,\n\nPlease find the examination schedule attached...\n\nThank you,\nStudent Cell'
  }
];

export default function EmailComposer({ onClose, students, selectedStudents = [], mode = 'default' }) {
  const [recipientType, setRecipientType] = useState(mode === 'filtered' ? 'selected' : 'all');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [sending, setSending] = useState(false);

  const hasSelected = Array.isArray(selectedStudents) && selectedStudents.length > 0;
  const selectedCount = hasSelected ? selectedStudents.length : 0;

  const handleTemplateSelect = (templateName) => {
    const template = emailTemplates.find(t => t.name === templateName);
    if (template) {
      setSubject(template.subject);
      setBody(template.body);
      setSelectedTemplate(templateName);
    }
  };

  const handleSendTest = () => {
    alert('Test email would be sent to admin@college.edu\n\nSubject: ' + subject + '\n\nBody:\n' + body);
  };

  const handleSend = async () => {
    if (!subject || !body) {
      alert('Please fill in subject and body');
      return;
    }

    setSending(true);
    try {
      let recipientCount = 0;
      if (recipientType === 'all') {
        recipientCount = students.length;
      } else if (recipientType === 'batch') {
        recipientCount = students.filter(s => s.batch === selectedBatch).length;
      } else if (recipientType === 'selected') {
        recipientCount = selectedCount;
      }

      const result = await sendEmail({
        recipientType,
        selectedBatch,
        selectedIds: recipientType === 'selected' ? selectedStudents.map(s => s.id) : undefined,
        subject,
        body,
        recipientCount
      });

      alert(`Email sent successfully to ${recipientCount} recipients!\nMessage ID: ${result.messageId}`);
      onClose();
    } catch (error) {
      alert('Error sending email');
    } finally {
      setSending(false);
    }
  };

  const uniqueBatches = [...new Set(students.map(s => s.batch))].sort();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Email Broadcast</h2>
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
            <label className="label">Email Template (Optional)</label>
            <select
              value={selectedTemplate}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              className="input-field"
            >
              <option value="">Select a template...</option>
              {emailTemplates.map((template) => (
                <option key={template.name} value={template.name}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          {mode !== 'filtered' ? (
            <div className="mb-6">
              <label className="label">Recipients *</label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="recipientType"
                    value="all"
                    checked={recipientType === 'all'}
                    onChange={(e) => setRecipientType(e.target.value)}
                    className="w-5 h-5"
                  />
                  <span className="text-base">All Students ({students.length})</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="recipientType"
                    value="batch"
                    checked={recipientType === 'batch'}
                    onChange={(e) => setRecipientType(e.target.value)}
                    className="w-5 h-5"
                  />
                  <span className="text-base">By Batch</span>
                </label>
                {hasSelected && (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="recipientType"
                      value="selected"
                      checked={recipientType === 'selected'}
                      onChange={(e) => setRecipientType(e.target.value)}
                      className="w-5 h-5"
                    />
                    <span className="text-base">Selected ({selectedCount})</span>
                  </label>
                )}
                {recipientType === 'batch' && (
                  <select
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="input-field ml-8"
                  >
                    <option value="">Select batch...</option>
                    {uniqueBatches.map((batch) => (
                      <option key={batch} value={batch}>
                        {batch} ({students.filter(s => s.batch === batch).length} students)
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <label className="label">Recipients</label>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-base text-gray-900">
                  Filtered students: <strong>{selectedCount}</strong>
                </p>
                <p className="text-sm text-muted mt-1">This email will be sent only to the students currently visible in the list.</p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="label">Subject *</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="input-field"
              placeholder="Enter email subject"
            />
          </div>

          <div className="mb-6">
            <label className="label">Message Body *</label>
            <textarea
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="input-field"
              rows="12"
              placeholder="Enter your message..."
            />
            <p className="text-sm text-muted mt-2">
              You can use placeholders like [Student Name], [Roll Number] which will be replaced when sending.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSendTest}
              className="btn-secondary flex items-center gap-2"
            >
              <Mail size={18} />
              Send Test
            </button>
            <button
              onClick={handleSend}
              disabled={sending || !subject || !body}
              className="btn-primary flex items-center gap-2"
            >
              <Send size={18} />
              {sending ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

