import { Link, useLocation } from 'react-router-dom';
import {
  Users,
  Bell,
  FileText,
  Mail,
  Settings,
  GraduationCap
} from 'lucide-react';

const navItems = [
  { path: '/admin/students', label: 'Student Data', icon: Users },
  { path: '/admin/notices', label: 'Notices', icon: Bell },
  { path: '/admin/forms', label: 'Frequent Forms', icon: FileText },
  { path: '/admin/email', label: 'Email Broadcast', icon: Mail },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="px-4 pt-4 pb-2 border-b border-gray-200">
        <div className="flex items-center justify-between gap-3">
          <img
            src="/logos/usict.png"
            alt="USICT"
            className="h-12 w-150 rounded"
          />
          <img
            src="/logos/ggsipu.svg"
            alt="GGSIPU"
            className="h-10 w-15 rounded"
          />
        </div>
      </div>
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

