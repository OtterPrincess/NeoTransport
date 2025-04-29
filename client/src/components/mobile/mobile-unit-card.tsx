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
    <Card className="mb-4 overflow-hidden border-2 border-gray-100">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-semibold">{unit.unitId}</h3>
              <p className="text-gray-600">{unit.location || 'Unknown Location'}</p>
            </div>
            {hasAlert && (
              <Badge variant="destructive" className="rounded-md px-3 py-1">
                Alert
              </Badge>
            )}
          </div>
          
          <div className="flex items-center mb-4">
            <h2 className="text-4xl font-bold">
              {shakeIndex}<span className="text-xl font-normal">g</span>
            </h2>
            {generateWaveform()}
          </div>
          
          <div className="grid grid-cols-2 gap-y-2">
            <div className="text-gray-700">Surface Temp</div>
            <div className="text-right font-medium">
              {telemetry?.surfaceTemp ? `${telemetry.surfaceTemp.toFixed(1)} °C` : 'N/A'}
            </div>
            
            <div className="text-gray-700">Internal Temp</div>
            <div className="text-right font-medium">
              {telemetry?.internalTemp ? `${telemetry.internalTemp.toFixed(1)} °C` : 'N/A'}
            </div>
            
            <div className="text-gray-700">Battery</div>
            <div className="text-right font-medium">
              {telemetry?.batteryLevel ? `${telemetry.batteryLevel} %` : 'N/A'}
            </div>
            
            <div className="text-gray-700">Vibration</div>
            <div className="text-right font-medium">
              {getVibrationStatus()}
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            Updated {telemetry 
              ? formatDistanceToNow(new Date(telemetry.timestamp), { addSuffix: true })
              : 'unknown'
            }
          </div>
          
          <Button 
            className="w-full mt-4 bg-[#6A1B9A] hover:bg-[#8E24AA]"
          >
            View All Units
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileUnitCard;