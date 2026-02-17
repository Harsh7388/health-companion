import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Eye, Loader2, ShieldBan, ShieldCheck, Trash2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAdminUsers, type AdminUser } from '@/hooks/use-admin-data';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

const AdminUsers: React.FC = () => {
  const { data: users, isLoading } = useAdminUsers();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const filteredUsers = (users || []).filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBlock = async (user: AdminUser) => {
    setActionLoading(user.user_id);
    const newBlocked = !user.is_blocked;
    const { error } = await supabase
      .from('profiles')
      .update({ is_blocked: newBlocked } as any)
      .eq('user_id', user.user_id);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: newBlocked ? 'User blocked' : 'User unblocked' });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    }
    setActionLoading(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(deleteTarget.user_id);

    const { data, error } = await supabase.functions.invoke('admin-delete-user', {
      body: { user_id: deleteTarget.user_id },
    });

    if (error || data?.error) {
      toast({ variant: 'destructive', title: 'Error', description: data?.error || error?.message });
    } else {
      toast({ title: 'User removed successfully' });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    }
    setDeleteTarget(null);
    setActionLoading(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold">User Management</h1>
              <p className="text-muted-foreground mt-2">Manage all registered users</p>
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
                      <th className="text-left py-4 px-6 font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-4 px-6 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.user_id} className={`border-t border-border hover:bg-muted/30 transition-colors ${user.is_blocked ? 'opacity-60' : ''}`}>
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
                          {user.is_blocked ? (
                            <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-destructive/20 text-destructive">Blocked</span>
                          ) : (
                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-success/20 text-success'}`}>
                              {user.role === 'admin' ? 'Admin' : 'Active'}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setSelectedUser(user)} className="text-primary hover:underline text-sm flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                            </button>
                            {user.role !== 'admin' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={actionLoading === user.user_id}
                                  onClick={() => handleBlock(user)}
                                  className={user.is_blocked ? 'text-success hover:text-success' : 'text-warning hover:text-warning'}
                                >
                                  {user.is_blocked ? <ShieldCheck className="w-4 h-4" /> : <ShieldBan className="w-4 h-4" />}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={actionLoading === user.user_id}
                                  onClick={() => setDeleteTarget(user)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
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

      {/* View User Dialog */}
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
                  <p className="text-muted-foreground">{selectedUser.is_blocked ? 'Blocked' : selectedUser.role}</p>
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

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently remove <strong>{deleteTarget?.name}</strong>? This will delete all their data and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminUsers;
