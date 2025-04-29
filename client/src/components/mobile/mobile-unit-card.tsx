import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns';
import type { UnitWithTelemetry } from "@shared/schema";

interface MobileUnitCardProps {
  unit: UnitWithTelemetry;
}

const MobileUnitCard: React.FC<MobileUnitCardProps> = ({ unit }) => {
  const telemetry = unit.telemetry;
  const hasAlert = unit.alerts && unit.alerts.length > 0 && unit.alerts.some(a => a.status === 'active');
  
  // Calculate shake index based on vibration
  const shakeIndex = telemetry?.vibration != null
    ? (telemetry.vibration > 10 ? 3.5 : telemetry.vibration / 3).toFixed(1)
    : '0.0';
  
  // Determine vibration status text
  const getVibrationStatus = () => {
    if (!telemetry || telemetry.vibration == null) return 'Unknown';
    
    const vibration = telemetry.vibration;
    if (vibration < 3) return 'Stable';
    if (vibration < 6) return 'Moderate';
    return 'High';
  };

  // Generate a simple vibration waveform SVG based on telemetry
  const generateWaveform = () => {
    if (!telemetry || telemetry.vibration == null) return null;

    // Generate wave points based on vibration value
    const vibration = telemetry.vibration;
    const amplitude = Math.min(vibration / 3, 10);
    const frequency = Math.max(1, Math.min(4, vibration / 2));
    
    // Generate SVG path points
    const points = [];
    const segments = 20;
    const step = 60 / segments;
    
    for (let i = 0; i <= segments; i++) {
      const x = i * step;
      const y = amplitude * Math.sin(i * frequency * 0.5) + 10;  // Center on 10
      points.push(`${x},${y}`);
    }
    
    return (
      <svg width="60" height="20" viewBox="0 0 60 20" className="ml-2">
        <path
          d={`M0,10 ${points.join(' L ')}`}
          fill="none"
          stroke="#8338EC"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  return (
    <div className="border-b border-gray-200 py-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl">NICU-{unit.unitId.replace(/Unit\s*#/i, '')} {unit.location || 'Room 101'}</h2>
        {hasAlert && (
          <span className="bg-red-500 text-white rounded-md px-4 py-1 text-base">
            Alert
          </span>
        )}
      </div>
      
      <div className="mt-8 flex items-center">
        <div className="flex flex-col">
          <div className="text-7xl font-bold tracking-tight">
            {shakeIndex}<span className="text-4xl ml-1">g</span>
          </div>
          <div className="flex items-center mt-1">
            <div className="text-xl mr-6">Vibration</div>
            <div className="text-xl">{getVibrationStatus()}</div>
            {generateWaveform()}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-y-6 mt-8">
        <div className="text-xl">Surface Temp</div>
        <div className="text-right text-xl font-medium">
          {telemetry?.surfaceTemp ? `${telemetry.surfaceTemp.toFixed(1)} °` : 'N/A'}
        </div>
        
        <div className="text-xl">Internal Temp</div>
        <div className="text-right text-xl font-medium">
          {telemetry?.internalTemp ? `${telemetry.internalTemp.toFixed(1)} °` : 'N/A'}
        </div>
        
        <div className="text-xl">Battery</div>
        <div className="text-right text-xl font-medium">
          {telemetry?.batteryLevel ? `${telemetry.batteryLevel} %` : 'N/A'}
        </div>
      </div>
      
      <div className="mt-8">
        <Button 
          variant="outline"
          className="w-full py-5 text-lg font-medium border-gray-300 hover:bg-gray-50 rounded-md"
        >
          View Details
        </Button>
      </div>
      
      <div className="mt-4 text-base text-gray-500">
        v2.1.0 • Last updated {telemetry 
          ? formatDistanceToNow(new Date(telemetry.timestamp), { addSuffix: false })
          : 'unknown'
        } ago
      </div>
    </div>
  );
};

export default MobileUnitCard;