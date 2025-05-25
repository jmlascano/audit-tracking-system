import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

interface AddMemberDialogProps {
  org_id: number;
  member_id: number;
  acad_year: number;
  acad_sem: string;
  old_status: string;
  orgMemberEdited?: () => void;
}

const AddMemberDialog = ({ org_id, member_id, acad_year, acad_sem, old_status, orgMemberEdited }: AddMemberDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newStatus, setNewStatus] = useState<string>(old_status);

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      await axios.put(`http://localhost:8080/orgs/${org_id}/members/${member_id}`, 
        {
          acad_year: acad_year,
          acad_sem: acad_sem,
          status: newStatus 
        }
    );
      
      toast.success("Successfully edited member!");
      setIsOpen(false); 
      
      if (orgMemberEdited) {
        orgMemberEdited();
      }
    } catch (error) {
       toast.error('Editing failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Status</DialogTitle>
        </DialogHeader>
        <Select
            defaultValue={old_status}
            onValueChange={(value) => setNewStatus(value)}
        >
            <SelectTrigger>
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
                <SelectItem value="Expelled">Expelled</SelectItem>
                <SelectItem value="Alumni">Alumni</SelectItem>
            </SelectContent>
        </Select>
        <DialogFooter className="gap-2">
            <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isLoading}>
                Cancel
            </Button>
            </DialogClose>
            <Button onClick={() => onSubmit()} disabled={isLoading}>
            {isLoading ? "Loading..." : "Confirm"}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;