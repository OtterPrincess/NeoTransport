import React from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { cn, getTimeAgo, getTemperatureStatusColor, getBatteryStatusColor } from "@/lib/utils";
import { STATUS_COLORS, VIBRATION_THRESHOLDS } from "@/lib/constants";
import type { UnitWithTelemetry } from "@shared/schema";
import { getUnitIllustration } from "@/components/unit-detail/unit-illustrations";

interface UnitCardProps {
  unit: UnitWithTelemetry;
}

export const UnitCard: React.FC<UnitCardProps> = ({ unit }) => {
  const isOffline = unit.status === "offline";
  // Validate the status value before accessing STATUS_COLORS
  const validStatusKey = (unit.status && STATUS_COLORS.hasOwnProperty(unit.status)) 
    ? unit.status 
    : "offline";
  const statusColors = STATUS_COLORS[validStatusKey as keyof typeof STATUS_COLORS];
  
  // Get telemetry data if available
  const internalTemp = unit.telemetry?.internalTemp;
  const surfaceTemp = unit.telemetry?.surfaceTemp;
  const vibration = unit.telemetry?.vibration;
  const batteryLevel = unit.telemetry?.batteryLevel;
  const isCharging = unit.telemetry?.batteryCharging;
  
  // Status display text
  const getStatusDisplayText = (): string => {
    switch(unit.status) {
      case "normal": return "Normal";
      case "warning": return "Warning";
      case "alert": return "Alert";
      case "offline": return "Offline";
      default: return "Unknown";
    }
  };
  
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
      <Card 
        className={cn(
          "bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer relative group overflow-hidden",
          unit.status === 'alert' && "ring-2 ring-red-200",
          unit.status === 'warning' && "ring-2 ring-amber-200"
        )}
      >
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
        
        {/* Surface Temperature */}
        <div>
          <p className="text-xs text-[#616161] mb-1">Surface Temp</p>
          <div className="flex items-center">
            {isOffline || surfaceTemp === undefined || surfaceTemp === null ? (
              <>
                <Icon name="offline" size={16} className="text-offline mr-1.5" />
                <span className="font-medium text-offline">No Data</span>
              </>
            ) : (
              <>
                <Icon 
                  name="surfaceTemp" 
                  size={16} 
                  className={cn(
                    "mr-1.5", 
                    getTemperatureStatusColor(surfaceTemp)
                  )} 
                />
                <span className={cn(
                  "font-medium",
                  getTemperatureStatusColor(surfaceTemp)
                )}>{surfaceTemp.toFixed(1)}°C</span>
              </>
            )}
          </div>
        </div>
        
        {/* Vibration */}
        <div>
          <p className="text-xs text-[#616161] mb-1">Vibration</p>
          <div className="flex items-center">
            {isOffline || vibration === undefined || vibration === null ? (
              <>
                <Icon name="offline" size={16} className="text-offline mr-1.5" />
                <span className="font-medium text-offline">No Data</span>
              </>
            ) : (
              <>
                <Icon 
                  name="vibration" 
                  size={16} 
                  className={cn(
                    "mr-1.5",
                    vibration < VIBRATION_THRESHOLDS.normal ? "text-safe" : 
                    vibration < VIBRATION_THRESHOLDS.warning ? "text-warning" : 
                    vibration < VIBRATION_THRESHOLDS.alert ? "text-warning" : 
                    "text-alert"
                  )} 
                />
                <span className="font-medium">{getVibrationStatusText()}</span>
              </>
            )}
          </div>
        </div>
        
        {/* Battery */}
        <div>
          <p className="text-xs text-[#616161] mb-1">Battery</p>
          <div className="flex items-center">
            {isOffline ? (
              <>
                <Icon name="offline" size={16} className="text-offline mr-1.5" />
                <span className="font-medium text-offline">No Data</span>
              </>
            ) : isCharging ? (
              <>
                <Icon name="battery" size={16} className="text-offline mr-1.5" />
                <span className="font-medium text-offline">Charging</span>
              </>
            ) : (
              <>
                <Icon 
                  name="battery" 
                  size={16} 
                  className={cn(
                    "mr-1.5",
                    batteryLevel ? getBatteryStatusColor(batteryLevel) : "text-offline"
                  )} 
                />
                <span className={cn(
                  "font-medium",
                  batteryLevel ? getBatteryStatusColor(batteryLevel) : "text-offline"
                )}>{getBatteryText()}</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-100 pt-2 flex justify-between items-center">
        <span className="text-xs text-[#616161]">Last updated: {lastUpdatedText}</span>
        <div className="relative group">
          <Link to={`/unit/${unit.id}`}>
            <button className="relative overflow-hidden px-3 py-1 rounded-full text-[#6A1B9A] text-sm font-medium flex items-center">
              <div className="absolute inset-0 bg-gradient-to-r from-[#F3E5F5]/0 via-[#E1BEE7]/0 to-[#F3E5F5]/0 opacity-0 group-hover:opacity-100 group-hover:from-[#F3E5F5]/40 group-hover:via-[#E1BEE7]/30 group-hover:to-[#F3E5F5]/20 transition-all duration-500"></div>
              <span className="relative z-10">View Details</span>
              <Icon name="info" size={16} className="ml-1 opacity-70 relative z-10" />
            </button>
          </Link>
          <div className="absolute right-0 w-64 p-2 mt-2 text-xs bg-white border rounded-md shadow-lg 
                       opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
            View detailed temperature and vibration charts, access device reports, manage alerts, and request maintenance.
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UnitCard;
