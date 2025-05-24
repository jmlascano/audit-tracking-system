import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from  "axios";
import { useEffect, useState } from "react";

interface Member {
  member_id: number;
  member_name: string;
  status: string;
  committee_role: string;
  gender: string;
  degree_program: string;
  batch: string;
  acad_year: number;
  acad_sem: string;
}

const OrgMemberMgt = () => {
  const [members, setMembers] = useState<Member[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>("All");

    // TODO: Connect with the logged in user or smth
    const org_id = 1; 

    const fetchMembers = async (statusFilter: string = "All") => {
    try {
      const params = statusFilter !== "All" ? { status: statusFilter } : {};
      
      const response = await axios.get(
        `http://localhost:8080/orgs/${org_id}/members`,
        { params }
      );
      setMembers(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchMembers(selectedStatus);
  }, [selectedStatus]); // Re-fetch when selectedStatus changes

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };

  return (
    <>
        <h1 className="text-xl font-bold px-8">Member Management</h1>
        <div className="min-h-screen flex flex-col m-8">
            <Table className="rounded-lg border outline-2 outline-white overflow-hidden">
                <TableHeader>
                    <TableRow className="font-bold">
                        <TableHead className="text-center" >ID</TableHead>
                        <TableHead className="text-center" >Name</TableHead>
                        <TableHead >
                            <div className="flex justify-center">
                                <Select defaultValue="All" onValueChange={handleStatusChange} >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Status</SelectItem>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                        <SelectItem value="Suspended">Suspended</SelectItem>
                                        <SelectItem value="Expelled">Expelled</SelectItem>
                                        <SelectItem value="Alumni">Alumni</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </TableHead>
                        <TableHead className="text-center" >Committee Role</TableHead>
                        <TableHead className="text-center" >Gender</TableHead>
                        <TableHead className="text-center" >Degree Program</TableHead>
                        <TableHead className="text-center" >Batch</TableHead>
                        <TableHead className="text-center" >Academic Year</TableHead>
                        <TableHead className="text-center" >Academic Sem</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {members.map((member) => (
                    <TableRow key={member.member_id} className="text-center">
                        <TableCell>{member.member_id}</TableCell>
                        <TableCell>{member.member_name}</TableCell>
                        <TableCell>{member.status}</TableCell>
                        <TableCell>{member.committee_role}</TableCell>
                        <TableCell>{member.gender}</TableCell>
                        <TableCell>{member.degree_program}</TableCell>
                        <TableCell>{member.batch}</TableCell>
                        <TableCell>{member.acad_year}</TableCell>
                        <TableCell>{member.acad_sem}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    </>
  );
};


export default OrgMemberMgt;
