import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteMemberDialogProps {
  org_id: number;
  member_id: number;
  orgMemberDeleted?: () => void;
}

const DeleteMemberDialog = ({ org_id, member_id, orgMemberDeleted }: DeleteMemberDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:8080/orgs/${org_id}/members/${member_id}`);
      
      toast.success("Successfully deleted member!");
      setIsOpen(false); 
      
      if (orgMemberDeleted) {
        orgMemberDeleted();
      }
    } catch (error) {
       toast.error('Deleting failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this member?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
            <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isLoading}>
                Cancel
            </Button>
            </DialogClose>
            <Button onClick={() => onSubmit()} disabled={isLoading} variant="destructive">
            {isLoading ? "Loading..." : "Delete"}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMemberDialog;