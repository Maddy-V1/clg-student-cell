import { Link, useLocation } from 'react-router-dom';
import {
  Users,
  Bell,
  FileText,
  HelpCircle,
  Upload,
  Mail,
  Settings,
  GraduationCap
} from 'lucide-react';

const navItems = [
  { path: '/admin/students', label: 'Student Data', icon: Users },
  { path: '/admin/notices', label: 'Notices', icon: Bell },
  { path: '/admin/forms', label: 'Frequent Forms', icon: FileText },
  { path: '/admin/helpdesk', label: 'Helpdesk', icon: HelpCircle },
  { path: '/admin/bulk-upload', label: 'Bulk Upload', icon: Upload },
  { path: '/admin/email', label: 'Email Broadcast', icon: Mail },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium
                    transition-colors min-h-[44px]
                    ${
                      isActive
                        ? 'bg-brand text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <Link
            to="/student/notices"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors min-h-[44px]"
          >
            <GraduationCap size={20} />
            <span>Student Portal</span>
          </Link>
        </div>
      </nav>
    </aside>
  );
}

