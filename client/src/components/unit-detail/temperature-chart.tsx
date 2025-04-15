import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";
import { generateMockHistoricalData } from "@/lib/mockData";

interface TemperatureChartProps {
  currentValue: number | null | undefined;
  minThreshold: number;
  maxThreshold: number;
  type: "internal" | "surface";
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({
  currentValue,
  minThreshold,
  maxThreshold,
  type
}) => {
  const [data, setData] = useState<Array<{ time: string; value: number }>>();
  
  useEffect(() => {
    if (currentValue !== undefined && currentValue !== null) {
      // Generate mock historical data based on the current value
      setData(generateMockHistoricalData(currentValue, 4, 0.1, 0.5));
    }
  }, [currentValue]);
  
  if (!data || !currentValue) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[#BDBDBD] text-sm">No data available</p>
      </div>
    );
  }
  
  const formatTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Calculate y-axis domain with padding
  const minValue = Math.min(minThreshold - 0.5, Math.min(...data.map(item => item.value)));
  const maxValue = Math.max(maxThreshold + 0.5, Math.max(...data.map(item => item.value)));
  
  const lineColor = type === "internal" ? "#6A1B9A" : "#9C27B0";
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
        <XAxis 
          dataKey="time" 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: '#616161' }}
          tickFormatter={formatTime}
          interval={data.length / 6}
        />
        <YAxis 
          domain={[minValue, maxValue]} 
          tick={{ fontSize: 10, fill: '#616161' }}
          tickCount={5}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip 
          formatter={(value: number) => [`${value.toFixed(1)}°C`, 'Temperature']}
          labelFormatter={(label) => formatTime(label as string)}
          contentStyle={{ fontSize: '12px' }}
        />
        <ReferenceLine y={maxThreshold} stroke="#FFA000" strokeDasharray="3 3" />
        <ReferenceLine y={minThreshold} stroke="#FFA000" strokeDasharray="3 3" />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={lineColor}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: lineColor }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TemperatureChart;
