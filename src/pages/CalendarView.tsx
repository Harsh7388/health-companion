import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, X, Pill } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useMedicine } from '@/contexts/MedicineContext';
import { cn } from '@/lib/utils';

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { medicines, getLogsForDate } = useMedicine();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDay = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getDayStatus = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const logs = getLogsForDate(dateStr);
    
    if (logs.length === 0) return null;
    
    const allTaken = logs.every(log => log.status === 'taken');
    const anyMissed = logs.some(log => log.status === 'missed');
    const allMissed = logs.every(log => log.status === 'missed');
    
    if (allTaken) return 'complete';
    if (allMissed) return 'missed';
    if (anyMissed) return 'partial';
    return 'partial';
  };

  const selectedDateLogs = selectedDate ? getLogsForDate(selectedDate) : [];

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 md:h-16" />);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const status = getDayStatus(day);
      const isToday = dateStr === new Date().toISOString().split('T')[0];
      const isSelected = dateStr === selectedDate;
      
      days.push(
        <motion.button
          key={day}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedDate(dateStr)}
          className={cn(
            'h-12 md:h-16 rounded-xl flex flex-col items-center justify-center transition-all relative',
            isToday && 'ring-2 ring-primary',
            isSelected && 'bg-primary text-primary-foreground',
            !isSelected && status === 'complete' && 'bg-success/20 text-success',
            !isSelected && status === 'missed' && 'bg-destructive/20 text-destructive',
            !isSelected && status === 'partial' && 'bg-warning/20 text-warning',
            !isSelected && !status && 'hover:bg-muted'
          )}
        >
          <span className="font-medium">{day}</span>
          {status && !isSelected && (
            <div className={cn(
              'absolute bottom-1 w-1.5 h-1.5 rounded-full',
              status === 'complete' && 'bg-success',
              status === 'missed' && 'bg-destructive',
              status === 'partial' && 'bg-warning'
            )} />
          )}
        </motion.button>
      );
    }
    
    return days;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold">
              Medicine Calendar
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your medication history
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 glass-card rounded-2xl p-6"
            >
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-xl font-display font-semibold">
                  {monthNames[month]} {year}
                </h2>
                <Button variant="ghost" size="icon" onClick={goToNextMonth}>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="h-10 flex items-center justify-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {renderCalendarDays()}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-sm text-muted-foreground">All taken</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <span className="text-sm text-muted-foreground">Partial</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="text-sm text-muted-foreground">All missed</span>
                </div>
              </div>
            </motion.div>

            {/* Selected Date Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4">
                {selectedDate 
                  ? new Date(selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Select a date'
                }
              </h3>

              {selectedDate ? (
                <div className="space-y-3">
                  {selectedDateLogs.length > 0 ? (
                    selectedDateLogs.map(log => {
                      const medicine = medicines.find(m => m.id === log.medicineId);
                      if (!medicine) return null;
                      
                      return (
                        <div
                          key={log.id}
                          className={cn(
                            'p-4 rounded-xl border flex items-center gap-3',
                            log.status === 'taken' && 'bg-success/10 border-success/30',
                            log.status === 'missed' && 'bg-destructive/10 border-destructive/30'
                          )}
                        >
                          <div className={cn(
                            'w-10 h-10 rounded-lg flex items-center justify-center',
                            log.status === 'taken' && 'bg-success/20',
                            log.status === 'missed' && 'bg-destructive/20'
                          )}>
                            {log.status === 'taken' ? (
                              <Check className="w-5 h-5 text-success" />
                            ) : (
                              <X className="w-5 h-5 text-destructive" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{medicine.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {medicine.dosage} • {log.time}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Pill className="w-10 h-10 mx-auto mb-3 opacity-50" />
                      <p>No records for this date</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Click on a date to view details</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CalendarView;
