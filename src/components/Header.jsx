import { Search } from 'lucide-react';
import SearchBar from './SearchBar';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-brand">
              Student Cell Management
            </h1>
          </div>
          
          <div className="flex-1 max-w-2xl mx-8">
            <SearchBar />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-base font-medium text-gray-900">Admin User</p>
              <p className="text-sm text-muted">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

