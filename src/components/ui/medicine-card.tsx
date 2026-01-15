import React from 'react';
import { motion } from 'framer-motion';
import { Pill, Clock, Check, X, MoreVertical, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Medicine, MedicineLog } from '@/contexts/MedicineContext';

interface MedicineCardProps {
  medicine: Medicine;
  log?: MedicineLog;
  onTake?: () => void;
  onMiss?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

const frequencyLabels = {
  daily: 'Once daily',
  twice_daily: 'Twice daily',
  weekly: 'Weekly',
  as_needed: 'As needed',
};

const MedicineCard: React.FC<MedicineCardProps> = ({
  medicine,
  log,
  onTake,
  onMiss,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const status = log?.status || 'pending';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={cn(
        'p-4 rounded-xl border bg-card transition-all duration-300',
        status === 'taken' && 'border-success/30 bg-success/5',
        status === 'missed' && 'border-destructive/30 bg-destructive/5',
        status === 'pending' && 'border-border hover:border-primary/30'
      )}
      style={{ boxShadow: 'var(--shadow-sm)' }}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
          status === 'taken' && 'bg-success/20',
          status === 'missed' && 'bg-destructive/20',
          status === 'pending' && 'bg-primary/10'
        )}>
          <Pill className={cn(
            'w-6 h-6',
            status === 'taken' && 'text-success',
            status === 'missed' && 'text-destructive',
            status === 'pending' && 'text-primary'
          )} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-foreground">{medicine.name}</h3>
              <p className="text-sm text-muted-foreground">{medicine.dosage}</p>
            </div>
            
            {(onEdit || onDelete) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={onEdit}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem onClick={onDelete} className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{medicine.time}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {frequencyLabels[medicine.frequency]}
            </span>
          </div>

          {/* Action Buttons */}
          {showActions && status === 'pending' && (
            <div className="flex items-center gap-2 mt-3">
              <Button
                size="sm"
                onClick={onTake}
                className="flex-1 bg-success hover:bg-success/90"
              >
                <Check className="w-4 h-4 mr-1" />
                Taken
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onMiss}
                className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                <X className="w-4 h-4 mr-1" />
                Missed
              </Button>
            </div>
          )}

          {/* Status Badge */}
          {status !== 'pending' && (
            <div className={cn(
              'inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full text-sm font-medium',
              status === 'taken' && 'bg-success/20 text-success',
              status === 'missed' && 'bg-destructive/20 text-destructive'
            )}>
              {status === 'taken' ? (
                <>
                  <Check className="w-4 h-4" />
                  Taken
                </>
              ) : (
                <>
                  <X className="w-4 h-4" />
                  Missed
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MedicineCard;
