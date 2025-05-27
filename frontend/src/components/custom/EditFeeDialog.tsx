import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar, Save, X } from 'lucide-react';

interface Fee {
  fee_id: number;
  fee_name: string;
  member_name: string;
  amount: number;
  due_date: string;
  payment_date: string | null;
  isPaid: number;
  isLate: string; 
  sem_issued: string;
  acad_year_issued: number;
}

interface EditFeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fee: Fee | null;
  org_id: number;
  onFeeUpdated: () => void;
}

const EditFeeDialog: React.FC<EditFeeDialogProps> = ({
  isOpen,
  onClose,
  fee,
  org_id,
  onFeeUpdated
}) => {
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (fee && isOpen) {
      // Format date for input (YYYY-MM-DD)
      const formattedDate = new Date(fee.due_date).toISOString().split('T')[0];
      setDueDate(formattedDate);
      setError('');
    }
  }, [fee, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fee || !dueDate) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:8080/orgs/${org_id}/fees/${fee.fee_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          due_date: dueDate
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update fee');
      }
      
      onFeeUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating fee:', error);
      setError('Failed to update fee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setDueDate('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border-2 border-purple-200 rounded-3xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-purple-600 bg-clip-text text-transparent font-sans flex items-center gap-2">
            <Calendar className="w-6 h-6 text-purple-600" />
            Edit Fee Due Date
          </DialogTitle>
        </DialogHeader>
        
        {fee && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-purple-50 to-yellow-50 rounded-2xl border border-purple-200">
                <h3 className="font-semibold text-gray-800 font-sans">Fee Details</h3>
                <p className="text-gray-600 font-sans"><span className="font-medium">Name:</span> {fee.fee_name}</p>
                <p className="text-gray-600 font-sans"><span className="font-medium">Member:</span> {fee.member_name}</p>
                <p className="text-gray-600 font-sans"><span className="font-medium">Amount:</span> ₱{fee.amount.toLocaleString()}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="due_date" className="text-base font-semibold text-gray-700 font-sans">
                  Due Date
                </Label>
                <Input
                  id="due_date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full h-12 border-2 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 bg-white/70 backdrop-blur-sm font-sans"
                  required
                />
              </div>
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl">
                  <p className="text-red-600 text-sm font-sans">{error}</p>
                </div>
              )}
            </div>
            
            <DialogFooter className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="h-12 px-6 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 rounded-2xl font-semibold font-sans"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="button"
                disabled={loading || !dueDate}
                onClick={handleSubmit}
                className="h-12 px-6 bg-gradient-to-r from-yellow-400 to-purple-600 hover:from-yellow-500 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-sans"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {loading ? 'Updating...' : 'Update Due Date'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditFeeDialog;