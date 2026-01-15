import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: 'daily' | 'twice_daily' | 'weekly' | 'as_needed';
  time: string;
  createdAt: Date;
}

export interface MedicineLog {
  id: string;
  medicineId: string;
  date: string;
  time: string;
  status: 'taken' | 'missed' | 'pending';
}

interface MedicineContextType {
  medicines: Medicine[];
  logs: MedicineLog[];
  streak: number;
  addMedicine: (medicine: Omit<Medicine, 'id' | 'createdAt'>) => void;
  removeMedicine: (id: string) => void;
  updateMedicine: (id: string, updates: Partial<Medicine>) => void;
  logMedicine: (medicineId: string, status: 'taken' | 'missed') => void;
  getTodayLogs: () => MedicineLog[];
  getLogsForDate: (date: string) => MedicineLog[];
  getAdherenceRate: (days: number) => number;
}

const MedicineContext = createContext<MedicineContextType | undefined>(undefined);

export const useMedicine = () => {
  const context = useContext(MedicineContext);
  if (!context) {
    throw new Error('useMedicine must be used within a MedicineProvider');
  }
  return context;
};

interface MedicineProviderProps {
  children: ReactNode;
}

export const MedicineProvider: React.FC<MedicineProviderProps> = ({ children }) => {
  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    const saved = localStorage.getItem('meditrack_medicines');
    if (saved) {
      return JSON.parse(saved);
    }
    // Demo medicines
    return [
      { id: '1', name: 'Vitamin D3', dosage: '1000 IU', frequency: 'daily', time: '08:00', createdAt: new Date() },
      { id: '2', name: 'Omega-3', dosage: '1000mg', frequency: 'daily', time: '12:00', createdAt: new Date() },
      { id: '3', name: 'Multivitamin', dosage: '1 tablet', frequency: 'daily', time: '09:00', createdAt: new Date() },
    ];
  });

  const [logs, setLogs] = useState<MedicineLog[]>(() => {
    const saved = localStorage.getItem('meditrack_logs');
    if (saved) {
      return JSON.parse(saved);
    }
    // Demo logs for past week
    const demoLogs: MedicineLog[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      demoLogs.push(
        { id: `log-${i}-1`, medicineId: '1', date: dateStr, time: '08:00', status: Math.random() > 0.2 ? 'taken' : 'missed' },
        { id: `log-${i}-2`, medicineId: '2', date: dateStr, time: '12:00', status: Math.random() > 0.3 ? 'taken' : 'missed' },
        { id: `log-${i}-3`, medicineId: '3', date: dateStr, time: '09:00', status: Math.random() > 0.1 ? 'taken' : 'missed' },
      );
    }
    return demoLogs;
  });

  const [streak, setStreak] = useState(0);

  useEffect(() => {
    localStorage.setItem('meditrack_medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('meditrack_logs', JSON.stringify(logs));
    calculateStreak();
  }, [logs]);

  const calculateStreak = () => {
    let currentStreak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayLogs = logs.filter(log => log.date === dateStr);
      const allTaken = dayLogs.length > 0 && dayLogs.every(log => log.status === 'taken');
      
      if (allTaken) {
        currentStreak++;
      } else if (i > 0) {
        break;
      }
    }
    setStreak(currentStreak);
  };

  const addMedicine = (medicine: Omit<Medicine, 'id' | 'createdAt'>) => {
    const newMedicine: Medicine = {
      ...medicine,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setMedicines(prev => [...prev, newMedicine]);
  };

  const removeMedicine = (id: string) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
  };

  const updateMedicine = (id: string, updates: Partial<Medicine>) => {
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const logMedicine = (medicineId: string, status: 'taken' | 'missed') => {
    const today = new Date().toISOString().split('T')[0];
    const existingLog = logs.find(log => log.medicineId === medicineId && log.date === today);
    
    if (existingLog) {
      setLogs(prev => prev.map(log => 
        log.id === existingLog.id ? { ...log, status } : log
      ));
    } else {
      const medicine = medicines.find(m => m.id === medicineId);
      const newLog: MedicineLog = {
        id: crypto.randomUUID(),
        medicineId,
        date: today,
        time: medicine?.time || new Date().toTimeString().slice(0, 5),
        status,
      };
      setLogs(prev => [...prev, newLog]);
    }
  };

  const getTodayLogs = () => {
    const today = new Date().toISOString().split('T')[0];
    return logs.filter(log => log.date === today);
  };

  const getLogsForDate = (date: string) => {
    return logs.filter(log => log.date === date);
  };

  const getAdherenceRate = (days: number) => {
    const today = new Date();
    let taken = 0;
    let total = 0;

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayLogs = logs.filter(log => log.date === dateStr);
      taken += dayLogs.filter(log => log.status === 'taken').length;
      total += dayLogs.length || medicines.length;
    }

    return total > 0 ? Math.round((taken / total) * 100) : 0;
  };

  return (
    <MedicineContext.Provider value={{
      medicines,
      logs,
      streak,
      addMedicine,
      removeMedicine,
      updateMedicine,
      logMedicine,
      getTodayLogs,
      getLogsForDate,
      getAdherenceRate,
    }}>
      {children}
    </MedicineContext.Provider>
  );
};
