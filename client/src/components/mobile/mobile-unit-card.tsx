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
    <Card className="mb-4 overflow-hidden border-b border-gray-200 shadow-sm">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">NICU-{unit.unitId.replace(/Unit\s*#/i, '')}</h3>
          {hasAlert && (
            <Badge variant="destructive" className="rounded-md font-medium">
              Alert
            </Badge>
          )}
        </div>
        
        <div className="flex items-center mb-6">
          <h2 className="text-5xl font-bold">
            {shakeIndex}<span className="text-2xl font-normal ml-1">g</span>
          </h2>
          <div className="ml-4 flex flex-col">
            <div className="flex items-center">
              {generateWaveform()}
            </div>
            <span className="text-lg mt-1 font-medium">
              {getVibrationStatus()}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-y-4 mb-6">
          <div className="text-gray-700 text-lg">Surface Temp</div>
          <div className="text-right font-medium text-lg">
            {telemetry?.surfaceTemp ? `${telemetry.surfaceTemp.toFixed(1)} °C` : 'N/A'}
          </div>
          
          <div className="text-gray-700 text-lg">Internal Temp</div>
          <div className="text-right font-medium text-lg">
            {telemetry?.internalTemp ? `${telemetry.internalTemp.toFixed(1)} °C` : 'N/A'}
          </div>
          
          <div className="text-gray-700 text-lg">Battery</div>
          <div className="text-right font-medium text-lg">
            {telemetry?.batteryLevel ? `${telemetry.batteryLevel} %` : 'N/A'}
          </div>
        </div>
        
        <Button 
          variant="outline"
          className="w-full py-6 text-lg font-medium border-gray-300 hover:bg-gray-50"
        >
          View Details
        </Button>
        
        <div className="mt-4 text-sm text-gray-500 text-center">
          v2.1.0 • Last updated {telemetry 
            ? formatDistanceToNow(new Date(telemetry.timestamp), { addSuffix: false })
            : 'unknown'
          } ago
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileUnitCard;