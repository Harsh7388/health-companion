import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pill, Flame, TrendingUp, Calendar, Clock, Droplets, Sparkles } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StatCard from '@/components/ui/stat-card';
import MedicineCard from '@/components/ui/medicine-card';
import ProgressRing from '@/components/ui/progress-ring';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useMedicine } from '@/contexts/MedicineContext';

const healthTips = [
  "💊 Take your medicines with a glass of water for better absorption.",
  "🥗 Eating before medication can reduce stomach irritation.",
  "⏰ Set consistent times for your medicines to build a routine.",
  "💤 Some vitamins work better when taken at night.",
  "🏃 Light exercise can improve medication effectiveness.",
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { medicines, streak, getTodayLogs, getAdherenceRate, logMedicine } = useMedicine();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  
  const todayLogs = getTodayLogs();
  const takenToday = todayLogs.filter(log => log.status === 'taken').length;
  const adherenceRate = getAdherenceRate(7);
  const randomTip = healthTips[Math.floor(Math.random() * healthTips.length)];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold">
              {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-muted-foreground mt-2">
              Here's your health overview for today
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Current Streak"
              value={`${streak} days`}
              icon={Flame}
              variant="accent"
              trend={{ value: 15, isPositive: true }}
            />
            <StatCard
              title="Weekly Adherence"
              value={`${adherenceRate}%`}
              icon={TrendingUp}
              variant="success"
            />
            <StatCard
              title="Today's Progress"
              value={`${takenToday}/${medicines.length}`}
              subtitle="Medicines taken"
              icon={Pill}
              variant="primary"
            />
            <StatCard
              title="Next Reminder"
              value="2:00 PM"
              subtitle="Omega-3"
              icon={Clock}
              variant="warning"
            />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's Medicines */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-semibold">Today's Medicines</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  {medicines.map((medicine) => {
                    const log = todayLogs.find(l => l.medicineId === medicine.id);
                    return (
                      <MedicineCard
                        key={medicine.id}
                        medicine={medicine}
                        log={log}
                        onTake={() => logMedicine(medicine.id, 'taken')}
                        onMiss={() => logMedicine(medicine.id, 'missed')}
                      />
                    );
                  })}

                  {medicines.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Pill className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No medicines added yet.</p>
                      <p className="text-sm">Add your first medicine to get started!</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Progress Ring */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <h3 className="text-lg font-semibold mb-4">Today's Adherence</h3>
                <ProgressRing
                  value={medicines.length > 0 ? (takenToday / medicines.length) * 100 : 0}
                  size={140}
                  strokeWidth={10}
                  label={`${medicines.length > 0 ? Math.round((takenToday / medicines.length) * 100) : 0}%`}
                  sublabel="completed"
                  variant="success"
                />
                <p className="mt-4 text-sm text-muted-foreground">
                  {takenToday === medicines.length && medicines.length > 0
                    ? "🎉 All done for today!"
                    : `${medicines.length - takenToday} more to go`}
                </p>
              </motion.div>

              {/* Water Reminder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl p-6 border border-primary/20 bg-primary/5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Water Reminder</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Stay hydrated! Aim for 8 glasses of water today.
                </p>
                <div className="flex gap-1">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-2 rounded-full ${
                        i < 5 ? 'bg-primary' : 'bg-primary/20'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">5/8 glasses</p>
              </motion.div>

              {/* Health Tip */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl p-6 border border-accent/20 bg-accent/5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-semibold">Health Tip</h3>
                </div>
                <p className="text-sm text-muted-foreground">{randomTip}</p>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
