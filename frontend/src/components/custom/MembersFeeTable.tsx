import React, { useEffect, useState, useCallback, useMemo } from "react";
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
import { Button } from "@/components/ui/button";
import { CreditCard, ArrowUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import axios from "axios";
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from "../ui/input";

interface Fee {
  fee_id: number;
  fee_name: string;
  org_name: string;
  amount: number;
  due_date: string;
  payment_date: string | null;
  isPaid: number;
  isLate: number;
  sem_issued: string;
  acad_year_issued: number;
  sem_ay: string;
}

interface FeeStats {
  ratio: {
    paid: number;
    unpaid: number;
    paid_count: number;
    unpaid_count: number;
  };
}

interface MembersFeeTableProps {
  member_id: number;
}

const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const MembersFeeTable = ({ member_id = 1 }: MembersFeeTableProps) => {
  const [fees, setFees] = useState<Fee[]>([]);
  const [stats, setStats] = useState<FeeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filters, setFilters] = useState({
    isPaid: "",
    isLate: "",
    search: "",
  });
  const [feeToDelete, setToPaid] = useState<number | null>(null);
  const [semAyInput, setSemAyInput] = useState("");

  const fetchFees = async () => {
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(
          ([key, value]) => value !== "All" && value !== ""
        )
      );
      const response = await axios.get(`http://localhost:8080/members/${member_id}/fees`, { params });
      console.log('Fees API response:', response.data);
      setFees(response.data);
    } catch (error) {
      console.error("Error fetching fees:", error);
      setFees([]);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/orgs/${member_id}/fees/stats`);
      console.log("Stats response:", response.data);
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats({
        ratio: { paid: 0, unpaid: 0, paid_count: 0, unpaid_count: 0 }
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchFees(), fetchStats()]);
      setLoading(false);
    };
    loadData();
  }, [member_id, filters]);

  const handleFilterChange = useCallback((field: string, value: string) => {
    setIsFiltering(true);
    setFilters((prev) => {
      const newFilters = { ...prev, [field]: value };
      return newFilters;
    });
    
    setTimeout(() => {
      setIsFiltering(false);
    }, 300);
  }, []);

  // Debounced version of the filter change handler
  const debouncedFilterChange = useMemo(
    () => debounce((value: string) => {
      handleFilterChange("sem_ay", value);
    }, 500), // 500ms delay
    [handleFilterChange]
  );

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

  const markFeeAsPaid = async (fee_id: number) => {
    try {
      await axios.get(`http://localhost:8080/members/${member_id}/fees/${fee_id}/pay`);
      console.log(`Fee ${fee_id} marked as paid`);
      await fetchFees(); // Refresh data
    } catch (error) {
      console.error("Failed to mark fee as paid:", error);
    }
  };

  const filteredFees = fees.filter((fee) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!fee.fee_name.toLowerCase().includes(searchLower) &&
          !fee.org_name.toLowerCase().includes(searchLower)) {
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

  // Compute stats for filtered fees
  const filteredStats = {
    totalAmount: filteredFees
      .filter(fee => fee.isPaid)
      .reduce((sum, fee) => sum + (typeof fee.amount === 'number' ? fee.amount : Number(fee.amount) || 0), 0),
    paidCount: filteredFees.filter(fee => fee.isPaid).length,
    unpaidCount: filteredFees.filter(fee => !fee.isPaid).length,
    highestDebt: filteredFees.reduce((max, fee) => {
      if (!fee.isPaid && fee.amount > (max?.amount || 0)) {
        return { org_name: fee.org_name, amount: fee.amount };
      }
      return max;
    }, { org_name: 'None', amount: 0 } as { org_name: string; amount: number })
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading fee data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col mx-16">
      {/* HEADER */}
      <div className="flex flex-col justify-between pb-4 sm:flex-row max-w-[1700px]">
        {/* TITLE */}
        <div className="flex gap-3 items-center pb-4 sm:pb-0">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-purple-800 bg-clip-text text-transparent font-sans">Fee Management</h1>
            <p className="text-gray-600 font-sans text-lg hidden sm:block">Track and manage organization fees</p>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="flex gap-8 flex-col-reverse lg:flex-row max-w-[1700px] items-start">
        {/* TABLE */}
        <AnimatePresence>
          {!isFiltering && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-[95vw] xl:max-w-[80vw] rounded-lg border-1 border-purple-200 bg-gradient-to-br from-purple-50 to-white-50 shadow-lg p-2 overflow-x-auto"
            >
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="font-bold bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg shadow-lg">
                    <TableHead className="text-center font-semibold text-gray-800">Fee ID</TableHead>
                    <TableHead className="text-center font-semibold text-gray-800">Fee Name</TableHead>
                    <TableHead className="text-center font-semibold text-gray-800">Organization Name</TableHead>
                    <TableHead className="text-center font-semibold text-gray-800">Amount</TableHead>
                    <TableHead className="text-center font-semibold text-gray-800">
                      <div className="flex justify-center">
                        <Input
                          className="max-w-[150px] min-w-[125px]"
                          placeholder="Search AY, Sem..."
                          value={semAyInput}
                          onChange={(e) => {
                            setSemAyInput(e.target.value);
                            debouncedFilterChange(e.target.value);
                          }}
                        />
                      </div>
                    </TableHead>
                    <TableHead className="text-center font-semibold text-gray-800">Due Date</TableHead>
                    <TableHead className="text-center font-semibold text-gray-800">Payment Date</TableHead>
                    <TableHead>
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
                    <TableHead>
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
                    <TableRow key={fee.fee_id} className="text-center hover:bg-purple-50/50 transition-colors">
                      <TableCell className="font-medium text-gray-900">{fee.fee_id}</TableCell>
                      <TableCell className="text-gray-700">{fee.fee_name}</TableCell>
                      <TableCell className="text-gray-700">{fee.org_name}</TableCell>
                      <TableCell className="font-medium text-gray-900">₱{fee.amount.toLocaleString()}</TableCell>
                      <TableCell className="font-medium text-gray-900">{fee.sem_ay}</TableCell>
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
                        {!fee.isPaid && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markFeeAsPaid(fee.fee_id)}
                            className="border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-colors"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                        )}
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

        {/* STATS SIDEBAR */}
        <AnimatePresence>
          {!isFiltering && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col mb-4 gap-4 sm:flex-row lg:flex-col min-w-[300px]"
            >
              <div className="rounded-lg border-1 border-purple-200 bg-gradient-to-br from-purple-50 to-white-50 shadow-lg p-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-purple-800 bg-clip-text text-transparent mb-6 font-sans">Fee Summary</h2>
                <div className="space-y-3 mb-6">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-green-600">Paid Fees:</span> {filteredStats.paidCount}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-red-600">Unpaid Fees:</span> {filteredStats.unpaidCount}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-blue-600">Total Paid Amount: </span>
                    ₱{filteredStats.totalAmount.toLocaleString()}
                  </p>
                </div>
                <div className="w-full h-[280px]">
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MembersFeeTable;