import { createContext, useContext, useState, useEffect } from 'react';
import { getStudents, getNotices, getForms, getTickets } from '../api/stubs.js';

const AppContext = createContext();

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

export function AppProvider({ children }) {
  const [user, setUser] = useState({
    name: 'Admin User',
    role: 'admin', // 'admin' or 'super_admin'
    email: 'admin@college.edu'
  });
  
  const [students, setStudents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [forms, setForms] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [studentsData, noticesData, formsData, ticketsData] = await Promise.all([
          getStudents(),
          getNotices(),
          getForms(),
          getTickets()
        ]);
        
        setStudents(studentsData);
        setNotices(noticesData);
        setForms(formsData);
        setTickets(ticketsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  const reloadStudents = async () => {
    const data = await getStudents();
    setStudents(data);
  };

  const reloadNotices = async () => {
    const data = await getNotices();
    setNotices(data);
  };

  const reloadForms = async () => {
    const data = await getForms();
    setForms(data);
  };

  const reloadTickets = async () => {
    const data = await getTickets();
    setTickets(data);
  };

  const value = {
    user,
    setUser,
    students,
    setStudents,
    notices,
    setNotices,
    forms,
    setForms,
    tickets,
    setTickets,
    loading,
    reloadStudents,
    reloadNotices,
    reloadForms,
    reloadTickets
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

