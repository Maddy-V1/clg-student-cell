import { useState } from 'react';
import NoticeCard from './NoticeCard';
import { deleteNotice } from '../api/stubs.js';

export default function NoticesList({ notices, onUpdate }) {
  const [filter, setFilter] = useState('all');

  const filteredNotices = notices.filter(notice => {
    if (filter === 'all') return true;
    if (filter === 'pinned') return notice.pinned;
    return notice.category === filter;
  });

  // Sort: pinned first, then by date
  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.publishedAt) - new Date(a.publishedAt);
  });

  const categories = ['all', 'Academic', 'Placement', 'Cultural', 'General'];
  const uniqueCategories = [
    ...new Set(notices.map(n => n.category).filter(Boolean))
  ];

  const handleDelete = async (id) => {
    try {
      await deleteNotice(id);
      await onUpdate();
    } catch (error) {
      alert('Error deleting notice');
    }
  };

  const handleTogglePin = async (id) => {
    // In prototype, toggle pin in local state
    const notice = notices.find(n => n.id === id);
    if (notice) {
      notice.pinned = !notice.pinned;
      await onUpdate();
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg text-base font-medium transition-colors min-h-[44px] ${
              filter === cat
                ? 'bg-brand text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat === 'all' ? 'All Notices' : cat}
            {cat === 'pinned' && ` (${notices.filter(n => n.pinned).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {sortedNotices.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-base text-muted">No notices found</p>
          </div>
        ) : (
          sortedNotices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              onDelete={handleDelete}
              onTogglePin={handleTogglePin}
            />
          ))
        )}
      </div>
    </div>
  );
}

