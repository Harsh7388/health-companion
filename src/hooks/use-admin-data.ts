import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AdminUser {
  user_id: string;
  name: string;
  email: string;
  age: number | null;
  created_at: string;
  role: string;
  medicine_count: number;
  adherence: number;
  is_blocked: boolean;
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, name, age, created_at, is_blocked');
      if (profilesError) throw profilesError;

      // Get roles
      const { data: roles } = await supabase
        .from('user_roles')
        .select('user_id, role');

      // Get medicine counts per user
      const { data: medicines } = await supabase
        .from('medicines')
        .select('user_id, id');

      // Get medicine logs
      const { data: logs } = await supabase
        .from('medicine_logs')
        .select('user_id, status');

      const users: AdminUser[] = (profiles || []).map(p => {
        const userRoles = roles?.filter(r => r.user_id === p.user_id) || [];
        const role = userRoles.find(r => r.role === 'admin') ? 'admin' : 'user';
        const userMeds = medicines?.filter(m => m.user_id === p.user_id) || [];
        const userLogs = logs?.filter(l => l.user_id === p.user_id) || [];
        const takenLogs = userLogs.filter(l => l.status === 'taken').length;
        const adherence = userLogs.length > 0 ? Math.round((takenLogs / userLogs.length) * 100) : 0;

        return {
          user_id: p.user_id,
          name: p.name,
          email: '',
          age: p.age,
          created_at: p.created_at,
          role,
          medicine_count: userMeds.length,
          adherence,
          is_blocked: (p as any).is_blocked ?? false,
        };
      });

      return users;
    },
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: totalMedicines } = await supabase
        .from('medicines')
        .select('*', { count: 'exact', head: true });

      const { data: allLogs } = await supabase
        .from('medicine_logs')
        .select('status');

      const totalLogs = allLogs?.length || 0;
      const takenLogs = allLogs?.filter(l => l.status === 'taken').length || 0;
      const avgAdherence = totalLogs > 0 ? Math.round((takenLogs / totalLogs) * 100) : 0;

      // Get logs grouped by date for charts
      const { data: dailyLogs } = await supabase
        .from('medicine_logs')
        .select('date, status')
        .order('date', { ascending: true });

      const dailyMap = new Map<string, { total: number; taken: number }>();
      dailyLogs?.forEach(log => {
        const existing = dailyMap.get(log.date) || { total: 0, taken: 0 };
        existing.total++;
        if (log.status === 'taken') existing.taken++;
        dailyMap.set(log.date, existing);
      });

      const chartData = Array.from(dailyMap.entries()).map(([date, data]) => ({
        name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        date,
        adherence: Math.round((data.taken / data.total) * 100),
        logs: data.total,
      }));

      return {
        totalUsers: totalUsers || 0,
        totalMedicines: totalMedicines || 0,
        avgAdherence,
        chartData,
      };
    },
  });
}
