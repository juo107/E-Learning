import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface KpiData {
  totalUsers: number;
  activeUsers24h: number;
  totalCourses: number;
  publishedCourses: number;
  pendingCourses: number;
  totalEnrollments: number;
  averageRating: number;
  reviewsCount: number;
  generatedAtUtc: string;
}

export interface ChartPoint {
  timestamp: number;
  value: number;
  label?: string;
}

export interface EventData {
  id: string;
  type: 'USER_LOGIN' | 'ORDER_CREATED' | 'COURSE_ENROLLED' | 'ERROR_RAISED' | 'REVIEW_ADDED';
  message: string;
  timestamp: number;
  metadata?: any;
}

export interface RegionData {
  name: string;
  value: number;
  color: string;
}

interface RealtimeState {
  // Data
  kpiData: KpiData | null;
  activeUsersChart: ChartPoint[];
  revenueChart: ChartPoint[];
  regionData: RegionData[];
  recentEvents: EventData[];
  
  // State
  isLoading: boolean;
  error: string | null;
  isLiveMode: boolean;
  lastUpdate: number;
  
  // Actions
  fetchKpiData: () => Promise<void>;
  startRealtimeUpdates: () => void;
  stopRealtimeUpdates: () => void;
  toggleLiveMode: () => void;
  clearError: () => void;
}

// Mock data generators
const generateMockKpiData = (): KpiData => ({
  totalUsers: Math.floor(Math.random() * 1000) + 500,
  activeUsers24h: Math.floor(Math.random() * 200) + 50,
  totalCourses: Math.floor(Math.random() * 100) + 20,
  publishedCourses: Math.floor(Math.random() * 80) + 15,
  pendingCourses: Math.floor(Math.random() * 20) + 5,
  totalEnrollments: Math.floor(Math.random() * 2000) + 500,
  averageRating: Math.round((Math.random() * 2 + 3) * 100) / 100,
  reviewsCount: Math.floor(Math.random() * 500) + 100,
  generatedAtUtc: new Date().toISOString()
});

const generateMockChartPoint = (minutesAgo: number): ChartPoint => ({
  timestamp: Date.now() - (minutesAgo * 60 * 1000),
  value: Math.floor(Math.random() * 100) + 20,
  label: new Date(Date.now() - (minutesAgo * 60 * 1000)).toLocaleTimeString()
});

const generateMockEvent = (): EventData => {
  const types: EventData['type'][] = ['USER_LOGIN', 'ORDER_CREATED', 'COURSE_ENROLLED', 'ERROR_RAISED', 'REVIEW_ADDED'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  const messages = {
    USER_LOGIN: 'User logged in',
    ORDER_CREATED: 'New course purchase',
    COURSE_ENROLLED: 'Student enrolled in course',
    ERROR_RAISED: 'System error occurred',
    REVIEW_ADDED: 'New review added'
  };
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    type,
    message: messages[type],
    timestamp: Date.now() - Math.random() * 300000, // Last 5 minutes
    metadata: { amount: Math.floor(Math.random() * 1000) + 100 }
  };
};

const generateMockRegionData = (): RegionData[] => [
  { name: 'APAC', value: Math.floor(Math.random() * 40) + 30, color: '#6366F1' },
  { name: 'EMEA', value: Math.floor(Math.random() * 30) + 20, color: '#F59E0B' },
  { name: 'AMER', value: Math.floor(Math.random() * 25) + 15, color: '#10B981' }
];

// Store
export const useRealtime = create<RealtimeState>()(
  persist(
    (set, get) => ({
      // Initial state
      kpiData: null,
      activeUsersChart: [],
      revenueChart: [],
      regionData: generateMockRegionData(),
      recentEvents: [],
      isLoading: false,
      error: null,
      isLiveMode: false,
      lastUpdate: 0,
      
      // Actions
      fetchKpiData: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Try to fetch from real API first
          const token = localStorage.getItem('token');
          if (token) {
            const response = await fetch('/api/admin/metrics/summary', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              set({ 
                kpiData: data, 
                isLoading: false,
                lastUpdate: Date.now()
              });
              return;
            }
          }
          
          // Fallback to mock data
          const mockData = generateMockKpiData();
          set({ 
            kpiData: mockData, 
            isLoading: false,
            lastUpdate: Date.now()
          });
          
        } catch (error) {
          console.error('Failed to fetch KPI data:', error);
          // Use mock data as fallback
          const mockData = generateMockKpiData();
          set({ 
            kpiData: mockData, 
            isLoading: false,
            error: 'Using mock data - API unavailable',
            lastUpdate: Date.now()
          });
        }
      },
      
      startRealtimeUpdates: () => {
        const { isLiveMode } = get();
        if (isLiveMode) return;
        
        set({ isLiveMode: true });
        
        // Update charts every 3 seconds
        const chartInterval = setInterval(() => {
          const { isLiveMode: currentLiveMode } = get();
          if (!currentLiveMode) {
            clearInterval(chartInterval);
            return;
          }
          
          set(state => ({
            activeUsersChart: [
              ...state.activeUsersChart.slice(-29), // Keep last 30 points
              generateMockChartPoint(0)
            ],
            revenueChart: [
              ...state.revenueChart.slice(-29),
              generateMockChartPoint(0)
            ],
            lastUpdate: Date.now()
          }));
        }, 3000);
        
        // Add new events every 5-10 seconds
        const eventInterval = setInterval(() => {
          const { isLiveMode: currentLiveMode } = get();
          if (!currentLiveMode) {
            clearInterval(eventInterval);
            return;
          }
          
          set(state => ({
            recentEvents: [
              generateMockEvent(),
              ...state.recentEvents.slice(0, 19) // Keep last 20 events
            ]
          }));
        }, Math.random() * 5000 + 5000);
        
        // Update region data every 30 seconds
        const regionInterval = setInterval(() => {
          const { isLiveMode: currentLiveMode } = get();
          if (!currentLiveMode) {
            clearInterval(regionInterval);
            return;
          }
          
          set({ regionData: generateMockRegionData() });
        }, 30000);
        
        // Store intervals for cleanup
        (get() as any).intervals = { chartInterval, eventInterval, regionInterval };
      },
      
      stopRealtimeUpdates: () => {
        const state = get() as any;
        if (state.intervals) {
          clearInterval(state.intervals.chartInterval);
          clearInterval(state.intervals.eventInterval);
          clearInterval(state.intervals.regionInterval);
        }
        set({ isLiveMode: false });
      },
      
      toggleLiveMode: () => {
        const { isLiveMode } = get();
        if (isLiveMode) {
          get().stopRealtimeUpdates();
        } else {
          get().startRealtimeUpdates();
        }
      },
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'realtime-store',
      partialize: (state) => ({ 
        isLiveMode: state.isLiveMode 
      })
    }
  )
);

// Initialize with some mock data
const store = useRealtime.getState();
if (store.activeUsersChart.length === 0) {
  // Generate initial chart data (last 30 minutes)
  const initialChartData = Array.from({ length: 30 }, (_, i) => 
    generateMockChartPoint(30 - i)
  );
  
  useRealtime.setState({
    activeUsersChart: initialChartData,
    revenueChart: initialChartData.map(point => ({
      ...point,
      value: Math.floor(point.value * 50) + 1000 // Revenue scale
    })),
    recentEvents: Array.from({ length: 10 }, () => generateMockEvent())
  });
}
