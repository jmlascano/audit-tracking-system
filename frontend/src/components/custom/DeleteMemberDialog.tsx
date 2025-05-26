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
  acad_year: number;
  acad_sem: string;
  orgMemberDeleted?: () => void;
}

const DeleteMemberDialog = ({ org_id, member_id, acad_year, acad_sem, orgMemberDeleted }: DeleteMemberDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:8080/orgs/${org_id}/members/${member_id}/${acad_year}/${acad_sem}`);
      
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
          <Trash2 className="h-4 w-4" color="red" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-purple-50 to-yellow-50 border-purple-200">
        <DialogHeader className="text-purple-800">
          <DialogTitle>Are you sure you want to delete this member?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
            <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isLoading} className="border-purple-200 text-purple-700 hover:bg-purple-50">
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