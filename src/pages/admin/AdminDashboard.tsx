import React from 'react';
import { motion } from 'framer-motion';
import { Users, Pill, TrendingUp, Activity, BarChart3, Calendar, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Navbar from '@/components/layout/Navbar';
import StatCard from '@/components/ui/stat-card';
import { useAdminStats, useAdminUsers } from '@/hooks/use-admin-data';

const AdminDashboard: React.FC = () => {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: users, isLoading: usersLoading } = useAdminUsers();

  const isLoading = statsLoading || usersLoading;

  const recentUsers = (users || [])
    .filter(u => u.role !== 'admin')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Overview of platform activity and user statistics</p>
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Users" value={String(stats?.totalUsers || 0)} icon={Users} variant="primary" />
                <StatCard title="Non-Admin Users" value={String(recentUsers.length)} icon={Activity} variant="success" />
                <StatCard title="Avg Adherence" value={`${stats?.avgAdherence || 0}%`} icon={TrendingUp} variant="accent" />
                <StatCard title="Total Medicines" value={String(stats?.totalMedicines || 0)} icon={Pill} variant="warning" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Daily Adherence</h3>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats?.chartData || []}>
                        <defs>
                          <linearGradient id="colorAdh" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem' }} />
                        <Area type="monotone" dataKey="adherence" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorAdh)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-5 h-5 text-success" />
                    <h3 className="text-lg font-semibold">Daily Logs</h3>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats?.chartData || []}>
                        <defs>
                          <linearGradient id="colorLogs" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem' }} />
                        <Area type="monotone" dataKey="logs" stroke="hsl(142, 71%, 45%)" fillOpacity={1} fill="url(#colorLogs)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Recent Users</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Age</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Joined</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Medicines</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Adherence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user) => (
                        <tr key={user.user_id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                          <td className="py-4 px-4 font-medium">{user.name}</td>
                          <td className="py-4 px-4 text-muted-foreground">{user.age ?? '—'}</td>
                          <td className="py-4 px-4 text-muted-foreground">{new Date(user.created_at).toLocaleDateString()}</td>
                          <td className="py-4 px-4">{user.medicine_count}</td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                              user.adherence >= 80 ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                            }`}>
                              {user.adherence}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
