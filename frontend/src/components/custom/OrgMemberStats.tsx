import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface OrgMemberStatsParams {
  org_id: number; 
};

const OrgMemberStats = ({ org_id }: OrgMemberStatsParams) => {
  const [n, setN] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    if (!n || isNaN(Number(n)) || parseInt(n) <= 0) {
      toast.error('Please enter a valid positive number');
      return;
    }

    setLoading(true);
    try { 
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orgs/${org_id}/members/stats?n=${n}`);
      const data = await response.json();
      
      if (response.ok) {
        setStats(data);
      } else {
        toast.error(data.error || 'Error fetching stats');
      }
    } catch (error) {
      toast.error('Error fetching stats');
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for pie chart
  const chartData = stats ? [
    {
      name: 'Active Members',
      value: (stats as any).active_percentage,
      color: '#8b5cf6'
    },
    {
      name: 'Inactive Members', 
      value: (stats as any).inactive_percentage,
      color: '#fbbf24'
    }
  ] : [];

  const COLORS = ['#8b5cf6', '#fbbf24'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-purple-200 rounded-lg shadow-xl backdrop-blur-sm">
          <p className='font-semibold text-purple-900'>{payload[0].name}</p>
          <p className='text-purple-700'>{`${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="max-w-[350px] min-w-[250px] bg-gradient-to-br from-purple-50 to-yellow-50 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <CardHeader>
        <CardTitle>Active vs Inactive Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
        <Input
            className="max-w-[200px] border-purple-200 focus:border-purple-400 focus:ring-purple-200 transition-colors"
            type="number"
            value={n}
            onChange={(e) => setN(e.target.value)}
            placeholder="Enter number of semesters..."
            min="1"
          />
          <Button
            onClick={fetchStats}
            disabled={loading}
            className='bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white transition-all duration-300 hover:scale-105 shadow-md"'
          >
            {loading ? 'Loading...' : 'Get Stats'}
          </Button>
        </div>

        {stats && (
          <div className="space-y-4">
            {((stats as any).active_percentage > 0 || (stats as any).inactive_percentage > 0) ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value, entry) => `${value}: ${entry.payload?.value ?? 0}%`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No data to display - both active and inactive percentages are 0%</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrgMemberStats;