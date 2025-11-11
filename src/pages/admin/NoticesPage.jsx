import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import NoticesList from '../../components/NoticesList';
import { createNotice } from '../../api/stubs.js';

export default function NoticesPage() {
  const { notices, reloadNotices } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'General',
    description: '',
    expiryAt: '',
    pinned: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calculate expiry date if not provided (default 30 days)
      let expiryDate = formData.expiryAt;
      if (!expiryDate) {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        expiryDate = date.toISOString().split('T')[0];
      }

      await createNotice({
        ...formData,
        expiryAt: new Date(expiryDate).toISOString()
      });
      await reloadNotices();
      setShowCreateModal(false);
      setFormData({
        title: '',
        category: 'General',
        description: '',
        expiryAt: '',
        pinned: false
      });
      alert('Notice created successfully!');
    } catch (error) {
      alert('Error creating notice');
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Notices</h1>
          <p className="text-base text-muted">
            Create and manage notices for students
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Create Notice
        </button>
      </div>

      <NoticesList notices={notices} onUpdate={reloadNotices} />

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Create Notice</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="label">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    placeholder="Enter notice title"
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
                    <option value="Academic">Academic</option>
                    <option value="Placement">Placement</option>
                    <option value="Cultural">Cultural</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="label">Description *</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                    rows="6"
                    placeholder="Enter notice description"
                  />
                </div>

                <div>
                  <label className="label">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryAt}
                    onChange={(e) => setFormData({ ...formData, expiryAt: e.target.value })}
                    className="input-field"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <p className="text-sm text-muted mt-1">
                    Leave empty for default 30 days expiry
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pinned"
                    checked={formData.pinned}
                    onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
                    className="w-5 h-5 text-brand focus:ring-brand rounded"
                  />
                  <label htmlFor="pinned" className="text-base text-gray-700">
                    Pin this notice to top
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

