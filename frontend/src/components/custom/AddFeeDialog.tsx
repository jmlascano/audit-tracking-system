
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

interface AddFeeDialogProps {
  org_id: number;
  onFeeAdded: () => void;
}

const AddFeeDialog = ({ org_id, onFeeAdded }: AddFeeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    fee_name: "",
    member_username: "",
    amount: "",
    due_date: "",
    sem_issued: "",
    acad_year_issued: ""
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`http://localhost:8080/orgs/${org_id}/fees`, formData);
      setOpen(false);
      onFeeAdded();
      setFormData({
        fee_name: "",
        member_username: "",
        amount: "",
        due_date: "",
        sem_issued: "",
        acad_year_issued: ""
      });
    } catch (error) {
      console.error("Error adding fee:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Fee</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Fee</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Fee Name"
            value={formData.fee_name}
            onChange={(e) => handleChange("fee_name", e.target.value)}
          />
          <Input
            placeholder="Member Username"
            value={formData.member_username}
            onChange={(e) => handleChange("member_username", e.target.value)}
          />
          <Input
            type="number"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
          />
          <Input
            type="date"
            placeholder="Due Date"
            value={formData.due_date}
            onChange={(e) => handleChange("due_date", e.target.value)}
          />
          <Select
            value={formData.sem_issued}
            onValueChange={(value) => handleChange("sem_issued", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Semester Issued" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1st Sem</SelectItem>
              <SelectItem value="2">2nd Sem</SelectItem>
              <SelectItem value="m">Midyear</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Academic Year Issued (e.g., 2425)"
            value={formData.acad_year_issued}
            onChange={(e) => handleChange("acad_year_issued", e.target.value)}
          />
        </div>
        <Button onClick={handleSubmit}>Add Fee</Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddFeeDialog;
