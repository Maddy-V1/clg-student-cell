import { GraduationCap, Bell, FileText, HelpCircle, Mail, Phone } from 'lucide-react';

const comingSoonSections = [
  {
    icon: Bell,
    title: 'Notices',
    description: 'View all latest notices and announcements from the Student Cell'
  },
  {
    icon: FileText,
    title: 'Frequent Forms',
    description: 'Access and download frequently used forms for examinations, placements, and events'
  },
  {
    icon: HelpCircle,
    title: 'Helpdesk',
    description: 'Submit queries and track the status of your requests'
  }
];

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="bg-brand bg-opacity-10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <GraduationCap size={48} className="text-brand" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Student Portal — Coming Soon
          </h1>
          <p className="text-xl text-muted mb-8">
            Student-facing pages are under development and will be available shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {comingSoonSections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title} className="card text-center">
                <div className="bg-brand bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon size={32} className="text-brand" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {section.title}
                </h2>
                <p className="text-base text-muted">{section.description}</p>
              </div>
            );
          })}
        </div>

        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Mail size={24} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Need Assistance?
              </h2>
              <p className="text-base text-gray-700 mb-4">
                If you need any form or notice urgently, please contact the Student Cell:
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-blue-600" />
                  <a
                    href="mailto:studentcell@college.edu"
                    className="text-base text-blue-600 hover:underline"
                  >
                    studentcell@college.edu
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={18} className="text-blue-600" />
                  <a
                    href="tel:01234567890"
                    className="text-base text-blue-600 hover:underline"
                  >
                    01234-567890
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-base text-muted">
            Expected launch: Q1 2025
          </p>
        </div>
      </div>
    </div>
  );
}

