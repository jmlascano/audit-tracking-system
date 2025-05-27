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
import { useState } from "react";
import { toast } from "sonner";

const formSchema = z.object({
  member_username: z.string().min(1, "Username is required"),
  batch: z.string().min(1, "Batch is required"),
  acad_year: z.string().min(1, "Academic year is required"),
  acad_sem: z.string().min(1, "Academic semester is required"),
  committee: z.string().min(1, "Committee is required"),
  role: z.string().min(1, "Role is required"),
  status: z.string().min(1, "Status is required"),
});

interface AddMemberDialogProps {
  org_id: number;
  onMemberAdded?: () => void;
}

const AddMemberDialog = ({ org_id, onMemberAdded }: AddMemberDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      member_username: "",
      batch: "",
      acad_year: "",
      acad_sem: "",
      committee: "",
      role: "",
      status: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await axios.post(`http://localhost:8080/orgs/${org_id}/members`, values);
      
      toast.success("Successfully added member!");
      
      form.reset();
      setIsOpen(false);
      
      if (onMemberAdded) {
        onMemberAdded();
      }
    } catch (error) {
       if (axios.isAxiosError(error) && error.response?.status === 409) {
            toast.error('Membership already exists');
        } if (axios.isAxiosError(error) && error.response?.status === 404) {
            toast.error('Member with that username not found');
        } else {
            toast.error('Adding failed. Please try again.');
        }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white transition-all duration-300 hover:scale-105 shadow-md">
          <Plus className="h-4 w-4" />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-purple-50 to-yellow-50 border-purple-200">
        <DialogHeader>
          <DialogTitle className="text-purple-800">Add Member to Organization</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="member_username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter member username" className="border-purple-200 focus:border-purple-400" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="batch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter batch" className="border-purple-200 focus:border-purple-400" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="acad_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Year</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2425" className="border-purple-200 focus:border-purple-400" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="acad_sem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Semester</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-purple-200 focus:border-purple-400">
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1st Semester</SelectItem>
                        <SelectItem value="2">2nd Semester</SelectItem>
                        <SelectItem value="m">Midyear</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* DEPRECIATED */}
            {/* <FormField
              control={form.control}
              name="committee_role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Committee Role</FormLabel>
                  <Input placeholder="eg. Member" className="border-purple-200 focus:border-purple-400" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="committee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Committee</FormLabel>
                  <Input placeholder="eg. Tech" className="border-purple-200 focus:border-purple-400" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Input placeholder="eg. Member" className="border-purple-200 focus:border-purple-400" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-purple-200 focus:border-purple-400">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                        <SelectItem value="Expelled">Expelled</SelectItem>
                        <SelectItem value="Alumni">Alumni</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isLoading} className="border-purple-200 text-purple-700 hover:bg-purple-50">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 text-white">
                {isLoading ? "Adding..." : "Add Member"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;