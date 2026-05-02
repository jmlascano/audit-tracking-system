import React, { useState } from "react";
import { Plus } from "lucide-react";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";

const formSchema = z.object({
  fee_name: z.string().min(2, "Fee name must be at least 2 characters"),
  member_username: z.string().min(1, "Member username is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .regex(/^\d+$/, "Amount must be a positive number"),
  due_date: z.string().min(1, "Due date is required"),
  sem_issued: z.string().min(1, "Semester is required"),
  acad_year_issued: z
    .string()
    .min(1, "Academic year is required")
    .regex(/^\d{4}$/, "Academic year must be a 4-digit number (e.g., 2425)"),
});

interface AddFeeDialogProps {
  org_id: number;
  onFeeAdded: () => void;
}

const AddFeeDialog = ({ org_id, onFeeAdded }: AddFeeDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fee_name: "",
      member_username: "",
      amount: "",
      due_date: "",
      sem_issued: "",
      acad_year_issued: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/orgs/${org_id}/fees`, values);
      toast.success("Successfully added fee!");
      setIsOpen(false);
      onFeeAdded();
      form.reset();
    } catch (error) {
      console.error("Error adding fee:", error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        toast.error("Member with that username not found");
      } else {
        toast.error("Failed to add fee. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white transition-all duration-300 hover:scale-105 shadow-md">
          <Plus className="h-4 w-4 mr-2" />
          Add Fee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-purple-50 to-yellow-50 border-purple-200">
        <DialogHeader>
          <DialogTitle className="text-purple-800">Add New Fee</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fee_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fee Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter fee name"
                      className="border-purple-200 focus:border-purple-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="member_username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter member username"
                      className="border-purple-200 focus:border-purple-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      className="border-purple-200 focus:border-purple-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="border-purple-200 focus:border-purple-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="acad_year_issued"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Year</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 2425"
                        className="border-purple-200 focus:border-purple-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sem_issued"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Semester</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-purple-200 focus:border-purple-400">
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1st Sem</SelectItem>
                        <SelectItem value="2">2nd Sem</SelectItem>
                        <SelectItem value="m">Midyear</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                type="submit"
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isLoading ? "Adding..." : "Add Fee"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFeeDialog;