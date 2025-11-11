import { useState, useEffect, useRef } from 'react';
import { Search, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { searchStudents } from '../utils/searchUtils.js';
import { useNavigate } from 'react-router-dom';
import StudentProfileModal from './StudentProfileModal';

export default function SearchBar() {
  const navigate = useNavigate();
  const { students } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      setShowResults(false);
      return;
    }

    const searchResults = searchStudents(students, query);
    setResults(searchResults.slice(0, 5)); // Limit to 5 results
    setShowResults(searchResults.length > 0);
  }, [query, students]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (student) => {
    setQuery('');
    setShowResults(false);
    if (student && student.roll) {
      navigate(`/admin/students/${student.roll}`);
    } else if (student && student.id) {
      navigate(`/admin/students/${student.id}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowResults(false);
      setQuery('');
    }
  };

  return (
    <>
      <div className="relative" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted" size={20} />
          <input
            type="text"
            placeholder="Search by name, roll number, or phone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-12 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent min-h-[44px]"
            aria-label="Search students"
          />
        </div>

        {showResults && results.length > 0 && (
          <div
            ref={resultsRef}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
          >
            {results.map((student) => (
              <button
                key={student.id}
                onClick={() => handleResultClick(student)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0 min-h-[44px]"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-brand bg-opacity-10 p-2 rounded-full">
                    <User size={16} className="text-brand" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-medium text-gray-900">
                      {student.firstName && student.lastName 
                        ? `${student.firstName} ${student.lastName}`
                        : student.name || 'N/A'}
                    </p>
                    <p className="text-sm text-muted">
                      {student.roll} • {student.branch || student.course}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {showResults && query.trim() !== '' && results.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
            <p className="text-base text-muted">No students found</p>
          </div>
        )}
      </div>

      {/* Detail opens as a route now; modal disabled */}
    </>
  );
}

