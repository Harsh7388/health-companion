import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Pill, Activity, Calendar, Clock } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import Navbar from '@/components/layout/Navbar';
import StatCard from '@/components/ui/stat-card';

const weeklyData = [
  { name: 'Mon', signups: 45, logins: 120 },
  { name: 'Tue', signups: 52, logins: 145 },
  { name: 'Wed', signups: 48, logins: 160 },
  { name: 'Thu', signups: 70, logins: 175 },
  { name: 'Fri', signups: 65, logins: 190 },
  { name: 'Sat', signups: 55, logins: 200 },
  { name: 'Sun', signups: 40, logins: 180 },
];

const adherenceByAge = [
  { name: '18-25', adherence: 72 },
  { name: '26-35', adherence: 85 },
  { name: '36-45', adherence: 91 },
  { name: '46-55', adherence: 88 },
  { name: '56+', adherence: 94 },
];

const medicineCategories = [
  { name: 'Vitamins', value: 35, color: 'hsl(168, 76%, 42%)' },
  { name: 'Supplements', value: 25, color: 'hsl(24, 95%, 53%)' },
  { name: 'Prescription', value: 30, color: 'hsl(142, 71%, 45%)' },
  { name: 'Other', value: 10, color: 'hsl(38, 92%, 50%)' },
];

const hourlyActivity = [
  { hour: '6AM', activity: 15 },
  { hour: '8AM', activity: 85 },
  { hour: '10AM', activity: 45 },
  { hour: '12PM', activity: 60 },
  { hour: '2PM', activity: 35 },
  { hour: '4PM', activity: 40 },
  { hour: '6PM', activity: 70 },
  { hour: '8PM', activity: 90 },
  { hour: '10PM', activity: 55 },
];

const AdminAnalytics: React.FC = () => {
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
              Analytics
            </h1>
            <p className="text-muted-foreground mt-2">
              Detailed platform statistics and insights
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="New Signups (Today)"
              value="48"
              icon={Users}
              variant="primary"
              trend={{ value: 15, isPositive: true }}
            />
            <StatCard
              title="Daily Active Users"
              value="892"
              icon={Activity}
              variant="success"
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title="Avg Session Time"
              value="12m"
              icon={Clock}
              variant="accent"
            />
            <StatCard
              title="Medicines Tracked"
              value="4,521"
              icon={Pill}
              variant="warning"
              trend={{ value: 5, isPositive: true }}
            />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">User Activity</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(24, 95%, 53%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(24, 95%, 53%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem',
                      }} 
                    />
                    <Area type="monotone" dataKey="signups" stroke="hsl(168, 76%, 42%)" fillOpacity={1} fill="url(#colorSignups)" strokeWidth={2} />
                    <Area type="monotone" dataKey="logins" stroke="hsl(24, 95%, 53%)" fillOpacity={1} fill="url(#colorLogins)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm text-muted-foreground">Signups</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span className="text-sm text-muted-foreground">Logins</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-success" />
                <h3 className="text-lg font-semibold">Adherence by Age Group</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={adherenceByAge}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem',
                      }} 
                    />
                    <Bar dataKey="adherence" fill="hsl(142, 71%, 45%)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <Pill className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold">Medicine Categories</h3>
              </div>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={medicineCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {medicineCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem',
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {medicineCategories.map((cat, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm text-muted-foreground">{cat.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 glass-card rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Hourly Activity Pattern</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourlyActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem',
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="activity" 
                      stroke="hsl(168, 76%, 42%)" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(168, 76%, 42%)', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: 'hsl(168, 76%, 42%)' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-muted-foreground text-center mt-4">
                Peak activity times: 8AM (morning dose) and 8PM (evening dose)
              </p>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAnalytics;
