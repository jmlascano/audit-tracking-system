import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";

interface DeleteFeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  feeId: number | null;
  feeName?: string;
}

const DeleteFeeDialog: React.FC<DeleteFeeDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  feeName,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-purple-50 to-yellow-50 border-purple-200">
        <DialogHeader className="text-purple-800">
          <DialogTitle>Are you sure you want to delete this fee?</DialogTitle>
          <DialogDescription>
            {`This will permanently delete ${feeName ? `"${feeName}"` : 'this fee'}. This action cannot be undone.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading ? "Loading..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteFeeDialog;