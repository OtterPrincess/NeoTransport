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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TEMPERATURE_RANGES } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";

interface UnitInfoProps {
  unit: UnitWithTelemetry;
}

export const UnitInfo: React.FC<UnitInfoProps> = ({ unit }) => {
  const queryClient = useQueryClient();
  const [reportLoading, setReportLoading] = React.useState(false);
  const [acknowledgeLoading, setAcknowledgeLoading] = React.useState(false);
  const [historyModalOpen, setHistoryModalOpen] = React.useState(false);
  
  const handleAcknowledgeAlerts = async () => {
    try {
      setAcknowledgeLoading(true);
      
      // Acknowledge all active alerts for this unit
      const activeAlerts = unit.alerts.filter(alert => alert.status === 'active');
      
      if (activeAlerts.length === 0) {
        toast({
          title: "No Active Alerts",
          description: "There are no active alerts to acknowledge.",
          variant: "default",
        });
        return;
      }
      
      const promises = activeAlerts.map(alert => 
        apiRequest('POST', `/api/alerts/${alert.id}/acknowledge`, {
          acknowledgedBy: 'Current User' // In a real app, this would be the authenticated user
        })
      );
      
      await Promise.all(promises);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/units'] });
      
      toast({
        title: "Alerts Acknowledged",
        description: `${activeAlerts.length} alert(s) have been acknowledged successfully.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to acknowledge alerts:', error);
      toast({
        title: "Error",
        description: "Failed to acknowledge alerts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAcknowledgeLoading(false);
    }
  };
  
  const [techCheckLoading, setTechCheckLoading] = React.useState(false);
  
  const handleRequestTechCheck = async () => {
    try {
      setTechCheckLoading(true);
      
      const response = await apiRequest('POST', `/api/units/${unit.id}/request-tech-check`, {});
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/units'] });
      
      // Show success toast
      toast({
        title: "Tech Check Requested",
        description: "A technician has been notified and will review the unit shortly.",
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to request tech check:', error);
      toast({
        title: "Request Failed",
        description: "Unable to request tech check. Please try again.",
        variant: "destructive",
      });
    } finally {
      setTechCheckLoading(false);
    }
  };
  
  const [teamsLoading, setTeamsLoading] = React.useState(false);
  
  const handleSendToTeams = async () => {
    try {
      setTeamsLoading(true);
      
      const activeAlerts = unit.alerts.filter(alert => alert.status === 'active');
      
      if (activeAlerts.length > 0) {
        await apiRequest('POST', `/api/alerts/${activeAlerts[0].id}/send-to-teams`, {});
        
        // Show success toast
        toast({
          title: "Sent to Teams",
          description: "Alert details have been shared with your team in Microsoft Teams.",
          variant: "default",
        });
      } else {
        toast({
          title: "No Active Alerts",
          description: "There are no active alerts to send to Teams.",
          variant: "default",
        });
      }
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
    } catch (error) {
      console.error('Failed to send to Teams:', error);
      toast({
        title: "Teams Notification Failed",
        description: "Unable to send alert to Microsoft Teams. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setTeamsLoading(false);
    }
  };
  
  const handleViewFullReport = async () => {
    try {
      setReportLoading(true);
      
      await apiRequest('POST', `/api/units/${unit.id}/generate-report`, {});
      
      // Show a notification or toast that report is being generated
      toast({
        title: "Full Report Generated",
        description: "The full report has been generated successfully and sent to the transport team.",
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to generate full report:', error);
      toast({
        title: "Error",
        description: "Failed to generate full report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setReportLoading(false);
    }
  };
  
  const handleViewHistory = () => {
    setHistoryModalOpen(true);
    // In a real app, this would open a dialog with historical data
    toast({
      title: "Viewing Complete History",
      description: "Showing full telemetry and alert history for this unit.",
      variant: "default",
    });
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
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-purple-300 bg-clip-text text-transparent">Unit Information</h3>
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
              disabled={acknowledgeLoading}
            >
              {acknowledgeLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  <Icon name="success" size={20} className="mr-1" />
                  Acknowledge Alert
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              className="border-[#6A1B9A] text-[#6A1B9A] hover:bg-[#6A1B9A]/5"
              onClick={handleViewFullReport}
              disabled={reportLoading}
            >
              {reportLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#6A1B9A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                <>
                  <Icon name="report" size={20} className="mr-1" />
                  View Full Report
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              className="border-[#6A1B9A] text-[#6A1B9A] hover:bg-[#6A1B9A]/5"
              onClick={handleViewHistory}
            >
              <Icon name="time" size={20} className="mr-1" />
              View All History
            </Button>
            
            <Button 
              variant="outline" 
              className="border-gray-300 text-[#616161] hover:bg-gray-50"
              onClick={handleRequestTechCheck}
              disabled={techCheckLoading}
            >
              {techCheckLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#616161]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Requesting...
                </span>
              ) : (
                <>
                  <Icon name="notification" size={20} className="mr-1" />
                  Request Tech Check
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              className="border-gray-300 text-[#616161] hover:bg-gray-50"
              onClick={handleSendToTeams}
              disabled={teamsLoading}
            >
              {teamsLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#616161]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                <>
                  <Icon name="teams" size={20} className="mr-1" />
                  Send to Teams
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* History Modal */}
      <Dialog open={historyModalOpen} onOpenChange={setHistoryModalOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[#6A1B9A]">
              Complete Unit History
            </DialogTitle>
            <DialogDescription>
              Detailed historical data for {unit.unitId} ({unit.serialNumber})
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="telemetry" className="mt-4">
            <TabsList className="w-full border-b mb-4">
              <TabsTrigger value="telemetry" className="flex-1">Telemetry History</TabsTrigger>
              <TabsTrigger value="alerts" className="flex-1">Alert History</TabsTrigger>
              <TabsTrigger value="maintenance" className="flex-1">Maintenance Records</TabsTrigger>
            </TabsList>
            
            <TabsContent value="telemetry" className="space-y-4">
              <div className="rounded-md border overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b grid grid-cols-5 font-medium text-sm">
                  <div>Timestamp</div>
                  <div>Internal Temp</div>
                  <div>Surface Temp</div>
                  <div>Vibration</div>
                  <div>Battery</div>
                </div>
                <div className="divide-y">
                  {/* Example historical telemetry data */}
                  {[...Array(5)].map((_, index) => {
                    const hoursAgo = index * 2;
                    const timestamp = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
                    const randomTemp = (internalTemp || 36.5) + (Math.random() * 0.8 - 0.4);
                    const randomSurfaceTemp = (surfaceTemp || 30.2) + (Math.random() * 0.6 - 0.3);
                    const randomVibration = Math.max(0, (vibration || 0.2) + (Math.random() * 0.2 - 0.1));
                    const randomBattery = batteryLevel ? Math.max(0, batteryLevel - hoursAgo * 3) : 80;
                    
                    return (
                      <div key={index} className="px-4 py-3 grid grid-cols-5 text-sm">
                        <div className="text-[#616161]">
                          {timestamp.toLocaleString()}
                        </div>
                        <div>
                          <span className={randomTemp > 37 ? 'text-[#E53935]' : 'text-[#212121]'}>
                            {randomTemp.toFixed(1)}°C
                          </span>
                        </div>
                        <div>
                          <span className={randomSurfaceTemp > 32 ? 'text-[#FFA000]' : 'text-[#212121]'}>
                            {randomSurfaceTemp.toFixed(1)}°C
                          </span>
                        </div>
                        <div>
                          <span className={
                            randomVibration > 0.6 ? 'text-[#E53935]' : 
                            randomVibration > 0.3 ? 'text-[#FFA000]' : 
                            'text-[#66BB6A]'
                          }>
                            {randomVibration.toFixed(2)}g
                          </span>
                        </div>
                        <div>
                          <span className={randomBattery < 20 ? 'text-[#E53935]' : 'text-[#212121]'}>
                            {randomBattery}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" className="text-[#616161]">
                  Export CSV
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="alerts" className="space-y-4">
              <div className="rounded-md border overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b grid grid-cols-4 font-medium text-sm">
                  <div>Timestamp</div>
                  <div>Type</div>
                  <div>Message</div>
                  <div>Status</div>
                </div>
                <div className="divide-y">
                  {/* Show actual alerts from the unit */}
                  {unit.alerts.map((alert, index) => (
                    <div key={index} className="px-4 py-3 grid grid-cols-4 text-sm">
                      <div className="text-[#616161]">
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                      <div>
                        <Badge variant={
                          alert.alertType === 'temperature' ? 'destructive' :
                          alert.alertType === 'vibration' ? 'secondary' :
                          'default'
                        }>
                          {alert.alertType}
                        </Badge>
                      </div>
                      <div>
                        {alert.message}
                      </div>
                      <div>
                        <Badge variant={
                          alert.status === 'active' ? 'destructive' :
                          alert.status === 'acknowledged' ? 'secondary' :
                          'outline'
                        }>
                          {alert.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {unit.alerts.length === 0 && (
                    <div className="px-4 py-8 text-center text-[#616161]">
                      No alert history found for this unit.
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="maintenance" className="space-y-4">
              <div className="rounded-md border overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b grid grid-cols-4 font-medium text-sm">
                  <div>Date</div>
                  <div>Technician</div>
                  <div>Service Type</div>
                  <div>Notes</div>
                </div>
                <div className="divide-y">
                  {/* Example maintenance records */}
                  <div className="px-4 py-3 grid grid-cols-4 text-sm">
                    <div className="text-[#616161]">
                      2025-03-30
                    </div>
                    <div>
                      Sarah Johnson
                    </div>
                    <div>
                      <Badge variant="outline">Calibration</Badge>
                    </div>
                    <div>
                      Routine temperature calibration performed
                    </div>
                  </div>
                  <div className="px-4 py-3 grid grid-cols-4 text-sm">
                    <div className="text-[#616161]">
                      2025-02-15
                    </div>
                    <div>
                      Michael Chen
                    </div>
                    <div>
                      <Badge variant="outline">Battery Replacement</Badge>
                    </div>
                    <div>
                      Battery replaced due to deteriorating capacity
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="text-[#616161]">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UnitInfo;