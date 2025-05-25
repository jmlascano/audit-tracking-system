import React, { useEffect, useState, useCallback } from "react";
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
import { Pencil, Trash2, Search } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import axios from "axios";
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import AddFeeDialog from "./AddFeeDialog"; 

interface Fee {
  fee_id: number;
  fee_name: string;
  member_name: string;
  amount: number;
  due_date: string;
  payment_date: string | null;
  isPaid: number;
  isLate: number;
  sem_issued: string;
  acad_year_issued: number;
}

interface FeeStats {
  highestDebt: {
    member_name: string;
    total_debt: number;
  };
  ratio: {
    paid: number;
    unpaid: number;
    paid_count: number;
    unpaid_count: number;
  };
}

interface OrgFeeTableProps {
  org_id: number;
}

const OrgFeeTable = ({ org_id = 1 }: OrgFeeTableProps) => {
  const [fees, setFees] = useState<Fee[]>([]);
  const [stats, setStats] = useState<FeeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filters, setFilters] = useState({
    isPaid: "",
    isLate: "",
    search: "",
  });
  const [searchInput, setSearchInput] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [feeToDelete, setFeeToDelete] = useState<number | null>(null);

  const fetchFees = async () => {
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(
          ([key, value]) => value !== "All" && value !== ""
        )
      );
      const response = await axios.get(`http://localhost:8080/orgs/${org_id}/fees`, { params });
      console.log('Fees API response:', response.data);
      setFees(response.data);
    } catch (error) {
      console.error("Error fetching fees:", error);
      setFees([]);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/orgs/${org_id}/fees/stats`);
      console.log("Stats response:", response.data);
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats({
        highestDebt: { member_name: 'None', total_debt: 0 },
        ratio: { paid: 0, unpaid: 0, paid_count: 0, unpaid_count: 0 }
      });
    }
  };

  const handleDelete = async (fee_id: number) => {
    try {
      setIsFiltering(true);
      await axios.delete(`http://localhost:8080/orgs/${org_id}/fees/${fee_id}`);
      await fetchFees();
      await fetchStats();
      setIsDialogOpen(false);
      setFeeToDelete(null);
    } catch (error) {
      console.error("Error deleting fee:", error);
    } finally {
      setIsFiltering(false);
    }
  };

  const openDeleteDialog = (fee_id: number) => {
    setFeeToDelete(fee_id);
    setIsDialogOpen(true);
  };

  const handleFeeAdded = async () => {
    setIsFiltering(true);
    await Promise.all([fetchFees(), fetchStats()]);
    setIsFiltering(false);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchFees(), fetchStats()]);
      setLoading(false);
    };
    loadData();
  }, [org_id, filters]);

  const handleFilterChange = useCallback((field: string, value: string) => {
    setIsFiltering(true);
    setFilters((prev) => {
      const newFilters = { ...prev, [field]: value };
      fetchFees().finally(() => setIsFiltering(false));
      return newFilters;
    });
  }, []);

  const handleSearch = () => {
    setIsFiltering(true);
    handleFilterChange("search", searchInput);
  };

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), 'MMMM d, yyyy');
    } catch {
      return 'Invalid Date';
    }
  };

  const formatDateTime = (date: string | null) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'MMMM d, yyyy, h:mm a');
    } catch {
      return 'Invalid Date';
    }
  };

  const filteredFees = fees.filter((fee) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!fee.fee_name.toLowerCase().includes(searchLower) &&
          !fee.member_name.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    if (filters.isPaid && filters.isPaid !== "All") {
      const isPaidFilter = filters.isPaid === "true";
      if (Boolean(fee.isPaid) !== isPaidFilter) {
        return false;
      }
    }
    if (filters.isLate && filters.isLate !== "All") {
      const isLateFilter = filters.isLate === "true";
      if (Boolean(fee.isLate) !== isLateFilter) {
        return false;
      }
    }
    return true;
  });

  //  stats for filtered fees
  const filteredStats = {
    totalAmount: filteredFees
      .filter(fee => fee.isPaid)
      .reduce((sum, fee) => sum + (typeof fee.amount === 'number' ? fee.amount : Number(fee.amount) || 0), 0),
    paidCount: filteredFees.filter(fee => fee.isPaid).length,
    unpaidCount: filteredFees.filter(fee => !fee.isPaid).length,
    highestDebt: filteredFees.reduce((max, fee) => {
      if (!fee.isPaid && fee.amount > (max?.amount || 0)) {
        return { member_name: fee.member_name, amount: fee.amount };
      }
      return max;
    }, { member_name: 'None', amount: 0 } as { member_name: string; amount: number })
  };

  const pieData: { name: string; value: number; fill: string }[] = [];
  if (filteredStats.paidCount > 0) {
    pieData.push({
      name: 'Paid',
      value: filteredStats.paidCount,
      fill: '#10B981'
    });
  }
  if (filteredStats.unpaidCount > 0) {
    pieData.push({
      name: 'Unpaid',
      value: filteredStats.unpaidCount,
      fill: '#EF4444'
    });
  }

  console.log("Pie chart data:", pieData);

  const getRadius = () => {
    const isMobile = window.innerWidth < 768;
    return {
      outerRadius: isMobile ? 80 : 100,
      innerRadius: isMobile ? 30 : 40,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading fee data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1>
        <div className="flex gap-2">
          <Input
            className="max-w-[200px]"
            placeholder="Search fees..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button
            className="bg-gray-600 hover:bg-gray-700"
            size="sm"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <AddFeeDialog org_id={org_id} onFeeAdded={handleFeeAdded} />
        </div>
      </div>

      <AnimatePresence>
        {!isFiltering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 p-6 bg-white rounded-lg shadow-sm border"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Fee Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Member with Highest Debt:</span> {filteredStats.highestDebt.member_name} 
                  <span className="font-medium text-red-600"> (₱{filteredStats.highestDebt.amount.toLocaleString()})</span>
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-green-600">Paid Fees:</span> {filteredStats.paidCount}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-red-600">Unpaid Fees:</span> {filteredStats.unpaidCount}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-blue-600">Total Amount:</span>
                  ₱{filteredStats.totalAmount.toLocaleString()}
                </p>
              </div>
              <div className="flex justify-center">
                <div className="w-[320px] h-[280px]">
                  {filteredFees.length > 0 && pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value, percent }) => 
                            `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                          }
                          {...getRadius()}
                          dataKey="value"
                          paddingAngle={2}
                        >
                          {pieData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.fill}
                              stroke={entry.fill}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '12px',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                            fontSize: '14px',
                          }}
                          formatter={(entryValue: number, name: string) => [`${entryValue} fee${entryValue > 1 ? 's' : ''}`, name]}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          height={40}
                          wrapperStyle={{ paddingTop: '10px', fontSize: '14px' }}
                          iconType="circle"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full bg-transparent">
                      <div className="text-center">
                        <div className="text-gray-400 mb-4">
                          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <p className="text-gray-500 text-sm font-medium">No fee data available</p>
                        <p className="text-gray-400 text-xs mt-1">Add fees or adjust filters to see statistics</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isFiltering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 bg-white rounded-lg shadow-sm border overflow-hidden"
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="text-center font-semibold text-gray-800">Fee ID</TableHead>
                  <TableHead className="text-center font-semibold text-gray-800">Fee Name</TableHead>
                  <TableHead className="text-center font-semibold text-gray-800">Member Name</TableHead>
                  <TableHead className="text-center font-semibold text-gray-800">Amount</TableHead>
                  <TableHead className="text-center font-semibold text-gray-800">Due Date</TableHead>
                  <TableHead className="text-center font-semibold text-gray-800">Payment Date</TableHead>
                  <TableHead className="text-center font-semibold text-gray-800">
                    <div className="flex justify-center">
                      <Select
                        value={filters.isPaid}
                        onValueChange={(value) => handleFilterChange("isPaid", value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Is Paid" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="true">Paid</SelectItem>
                          <SelectItem value="false">Unpaid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-800">
                    <div className="flex justify-center">
                      <Select
                        value={filters.isLate}
                        onValueChange={(value) => handleFilterChange("isLate", value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Is Late" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="true">Late</SelectItem>
                          <SelectItem value="false">Not Late</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-800">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFees.map((fee) => (
                  <TableRow key={fee.fee_id} className="text-center hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-900">{fee.fee_id}</TableCell>
                    <TableCell className="text-gray-700">{fee.fee_name}</TableCell>
                    <TableCell className="text-gray-700">{fee.member_name}</TableCell>
                    <TableCell className="font-medium text-gray-900">₱{fee.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-gray-700">{formatDate(fee.due_date)}</TableCell>
                    <TableCell className="text-gray-700">{formatDateTime(fee.payment_date)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        fee.isPaid 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {fee.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        fee.isLate 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {fee.isLate ? 'Late' : 'On Time'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-center">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                          onClick={() => openDeleteDialog(fee.fee_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredFees.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      No fees found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </AnimatePresence>

      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="fixed inset-0 bg-black/20" onClick={() => {
            setIsDialogOpen(false);
            setFeeToDelete(null);
          }}></div>
          <div className="relative bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this fee? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsDialogOpen(false);
                  setFeeToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700"
                onClick={() => feeToDelete && handleDelete(feeToDelete)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrgFeeTable;