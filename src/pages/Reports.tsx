import React from 'react';
import { motion } from 'framer-motion';
import { Download, TrendingUp, Calendar, Pill, FileText } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatCard from '@/components/ui/stat-card';
import { useMedicine } from '@/contexts/MedicineContext';
import { useToast } from '@/hooks/use-toast';

const Reports: React.FC = () => {
  const { medicines, logs, getAdherenceRate } = useMedicine();
  const { toast } = useToast();

  // Generate weekly data
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    const dayLogs = logs.filter(log => log.date === dateStr);
    const taken = dayLogs.filter(log => log.status === 'taken').length;
    const total = dayLogs.length || medicines.length;
    
    return {
      name: date.toLocaleDateString('en-US', { weekday: 'short' }),
      adherence: total > 0 ? Math.round((taken / total) * 100) : 0,
      taken,
      missed: total - taken,
    };
  });

  // Generate monthly data
  const monthlyData = Array.from({ length: 4 }, (_, i) => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - (7 * (3 - i)));
    
    return {
      name: `Week ${i + 1}`,
      adherence: Math.round(70 + Math.random() * 25),
    };
  });

  // Medicine breakdown
  const medicineBreakdown = medicines.map(medicine => {
    const medicineLogs = logs.filter(log => log.medicineId === medicine.id);
    const taken = medicineLogs.filter(log => log.status === 'taken').length;
    const total = medicineLogs.length;
    
    return {
      name: medicine.name,
      adherence: total > 0 ? Math.round((taken / total) * 100) : 0,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    };
  });

  const pieData = [
    { name: 'Taken', value: logs.filter(l => l.status === 'taken').length, color: 'hsl(142, 71%, 45%)' },
    { name: 'Missed', value: logs.filter(l => l.status === 'missed').length, color: 'hsl(0, 84%, 60%)' },
  ];

  const handleDownloadReport = () => {
    toast({
      title: 'Report Downloaded',
      description: 'Your adherence report has been downloaded as PDF.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold">
                Reports & Analytics
              </h1>
              <p className="text-muted-foreground mt-2">
                Track your medication adherence over time
              </p>
            </div>

            <Button onClick={handleDownloadReport} className="btn-glow">
              <Download className="w-5 h-5 mr-2" />
              Download PDF
            </Button>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Weekly Adherence"
              value={`${getAdherenceRate(7)}%`}
              icon={TrendingUp}
              variant="success"
              trend={{ value: 5, isPositive: true }}
            />
            <StatCard
              title="Monthly Adherence"
              value={`${getAdherenceRate(30)}%`}
              icon={Calendar}
              variant="primary"
            />
            <StatCard
              title="Total Medicines"
              value={medicines.length}
              icon={Pill}
              variant="accent"
            />
          </div>

          {/* Charts */}
          <Tabs defaultValue="weekly" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="weekly">Weekly Report</TabsTrigger>
              <TabsTrigger value="monthly">Monthly Report</TabsTrigger>
            </TabsList>

            <TabsContent value="weekly" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Adherence Trend */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">Adherence Trend</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weeklyData}>
                        <defs>
                          <linearGradient id="colorAdherence" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
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
                        <Area 
                          type="monotone" 
                          dataKey="adherence" 
                          stroke="hsl(168, 76%, 42%)" 
                          fillOpacity={1} 
                          fill="url(#colorAdherence)" 
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Taken vs Missed */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">Taken vs Missed</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
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
                        <Bar dataKey="taken" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="missed" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>

              {/* Pie Chart & Medicine Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">Overall Distribution</h3>
                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
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
                  <div className="flex justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-success" />
                      <span className="text-sm text-muted-foreground">Taken</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-destructive" />
                      <span className="text-sm text-muted-foreground">Missed</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">Medicine Breakdown</h3>
                  <div className="space-y-4">
                    {medicineBreakdown.map((medicine, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{medicine.name}</span>
                          <span className="text-sm text-muted-foreground">{medicine.adherence}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${medicine.adherence}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="bg-primary h-2 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                    {medicineBreakdown.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                        <p>No medicine data available</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="monthly">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold mb-4">Monthly Adherence Trend</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
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
                      <Bar dataKey="adherence" fill="hsl(168, 76%, 42%)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Reports;
