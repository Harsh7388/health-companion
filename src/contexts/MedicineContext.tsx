import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
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
  isLoading: boolean;
  addMedicine: (medicine: Omit<Medicine, 'id' | 'createdAt'>) => Promise<void>;
  removeMedicine: (id: string) => Promise<void>;
  updateMedicine: (id: string, updates: Partial<Medicine>) => Promise<void>;
  logMedicine: (medicineId: string, status: 'taken' | 'missed') => Promise<void>;
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

export const MedicineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [logs, setLogs] = useState<MedicineLog[]>([]);
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMedicines = useCallback(async () => {
    if (!user) { setMedicines([]); setLogs([]); setIsLoading(false); return; }
    
    const { data } = await supabase
      .from('medicines')
      .select('*')
      .eq('user_id', user.id)
      .order('time');

    if (data) {
      setMedicines(data.map(m => ({
        id: m.id,
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        time: m.time,
        createdAt: new Date(m.created_at),
      })));
    }

    const { data: logData } = await supabase
      .from('medicine_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(500);

    if (logData) {
      setLogs(logData.map(l => ({
        id: l.id,
        medicineId: l.medicine_id,
        date: l.date,
        time: l.time,
        status: l.status as 'taken' | 'missed' | 'pending',
      })));
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  useEffect(() => {
    calculateStreak();
  }, [logs, medicines]);

  const calculateStreak = () => {
    let currentStreak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayLogs = logs.filter(log => log.date === dateStr);
      const allTaken = dayLogs.length > 0 && dayLogs.every(log => log.status === 'taken');
      if (allTaken) currentStreak++;
      else if (i > 0) break;
    }
    setStreak(currentStreak);
  };

  const addMedicine = async (medicine: Omit<Medicine, 'id' | 'createdAt'>) => {
    if (!user) return;
    const { error } = await supabase.from('medicines').insert({
      user_id: user.id,
      name: medicine.name,
      dosage: medicine.dosage,
      frequency: medicine.frequency,
      time: medicine.time,
    });
    if (!error) fetchMedicines();
  };

  const removeMedicine = async (id: string) => {
    const { error } = await supabase.from('medicines').delete().eq('id', id);
    if (!error) fetchMedicines();
  };

  const updateMedicine = async (id: string, updates: Partial<Medicine>) => {
    const { error } = await supabase.from('medicines').update({
      ...(updates.name && { name: updates.name }),
      ...(updates.dosage && { dosage: updates.dosage }),
      ...(updates.frequency && { frequency: updates.frequency }),
      ...(updates.time && { time: updates.time }),
    }).eq('id', id);
    if (!error) fetchMedicines();
  };

  const logMedicine = async (medicineId: string, status: 'taken' | 'missed') => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const medicine = medicines.find(m => m.id === medicineId);

    const { error } = await supabase.from('medicine_logs').upsert({
      user_id: user.id,
      medicine_id: medicineId,
      date: today,
      time: medicine?.time || new Date().toTimeString().slice(0, 5),
      status,
    }, { onConflict: 'medicine_id,date' });
    if (!error) fetchMedicines();
  };

  const getTodayLogs = () => {
    const today = new Date().toISOString().split('T')[0];
    return logs.filter(log => log.date === today);
  };

  const getLogsForDate = (date: string) => logs.filter(log => log.date === date);

  const getAdherenceRate = (days: number) => {
    const today = new Date();
    let taken = 0, total = 0;
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
      medicines, logs, streak, isLoading,
      addMedicine, removeMedicine, updateMedicine, logMedicine,
      getTodayLogs, getLogsForDate, getAdherenceRate,
    }}>
      {children}
    </MedicineContext.Provider>
  );
};
