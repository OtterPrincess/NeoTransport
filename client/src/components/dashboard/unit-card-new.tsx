import React from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { cn, getTimeAgo } from "@/lib/utils";
import { VIBRATION_THRESHOLDS } from "@/lib/constants";
import type { UnitWithTelemetry } from "@shared/schema";
import { getUnitIllustration } from "@/components/unit-detail/unit-illustrations";

interface UnitCardProps {
  unit: UnitWithTelemetry;
}

export const UnitCard: React.FC<UnitCardProps> = ({ unit }) => {
  const isOffline = unit.status === "offline";
  
  // Get telemetry data if available
  const internalTemp = unit.telemetry?.internalTemp;
  const vibration = unit.telemetry?.vibration;
  const batteryLevel = unit.telemetry?.batteryLevel;
  const isCharging = unit.telemetry?.batteryCharging;
  
  const getVibrationStatusText = (): string => {
    if (isOffline || vibration === undefined || vibration === null) return "No Data";
    if (vibration < VIBRATION_THRESHOLDS.normal) return "Stable";
    if (vibration < VIBRATION_THRESHOLDS.warning) return "Moderate";
    if (vibration < VIBRATION_THRESHOLDS.alert) return "Warning";
    return "High";
  };
  
  const getBatteryText = (): string => {
    if (isOffline) return "No Data";
    if (isCharging) return "Charging";
    if (batteryLevel !== undefined && batteryLevel !== null) {
      return `${batteryLevel}%`;
    }
    return "Unknown";
  };
  
  // For display purposes
  const lastUpdatedText = unit.telemetry?.timestamp 
    ? getTimeAgo(unit.telemetry.timestamp)
    : isOffline ? "2 hours ago" : "Unknown";
  
  return (
    <Link href={`/unit/${unit.id}`}>
      <Card className={cn(
        "bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer relative group overflow-hidden",
        unit.status === 'alert' && "ring-2 ring-red-200",
        unit.status === 'warning' && "ring-2 ring-amber-200"
      )}>
        {/* Status indicator */}
        <div className={cn(
          "absolute top-4 right-4 w-3 h-3 rounded-full",
          unit.status === 'normal' && "bg-green-500",
          unit.status === 'warning' && "bg-amber-500",
          unit.status === 'alert' && "bg-red-500",
          unit.status === 'offline' && "bg-slate-400"
        )}>
          <div className={cn(
            "absolute inset-0 rounded-full animate-pulse",
            unit.status === 'normal' && "bg-green-500",
            unit.status === 'warning' && "bg-amber-500",
            unit.status === 'alert' && "bg-red-500",
            unit.status === 'offline' && "bg-slate-400"
          )}></div>
        </div>
        
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">{unit.unitId}</h3>
            <div className="flex items-center text-sm text-slate-600">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {unit.room} • {unit.location}
            </div>
          </div>
          
          {/* Unit illustration */}
          <div className="w-16 h-16 flex-shrink-0">
            {getUnitIllustration(unit.unitId, unit.status)}
          </div>
        </div>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Temperature */}
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-xs font-medium text-slate-600">Temperature</p>
            </div>
            {isOffline || internalTemp === undefined ? (
              <p className="text-sm font-semibold text-slate-400">No Data</p>
            ) : (
              <p className={cn(
                "text-lg font-bold",
                internalTemp > 37.5 ? "text-red-600" : "text-slate-900"
              )}>{internalTemp.toFixed(1)}°C</p>
            )}
          </div>
          
          {/* Vibration */}
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p className="text-xs font-medium text-slate-600">Vibration</p>
            </div>
            {isOffline || vibration === undefined ? (
              <p className="text-sm font-semibold text-slate-400">No Data</p>
            ) : (
              <p className={cn(
                "text-lg font-bold",
                vibration < VIBRATION_THRESHOLDS.normal ? "text-green-600" :
                vibration < VIBRATION_THRESHOLDS.warning ? "text-amber-600" :
                "text-red-600"
              )}>{getVibrationStatusText()}</p>
            )}
          </div>
          
          {/* Battery */}
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a8.97 8.97 0 008.354-5.646z" />
              </svg>
              <p className="text-xs font-medium text-slate-600">Battery</p>
            </div>
            {isOffline ? (
              <p className="text-sm font-semibold text-slate-400">No Data</p>
            ) : (
              <p className={cn(
                "text-lg font-bold",
                isCharging ? "text-blue-600" :
                batteryLevel && batteryLevel > 20 ? "text-green-600" :
                batteryLevel && batteryLevel > 10 ? "text-amber-600" :
                "text-red-600"
              )}>{getBatteryText()}</p>
            )}
          </div>
          
          {/* Status */}
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <svg className="w-4 h-4 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs font-medium text-slate-600">Status</p>
            </div>
            <p className={cn(
              "text-lg font-bold capitalize",
              unit.status === 'normal' && "text-green-600",
              unit.status === 'warning' && "text-amber-600",
              unit.status === 'alert' && "text-red-600",
              unit.status === 'offline' && "text-slate-400"
            )}>{unit.status}</p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
          <span className="text-xs text-slate-500">Last updated {lastUpdatedText}</span>
          <div className="flex items-center text-purple-600">
            <span className="text-sm font-medium mr-1">View Details</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default UnitCard;