import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatShortDate } from "@/lib/utils";
import Icon from "@/components/ui/icon";
import type { UnitWithTelemetry } from "@shared/schema";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

interface DeviceInfoProps {
  unit: UnitWithTelemetry;
}

export const DeviceInfo: React.FC<DeviceInfoProps> = ({ unit }) => {
  const queryClient = useQueryClient();
  
  const handleDeviceReport = async () => {
    try {
      const response = await apiRequest('POST', `/api/units/${unit.id}/generate-report`, {});
      
      toast({
        title: "Device Report Generated",
        description: "The device report has been generated successfully.",
        variant: "default",
      });
      
      // If needed, you could invalidate queries here
      // queryClient.invalidateQueries({ queryKey: ['/api/units'] });
    } catch (error) {
      console.error('Failed to generate device report:', error);
      toast({
        title: "Error",
        description: "Failed to generate device report. Please try again.",
        variant: "destructive",
      });
    }
  };
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-3">Device Information</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-[#616161]">Serial Number</p>
            <p className="font-medium">{unit.serialNumber}</p>
          </div>
          <div>
            <p className="text-sm text-[#616161]">Firmware Version</p>
            <p className="font-medium">{unit.firmwareVersion || "Unknown"}</p>
          </div>
          <div>
            <p className="text-sm text-[#616161]">Last Maintenance</p>
            <p className="font-medium">
              {unit.lastMaintenance ? formatShortDate(unit.lastMaintenance) : "Not available"}
            </p>
          </div>
          <div>
            <p className="text-sm text-[#616161]">Next Maintenance Due</p>
            <p className="font-medium">
              {unit.nextMaintenance ? formatShortDate(unit.nextMaintenance) : "Not scheduled"}
            </p>
          </div>
          <div>
            <p className="text-sm text-[#616161]">Sensor Status</p>
            <div className="flex items-center">
              <span className={`h-2.5 w-2.5 rounded-full ${unit.status === 'offline' ? 'bg-offline' : 'bg-safe'} mr-2`}></span>
              <p className="font-medium">
                {unit.status === 'offline' ? 'Sensors offline' : 'All sensors operational'}
              </p>
            </div>
          </div>
          <div className="pt-2">
            <Button 
              variant="outline" 
              className="w-full border-[#6A1B9A] text-[#6A1B9A] hover:bg-[#6A1B9A]/5"
              onClick={handleDeviceReport}
            >
              <Icon name="report" size={20} className="mr-1" />
              Device Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceInfo;
