import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { UnitWithTelemetry } from "@shared/schema";

interface MedicalUnitCardProps {
  unit: UnitWithTelemetry;
  onViewDetails?: (unitId: number) => void;
}

const MedicalUnitCard: React.FC<MedicalUnitCardProps> = ({ unit, onViewDetails }) => {
  const telemetry = unit.telemetry && unit.telemetry.length > 0 ? unit.telemetry[0] : null;
  const internalTemp = telemetry?.internalTemp;
  const vibration = telemetry?.vibration;
  const batteryLevel = telemetry?.batteryLevel;
  const isCharging = telemetry?.batteryCharging;
  const isOffline = unit.status === 'offline';

  const getTemperatureStatus = () => {
    if (isOffline || !internalTemp) return 'unknown';
    if (internalTemp < 36.0) return 'low';
    if (internalTemp > 37.5) return 'high';
    return 'normal';
  };

  const getVibrationLevel = () => {
    if (isOffline || vibration === undefined) return 'unknown';
    if (vibration < 0.5) return 'minimal';
    if (vibration < 1.0) return 'moderate';
    return 'high';
  };

  const getBatteryStatus = () => {
    if (isOffline || !batteryLevel) return 'unknown';
    if (batteryLevel > 50) return 'good';
    if (batteryLevel > 20) return 'low';
    return 'critical';
  };

  const formatLastUpdated = () => {
    if (!telemetry?.timestamp) return 'No data';
    const now = new Date();
    const timestamp = new Date(telemetry.timestamp);
    const diffMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours}h ago`;
  };

  return (
    <Card className="bg-white border border-slate-300 hover:shadow-lg transition-all duration-200 rounded-lg overflow-hidden">
      {/* Medical Header Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white rounded-full p-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.901-6.06 2.37M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg">{unit.unitId}</h3>
              <p className="text-blue-100 text-xs font-medium">NEONATAL TRANSPORT</p>
            </div>
          </div>
          
          <div className="text-right">
            <Badge 
              className={cn(
                "text-xs font-bold",
                unit.status === 'normal' && "bg-green-500 text-white",
                unit.status === 'warning' && "bg-amber-500 text-white",
                unit.status === 'alert' && "bg-red-500 text-white",
                unit.status === 'offline' && "bg-slate-500 text-white"
              )}
            >
              {unit.status === 'normal' ? '● NORMAL' : 
               unit.status === 'warning' ? '⚠ WARNING' :
               unit.status === 'alert' ? '🚨 ALERT' :
               '○ OFFLINE'}
            </Badge>
            <p className="text-blue-100 text-xs mt-1">ID: {unit.serialNumber}</p>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Patient Information Panel */}
        <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">LOCATION & STATUS</h4>
            <span className="text-xs text-slate-500 font-mono">{formatLastUpdated()}</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-600 font-medium mb-1">ROOM</p>
              <p className="text-sm font-bold text-slate-900">{unit.room}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 font-medium mb-1">LOCATION</p>
              <p className="text-sm font-bold text-slate-900">{unit.location}</p>
            </div>
          </div>
        </div>

        {/* Vital Signs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Temperature Monitor */}
          <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-xs font-bold text-slate-700 uppercase">TEMP</span>
              </div>
              <div className={cn(
                "w-3 h-3 rounded-full",
                getTemperatureStatus() === 'normal' && "bg-green-500",
                getTemperatureStatus() === 'high' && "bg-red-500",
                getTemperatureStatus() === 'low' && "bg-blue-500",
                getTemperatureStatus() === 'unknown' && "bg-slate-400"
              )}></div>
            </div>
            {isOffline || internalTemp === undefined ? (
              <p className="text-lg font-bold text-slate-400">--°C</p>
            ) : (
              <div>
                <p className={cn(
                  "text-2xl font-bold",
                  getTemperatureStatus() === 'normal' && "text-green-600",
                  getTemperatureStatus() === 'high' && "text-red-600",
                  getTemperatureStatus() === 'low' && "text-blue-600"
                )}>{internalTemp.toFixed(1)}°C</p>
                <p className="text-xs text-slate-500 mt-1">
                  Range: 36.0-37.5°C
                </p>
              </div>
            )}
          </div>

          {/* Vibration Monitor */}
          <div className="bg-white border-2 border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-xs font-bold text-slate-700 uppercase">VIBRATION</span>
              </div>
              <div className={cn(
                "w-3 h-3 rounded-full",
                getVibrationLevel() === 'minimal' && "bg-green-500",
                getVibrationLevel() === 'moderate' && "bg-amber-500",
                getVibrationLevel() === 'high' && "bg-red-500",
                getVibrationLevel() === 'unknown' && "bg-slate-400"
              )}></div>
            </div>
            {isOffline || vibration === undefined ? (
              <p className="text-lg font-bold text-slate-400">--g</p>
            ) : (
              <div>
                <p className={cn(
                  "text-2xl font-bold",
                  getVibrationLevel() === 'minimal' && "text-green-600",
                  getVibrationLevel() === 'moderate' && "text-amber-600",
                  getVibrationLevel() === 'high' && "text-red-600"
                )}>{vibration.toFixed(2)}g</p>
                <p className="text-xs text-slate-500 mt-1">
                  {getVibrationLevel() === 'minimal' ? 'Stable' :
                   getVibrationLevel() === 'moderate' ? 'Moderate' : 'High'}
                </p>
              </div>
            )}
          </div>

          {/* Power Monitor */}
          <div className="bg-white border-2 border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-xs font-bold text-slate-700 uppercase">POWER</span>
              </div>
              {isCharging && <span className="text-xs text-green-600 font-bold">CHG</span>}
            </div>
            {isOffline || batteryLevel === undefined ? (
              <p className="text-lg font-bold text-slate-400">--%</p>
            ) : (
              <div>
                <p className={cn(
                  "text-2xl font-bold",
                  getBatteryStatus() === 'good' && "text-green-600",
                  getBatteryStatus() === 'low' && "text-amber-600",
                  getBatteryStatus() === 'critical' && "text-red-600"
                )}>{batteryLevel}%</p>
                <Progress 
                  value={batteryLevel} 
                  className="mt-2 h-2"
                />
              </div>
            )}
          </div>
        </div>

        {/* Action Panel */}
        <div className="border-t border-slate-200 pt-4">
          <div className="flex gap-3">
            <Button 
              variant="default" 
              size="sm" 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              onClick={() => onViewDetails?.(unit.id)}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.901-6.06 2.37M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              </svg>
              <span className="hidden sm:inline">View Patient Details</span>
              <span className="sm:hidden">Details</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              <span className="hidden sm:inline">Share</span>
              <span className="sm:hidden">Share</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalUnitCard;