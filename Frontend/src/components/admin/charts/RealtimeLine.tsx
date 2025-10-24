import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useRealtime } from '../../../store/useRealtime';

interface RealtimeLineProps {
  title?: string;
  subtitle?: string;
  dataKey?: 'activeUsersChart' | 'revenueChart';
  color?: string;
}

export default function RealtimeLine({ 
  title = 'Active Users (Real-time)', 
  subtitle = 'last 15m',
  dataKey = 'activeUsersChart',
  color = '#6366F1'
}: RealtimeLineProps) {
  const { activeUsersChart, revenueChart, isLiveMode } = useRealtime();
  
  const data = dataKey === 'activeUsersChart' ? activeUsersChart : revenueChart;
  
  // Format data for Recharts
  const chartData = data.map(point => ({
    time: new Date(point.timestamp).toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    value: point.value,
    fullTime: point.label || new Date(point.timestamp).toLocaleString('vi-VN')
  }));

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-semibold flex items-center gap-2">
            {title}
            {isLiveMode && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 dark:text-green-400">LIVE</span>
              </div>
            )}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">{subtitle}</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">
            {data.length > 0 ? data[data.length - 1].value.toLocaleString() : '0'}
          </div>
          <div className="text-xs text-gray-500">
            {dataKey === 'revenueChart' ? 'VND' : 'users'}
          </div>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
              labelStyle={{ color: '#F9FAFB' }}
              formatter={(value: number, name: string) => [
                `${value.toLocaleString()} ${dataKey === 'revenueChart' ? 'VND' : 'users'}`,
                name
              ]}
              labelFormatter={(label: string, payload: any) => {
                if (payload && payload[0]) {
                  return payload[0].payload.fullTime;
                }
                return label;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
