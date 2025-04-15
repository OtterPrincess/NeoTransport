import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";
import { generateMockVibrationData } from "@/lib/mockData";
import { VIBRATION_THRESHOLDS } from "@/lib/constants";

interface VibrationChartProps {
  currentValue: number | null | undefined;
}

const VibrationChart: React.FC<VibrationChartProps> = ({ currentValue }) => {
  const [data, setData] = useState<Array<{ time: string; value: number }>>();
  
  useEffect(() => {
    // Generate mock vibration data
    setData(generateMockVibrationData(4));
  }, []);
  
  if (!data) {
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
  const maxValue = Math.max(1.0, Math.max(...data.map(item => item.value)));
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
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
          domain={[0, maxValue]} 
          tick={{ fontSize: 10, fill: '#616161' }}
          tickCount={5}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip 
          formatter={(value: number) => [`${value.toFixed(2)}g`, 'Vibration']}
          labelFormatter={(label) => formatTime(label as string)}
          contentStyle={{ fontSize: '12px' }}
        />
        <ReferenceLine 
          y={VIBRATION_THRESHOLDS.warning} 
          stroke="#FFA000" 
          strokeDasharray="3 3" 
        />
        <ReferenceLine 
          y={VIBRATION_THRESHOLDS.alert} 
          stroke="#E53935" 
          strokeDasharray="3 3" 
        />
        <defs>
          <linearGradient id="vibrationGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#9C27B0" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#9C27B0" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke="#9C27B0"
          fill="url(#vibrationGradient)"
          strokeWidth={2}
          activeDot={{ r: 4, fill: "#9C27B0" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default VibrationChart;
