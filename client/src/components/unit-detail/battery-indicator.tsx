import React from "react";
import { BATTERY_THRESHOLDS } from "@/lib/constants";

interface BatteryIndicatorProps {
  level: number | null | undefined;
}

const BatteryIndicator: React.FC<BatteryIndicatorProps> = ({ level }) => {
  if (level === undefined || level === null) {
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className="bg-[#BDBDBD] h-2.5 rounded-full w-0"></div>
      </div>
    );
  }
  
  const getBatteryColor = () => {
    if (level < BATTERY_THRESHOLDS.alert) return "bg-[#E53935]";
    if (level < BATTERY_THRESHOLDS.warning) return "bg-[#FFA000]";
    return "bg-[#66BB6A]";
  };
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className={`${getBatteryColor()} h-2.5 rounded-full`} 
        style={{ width: `${level}%` }}
      ></div>
    </div>
  );
};

export default BatteryIndicator;
