import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import TemperatureChart from "./temperature-chart";
import VibrationChart from "./vibration-chart";
import BatteryIndicator from "./battery-indicator";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { UnitWithTelemetry } from "@shared/schema";
import { TEMPERATURE_RANGES } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";

interface UnitInfoProps {
  unit: UnitWithTelemetry;
}

export const UnitInfo: React.FC<UnitInfoProps> = ({ unit }) => {
  const queryClient = useQueryClient();
  
  const handleAcknowledgeAlerts = async () => {
    try {
      // Acknowledge all active alerts for this unit
      const activeAlerts = unit.alerts.filter(alert => alert.status === 'active');
      
      const promises = activeAlerts.map(alert => 
        apiRequest('POST', `/api/alerts/${alert.id}/acknowledge`, {
          acknowledgedBy: 'Current User' // In a real app, this would be the authenticated user
        })
      );
      
      await Promise.all(promises);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/units'] });
    } catch (error) {
      console.error('Failed to acknowledge alerts:', error);
    }
  };
  
  const handleRequestTechCheck = async () => {
    try {
      await apiRequest('POST', `/api/units/${unit.id}/request-tech-check`, {});
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/units'] });
    } catch (error) {
      console.error('Failed to request tech check:', error);
    }
  };
  
  const handleSendToTeams = async () => {
    try {
      const activeAlerts = unit.alerts.filter(alert => alert.status === 'active');
      
      if (activeAlerts.length > 0) {
        await apiRequest('POST', `/api/alerts/${activeAlerts[0].id}/send-to-teams`, {});
      }
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
    } catch (error) {
      console.error('Failed to send to Teams:', error);
    }
  };
  
  const handleViewFullReport = async () => {
    try {
      await apiRequest('POST', `/api/units/${unit.id}/full-report`, {});
      
      // Show a notification or toast that report is being generated
      toast({
        title: "Full Report Generated",
        description: "The full report has been generated successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to generate full report:', error);
      toast({
        title: "Error",
        description: "Failed to generate full report. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Access telemetry data
  const telemetry = unit.telemetry;
  const internalTemp = telemetry?.internalTemp;
  const surfaceTemp = telemetry?.surfaceTemp;
  const vibration = telemetry?.vibration;
  const batteryLevel = telemetry?.batteryLevel;
  
  // Calculate temperature deviations
  const internalTempDiff = internalTemp !== undefined && internalTemp !== null
    ? (internalTemp - TEMPERATURE_RANGES.internal.max).toFixed(1)
    : null;
  
  const surfaceTempDiff = surfaceTemp !== undefined && surfaceTemp !== null
    ? (surfaceTemp - TEMPERATURE_RANGES.surface.max).toFixed(1)
    : null;
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold">Unit Information</h3>
            <p className="text-sm text-[#616161]">{unit.room} {unit.location}</p>
          </div>
          <div className="text-sm">
            <p className="text-[#616161]">Assigned to: <span className="font-medium">{unit.assignedNurse || 'Unassigned'}</span></p>
            <p className="text-[#616161]">ID: <span className="font-medium">{unit.serialNumber}</span></p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Internal Temperature Section */}
          <div className="border rounded-lg p-3">
            <h4 className="text-sm font-medium text-[#616161] mb-1">Internal Temperature</h4>
            <div className="flex items-center">
              {internalTemp !== undefined && internalTemp !== null ? (
                <>
                  <span className={`text-2xl font-bold ${
                    internalTemp > TEMPERATURE_RANGES.internal.alertMax 
                      ? 'text-[#E53935]' 
                      : internalTemp > TEMPERATURE_RANGES.internal.max || internalTemp < TEMPERATURE_RANGES.internal.min
                        ? 'text-[#FFA000]'
                        : 'text-[#212121]'
                  }`}>
                    {internalTemp.toFixed(1)}°C
                  </span>
                  {internalTempDiff && parseFloat(internalTempDiff) > 0 && (
                    <span className="ml-2 px-2 py-1 text-xs rounded bg-[#E53935] bg-opacity-10 text-[#E53935]">
                      +{internalTempDiff}°C
                    </span>
                  )}
                  {internalTempDiff && parseFloat(internalTempDiff) < 0 && (
                    <span className="ml-2 px-2 py-1 text-xs rounded bg-[#FFA000] bg-opacity-10 text-[#FFA000]">
                      {internalTempDiff}°C
                    </span>
                  )}
                </>
              ) : (
                <span className="text-2xl font-bold text-[#BDBDBD]">No Data</span>
              )}
            </div>
            <div className="text-xs text-[#616161] mt-1">
              Normal range: {TEMPERATURE_RANGES.internal.min}°C - {TEMPERATURE_RANGES.internal.max}°C
            </div>
            <div className="h-[120px] mt-2">
              <TemperatureChart 
                currentValue={internalTemp} 
                minThreshold={TEMPERATURE_RANGES.internal.min} 
                maxThreshold={TEMPERATURE_RANGES.internal.max} 
                type="internal"
              />
            </div>
          </div>
          
          {/* Surface Temperature Section */}
          <div className="border rounded-lg p-3">
            <h4 className="text-sm font-medium text-[#616161] mb-1">Surface Temperature</h4>
            <div className="flex items-center">
              {surfaceTemp !== undefined && surfaceTemp !== null ? (
                <>
                  <span className={`text-2xl font-bold ${
                    surfaceTemp > TEMPERATURE_RANGES.surface.alertMax 
                      ? 'text-[#E53935]' 
                      : surfaceTemp > TEMPERATURE_RANGES.surface.max || surfaceTemp < TEMPERATURE_RANGES.surface.min
                        ? 'text-[#FFA000]'
                        : 'text-[#212121]'
                  }`}>
                    {surfaceTemp.toFixed(1)}°C
                  </span>
                  {surfaceTempDiff && parseFloat(surfaceTempDiff) > 0 && (
                    <span className="ml-2 px-2 py-1 text-xs rounded bg-[#FFA000] bg-opacity-10 text-[#FFA000]">
                      +{surfaceTempDiff}°C
                    </span>
                  )}
                  {surfaceTempDiff && parseFloat(surfaceTempDiff) < 0 && (
                    <span className="ml-2 px-2 py-1 text-xs rounded bg-[#FFA000] bg-opacity-10 text-[#FFA000]">
                      {surfaceTempDiff}°C
                    </span>
                  )}
                </>
              ) : (
                <span className="text-2xl font-bold text-[#BDBDBD]">No Data</span>
              )}
            </div>
            <div className="text-xs text-[#616161] mt-1">
              Normal range: {TEMPERATURE_RANGES.surface.min}°C - {TEMPERATURE_RANGES.surface.max}°C
            </div>
            <div className="h-[120px] mt-2">
              <TemperatureChart 
                currentValue={surfaceTemp} 
                minThreshold={TEMPERATURE_RANGES.surface.min} 
                maxThreshold={TEMPERATURE_RANGES.surface.max} 
                type="surface"
              />
            </div>
          </div>
          
          {/* Vibration Status Section */}
          <div className="border rounded-lg p-3">
            <h4 className="text-sm font-medium text-[#616161] mb-1">Vibration Status</h4>
            <div className="flex items-center">
              {vibration !== undefined && vibration !== null ? (
                <>
                  <span className={`text-2xl font-bold ${
                    vibration > 0.7 
                      ? 'text-[#E53935]' 
                      : vibration > 0.3
                        ? 'text-[#FFA000]'
                        : 'text-[#66BB6A]'
                  }`}>
                    {vibration < 0.3 ? 'Stable' : vibration < 0.7 ? 'Moderate' : 'High'}
                  </span>
                  <span className={`ml-2 px-2 py-1 text-xs rounded ${
                    vibration < 0.3 
                      ? 'bg-[#66BB6A] bg-opacity-10 text-[#66BB6A]' 
                      : vibration < 0.7
                        ? 'bg-[#FFA000] bg-opacity-10 text-[#FFA000]'
                        : 'bg-[#E53935] bg-opacity-10 text-[#E53935]'
                  }`}>
                    {vibration.toFixed(2)}g
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-[#BDBDBD]">No Data</span>
              )}
            </div>
            <div className="text-xs text-[#616161] mt-1">
              Last spike: {vibration && vibration > 0.3 ? 'Current' : '4h 32m ago'}
            </div>
            <div className="h-[120px] mt-2">
              <VibrationChart currentValue={vibration} />
            </div>
          </div>
          
          {/* Battery Status Section */}
          <div className="border rounded-lg p-3">
            <h4 className="text-sm font-medium text-[#616161] mb-1">Battery Status</h4>
            <div className="flex items-center">
              {batteryLevel !== undefined && batteryLevel !== null ? (
                <>
                  <span className={`text-2xl font-bold ${
                    batteryLevel < 20 
                      ? 'text-[#E53935]' 
                      : batteryLevel < 30
                        ? 'text-[#FFA000]'
                        : 'text-[#212121]'
                  }`}>
                    {batteryLevel}%
                  </span>
                  <span className="ml-2 px-2 py-1 text-xs rounded bg-[#66BB6A] bg-opacity-10 text-[#66BB6A]">
                    {Math.round(batteryLevel / 6)}h remaining
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-[#BDBDBD]">No Data</span>
              )}
            </div>
            <div className="text-xs text-[#616161] mt-1">
              Last charged: Today, 6:45 AM
            </div>
            <div className="mt-3">
              <BatteryIndicator level={batteryLevel} />
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            className="bg-[#6A1B9A] hover:bg-[#6A1B9A]/90 text-white"
            onClick={handleAcknowledgeAlerts}
          >
            <Icon name="success" size={20} className="mr-1" />
            Acknowledge Alert
          </Button>
          <Button 
            variant="outline" 
            className="border-[#6A1B9A] text-[#6A1B9A] hover:bg-[#6A1B9A]/5"
            onClick={handleViewFullReport}
          >
            <Icon name="report" size={20} className="mr-1" />
            View Full Report
          </Button>
          <Button 
            variant="outline" 
            className="border-gray-300 text-[#616161] hover:bg-gray-50"
            onClick={handleRequestTechCheck}
          >
            <Icon name="notification" size={20} className="mr-1" />
            Request Tech Check
          </Button>
          <Button 
            variant="outline" 
            className="border-gray-300 text-[#616161] hover:bg-gray-50"
            onClick={handleSendToTeams}
          >
            <Icon name="teams" size={20} className="mr-1" />
            Send to Teams
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnitInfo;
