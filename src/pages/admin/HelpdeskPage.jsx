import { useState } from 'react';
import { HelpCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { updateTicketStatus } from '../../api/stubs.js';
import { formatDateTime } from '../../utils/dateUtils.js';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Resolved: 'bg-green-100 text-green-800'
};

const statusIcons = {
  Pending: Clock,
  'In Progress': Clock,
  Resolved: CheckCircle
};

export default function HelpdeskPage() {
  const { tickets, reloadTickets } = useApp();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [response, setResponse] = useState('');

  const handleStatusUpdate = async (ticketId, newStatus) => {
    try {
      await updateTicketStatus(ticketId, newStatus, response || null);
      setResponse('');
      setSelectedTicket(null);
      await reloadTickets();
      alert('Ticket updated successfully!');
    } catch (error) {
      alert('Error updating ticket');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Helpdesk</h1>
        <p className="text-base text-muted">
          View and respond to student helpdesk queries
        </p>
      </div>

      <div className="space-y-4">
        {tickets.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-base text-muted">No tickets found</p>
          </div>
        ) : (
          tickets.map((ticket) => {
            const StatusIcon = statusIcons[ticket.status] || Clock;
            return (
              <div key={ticket.id} className="card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-brand bg-opacity-10 p-2 rounded-full">
                        <HelpCircle size={20} className="text-brand" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {ticket.studentName || ticket.studentRoll}
                        </h3>
                        <p className="text-sm text-muted">Roll: {ticket.studentRoll}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                          statusColors[ticket.status] || statusColors.Pending
                        }`}
                      >
                        <StatusIcon size={14} />
                        {ticket.status}
                      </span>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-muted mb-1">Category: {ticket.category}</p>
                      <p className="text-base text-gray-700 leading-relaxed">
                        {ticket.description}
                      </p>
                    </div>

                    <div className="text-sm text-muted mb-3">
                      Created: {formatDateTime(ticket.createdAt)}
                    </div>

                    {ticket.responses && ticket.responses.length > 0 && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-semibold text-gray-900 mb-2">Responses:</p>
                        {ticket.responses.map((resp, idx) => (
                          <div key={idx} className="mb-2 pb-2 border-b border-gray-200 last:border-b-0">
                            <p className="text-base text-gray-700">{resp.message}</p>
                            <p className="text-sm text-muted mt-1">
                              {formatDateTime(resp.respondedAt)} by {resp.respondedBy}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setSelectedTicket(ticket)}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      Respond
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Respond to Ticket</h2>
              <button
                onClick={() => {
                  setSelectedTicket(null);
                  setResponse('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-base text-gray-700 mb-2">
                  <strong>Student:</strong> {selectedTicket.studentName || selectedTicket.studentRoll}
                </p>
                <p className="text-base text-gray-700 mb-2">
                  <strong>Category:</strong> {selectedTicket.category}
                </p>
                <p className="text-base text-gray-700 mb-4">
                  <strong>Description:</strong> {selectedTicket.description}
                </p>
              </div>

              <div className="mb-4">
                <label className="label">Response Message</label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="input-field"
                  rows="5"
                  placeholder="Enter your response..."
                />
              </div>

              <div className="mb-4">
                <label className="label">Update Status</label>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleStatusUpdate(selectedTicket.id, 'Pending')}
                    className={`px-4 py-2 rounded-lg text-base font-medium min-h-[44px] ${
                      selectedTicket.status === 'Pending'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedTicket.id, 'In Progress')}
                    className={`px-4 py-2 rounded-lg text-base font-medium min-h-[44px] ${
                      selectedTicket.status === 'In Progress'
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedTicket.id, 'Resolved')}
                    className={`px-4 py-2 rounded-lg text-base font-medium min-h-[44px] ${
                      selectedTicket.status === 'Resolved'
                        ? 'bg-green-500 text-white'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    Resolved
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setSelectedTicket(null);
                    setResponse('');
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedTicket.id, selectedTicket.status)}
                  className="btn-primary"
                >
                  Save Response
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

