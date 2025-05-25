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
    if (!n || isNaN(n) || parseInt(n) <= 0) {
      toast.error('Please enter a valid positive number');
      return;
    }

    setLoading(true);
    try { 
      const response = await fetch(`http://localhost:8080/orgs/${org_id}/members/stats?n=${n}`);
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
      color: '#c181e3'
    },
    {
      name: 'Inactive Members', 
      value: (stats as any).inactive_percentage,
      color: '#5836ad'
    }
  ] : [];

  const COLORS = ['#c181e3', '#5836ad'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-lg">
          <p>{payload[0].name}</p>
          <p>{`${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="max-w-[350px]">
      <CardHeader>
        <CardTitle>Active vs Inactive Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
        <Input
          className="max-w-[200px]"
            type="number"
            value={n}
            onChange={(e) => setN(e.target.value)}
            placeholder="Enter number of semesters..."
            min="1"
          />
          <Button
            onClick={fetchStats}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Get Stats'}
          </Button>
        </div>

        {stats && (
          <div className="space-y-4">            
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
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value, entry) => `${value}: ${entry.payload.value}%`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrgMemberStats;