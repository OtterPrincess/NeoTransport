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
    <Card 
      className={cn(
        "rounded-lg shadow-sm border-l-4 p-4 hover:shadow-md transition-all duration-300 cursor-pointer relative group",
        statusColors.border
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-[#F3E5F5]/0 via-[#E1BEE7]/0 to-[#F3E5F5]/0 rounded-lg opacity-0 group-hover:opacity-30 group-hover:from-[#F3E5F5]/40 group-hover:via-[#E1BEE7]/30 group-hover:to-[#F3E5F5]/20 transition-all duration-500 pointer-events-none"></div>
      <div className={cn(
        "absolute top-2 right-2 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center",
        statusColors.bg
      )}>
        <Icon 
          name={unit.status === "normal" ? "success" : unit.status === "offline" ? "offline" : "warning"} 
          size={16} 
          className="mr-1" 
        />
        {getStatusDisplayText()}
      </div>
      
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className={cn(
            "text-lg font-semibold",
            isOffline && "text-offline"
          )}>{unit.unitId}</h3>
          <p className="text-sm text-[#616161]">{unit.room} {unit.location}</p>
        </div>
        
        {/* Unit illustration */}
        <div className="w-20 h-20 -mt-1 -mr-1">
          {getUnitIllustration(unit.unitId, unit.status)}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Internal Temperature */}
        <div>
          <p className="text-xs text-[#616161] mb-1">Internal Temp</p>
          <div className="flex items-center">
            {isOffline || internalTemp === undefined || internalTemp === null ? (
              <>
                <Icon name="offline" size={16} className="text-offline mr-1.5" />
                <span className="font-medium text-offline">No Data</span>
              </>
            ) : (
              <>
                <Icon 
                  name="internalTemp" 
                  size={16} 
                  className={cn(
                    "mr-1.5", 
                    getTemperatureStatusColor(internalTemp)
                  )} 
                />
                <span className={cn(
                  "font-medium",
                  getTemperatureStatusColor(internalTemp)
                )}>{internalTemp.toFixed(1)}°C</span>
              </>
            )}
          </div>
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
