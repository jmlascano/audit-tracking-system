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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Search, Users, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import AddFeeDialog from "./AddFeeDialog.tsx";
import FeeSummary from "./FeeSummary.tsx";
import DeleteFeeDialog from "./DeleteFeeDialog.tsx";
import EditFeeDialog from "./EditFeeDialog.tsx";

interface Fee {
  fee_id: number;
  fee_name: string;
  member_name: string;
  amount: number;
  due_date: string;
  payment_date: string | null;
  isPaid: number;
  isLate: string;
  sem_issued: string;
  acad_year_issued: number;
  sem_ay: string;
}

interface OrgFeeTableProps {
  org_id: number;
}

const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const OrgFeeTable = ({ org_id = 1 }: OrgFeeTableProps) => {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filters, setFilters] = useState({
    sem_ay: "",
    isPaid: "",
    isLate: "",
    search: "",
    searchType: "all",
  });
  const [searchInput, setSearchInput] = useState("");
  const [semAyInput, setSemAyInput] = useState("");
  const [feeToDelete, setFeeToDelete] = useState<{id: number, name: string} | null>(null);
  const [feeToEdit, setFeeToEdit] = useState<Fee | null>(null);

  const fetchFees = async () => {
    try {
      const params = new URLSearchParams();
      
      if (filters.isPaid && filters.isPaid !== "All") {
        params.append('isPaid', filters.isPaid);
      }
      if (filters.isLate && filters.isLate !== "All") {
        params.append('isLate', filters.isLate);
      }
      if (filters.search) {
        params.append('search', filters.search);
        if (filters.searchType !== "all") {
          params.append('searchType', filters.searchType);
        }
      }
      if (filters.sem_ay) {
      params.append('sem_ay', filters.sem_ay);
      }
      params.append('_t', Date.now().toString());

      const response = await fetch(`http://localhost:8080/orgs/${org_id}/fees?${params.toString()}`, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch fees');
      }
      const data = await response.json();
      console.log('Fees API response:', data.map((f: { fee_id: any; due_date: any; isLate: any; }) => ({ fee_id: f.fee_id, due_date: f.due_date, isLate: f.isLate })));
      setFees(data);
    } catch (error) {
      console.error("Error fetching fees:", error);
      setFees([]);
    }
  };

  const handleDelete = async (fee_id: number) => {
    try {
      setIsFiltering(true);
      const response = await fetch(`http://localhost:8080/orgs/${org_id}/fees/${fee_id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete fee');
      }
      
      await fetchFees();
    } catch (error) {
      console.error("Error deleting fee:", error);
    } finally {
      setIsFiltering(false);
    }
  };

  const openDeleteDialog = (fee_id: number, fee_name: string) => {
    setFeeToDelete({ id: fee_id, name: fee_name });
  };

  const openEditDialog = (fee: Fee) => {
    setFeeToEdit(fee);
  };

  const handleFeeAdded = async () => {
    setIsFiltering(true);
    await fetchFees();
    setIsFiltering(false);
  };

  const handleFeeUpdated = async () => {
    setIsFiltering(true);
    await fetchFees();
    setIsFiltering(false);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchFees();
      setLoading(false);
    };
    loadData();
  }, [org_id, filters]);

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

  const handleSearch = () => {
    setIsFiltering(true);
    handleFilterChange("search", searchInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    handleFilterChange("search", "");
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

  const formatSemAY = (sem: string, year: number) => {
    const semText = sem === '1st' ? '1st Sem' : sem === '2nd' ? '2nd Sem' : sem;
    return `${semText}, ${year}`;
  };

  const filteredFees = fees.filter((fee) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      switch (filters.searchType) {
        case 'fee_name':
          if (!fee.fee_name.toLowerCase().includes(searchLower)) return false;
          break;
        case 'fee_id':
          if (!fee.fee_id.toString().includes(searchLower)) return false;
          break;
        case 'member_name':
          if (!fee.member_name.toLowerCase().includes(searchLower)) return false;
          break;
        case 'sem_ay':

          break;
        default:
          if (
            !fee.fee_name.toLowerCase().includes(searchLower) &&
            !fee.member_name.toLowerCase().includes(searchLower) &&
            !fee.fee_id.toString().includes(searchLower) &&
            !formatSemAY(fee.sem_issued, fee.acad_year_issued).toLowerCase().includes(searchLower)
          ) {
            return false;
          }
      }
    }
    if (filters.isPaid && filters.isPaid !== "All") {
      const isPaidFilter = filters.isPaid === "true";
      if (Boolean(fee.isPaid) !== isPaidFilter) {
        return false;
      }
    }
    if (filters.isLate && filters.isLate !== "All") {
      if (fee.isLate !== filters.isLate) {
        return false;
      }
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-transparent">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-sans text-lg">Loading fee data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent">
      <div className="max-w-9xl mx-auto px-6 py-8 max-w-[1700px]">
        {/* HEADER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8 w-full"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-purple-800 bg-clip-text text-transparent font-sans">
                  Fee Management
                </h1>
                <p className="text-gray-600 font-sans text-lg">Track and manage organization fees</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="flex gap-2">
                <Select
                  value={filters.searchType}
                  onValueChange={(value) => handleFilterChange("searchType", value)}
                >
                  <SelectTrigger className="w-40 border-2 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 bg-white/70 backdrop-blur-sm">
                    <Filter className="w-4 mr-2 text-purple-600" />
                    <SelectValue placeholder="Search Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fields</SelectItem>
                    <SelectItem value="fee_name">Fee Name</SelectItem>
                    <SelectItem value="fee_id">Fee ID</SelectItem>
                    <SelectItem value="member_name">Member Name</SelectItem>
                    <SelectItem value="sem_ay">Sem/AY</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="relative group">
                  <Input
                    className="w-full sm:w-72 border-2 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 pl-12 pr-12 bg-white/70 backdrop-blur-sm transition-all duration-300 placeholder:text-gray-400 font-sans text-base"
                    placeholder={`Search ${filters.searchType === 'all' ? 'fees' : filters.searchType === 'sem_ay' ? 'sem/ay (e.g., 1st Sem, 2024)' : filters.searchType.replace('_', ' ')}...`}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400 group-hover:text-purple-600 transition-colors duration-200" />
                  {searchInput && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-purple-100 rounded-full"
                      onClick={clearSearch}
                    >
                      ×
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  className="bg-yellow-400 hover:bg-yellow-500 text-purple-800 font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  onClick={handleSearch}
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
                <AddFeeDialog org_id={org_id} onFeeAdded={handleFeeAdded} />
              </div>
            </div>
          </div>
        </motion.div>

      {/* MAIN CONTENT SECTION */}
        <div className="flex flex-col xl:flex-row gap-8 items-start w-full">
          <AnimatePresence>
            <div className="w-full max-w-[95vw] xl:max-w-[80vw] rounded-lg border-1 border-purple-200 bg-gradient-to-br from-purple-50 to-white-50 shadow-lg p-2 overflow-x-auto">
            {!isFiltering && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-1 min-w-0"
                style={{ height: 'fit-content' }}
              >
                <div className="overflow-x-auto">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow className="font-bold bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg shadow-lg">
                        <TableHead className="text-center font-bold text-gray-800">Fee ID</TableHead>
                        <TableHead className="text-center font-bold text-gray-800">Fee Name</TableHead>
                        <TableHead className="text-center font-bold text-gray-800">Member Name</TableHead>
                        <TableHead className="text-center font-bold text-gray-800">Amount</TableHead>
                        <TableHead className="text-center font-bold text-gray-800">Due Date</TableHead>
                        <TableHead className="text-center font-bold text-gray-800">Payment Date</TableHead>
                        <TableHead className="text-center font-bold text-gray-800">
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
                        <TableHead className="text-center font-bold text-gray-800">
                          <Select
                            value={filters.isPaid}
                            onValueChange={(value) => handleFilterChange("isPaid", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Is Paid" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="All">All</SelectItem>
                              <SelectItem value="true">Paid</SelectItem>
                              <SelectItem value="false">Unpaid</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableHead>
                        <TableHead className="text-center font-bold text-gray-800">
                          <Select
                            value={filters.isLate}
                            onValueChange={(value) => handleFilterChange("isLate", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Is Late" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="All">All</SelectItem>
                              <SelectItem value="Late">Late</SelectItem>
                              <SelectItem value="On Time">On Time</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableHead>
                        <TableHead className="text-center font-bold text-gray-800">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFees.map((fee, index) => (
                        <motion.tr
                          key={fee.fee_id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="text-center"
                        >
                          <TableCell className="text-gray-900">{fee.fee_id}</TableCell>
                          <TableCell className="text-gray-600">{fee.fee_name}</TableCell>
                          <TableCell className="text-gray-600">{fee.member_name}</TableCell>
                          <TableCell className="text-gray-900">₱{fee.amount.toLocaleString()}</TableCell>
                          <TableCell className="text-gray-600">{formatDate(fee.due_date)}</TableCell>
                          <TableCell className="text-gray-600">{formatDateTime(fee.payment_date)}</TableCell>
                          <TableCell className="text-gray-600">{fee.sem_ay}</TableCell>
                          <TableCell>
                            <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                              fee.isPaid
                                ? 'bg-green-100 text-green-700 border border-green-200' :
                                'bg-red-100 text-red-700 border border-red-200'
                            }`}>
                              {fee.isPaid ? 'Paid' : 'Unpaid'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                                fee.isLate === 'Late'
                                  ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                  : 'bg-gray-100 text-gray-700 border-gray-200'
                              }`}
                            >
                              {fee.isLate}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2 justify-center">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 w-9 p-0 border-2 border-purple-300 text-purple-600 hover:bg-purple-600 hover:text-white hover:border-purple-600 rounded-xl transform-none hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl"
                                onClick={() => openEditDialog(fee)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 w-9 p-0 border-2 border-yellow-300 text-yellow-600 hover:bg-yellow-400 hover:text-purple-800 hover:border-yellow-500 rounded-xl transform-none hover:scale-110 transition-transform duration-200 shadow-lg hover:shadow-xl"
                                onClick={() => openDeleteDialog(fee.fee_id, fee.fee_name)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                      {filteredFees.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                            No fees found matching your criteria
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </motion.div>
            )}
            </div>
          </AnimatePresence>

          <FeeSummary fees={filteredFees} isFiltering={isFiltering} />
        </div>

        <DeleteFeeDialog
          isOpen={!!feeToDelete}
          onClose={() => setFeeToDelete(null)}
          onConfirm={() => feeToDelete && handleDelete(feeToDelete.id)}
          feeId={feeToDelete?.id || null}
          feeName={feeToDelete?.name}
        />

        <EditFeeDialog
          isOpen={!!feeToEdit}
          onClose={() => setFeeToEdit(null)}
          fee={feeToEdit}
          org_id={org_id}
          onFeeUpdated={handleFeeUpdated}
        />
      </div>
    </div>
  );
};

export default OrgFeeTable;