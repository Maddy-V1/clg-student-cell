import { Settings as SettingsIcon, User, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function SettingsPage() {
  const { user } = useApp();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-base text-muted">
          Manage platform settings and user roles
        </p>
      </div>

      <div className="space-y-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <User size={24} className="text-brand" />
            <h2 className="text-xl font-bold text-gray-900">User Information</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted mb-1">Name</p>
              <p className="text-base font-medium text-gray-900">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted mb-1">Email</p>
              <p className="text-base font-medium text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted mb-1">Role</p>
              <p className="text-base font-medium text-gray-900 capitalize">
                {user.role === 'super_admin' ? 'Super Admin (Faculty-in-charge)' : 'Student Cell Admin'}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={24} className="text-brand" />
            <h2 className="text-xl font-bold text-gray-900">Role-Based Access</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-base text-gray-700 mb-2">
                <strong>Super Admin (Faculty-in-charge):</strong> Full access to all features including user management and system settings.
              </p>
            </div>
            <div>
              <p className="text-base text-gray-700">
                <strong>Student Cell Admin:</strong> Can manage notices, forms, helpdesk, and student data. Cannot modify user roles or system settings.
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <SettingsIcon size={24} className="text-brand" />
            <h2 className="text-xl font-bold text-gray-900">Platform Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label">College Name</label>
              <input
                type="text"
                defaultValue="Your College Name"
                className="input-field"
                disabled
              />
              <p className="text-sm text-muted mt-1">
                This will be configurable in the full product
              </p>
            </div>
            <div>
              <label className="label">Student Cell Email</label>
              <input
                type="email"
                defaultValue="studentcell@college.edu"
                className="input-field"
                disabled
              />
            </div>
            <div>
              <label className="label">Contact Number</label>
              <input
                type="tel"
                defaultValue="01234-567890"
                className="input-field"
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

