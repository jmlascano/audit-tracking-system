// components/MembersTable.tsx
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
import { Input } from "@/components/ui/input";
import axios from  "axios";
import { useEffect, useState } from "react";
import AddMemberDialog from "./AddMemberDialog";
import EditMemberDialog from "./EditMemberDialog";
import DeleteMemberDialog from "./DeleteMemberDialog";
import OrgMemberStats from "./OrgMemberStats";
import OrgEvents from "./OrgEvents";

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

interface MembersTableProps {
  org_id: number
}

const MembersTable = ({ org_id }: MembersTableProps) => {
  const [members, setMembers] = useState<Member[]>([]);
   const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
    status: "",
    gender: "",
    committee_role: "",
    degree_program: "",
    batch: "",
    acad_year: "",
    acad_sem: ""
  });

    const fetchMembers = async () => {
      setMembers([]); // clear table before every fetch because buggy
    try {
      // For the filter
      const params = Object.fromEntries(
        Object.entries(filters).filter(
          ([key, value]) => value !== "All" && value !== ""
        )
      );

      // For the search term (q)
      if (searchTerm.trim()) {
        params.q = searchTerm;
      }

      console.log("Sending filters:", params); // debugging
      
      const response = await axios.get(
        `http://localhost:8080/orgs/${org_id}/members`,
        { params }
      );

      console.log("Received data:", response.data); // debugging
      setMembers(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    // To avoid too many API calls at once
    const debounceTimer = setTimeout(() => {
      fetchMembers();
    }, 150); // 150ms delay

     return () => clearTimeout(debounceTimer);
  }, [filters, searchTerm]); // Re-fetch when any filter changes

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col lg:p-6">
        <div className="flex flex-col justify-between pb-4 sm:flex-row">
            <h1 className="text-2xl font-bold text-gray-900 pb-2">Member Management</h1>
            <div className="flex gap-4">
              <Input 
                className="max-w-[250px] border-purple-200 focus:border-purple-400 focus:ring-purple-200 transition-colors" 
                placeholder="Search members..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <AddMemberDialog org_id={org_id} onMemberAdded={() => fetchMembers()}/>
          </div>
        </div>
        {/* BODY */}
        <div className="flex gap-8 flex-col-reverse lg:flex-row">
          {/* TABLE */}
          <div className="min-w-[250px] rounded-lg border-1 border-purple-200 bg-gradient-to-br from-purple-50 to-white-50 shadow-lg p-2">
          <Table>
              <TableHeader>
                  <TableRow className="font-bold bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg shadow-lg">
                      <TableHead className="text-center" >Name</TableHead>
                      <TableHead >
                          <div className="flex justify-center">
                          <Select
                              value={filters.status}
                              onValueChange={(value) => handleFilterChange("status", value)}
                          >
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
                      <TableHead >
                          <div className="flex justify-center">
                          <Input
                              placeholder="Search role..."
                              value={filters.committee_role}
                              onChange={(e) => handleFilterChange("committee_role", e.target.value)}
                          />
                          </div>
                      </TableHead>
                      <TableHead >
                          <div className="flex justify-center">
                          <Select
                              value={filters.gender}
                              onValueChange={(value) => handleFilterChange("gender", value)}
                          >
                              <SelectTrigger>
                              <SelectValue placeholder="Gender" />
                              </SelectTrigger>
                              <SelectContent>
                              <SelectItem value="All">All Genders</SelectItem>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                          </Select>
                          </div>
                      </TableHead>
                      <TableHead >
                          <div className="flex justify-center">
                          <Input
                              placeholder="Search program..."
                              value={filters.degree_program}
                              onChange={(e) => handleFilterChange("degree_program", e.target.value)}
                          />
                          </div>
                      </TableHead>
                      <TableHead>
                          <div className="flex justify-center">
                          <Input
                              placeholder="Search batch..."
                              value={filters.batch}
                              onChange={(e) => handleFilterChange("batch", e.target.value)}
                          />
                          </div>
                      </TableHead>
                      <TableHead>
                          <div className="flex justify-center">
                          <Input
                              placeholder="Search academic year..."
                              value={filters.acad_year}
                              onChange={(e) => handleFilterChange("acad_year", e.target.value)}
                          />
                          </div>
                      </TableHead>
                      <TableHead>
                          <div className="flex justify-center">
                          <Select
                              value={filters.acad_sem}
                              onValueChange={(value) => handleFilterChange("acad_sem", value)}
                          >
                              <SelectTrigger>
                              <SelectValue placeholder="Academic Semester" />
                              </SelectTrigger>
                              <SelectContent>
                              <SelectItem value="All">All Sems</SelectItem>
                              <SelectItem value="1">1st Sem</SelectItem>
                              <SelectItem value="2">2nd Sem</SelectItem>
                              <SelectItem value="m">Midyear</SelectItem>
                              </SelectContent>
                          </Select>
                          </div>
                      </TableHead>
                      <TableHead className="text-center" >Actions</TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {members.map((member) => (
                  <TableRow className="text-center" key={`${member.member_id}-${member.acad_year}-${member.acad_sem}`}>
                      <TableCell>{member.member_name}</TableCell>
                      <TableCell>{member.status}</TableCell>
                      <TableCell>{member.committee_role}</TableCell>
                      <TableCell>{member.gender}</TableCell>
                      <TableCell>{member.degree_program}</TableCell>
                      <TableCell>{member.batch}</TableCell>
                      <TableCell>{member.acad_year}</TableCell>
                      <TableCell>{member.acad_sem}</TableCell>
                      <TableCell className="flex gap-2">
                          <EditMemberDialog org_id={org_id} member_id={member.member_id} acad_year={member.acad_year} acad_sem={member.acad_sem} old_status={member.status} orgMemberEdited={() => fetchMembers()}/>
                          <DeleteMemberDialog org_id={org_id} member_id={member.member_id} acad_year={member.acad_year} acad_sem={member.acad_sem} orgMemberDeleted={() => fetchMembers()}/>
                      </TableCell>
                  </TableRow>
                  ))}
              </TableBody>
          </Table>
          </div>
          {/* OTHER STATS */}
          <div className="flex flex-col mb-4 gap-4 sm:flex-row lg:flex-col">
            <OrgMemberStats org_id={org_id} />
            <OrgEvents org_id={org_id} />
          </div>
        </div>
    </div>
  );
};

export default MembersTable;