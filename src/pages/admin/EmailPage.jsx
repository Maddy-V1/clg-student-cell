import { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import EmailComposer from '../../components/EmailComposer';

export default function EmailPage() {
  const { students } = useApp();
  const [showComposer, setShowComposer] = useState(false);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Broadcast</h1>
          <p className="text-base text-muted">
            Send emails to all students or specific batches
          </p>
        </div>
        <button
          onClick={() => setShowComposer(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Send size={20} />
          Compose Email
        </button>
      </div>

      <div className="card">
        <div className="text-center py-12">
          <Mail size={64} className="mx-auto text-muted mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Email Broadcast</h2>
          <p className="text-base text-muted mb-6">
            Use the compose button to send emails to students. You can send to all students or filter by batch.
          </p>
          <button
            onClick={() => setShowComposer(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Send size={20} />
            Compose New Email
          </button>
        </div>
      </div>

      {showComposer && (
        <EmailComposer
          onClose={() => setShowComposer(false)}
          students={students}
        />
      )}
    </div>
  );
}

