import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useRealtime } from '../../../store/useRealtime';

interface RegionDonutProps {
  title?: string;
}

export default function RegionDonut({ title = 'Traffic by Region' }: RegionDonutProps) {
  const { regionData } = useRealtime();
  
  const total = regionData.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950">
      <div className="font-semibold mb-4">{title}</div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={regionData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {regionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
              formatter={(value: number, name: string) => [
                `${value.toLocaleString()} (${((value / total) * 100).toFixed(1)}%)`,
                name
              ]}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value: string) => (
                <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Summary stats */}
      <div className="mt-4 space-y-2">
        {regionData.map((region, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: region.color }}
              ></div>
              <span className="text-gray-700 dark:text-gray-300">{region.name}</span>
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              {region.value.toLocaleString()} ({((region.value / total) * 100).toFixed(1)}%)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
