import { Pin, Calendar, X } from 'lucide-react';
import { formatDate, isExpired, getDaysUntilExpiry } from '../utils/dateUtils.js';

export default function NoticeCard({ notice, onDelete, onTogglePin }) {
  const daysUntilExpiry = getDaysUntilExpiry(notice.expiryAt);
  const expired = isExpired(notice.expiryAt);

  if (expired) return null;

  return (
    <div className={`card ${notice.pinned ? 'border-l-4 border-l-brand' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {notice.pinned && (
              <Pin size={16} className="text-brand fill-current" />
            )}
            <h3 className="text-xl font-bold text-gray-900">{notice.title}</h3>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              {notice.category}
            </span>
          </div>
          
          <p className="text-base text-gray-700 mb-4 leading-relaxed">
            {notice.description}
          </p>
          
          <div className="flex items-center gap-4 text-sm text-muted">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>Published: {formatDate(notice.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>
                Expires: {formatDate(notice.expiryAt)}
                {daysUntilExpiry !== null && (
                  <span className="ml-1">
                    ({daysUntilExpiry > 0 ? `${daysUntilExpiry} days left` : 'Expired'})
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => onTogglePin(notice.id)}
            className={`p-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
              notice.pinned
                ? 'bg-brand text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-label={notice.pinned ? 'Unpin notice' : 'Pin notice'}
          >
            <Pin size={18} />
          </button>
          {onDelete && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this notice?')) {
                  onDelete(notice.id);
                }
              }}
              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Delete notice"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

