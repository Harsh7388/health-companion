import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Eye, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAdminUsers, type AdminUser } from '@/hooks/use-admin-data';

const AdminUsers: React.FC = () => {
  const { data: users, isLoading } = useAdminUsers();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const filteredUsers = (users || []).filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold">User Management</h1>
              <p className="text-muted-foreground mt-2">View all registered users</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-semibold">{users?.length || 0}</span>
              <span className="text-muted-foreground">total users</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="Search users by name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left py-4 px-6 font-medium text-muted-foreground">User</th>
                      <th className="text-left py-4 px-6 font-medium text-muted-foreground">Age</th>
                      <th className="text-left py-4 px-6 font-medium text-muted-foreground">Join Date</th>
                      <th className="text-left py-4 px-6 font-medium text-muted-foreground">Adherence</th>
                      <th className="text-left py-4 px-6 font-medium text-muted-foreground">Medicines</th>
                      <th className="text-left py-4 px-6 font-medium text-muted-foreground">Role</th>
                      <th className="text-left py-4 px-6 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.user_id} className="border-t border-border hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-6 font-medium">{user.name}</td>
                        <td className="py-4 px-6 text-muted-foreground">{user.age ?? '—'}</td>
                        <td className="py-4 px-6 text-muted-foreground">{new Date(user.created_at).toLocaleDateString()}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div className={`h-2 rounded-full ${user.adherence >= 80 ? 'bg-success' : user.adherence >= 60 ? 'bg-warning' : 'bg-destructive'}`} style={{ width: `${user.adherence}%` }} />
                            </div>
                            <span className="text-sm font-medium">{user.adherence}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">{user.medicine_count}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <button onClick={() => setSelectedUser(user)} className="text-primary hover:underline text-sm flex items-center gap-1">
                            <Eye className="w-4 h-4" /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No users found.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{selectedUser.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <p className="text-muted-foreground">{selectedUser.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-medium">{selectedUser.age ?? '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Join Date</p>
                  <p className="font-medium">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Adherence Rate</p>
                  <p className="font-medium">{selectedUser.adherence}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Medicines</p>
                  <p className="font-medium">{selectedUser.medicine_count}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
