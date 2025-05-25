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
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Pencil } from 'lucide-react';
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

const OrgPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
    const [filters, setFilters] = useState({
    status: "",
    gender: "",
    committee_role: "",
    degree_program: "",
    batch: "",
    acad_year: "",
    acad_sem: ""
  });

    const user = JSON.parse(localStorage.getItem('user'));
    const org_id = user.id ? user.id : 1; // Since user could be null, lets just default it to 1 lol
    const org_name = user.name ? user.name : "Young Software Engineers' Society"; // Since user could be null, lets just default it to YSES lol

    const fetchMembers = async () => {
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(
          ([key, value]) => value !== "All" && value !== ""
        )
      );
      
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
    fetchMembers();
  }, [filters]); // Re-fetch when any filter changes

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogout = () => {
    // Remove user data in local storage
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  }

  return (
    <>
      <div className="flex justify-between mx-16 my-8">
        <h1 className="text-2xl font-bold font-inter">Hi {org_name}!</h1>
        <Button variant="destructive" onClick={handleLogout}><Link to="/">Log Out</Link></Button>
      </div>
      <div className="min-h-screen flex flex-col mx-16 my-8">
          <Table className="rounded-lg border outline-2 outline-white overflow-hidden">
              <TableHeader>
                  <TableRow className="font-bold font-inter">
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
                      <TableHead className="text-center" >Edit</TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {members.map((member) => (
                  <TableRow key={member.member_id} className="text-center font-inter">
                      <TableCell>{member.member_name}</TableCell>
                      <TableCell>{member.status}</TableCell>
                      <TableCell>{member.committee_role}</TableCell>
                      <TableCell>{member.gender}</TableCell>
                      <TableCell>{member.degree_program}</TableCell>
                      <TableCell>{member.batch}</TableCell>
                      <TableCell>{member.acad_year}</TableCell>
                      <TableCell>{member.acad_sem}</TableCell>
                      <TableCell>
                        <Button variant="outline">
                          <Pencil />
                        </Button>
                        </TableCell>
                  </TableRow>
                  ))}
              </TableBody>
          </Table>
      </div>
    </>
  );
};


export default OrgPage;
