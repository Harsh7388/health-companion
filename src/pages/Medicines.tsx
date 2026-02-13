import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pill, Search } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MedicineCard from '@/components/ui/medicine-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useMedicine, Medicine } from '@/contexts/MedicineContext';
import { useToast } from '@/hooks/use-toast';

const Medicines: React.FC = () => {
  const { medicines, addMedicine, removeMedicine, updateMedicine, getTodayLogs, logMedicine } = useMedicine();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    time: '08:00',
  });

  const todayLogs = getTodayLogs();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMedicine) {
      updateMedicine(editingMedicine.id, formData);
      toast({
        title: 'Medicine updated',
        description: `${formData.name} has been updated.`,
      });
    } else {
      addMedicine(formData);
      toast({
        title: 'Medicine added',
        description: `${formData.name} has been added to your list.`,
      });
    }
    
    setFormData({ name: '', dosage: '', frequency: 'daily', time: '08:00' });
    setEditingMedicine(null);
    setIsOpen(false);
  };

  const handleEdit = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setFormData({
      name: medicine.name,
      dosage: medicine.dosage,
      frequency: medicine.frequency as string,
      time: medicine.time,
    });
    setIsOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    removeMedicine(id);
    toast({
      title: 'Medicine removed',
      description: `${name} has been removed from your list.`,
    });
  };

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.dosage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold">
                My Medicines
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your medication schedule
              </p>
            </div>

            <Dialog open={isOpen} onOpenChange={(open) => {
              setIsOpen(open);
              if (!open) {
                setEditingMedicine(null);
                setFormData({ name: '', dosage: '', frequency: 'daily', time: '08:00' });
              }
            }}>
              <DialogTrigger asChild>
                <Button className="btn-glow">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Medicine
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Medicine Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Vitamin D3"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosage</Label>
                    <Input
                      id="dosage"
                      placeholder="e.g., 1000 IU, 500mg"
                      value={formData.dosage}
                      onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="frequency">Frequency</Label>
                      <Select 
                        value={formData.frequency}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Once daily</SelectItem>
                          <SelectItem value="twice_daily">Twice daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="as_needed">As needed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      {editingMedicine ? 'Update' : 'Add Medicine'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative mb-6"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </motion.div>

          {/* Medicine List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {filteredMedicines.map((medicine) => {
              const log = todayLogs.find(l => l.medicineId === medicine.id);
              return (
                <MedicineCard
                  key={medicine.id}
                  medicine={medicine}
                  log={log}
                  onTake={() => logMedicine(medicine.id, 'taken')}
                  onMiss={() => logMedicine(medicine.id, 'missed')}
                  onEdit={() => handleEdit(medicine)}
                  onDelete={() => handleDelete(medicine.id, medicine.name)}
                />
              );
            })}

            {filteredMedicines.length === 0 && (
              <div className="text-center py-12 glass-card rounded-2xl">
                <Pill className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                {searchQuery ? (
                  <>
                    <p className="text-muted-foreground">No medicines found matching "{searchQuery}"</p>
                    <Button variant="link" onClick={() => setSearchQuery('')}>
                      Clear search
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-muted-foreground mb-4">No medicines added yet.</p>
                    <Button onClick={() => setIsOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Medicine
                    </Button>
                  </>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Medicines;
