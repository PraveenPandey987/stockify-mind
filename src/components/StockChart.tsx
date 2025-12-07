
import React, { useState, useEffect } from 'react';
import { 
  Area, 
  AreaChart,
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  CartesianGrid
} from 'recharts';
import { cn } from '@/lib/utils';

export interface ChartData {
  date: string;
  value: number;
  volume?: number;
}

interface StockChartProps {
  data: ChartData[];
  duration?: '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';
  isUp?: boolean;
  showControls?: boolean;
  showVolume?: boolean;
  height?: number;
  className?: string;
  isLoading?: boolean;
}

const StockChart: React.FC<StockChartProps> = ({ 
  data,
  duration = '1M',
  isUp = true,
  showControls = true,
  showVolume = false,
  height = 300,
  className,
  isLoading = false
}) => {
  const [selectedDuration, setSelectedDuration] = useState(duration);
  const [displayData, setDisplayData] = useState<ChartData[]>([]);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  const durations = ['1D', '1W', '1M', '3M', '1Y', 'ALL'] as const;
  
  useEffect(() => {
    setSelectedDuration(duration);
  }, [duration]);
  
  useEffect(() => {
    if (isLoading) {
      setDisplayData([]);
      setAnimationComplete(false);
      return;
    }
    
    // Filter data based on selected duration
    let filteredData = [...data];
    if (selectedDuration !== 'ALL') {
      const daysMap = {
        '1D': 1,
        '1W': 7,
        '1M': 30,
        '3M': 90,
        '1Y': 365
      };
      
      const days = daysMap[selectedDuration];
      
      if (days) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        filteredData = data.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= cutoffDate;
        });
      }
    }
    
    // Animate data display
    const animate = () => {
      const totalPoints = filteredData.length;
      const increment = Math.max(Math.ceil(totalPoints / 20), 1);
      let currentIndex = 0;
      
      const interval = setInterval(() => {
        currentIndex += increment;
        
        if (currentIndex >= totalPoints) {
          currentIndex = totalPoints;
          clearInterval(interval);
          setAnimationComplete(true);
        }
        
        setDisplayData(filteredData.slice(0, currentIndex));
      }, 50);
      
      return () => clearInterval(interval);
    };
    
    if (filteredData.length > 0) {
      setAnimationComplete(false);
      const cleanup = animate();
      return cleanup;
    } else {
      setDisplayData([]);
      setAnimationComplete(true);
    }
  }, [data, selectedDuration, isLoading]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };
  
  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    
    if (selectedDuration === '1D') {
      return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    } else if (selectedDuration === '1W' || selectedDuration === '1M') {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
    }
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="font-medium">{new Date(label).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}</p>
          <p className="text-primary">{formatCurrency(payload[0].value)}</p>
          {showVolume && payload[1] && (
            <p className="text-muted-foreground">
              Volume: {new Intl.NumberFormat().format(payload[1].value)}
            </p>
          )}
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className={cn("w-full", className)}>
      {showControls && (
        <div className="flex justify-end space-x-1 mb-4">
          {durations.map((d) => (
            <button
              key={d}
              className={cn(
                "px-2 py-1 text-xs rounded-md transition-colors",
                selectedDuration === d
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent"
              )}
              onClick={() => setSelectedDuration(d)}
            >
              {d}
            </button>
          ))}
        </div>
      )}
      
      <div className={cn(
        "w-full transition-opacity duration-300",
        (!animationComplete || isLoading) && "opacity-70",
        isLoading && "shimmer"
      )}>
        {displayData.length > 0 ? (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart
              data={displayData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDown" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--muted))" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="hsl(var(--muted))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDateLabel} 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                minTickGap={20}
                stroke="hsl(var(--chart-text))"
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)} 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
                width={60}
                stroke="hsl(var(--chart-text))"
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--chart-grid))" />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={isUp ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                strokeWidth={2}
                fill={isUp ? "url(#colorUp)" : "url(#colorDown)"}
                animationDuration={1000}
              />
              {showVolume && (
                <Area 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="hsl(var(--muted))"
                  strokeWidth={1}
                  fill="url(#colorVolume)"
                  yAxisId={1}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div 
            className="flex items-center justify-center" 
            style={{ height: `${height}px` }}
          >
            <p className="text-muted-foreground">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockChart;
