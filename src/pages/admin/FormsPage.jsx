import { useState } from 'react';
import { Plus, FileText, ExternalLink, Download, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { createForm } from '../../api/stubs.js';
import { formatDate } from '../../utils/dateUtils.js';

export default function FormsPage() {
  const { forms, reloadForms } = useApp();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Examination',
    type: 'link',
    url: '',
    file: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.type === 'link' && !formData.url) {
        alert('Please provide a link');
        return;
      }
      if (formData.type === 'file' && !formData.file) {
        alert('Please select a file');
        return;
      }

      await createForm({
        title: formData.title,
        category: formData.category,
        type: formData.type,
        url: formData.type === 'link' ? formData.url : '#'
      });
      await reloadForms();
      setShowUploadModal(false);
      setFormData({
        title: '',
        category: 'Examination',
        type: 'link',
        url: '',
        file: null
      });
      alert('Form uploaded successfully!');
    } catch (error) {
      alert('Error uploading form');
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Frequent Forms</h1>
          <p className="text-base text-muted">
            Manage frequently used forms for students
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Upload Form
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {forms.length === 0 ? (
          <div className="col-span-full card text-center py-12">
            <p className="text-base text-muted">No forms uploaded yet</p>
          </div>
        ) : (
          forms.map((form) => (
            <div key={form.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText size={24} className="text-brand" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{form.title}</h3>
                    <p className="text-sm text-muted">{form.category}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-muted mb-1">Uploaded: {formatDate(form.uploadedAt)}</p>
              </div>

              <div className="flex gap-2">
                {form.type === 'link' ? (
                  <a
                    href={form.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex items-center gap-2 flex-1 justify-center"
                  >
                    <ExternalLink size={18} />
                    Open Form
                  </a>
                ) : (
                  <button className="btn-primary flex items-center gap-2 flex-1 justify-center">
                    <Download size={18} />
                    Download
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Upload Form</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="label">Form Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Examination Form"
                  />
                </div>

                <div>
                  <label className="label">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="Examination">Examination</option>
                    <option value="Placement">Placement</option>
                    <option value="Event Permissions">Event Permissions</option>
                    <option value="Certificates">Certificates</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="label">Form Type *</label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="input-field"
                  >
                    <option value="link">Google Form / External Link</option>
                    <option value="file">PDF File</option>
                  </select>
                </div>

                {formData.type === 'link' ? (
                  <div>
                    <label className="label">Form URL *</label>
                    <input
                      type="url"
                      required
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="input-field"
                      placeholder="https://forms.google.com/..."
                    />
                  </div>
                ) : (
                  <div>
                    <label className="label">PDF File *</label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                      className="input-field"
                    />
                    <p className="text-sm text-muted mt-1">
                      Note: File upload will be implemented in full product
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Upload Form
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

