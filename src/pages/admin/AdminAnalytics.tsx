import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Pill, Activity, Loader2 } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import Navbar from '@/components/layout/Navbar';
import StatCard from '@/components/ui/stat-card';
import { useAdminStats, useAdminUsers } from '@/hooks/use-admin-data';

const COLORS = ['hsl(172, 60%, 40%)', 'hsl(142, 71%, 45%)', 'hsl(24, 95%, 53%)', 'hsl(38, 92%, 50%)'];

const AdminAnalytics: React.FC = () => {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: users, isLoading: usersLoading } = useAdminUsers();

  const isLoading = statsLoading || usersLoading;

  // Adherence by age group from real data
  const ageGroups = [
    { label: '18-25', min: 18, max: 25 },
    { label: '26-35', min: 26, max: 35 },
    { label: '36-45', min: 36, max: 45 },
    { label: '46+', min: 46, max: 120 },
  ];
  const adherenceByAge = ageGroups.map(g => {
    const groupUsers = (users || []).filter(u => u.age && u.age >= g.min && u.age <= g.max);
    const avg = groupUsers.length > 0 ? Math.round(groupUsers.reduce((s, u) => s + u.adherence, 0) / groupUsers.length) : 0;
    return { name: g.label, adherence: avg };
  });

  // Medicine frequency distribution
  const freqMap = new Map<string, number>();
  (users || []).forEach(u => {
    const key = u.medicine_count > 4 ? '5+' : String(u.medicine_count);
    freqMap.set(key, (freqMap.get(key) || 0) + 1);
  });
  const medicineDist = Array.from(freqMap.entries()).map(([name, value]) => ({ name: `${name} meds`, value }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold">Analytics</h1>
            <p className="text-muted-foreground mt-2">Detailed platform statistics and insights</p>
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Users" value={String(stats?.totalUsers || 0)} icon={Users} variant="primary" />
                <StatCard title="Avg Adherence" value={`${stats?.avgAdherence || 0}%`} icon={Activity} variant="success" />
                <StatCard title="Total Medicines" value={String(stats?.totalMedicines || 0)} icon={Pill} variant="warning" />
                <StatCard title="Daily Logs" value={String(stats?.chartData?.reduce((s, d) => s + d.logs, 0) || 0)} icon={TrendingUp} variant="accent" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Daily Adherence Trend</h3>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats?.chartData || []}>
                        <defs>
                          <linearGradient id="colorAdh2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem' }} />
                        <Area type="monotone" dataKey="adherence" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorAdh2)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Users className="w-5 h-5 text-success" />
                    <h3 className="text-lg font-semibold">Adherence by Age Group</h3>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={adherenceByAge}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem' }} />
                        <Bar dataKey="adherence" fill="hsl(142, 71%, 45%)" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Pill className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-semibold">Medicine Count Distribution</h3>
                </div>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={medicineDist} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                        {medicineDist.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminAnalytics;
