import React from 'react';
import { Card } from "@/components/ui/card";
import { getUnitIllustration } from "./unit-illustrations";
import type { Unit } from "@shared/schema";

interface UnitInfoHeaderProps {
  unit: Unit;
}

const UnitInfoHeader: React.FC<UnitInfoHeaderProps> = ({ unit }) => {
  return (
    <div className="bg-gradient-to-r from-[#6A1B9A] to-[#9C27B0] rounded-lg p-6 mb-6 text-white shadow-md">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{unit.unitId}</h2>
          <p className="text-sm opacity-90">Serial: {unit.serialNumber}</p>
          <p className="text-sm opacity-90">
            <span className="inline-block bg-white/20 rounded-full px-3 py-1 mr-2">
              {unit.room}
            </span>
            <span className="inline-block bg-white/20 rounded-full px-3 py-1">
              {unit.location || 'No specific location'}
            </span>
          </p>
        </div>
        
        <div className="w-32 h-32">
          {getUnitIllustration(unit.unitId, unit.status)}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <p className="text-xs opacity-80">Last Calibration</p>
          <p className="font-semibold">
            {unit.lastMaintenance ? new Date(unit.lastMaintenance).toLocaleDateString() : 'Not calibrated'}
          </p>
        </div>
        
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <p className="text-xs opacity-80">Firmware Version</p>
          <p className="font-semibold">{unit.firmwareVersion || 'Unknown'}</p>
        </div>
        
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <p className="text-xs opacity-80">Next Maintenance</p>
          <p className="font-semibold">
            {unit.nextMaintenance ? new Date(unit.nextMaintenance).toLocaleDateString() : 'Not scheduled'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnitInfoHeader;