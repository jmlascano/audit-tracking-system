import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';

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
}

interface FeeSummaryProps {
  fees: Fee[];
  isFiltering: boolean;
}

const FeeSummary: React.FC<FeeSummaryProps> = ({ fees, isFiltering }) => {
  // Aggregate unpaid debt per member
  const unpaidDebtByMember = fees
    .filter(fee => !fee.isPaid)
    .reduce((acc, fee) => {
      const amount = typeof fee.amount === 'number' ? fee.amount : Number(fee.amount) || 0;
      acc[fee.member_name] = (acc[fee.member_name] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);

  // Find member with highest total unpaid debt
  const highestDebt = Object.entries(unpaidDebtByMember).reduce(
    (max, [member_name, amount]) => {
      if (amount > max.amount) {
        return { member_name, amount };
      }
      return max;
    },
    { member_name: 'None', amount: 0 }
  );

  const filteredStats = {
    totalAmount: fees
      .filter(fee => fee.isPaid)
      .reduce((sum, fee) => sum + (typeof fee.amount === 'number' ? fee.amount : Number(fee.amount) || 0), 0),
    totalUnpaidAmount: fees
      .filter(fee => !fee.isPaid)
      .reduce((sum, fee) => sum + (typeof fee.amount === 'number' ? fee.amount : Number(fee.amount) || 0), 0),
    paidCount: fees.filter(fee => fee.isPaid).length,
    unpaidCount: fees.filter(fee => !fee.isPaid).length,
    highestDebt,
  };

  const pieData: { name: string; value: number; fill: string }[] = [];
  if (filteredStats.paidCount > 0) {
    pieData.push({
      name: 'Paid',
      value: filteredStats.paidCount,
      fill: '#FBBF24' // yellow-400
    });
  }
  if (filteredStats.unpaidCount > 0) {
    pieData.push({
      name: 'Unpaid',
      value: filteredStats.unpaidCount,
      fill: '#9333EA' // purple-600
    });
  }

  const getRadius = () => {
    const isMobile = window.innerWidth < 768;
    return {
      outerRadius: isMobile ? 80 : 100,
      innerRadius: isMobile ? 30 : 40,
    };
  };

  if (isFiltering) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className=""
    >
      <div className="bg-gradient-to-br p-4 from-purple-50 to-yellow-50 border-1 rounded-2xl border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <h2 className="text-2xl font-bold text-gray-800 font-sans">Fee Summary</h2>
        <div className="space-y-3 mt-4">
          <p className="text-base text-gray-600 font-medium font-sans">
            <span className="font-bold">Member with Highest Debt:</span> {filteredStats.highestDebt.member_name}
            <span className="font-bold text-yellow-700"> (₱{filteredStats.highestDebt.amount.toLocaleString()})</span>
          </p>
          <p className="text-base text-gray-600 font-medium font-sans">
            <span className="font-bold text-purple-600">Paid Fees:</span> {filteredStats.paidCount}
          </p>
          <p className="text-base text-gray-600 font-medium font-sans">
            <span className="font-bold text-yellow-700">Unpaid Fees:</span> {filteredStats.unpaidCount}
          </p>
          <p className="text-base text-gray-600 font-medium font-sans">
            <span className="font-bold text-purple-600">Total Paid Amount: </span>
            ₱{filteredStats.totalAmount.toLocaleString()}
          </p>
          <p className="text-base text-gray-600 font-medium font-sans">
            <span className="font-bold text-yellow-700">Total Unpaid Amount: </span>
            ₱{filteredStats.totalUnpaidAmount.toLocaleString()}
          </p>
        </div>
        <div className="w-full h-[280px] mt-6 flex justify-center">
          {fees.length > 0 && pieData.length > 0 ? (
            <div style={{ maxWidth: 320, width: '100%', height: '100%' }}>
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
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
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
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-xl font-bold text-gray-600 mb-2 font-sans">No fee data available</p>
                <p className="text-gray-500 font-sans text-base">Add fees or adjust filters to see statistics</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FeeSummary;