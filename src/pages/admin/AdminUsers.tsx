import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, MoreVertical, Ban, Trash2, Eye, Filter } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 28, joinDate: '2024-01-15', adherence: 92, medicines: 4, status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 35, joinDate: '2024-01-10', adherence: 88, medicines: 3, status: 'active' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', age: 42, joinDate: '2024-01-05', adherence: 75, medicines: 5, status: 'active' },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', age: 31, joinDate: '2024-01-02', adherence: 95, medicines: 2, status: 'inactive' },
  { id: 5, name: 'Chris Brown', email: 'chris@example.com', age: 25, joinDate: '2023-12-28', adherence: 68, medicines: 6, status: 'active' },
  { id: 6, name: 'Emily Davis', email: 'emily@example.com', age: 29, joinDate: '2023-12-20', adherence: 82, medicines: 4, status: 'blocked' },
  { id: 7, name: 'David Lee', email: 'david@example.com', age: 45, joinDate: '2023-12-15', adherence: 90, medicines: 3, status: 'active' },
  { id: 8, name: 'Lisa Garcia', email: 'lisa@example.com', age: 38, joinDate: '2023-12-10', adherence: 78, medicines: 5, status: 'active' },
];

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { toast } = useToast();

  const handleBlockUser = (userId: number, userName: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === 'blocked' ? 'active' : 'blocked' } 
        : u
    ));
    toast({
      title: users.find(u => u.id === userId)?.status === 'blocked' ? 'User Unblocked' : 'User Blocked',
      description: `${userName} has been ${users.find(u => u.id === userId)?.status === 'blocked' ? 'unblocked' : 'blocked'}.`,
    });
  };

  const handleDeleteUser = (userId: number, userName: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    toast({
      title: 'User Deleted',
      description: `${userName} has been removed from the platform.`,
      variant: 'destructive',
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold">
                User Management
              </h1>
              <p className="text-muted-foreground mt-2">
                View and manage all registered users
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-semibold">{users.length}</span>
              <span className="text-muted-foreground">total users</span>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 mb-6"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  {filterStatus === 'all' ? 'All Status' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterStatus('all')}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('active')}>Active</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('inactive')}>Inactive</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('blocked')}>Blocked</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>

          {/* Users Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
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
                    <tr key={user.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">{user.age}</td>
                      <td className="py-4 px-6 text-muted-foreground">
                        {new Date(user.joinDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                user.adherence >= 80 ? 'bg-success' : 
                                user.adherence >= 60 ? 'bg-warning' : 'bg-destructive'
                              }`}
                              style={{ width: `${user.adherence}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{user.adherence}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">{user.medicines}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          user.status === 'active' ? 'bg-success/20 text-success' :
                          user.status === 'inactive' ? 'bg-muted text-muted-foreground' :
                          'bg-destructive/20 text-destructive'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleBlockUser(user.id, user.name)}>
                              <Ban className="w-4 h-4 mr-2" />
                              {user.status === 'blocked' ? 'Unblock' : 'Block'} User
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No users found matching your search.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {selectedUser.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-medium">{selectedUser.age} years</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Join Date</p>
                  <p className="font-medium">{new Date(selectedUser.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Adherence Rate</p>
                  <p className="font-medium">{selectedUser.adherence}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Medicines</p>
                  <p className="font-medium">{selectedUser.medicines}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                    selectedUser.status === 'active' ? 'bg-success/20 text-success' :
                    selectedUser.status === 'inactive' ? 'bg-muted text-muted-foreground' :
                    'bg-destructive/20 text-destructive'
                  }`}>
                    {selectedUser.status}
                  </span>
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
